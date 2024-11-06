import express from 'express';
import auth from '../middleware/auth.js';
import Invoice from '../models/invoice.model.js';
import Project from '../models/project.model.js';

const router = express.Router();

// @route   POST api/invoices
// @desc    Create an invoice
router.post('/', auth, async (req, res) => {
  const { projectId, amount, dueDate } = req.body;

  try {
    // Fetch the project to get client information
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    const invoice = new Invoice({
      project: projectId,
      freelancer: req.user.id,
      client: project.client, // Get client ID from project
      amount,
      dueDate,
    });

    await invoice.save();

    // Emit real-time event
    const io = req.app.get('socketio');
    io.emit('invoiceCreated', invoice);

    res.json(invoice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/invoices
// @desc    Get all invoices for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    let invoices;
    if (req.user.role === 'freelancer') {
      invoices = await Invoice.find({ freelancer: req.user.id }).populate('client', 'name');
    } else {
      invoices = await Invoice.find({ client: req.user.id }).populate('freelancer', 'name');
    }
    res.json(invoices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/invoices/:id
// @desc    Update an invoice
router.put('/:id', auth, async (req, res) => {
  const { amount, dueDate, status } = req.body;

  try {
    let invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ msg: 'Invoice not found' });

    // Authorization check
    if (invoice.freelancer.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Update invoice fields
    invoice.amount = amount || invoice.amount;
    invoice.dueDate = dueDate || invoice.dueDate;
    invoice.status = status || invoice.status;

    await invoice.save();

    // Emit real-time event
    const io = req.app.get('socketio');
    io.emit('invoiceUpdated', invoice);

    res.json(invoice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/invoices/:id
// @desc    Delete an invoice
router.delete('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ msg: 'Invoice not found' });

    // Authorization check
    if (invoice.freelancer.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await invoice.remove();

    // Emit real-time event
    const io = req.app.get('socketio');
    io.emit('invoiceDeleted', { invoiceId: req.params.id });

    res.json({ msg: 'Invoice removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
