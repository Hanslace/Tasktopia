import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showAlert = (message, type = 'info') => {
  toast[type](message);
};

const Alert = () => (
  <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
);

export default Alert;

// import { showAlert } from '../components/common/Alert';

// export const someAction = () => async (dispatch) => {
//   try {
//     // Perform action
//     showAlert('Action successful!', 'success');
//   } catch (error) {
//     showAlert('Action failed.', 'error');
//   }
// };