import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

const ContactItem = ({ imageSrc, label }) => {
  return (
    <div className='contact-item'>
      <div className='content'>
      <img src={imageSrc} className='contact-image' />
        <span className='contact-label'>{label}</span>
      </div>

      <div className='underline'></div>
    </div>

  );
};

ContactItem.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default ContactItem;
