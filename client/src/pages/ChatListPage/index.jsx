import React, { useState } from 'react';
import ContactListModal from './../../components/ContactListModal';
import ChatListHeader from '../../components/ChatListHeader';
import ContactItem from '../../components/ContactItem';
import Modal from '../../components/Modal';

import './index.css';

import { useNavigate } from 'react-router-dom';

const ChatsPage = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [showContactList, setShowContactList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNewChat = () => {
    setShowContactList(true);
  };

  const handleContactSelected = (contact) => {
    const newChat = {
      contact,
      messages: [],
    };

    setChats([...chats, newChat]);
    setShowContactList(false);
  };

  const handleOnLogout = () => {
    navigate('/login')
  }

  const handleOnSearch = (query) => {
    console.log(query)
  }

  const handleAddNewContact = () => {
    console.log('Heheh')
    setIsModalOpen(!isModalOpen);
  }

  return (
    <div className="chats-container">
      {isModalOpen && <Modal onCloseModal={handleAddNewContact} />}
      <ChatListHeader onLogout={handleOnLogout} onSearch={handleOnSearch} onAddNewContact={handleAddNewContact} />
      {chats.length === 0 ? (
        <div>
          <p>Search a contact to start a new conversation</p>
          <ContactItem imageSrc='' label='Gladson' />
          <ContactItem imageSrc='' label='Ademir' />
          <ContactItem imageSrc='' label='Natanael' />
        </div>

      ) : (
        <ul className="chat-list">
          {chats.map((chat, index) => (
            <li key={index} className="chat-item">
              <button className="new-message-button">New Message</button>
              <div className="contact-info">
                <img
                  src={chat.contact.photo}
                  alt={chat.contact.name}
                  className="contact-photo"
                />
                <span>{chat.contact.name}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showContactList && (
        <ContactListModal onSelect={handleContactSelected} />
      )}
    </div>
  );
};

export default ChatsPage;
