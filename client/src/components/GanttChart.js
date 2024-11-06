import React, { useEffect, useState } from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { connect } from 'react-redux';
import { getProjects } from '../actions/projectActions';

const GanttChart = ({ getProjects, project: { projects, loading } }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  useEffect(() => {
    if (!loading && projects) {
      // Map projects to Gantt tasks
      const ganttTasks = projects.map((project) => ({
        start: new Date(project.startDate),
        end: new Date(project.endDate),
        name: project.title,
        id: project._id,
        type: 'task',
        progress: project.progress || 0,
      }));
      setTasks(ganttTasks);
    }
  }, [projects, loading]);

  return (
    <div>
      <Gantt tasks={tasks} viewMode={ViewMode.Month} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  project: state.project,
});

export default connect(mapStateToProps, { getProjects })(GanttChart);