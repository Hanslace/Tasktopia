import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getProjects } from '../../actions/projectActions';

const ProjectList = ({ getProjects, project: { projects, loading } }) => {
  useEffect(() => {
    getProjects();
  }, [getProjects]);

  return (
    <div>
      <h2>Your Projects</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {projects.map((project) => (
            <div key={project._id} className="project-card">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {/* Link to ProjectDetail component */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  project: state.project,
});

export default connect(mapStateToProps, { getProjects })(ProjectList);