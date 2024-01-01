import React, { useState } from 'react';
import './index.css';

const Modal = ({ onCloseModal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = () => {
    setSearchResults([]);
  };

  return (
    <div className='modal-overlay'>
      <div className='modal'>
        <div className='modal-close-container'>
          
          <div className='close-button' onClick={onCloseModal}>X</div>
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
          {searchResults.map((result, index) => (
            <li key={index}>{result}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Modal;
