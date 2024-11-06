// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadUser } from './actions/authActions';
import setAuthToken from './utils/setAuthToken';
import { io } from 'socket.io-client';

import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/routing/PrivateRoute';
import Dashboard from './components/dashboard/Dashboard';
import ProjectList from './components/projects/ProjectList';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Set auth token if available
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  const dispatch = useDispatch();

  // Load user on initial render
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    // Connect to the Socket.io server
    const socket = io('http://localhost:5000'); // Replace with your production URL if needed

    // Project-related events
    socket.on('projectCreated', (project) => {
      console.log('New project created:', project);
      // Update state or UI as needed
    });

    socket.on('projectUpdated', (project) => {
      console.log('Project updated:', project);
      // Update state or UI as needed
    });

    socket.on('projectDeleted', ({ projectId }) => {
      console.log('Project deleted:', projectId);
      // Remove project from state or UI as needed
    });

    // Task-related events
    socket.on('taskCreated', (task) => {
      console.log('New task created:', task);
      // Update state or UI as needed
    });

    socket.on('taskUpdated', (task) => {
      console.log('Task updated:', task);
      // Update state or UI as needed
    });

    socket.on('taskDeleted', ({ taskId }) => {
      console.log('Task deleted:', taskId);
      // Remove task from state or UI as needed
    });

    // Invoice-related events
    socket.on('invoiceCreated', (invoice) => {
      console.log('New invoice created:', invoice);
      // Update state or UI as needed
    });

    socket.on('invoiceUpdated', (invoice) => {
      console.log('Invoice updated:', invoice);
      // Update state or UI as needed
    });

    socket.on('invoiceDeleted', ({ invoiceId }) => {
      console.log('Invoice deleted:', invoiceId);
      // Remove invoice from state or UI as needed
    });

    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/projects" component={ProjectList} />
        {/* Add more PrivateRoutes as needed */}
      </Switch>
    </Router>
  );
};

export default App;
