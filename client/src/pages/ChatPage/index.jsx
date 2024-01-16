import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from '../../components/ChatHeader';
import io from 'socket.io-client';
import CryptoJS from 'crypto-js';
import './index.css'

import { getChatKey } from '../../keys';

import { useNavigate } from 'react-router-dom';

const ChatPage = () => {

  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatName, setChatName] = useState('');
  const socketRef = useRef();

  useEffect(() => {
    const chatId = sessionStorage.getItem("chatId");
    if (chatId === null) {
      navigate('/chats');
      return;
    }

    const chatName = sessionStorage.getItem("chatName")
    setChatName(chatName)

    socketRef.current = io('ws://localhost:8080');
    socketRef.current.emit('joinRoom', chatId);

    socketRef.current.on('message', (data) => {
      console.log(data)

      if (data.type === 'connection') {
        console.log(data.message)
      } else {
        console.log(data)
        const currentId = sessionStorage.getItem("sessionId");
        const chatKey = getChatKey(currentId, chatId)

        const decryptedMessage = decryptMessage(data.message, chatKey);
        setMessages((prevMessages) => [...prevMessages, { text: decryptedMessage, isUser: currentId == data.userId }]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };

  }, []);

  const encryptMessage = (message, key) => CryptoJS.TripleDES.encrypt(message, key).toString();

  const decryptMessage = (encrypted, key) => CryptoJS.TripleDES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const currentId = sessionStorage.getItem("sessionId");
      const chatId = sessionStorage.getItem("chatId")
      const chatKey = getChatKey(currentId, chatId)
      console.log(chatKey)
      const encryptedMessage = encryptMessage(newMessage, chatKey);
      socketRef.current.emit('message', { roomId: chatId, message: encryptedMessage, userId: currentId });
      setNewMessage('');
    }
  };


  const handleBackClick = () => {
    navigate('/chats');
  }

  return (
    <div>
      <ChatHeader onBackClick={handleBackClick} conversationName={chatName}></ChatHeader>

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
