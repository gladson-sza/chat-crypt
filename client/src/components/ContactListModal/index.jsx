import React from 'react';
import './index.css';

const contacts = [
  { id: 1, name: 'John Doe', photo: 'https://icons8.com.br/icon/23240/usu%C3%A1rio-masculino-tipo-de-pele-com-c%C3%ADrculo-3' },
  { id: 2, name: 'Jane Smith', photo: 'https://icons8.com.br/icon/23240/usu%C3%A1rio-masculino-tipo-de-pele-com-c%C3%ADrculo-3' },
  // Add more contacts as needed
];

const ContactListModal = ({ onSelect }) => {
  return (
    <div className="contact-list-modal">
      <h3>Select a Contact</h3>
      <ul className="chat-list">
        {contacts.map((contact) => (
          <li key={contact.id} onClick={() => onSelect(contact)}>
            {
              <img
                src={contact.photo}
                className="contact-photo"
              />}
            <span>{contact.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactListModal;