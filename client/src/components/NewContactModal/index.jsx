import React, { useState } from 'react';
import axios from 'axios'
import ContactItem from '../ContactItem';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const NewContactModal = ({ onToggleModal, onNewContactAdded }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = () => {
    const currentId = sessionStorage.getItem("sessionId");

    axios.post(`http://localhost:8080/contacts/search?q=${searchQuery}`, {
      currentId: currentId,
    }).then(response => {
      console.log(response.data)
      setSearchResults(response.data);
    })
      .catch(error => {
        console.error('Erro ao fazer a solicitação:', error.response.data);
      });

  };


  const handleAddContact = (contactId) => {
    const currentId = sessionStorage.getItem("sessionId");

    axios.post(`http://localhost:8080/contact/add`, {
      currentId: currentId,
      contactId: contactId
    }).then(response => {
      onNewContactAdded()
    })
      .catch(error => {
        console.error('Erro ao fazer a solicitação:', error.response.data);
      });
  }

  return (
    <div className='modal-overlay'>
      <div className='modal'>
        <div className='modal-close-container'>
          <FontAwesomeIcon onClick={onToggleModal} icon={faXmark} />
        </div>
        <div className='modal-spacer'></div>
        <div className='modal-search'>
          <input
            type='text'
            placeholder='Search...'
            value={searchQuery}
            className='modal-search-input'
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <ul>
          {searchResults.map((result) => (
            <li key={result.id}>
              <ContactItem label={result.name} onClick={() => handleAddContact(result.id)} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NewContactModal;
