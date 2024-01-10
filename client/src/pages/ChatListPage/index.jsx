import React, { useState, useEffect } from 'react';
import ChatListHeader from '../../components/ChatListHeader';
import ContactItem from '../../components/ContactItem';
import Modal from '../../components/Modal';
import axios from 'axios';

import './index.css';

import { useNavigate } from 'react-router-dom';

const ChatsPage = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    const currentId = sessionStorage.getItem("sessionId");

    axios.post('http://localhost:8080/contacts/my', { currentId: currentId, })
      .then(response => {
        console.log(response.data)
        setChats(response.data);
      })
      .catch(error => {
        console.error('Erro ao fazer a solicitação:', error.response.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOnLogout = () => {
    navigate('/login')
  }

  const handleOnSearch = (query) => {
    console.log(query)
  }

  const handleAddNewContact = () => {
    setIsModalOpen(!isModalOpen);
    fetchData();
  }

  const handleOnContactClick = (socketId) => {
    const currentId = sessionStorage.getItem("sessionId");
    navigate('/chat')
  }

  return (
    <div className="chats-container">
      {isModalOpen && <Modal onCloseModal={handleAddNewContact} />}
      <ChatListHeader onLogout={handleOnLogout} onSearch={handleOnSearch} onAddNewContact={handleAddNewContact} />
      {chats.length === 0 ? (
        <div>
          <p>Add a contact to start a new conversation</p>
        </div>
      ) : (
        <ul className="chat-list">
          {chats.map((chat, index) => (
            <li key={index}><ContactItem label={chat.name} onClick={() => {handleOnContactClick()}} /></li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatsPage;
