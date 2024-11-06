import axios from 'axios';
import {
  GET_INVOICES,
  GET_INVOICE,
  ADD_INVOICE,
  UPDATE_INVOICE,
  DELETE_INVOICE,
  INVOICE_ERROR,
} from './types';
import { setAlert } from './alertActions';

// Get all invoices
export const getInvoices = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/invoices');

    dispatch({
      type: GET_INVOICES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: INVOICE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add an invoice
export const addInvoice = (formData) => async (dispatch) => {
  try {
    const res = await axios.post('/api/invoices', formData);

    dispatch({
      type: ADD_INVOICE,
      payload: res.data,
    });

    dispatch(setAlert('Invoice Created', 'success'));
  } catch (err) {
    dispatch({
      type: INVOICE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Other invoice actions can be defined similarly.