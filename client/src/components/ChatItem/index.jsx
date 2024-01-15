import React from 'react';
import './index.css';

const ChatItem = ({ name, onClick }) => {
  return (
    <div className='chat-item' onClick={onClick}>
      <div className='chat-item-content'>
        <span className='chat-item-label'>{name}</span>
      </div>

      <div className='underline'></div>
    </div>

  );
};

export default ChatItem;
