import React, { useState, useEffect } from 'react';
import ChatListHeader from '../../components/ChatListHeader';
import NewContactModal from '../../components/NewContactModal';
import NewChatModal from '../../components/NewChatModal';
import axios from 'axios';
import { saveChatKey, getPrivateKey, decryptWithPrivateKey } from '../../keys';

import './index.css';

import { useNavigate } from 'react-router-dom';
import ChatItem from '../../components/ChatItem';

const ChatsPage = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);

  const fetchChats = async (currentId) => {
    axios.post('http://localhost:8080/chat/my', { currentId: currentId })
      .then(response => {
        console.log(response.data)
        setChats(response.data);
      })
      .catch(error => {
        console.error('Erro ao fazer a solicitação:', error.response.data);
      });
  }

  const fetchKeys = async (currentId) => {
    try {
      const result = await axios.post('http://localhost:8080/key/get', { currentId: currentId })
      const exchanges = result.data
      for (let i = 0; i < exchanges.length; i++) {
        const { id, chatId, key } = exchanges[i]
        await axios.post('http://localhost:8080/key/confirm', { exchangeId: id })
        const privateKey = getPrivateKey(currentId)
        const decryptedKey = decryptWithPrivateKey(privateKey, key)
        saveChatKey(currentId, chatId, decryptedKey)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const fetchData = async () => {
    const currentId = sessionStorage.getItem("sessionId");
    if (currentId === null) {
      navigate('/login');
    }

    await fetchChats(currentId)
    await fetchKeys(currentId)
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOnLogout = () => {
    sessionStorage.setItem("sessionId", null);
    navigate('/login')
  }

  const toggleNewChatModal = () => setIsNewChatModalOpen(!isNewChatModalOpen);
  const toogleAddContactModal = () => setIsAddContactModalOpen(!isAddContactModalOpen)

  const onNewContactAdded = () => {
    toogleAddContactModal()
    fetchData()
  }

  const onNewChatCreated = () => {
    toggleNewChatModal()
    fetchData()
  }

  const handleOnChatClicked = (chatId) => {
    const currentId = sessionStorage.getItem("sessionId");
    console.log(chatId)
    // navigate('/chat')
  }

  return (
    <div className="chats-container">
      {isNewChatModalOpen && <NewChatModal onToggleModal={toggleNewChatModal} onNewChatCreated={onNewChatCreated} />}
      {isAddContactModalOpen && <NewContactModal onToggleModal={toogleAddContactModal} onNewContactAdded={onNewContactAdded} />}

      <ChatListHeader onLogout={handleOnLogout} onNewChat={toggleNewChatModal} onAddNewContact={toogleAddContactModal} />
      {chats.length === 0 ? (
        <div>
          <p>Adicione um contato e crie um novo chat</p>
        </div>
      ) : (
        <ul className="chat-list">
          {chats.map((chat, index) => (
            <li key={index}><ChatItem name={chat.name} onClick={() => { handleOnChatClicked(chat.id) }} /></li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatsPage;
