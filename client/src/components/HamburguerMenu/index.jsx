import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import './index.css'; // Add your styles here

const HamburgerMenu = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="hamburger-menu">
      <div className={`menu-icon ${isMenuOpen ? 'open' : ''}`} onClick={handleToggleMenu}>
        <FontAwesomeIcon icon={faBars} />
      </div>

      {isMenuOpen && (
        <div className="dropdown-menu">
          <div className="menu-item" onClick={handleLogout}>
            Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
