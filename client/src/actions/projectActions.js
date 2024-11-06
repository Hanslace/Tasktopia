import axios from 'axios';
import {
  GET_PROJECTS,
  GET_PROJECT,
  ADD_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  PROJECT_ERROR,
} from './types';
import { setAlert } from './alertActions';

// Get all projects
export const getProjects = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/projects');

    dispatch({
      type: GET_PROJECTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add a project
export const addProject = (formData) => async (dispatch) => {
  try {
    const res = await axios.post('/api/projects', formData);

    dispatch({
      type: ADD_PROJECT,
      payload: res.data,
    });

    dispatch(setAlert('Project Created', 'success'));
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Other project actions (getProject, updateProject, deleteProject) can be defined similarly.