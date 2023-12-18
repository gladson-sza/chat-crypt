import React from 'react';
import HamburgerMenu from '../HamburguerMenu';
import SearchBar from '../SearchBar';
import './index.css';

const ChatListHeader = ({ onLogout, onSearch }) => {
  return (
    <div className="header-container">
      <HamburgerMenu onLogout={onLogout} />
      <div className='spacer'></div>
      <SearchBar onSearch={onSearch}/>
    </div>
  );
};

export default ChatListHeader;
