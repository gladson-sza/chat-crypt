import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './index.css'

const RegistrationPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegistration = () => {
    // Perform your registration logic here (e.g., send data to a server)
    console.log('Registration clicked');
  };

  return (
    <div>
      <h2>Registration</h2>
      <form className='form-container'>
        <div className='input-label'>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className='input-label'>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className='input-label'>

          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <br></br>
        <button type="button" onClick={handleRegistration}>
          Register
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
};

export default RegistrationPage;