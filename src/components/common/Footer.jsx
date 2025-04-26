import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-copyright">
        &copy; {currentYear} RetroDigital. Tous droits réservés.
      </div>
      
      <div className="footer-links">
        <Link to="/about" className="footer-link">À propos</Link>
        <Link to="/privacy" className="footer-link">Confidentialité</Link>
        <Link to="/terms" className="footer-link">Conditions d'utilisation</Link>
        <Link to="/contact" className="footer-link">Contact</Link>
      </div>
    </footer>
  );
};

export default Footer;