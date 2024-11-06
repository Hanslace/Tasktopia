import {
    GET_PROJECTS,
    GET_PROJECT,
    ADD_PROJECT,
    UPDATE_PROJECT,
    DELETE_PROJECT,
    PROJECT_ERROR,
  } from '../actions/types';
  
  const initialState = {
    projects: [],
    project: null,
    loading: true,
    error: {},
  };
  
  export default function projectReducer(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_PROJECTS:
        return {
          ...state,
          projects: payload,
          loading: false,
        };
      case GET_PROJECT:
        return {
          ...state,
          project: payload,
          loading: false,
        };
      case ADD_PROJECT:
        return {
          ...state,
          projects: [payload, ...state.projects],
          loading: false,
        };
      case UPDATE_PROJECT:
        return {
          ...state,
          projects: state.projects.map((project) =>
            project._id === payload._id ? payload : project
          ),
          loading: false,
        };
      case DELETE_PROJECT:
        return {
          ...state,
          projects: state.projects.filter((project) => project._id !== payload),
          loading: false,
        };
      case PROJECT_ERROR:
        return {
          ...state,
          error: payload,
          loading: false,
        };
      default:
        return state;
    }
  }