import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getProject } from '../../actions/projectActions';

const ProjectDetail = ({ match, getProject, project: { project, loading } }) => {
  useEffect(() => {
    getProject(match.params.id);
  }, [getProject, match.params.id]);

  return (
    <div>
      {loading || !project ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          {/* Tabs for tasks, invoices, activity logs */}
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  project: state.project,
});

export default connect(mapStateToProps, { getProject })(ProjectDetail);