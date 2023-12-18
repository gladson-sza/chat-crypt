import React, { useState } from 'react';
import ContactListModal from './../../components/ContactListModal';
import ChatListHeader from '../../components/ChatListHeader';
import ContactItem from '../../components/ContactItem';

import './index.css';

import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';

const ChatsPage = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [showContactList, setShowContactList] = useState(false);

  const handleNewChat = () => {
    setShowContactList(true);
  };

  const handleContactSelected = (contact) => {
    // Create a new chat with the selected contact
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

  return (
    <div className="chats-container">
      <ChatListHeader onLogout={handleOnLogout} onSearch={handleOnSearch} />

      {chats.length === 0 ? (
        <div>
          <p>Search a contact to start a new conversation</p>
          <ContactItem label='Gladson'/>
          <ContactItem label='Ademir'/>
          <ContactItem label='Natanael'/>
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
