// src/components/auth/Register.js
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { register } from '../../actions/authActions';

const Register = ({ register }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'freelancer', // Default role
  });

  const { name, email, password, role } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    register({ name, email, password, role });
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={name}
        onChange={onChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={email}
        onChange={onChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={onChange}
        required
      />
      <select name="role" value={role} onChange={onChange} required>
        <option value="freelancer">Freelancer</option>
        <option value="client">Client</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
};

export default connect(null, { register })(Register);
