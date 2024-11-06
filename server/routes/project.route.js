import express from 'express';
import auth from '../middleware/auth.js';
import Project from '../models/project.model.js';
import ActivityLog from '../models/activitylog.model.js';

const router = express.Router();

// @route   POST api/projects
// @desc    Create a project
router.post('/', auth, async (req, res) => {
  const { title, description, clientId } = req.body;

  try {
    const project = new Project({
      title,
      description,
      freelancer: req.user.id,
      client: clientId,
    });

    await project.save();

    // Log activity
    await new ActivityLog({
      user: req.user.id,
      action: 'Created project',
      details: project.title,
    }).save();

    // Emit event for real-time update
    const io = req.app.get('socketio');
    io.emit('projectCreated', project);

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/projects
// @desc    Get all projects for a user
router.get('/', auth, async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'freelancer') {
      projects = await Project.find({ freelancer: req.user.id }).populate('client', 'name');
    } else {
      projects = await Project.find({ client: req.user.id }).populate('freelancer', 'name');
    }
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/projects/:id
// @desc    Get a single project by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'name')
      .populate('freelancer', 'name');

    if (!project) return res.status(404).json({ msg: 'Project not found' });

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/projects/:id
// @desc    Update a project
router.put('/:id', auth, async (req, res) => {
  const { title, description } = req.body;

  try {
    let project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ msg: 'Project not found' });

    // Ensure that the user is authorized to update the project
    if (project.freelancer.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Update project fields
    project.title = title || project.title;
    project.description = description || project.description;

    await project.save();

    // Log activity
    await new ActivityLog({
      user: req.user.id,
      action: 'Updated project',
      details: project.title,
    }).save();

    // Emit event for real-time update
    const io = req.app.get('socketio');
    io.emit('projectUpdated', project);

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/projects/:id
// @desc    Delete a project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ msg: 'Project not found' });

    // Ensure that the user is authorized to delete the project
    if (project.freelancer.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await project.remove();

    // Log activity
    await new ActivityLog({
      user: req.user.id,
      action: 'Deleted project',
      details: project.title,
    }).save();

    // Emit event for real-time update
    const io = req.app.get('socketio');
    io.emit('projectDeleted', { projectId: req.params.id });

    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
