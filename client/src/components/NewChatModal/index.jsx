import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContactItem from '../ContactItem';
import './index.css';

const NewChatModal = ({ onToggleModal, onNewChatCreated }) => {
  const [checkedContacts, setCheckedContacts] = useState([]);
  const [contactList, setContactList] = useState([])

  const handleCheckboxChange = (event) => {
    const contactId = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      setCheckedContacts(prevChecked => [...prevChecked, contactId]);
    } else {
      setCheckedContacts(prevChecked => prevChecked.filter(id => id !== contactId));
    }
  };

  const fetchData = async () => {
    const currentId = sessionStorage.getItem("sessionId");
    if (currentId === null) {
      navigate('/login');
    }

    axios.post('http://localhost:8080/contacts/my', { currentId: currentId })
      .then(response => {
        console.log(response.data)
        setContactList(response.data);
      })
      .catch(error => {
        console.error('Erro ao fazer a solicitação:', error.response.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const hangleCreateChat = () => {
    const currentId = sessionStorage.getItem("sessionId");
    if (currentId === null) {
      navigate('/login');
    }

    console.log('Checked Contacts:', checkedContacts);
    const contactIds = checkedContacts.map(e => parseInt(e))

    if (checkedContacts.length > 0) {
      axios.post('http://localhost:8080/chat', { currentId: currentId, contactIds: contactIds })
        .then(response => {
          console.log(response.data)
          onToggleModal()
        })
        .catch(error => {
          console.error('Erro ao fazer a solicitação:', error.response.data);
        });
    }
  };

  return (
    <div className='modal-overlay'>
      <div className='modal'>
        <div className='modal-close-container'>
          <div className='close-button' onClick={onToggleModal}>X</div>
        </div>
        <ul>
          {contactList.map((result) => (
            <li className='modal-group-choice' key={result.id}>
              <input
                type='checkbox'
                value={result.id}
                onChange={handleCheckboxChange}
              />
              <ContactItem label={result.name} />
            </li>
          ))}
        </ul>

        <button onClick={hangleCreateChat}>Criar</button>
      </div>
    </div>
  );
};

export default NewChatModal;
