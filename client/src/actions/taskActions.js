import axios from 'axios';
import {
  GET_TASKS,
  ADD_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  TASK_ERROR,
  TASK_UPDATED,
} from './types';
import { setAlert } from './alertActions';

// Get all tasks
export const getTasks = (projectId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/tasks?projectId=${projectId}`);
    dispatch({
      type: GET_TASKS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TASK_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status },
    });
  }
};

// Add a task
export const addTask = (formData) => async (dispatch) => {
  try {
    const res = await axios.post('/api/tasks', formData);
    dispatch({
      type: ADD_TASK,
      payload: res.data,
    });
    dispatch(setAlert('Task Added', 'success'));
  } catch (err) {
    dispatch({
      type: TASK_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status },
    });
  }
};


// Update an existing task's details (not just status)
export const updateTask = (taskId, formData) => async (dispatch) => {
    try {
      const res = await axios.put(`/api/tasks/${taskId}`, formData);
      dispatch({
        type: UPDATE_TASK,
        payload: res.data,
      });
      dispatch(setAlert('Task Updated', 'success'));
    } catch (err) {
      dispatch({
        type: TASK_ERROR,
        payload: { msg: err.response?.statusText, status: err.response?.status },
      });
    }
  };
  


// Update task status
export const updateTaskStatus = (taskId, status) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/tasks/${taskId}`, { status });
    dispatch({
      type: TASK_UPDATED,
      payload: res.data,
    });
    dispatch(setAlert('Task Status Updated', 'success'));
  } catch (error) {
    dispatch({
      type: TASK_ERROR,
      payload: { msg: error.response?.statusText, status: error.response?.status },
    });
  }
};

// Delete a task
export const deleteTask = (taskId) => async (dispatch) => {
  try {
    await axios.delete(`/api/tasks/${taskId}`);
    dispatch({
      type: DELETE_TASK,
      payload: taskId,
    });
    dispatch(setAlert('Task Deleted', 'success'));
  } catch (err) {
    dispatch({
      type: TASK_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status },
    });
  }
};
