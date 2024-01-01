import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'

import './index.css'

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const body = {
      email: email,
      password: password,
    }

    axios.post('http://localhost:8080/login', body)
      .then(response => {
        sessionStorage.setItem("sessionId", response.data.id);
        navigate('/chats')
      })
      .catch(error => {
        console.error('Erro ao fazer a solicitação:', error.response.data);
      });
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
