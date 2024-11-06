import {
    GET_INVOICES,
    GET_INVOICE,
    ADD_INVOICE,
    UPDATE_INVOICE,
    DELETE_INVOICE,
    INVOICE_ERROR,
  } from '../actions/types';
  
  const initialState = {
    invoices: [],
    invoice: null,
    loading: true,
    error: {},
  };
  
  export default function invoiceReducer(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_INVOICES:
        return {
          ...state,
          invoices: payload,
          loading: false,
        };
      case GET_INVOICE:
        return {
          ...state,
          invoice: payload,
          loading: false,
        };
      case ADD_INVOICE:
        return {
          ...state,
          invoices: [payload, ...state.invoices],
          loading: false,
        };
      case UPDATE_INVOICE:
        return {
          ...state,
          invoices: state.invoices.map((invoice) =>
            invoice._id === payload._id ? payload : invoice
          ),
          loading: false,
        };
      case DELETE_INVOICE:
        return {
          ...state,
          invoices: state.invoices.filter((invoice) => invoice._id !== payload),
          loading: false,
        };
      case INVOICE_ERROR:
        return {
          ...state,
          error: payload,
          loading: false,
        };
      default:
        return state;
    }
  }