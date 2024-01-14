import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from '../../components/ChatHeader';
import io from 'socket.io-client';
import CryptoJS from 'crypto-js';
import './index.css'

import { useNavigate } from 'react-router-dom';

const ChatPage = () => {

  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomName, setRoomName] = useState(''); // Adicione o estado para o nome da sala
  const socketRef = useRef();

  useEffect(() => {
    const chatId = sessionStorage.getItem("chatId");
    if (chatId === null) {
      navigate('/chats');
      return;
    }

    socketRef.current = io('ws://localhost:8080');
    socketRef.current.connect();
    socketRef.current.on('message', (message) => {
      console.log(message)
      if (message.name !== 'Admin') {
        const currentId = sessionStorage.getItem("sessionId");

        const decryptedMessage = decryptMessage(message.text);
        setMessages((prevMessages) => [...prevMessages, { text: decryptedMessage, isUser: currentId == message.userId }]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };

  }, []);

  const encryptMessage = (message) => CryptoJS.TripleDES.encrypt(message, getSharedKey()).toString();

  const decryptMessage = (encrypted) => CryptoJS.TripleDES.decrypt(encrypted, getSharedKey()).toString(CryptoJS.enc.Utf8);

  const getSharedKey = () => {
    return 'NErCsY8LIG+qPweBswMFPlmJTZa0WzKbnzKhEm539HjUd50kJarYCYHFLLlumyU0';
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const encryptedMessage = encryptMessage(newMessage);
      const currentId = sessionStorage.getItem("sessionId");
      socketRef.current.emit('message', { text: encryptedMessage, userId: currentId });
      setNewMessage('');
    }
  };


  const handleBackClick = () => {
    navigate('/chats');
  }

  return (
    <div>
      <ChatHeader onBackClick={handleBackClick} conversationName='Gladson'></ChatHeader>

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
