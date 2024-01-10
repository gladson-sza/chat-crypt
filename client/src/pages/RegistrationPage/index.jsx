import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios'

import './index.css'

const RegistrationPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (str) => {
    return String(str)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleRegistration = () => {
    if (name === '') {
      alert('Nome vazio')
      return;
    }

    if (email === '' || !validateEmail(email)) {
      alert('Email incorreto')
      return;
    }

    if (password === '' || password.length < 8) {
      alert('Sua senha não pode ter menos de 8 caracteres')
      return;
    }

    const body = {
      name: name,
      email: email,
      password: password
    }

    axios.post('http://localhost:8080/user', body)
      // TODO: then, output pretty window showing success registration message
      .then(_ => navigate('/login'))
      .catch(error => {
        alert('Email já registrado')
        console.error('Erro ao fazer a solicitação:', error.response.data);
      });
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