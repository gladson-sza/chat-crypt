import React from 'react';
import './index.css';

const ContactItem = ({ label, onClick }) => {
  return (
    <div className='contact-item' onClick={onClick}>
      <div className='content'>
        <span className='contact-label'>{label}</span>
      </div>

      <div className='underline'></div>
    </div>

  );
};

export default ContactItem;
