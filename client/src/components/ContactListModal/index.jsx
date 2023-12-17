import React from 'react';
import './index.css';

const contacts = [
  { id: 1, name: 'John Doe', photo: 'https://placekitten.com/50/50' },
  { id: 2, name: 'Jane Smith', photo: 'https://placekitten.com/51/51' },
  // Add more contacts as needed
];

const ContactListModal = ({ onSelect }) => {
  return (
    <div className="contact-list-modal">
      <h3>Select a Contact</h3>
      <ul className="contact-list">
        {contacts.map((contact) => (
          <li key={contact.id} onClick={() => onSelect(contact)}>
            <img
              src={contact.photo}
              alt={contact.name}
              className="contact-photo"
            />
            <span>{contact.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactListModal;