import React from 'react';
import HamburgerMenu from '../HamburguerMenu';
import './index.css';

const ChatListHeader = ({ onLogout, onAddNewContact, onNewChat }) => {
  return (
    <div className="base-container">
      <div className="header-container">
        <HamburgerMenu onLogout={onLogout} />
        <div className='spacer'></div>
      </div>
      <div className="header-container">
        <button onClick={onNewChat}>Novo Chat</button>
        <div className='spacer'></div>
        <button onClick={onAddNewContact}>Adicionar Contato</button>
      </div>

    </div>
  );
};

export default ChatListHeader;
