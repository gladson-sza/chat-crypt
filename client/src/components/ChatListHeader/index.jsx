import React from 'react';
import HamburgerMenu from '../HamburguerMenu';
import SearchBar from '../SearchBar';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const ChatListHeader = ({ onLogout, onSearch, onAddNewContact, onCreateGroup }) => {
  return (
    <div className="base-container">
      <div className="header-container">
        <HamburgerMenu onLogout={onLogout} />
        <div className='spacer'></div>
        <SearchBar onSearch={onSearch} />
      </div>
      <button onClick={onCreateGroup}>Criar Grupo</button>
      <FontAwesomeIcon className='circle' onClick={onAddNewContact} icon={faPlus} />

    </div>
  );
};

export default ChatListHeader;
