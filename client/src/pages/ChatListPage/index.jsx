import React, { useState } from 'react';
import ContactListModal from './../../components/ContactListModal';
import './index.css';

const ChatsPage = () => {
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

  return (
    <div className="chats-container">
      <h2>My Chats</h2>

      {chats.length === 0 ? (
        <p>No chats available. Start a new conversation!</p>
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

      <button className="new-conversation-button" onClick={handleNewChat}>
        Start a New Conversation
      </button>

      {showContactList && (
        <ContactListModal onSelect={handleContactSelected} />
      )}
    </div>
  );
};

export default ChatsPage;
