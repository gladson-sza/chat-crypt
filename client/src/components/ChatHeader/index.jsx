import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './index.css';

const ChatHeader = ({ onBackClick, conversationName }) => {
  return (
    <div className="header-container">
      <div className="back-button" onClick={onBackClick}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </div>
      <div className="conversation-name">{conversationName}</div>
    </div>
  );
};

export default ChatHeader;
