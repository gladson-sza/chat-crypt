import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPublicKey } from '../../keys'
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
        const currentId = response.data.id
        sessionStorage.setItem("sessionId", currentId)
        const pKey = getPublicKey(currentId)

        axios.post('http://localhost:8080/key', { currentId: currentId, publicKey: pKey }).then(
          navigate('/chats')
        ).catch(error => {
          alert('Não foi possível se conectar ao servidor')
          console.error('Erro ao fazer a solicitação:', error);
        });
      })
      .catch(error => {
        alert('Email ou senha incorretos')
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
