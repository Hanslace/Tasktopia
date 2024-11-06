import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const Navbar = ({ auth }) => {
  const { isAuthenticated, user } = auth;

  const authLinks = (
    <>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/projects">Projects</Link>
      {user && user.role === 'freelancer' && <Link to="/tasks">Tasks</Link>}
      <Link to="/profile">Profile</Link>
      <Link to="/logout">Logout</Link>
    </>
  );

  const guestLinks = (
    <>
      <Link to="/register">Register</Link>
      <Link to="/login">Login</Link>
    </>
  );

  return (
    <nav>
      <h1>Project Management Dashboard</h1>
      <div>
        {isAuthenticated ? authLinks : guestLinks}
      </div>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Navbar);