import React, { useState } from 'react';

import './index.css'
import Header from '../../components/Header';
import { useNavigate } from 'react-router-dom';

const ChatPage = () => {

  const navigate  = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    setMessages([...messages, { text: newMessage, isUser: true }]);
    setNewMessage('');
  };

  const handleBackClick = () => {
    navigate ('/login');
  }

  return (
    <div>
      <Header onBackClick={handleBackClick} conversationName='Gladson'></Header>

      <div className='chat-container'>
        {messages.length === 0 ?
          <div className='message-list'>
            {<p>No messages avaliable, start a new conversation.</p>}
          </div>
          : <div className='message-list'>
            {messages.map((message, index) => (
              <div
                key={index}
                className={message.isUser ? 'user-message' : 'other-message'}
              >
                {message.text}
              </div>
            ))}
          </div>}



        <div className='message-input'>
          <input
            type='text'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder='Type your message...'
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
