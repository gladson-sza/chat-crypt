import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './index.css'

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Perform your login logic here (e.g., send data to a server)
    console.log('Login clicked');
  };

  return (
    <div>
      <h2>Login</h2>
      <form className='form-container'>
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

        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>

      <p>
        Don't have an account? <Link to="/registration">Register here</Link>.
      </p>
    </div>
  );
};

export default LoginPage;
