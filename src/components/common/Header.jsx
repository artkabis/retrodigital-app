import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Header = ({ toggleSidebar }) => {
  const { currentUser, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <header className="header">
      <button className="header-menu-toggle" onClick={toggleSidebar}>
        <span className="icon-menu">☰</span>
      </button>
      
      <Link to="/" className="header-logo">
        <span className="logo-icon">📚</span>
        <span className="logo-text">RetroDigital</span>
      </Link>
      
      {isAuthenticated && (
        <nav className="header-nav">
          <Link 
            to="/collections" 
            className={`header-nav-item ${isActive('/collections') ? 'active' : ''}`}
          >
            Collections
          </Link>
          <Link 
            to="/scan/barcode" 
            className={`header-nav-item ${isActive('/scan/barcode') ? 'active' : ''}`}
          >
            Scanner
          </Link>
        </nav>
      )}
      
      <div className="header-actions">
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="btn btn-text">
              {currentUser?.firstName || currentUser?.username}
            </Link>
            <button 
              onClick={handleLogout} 
              className="btn btn-secondary"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-text">
              Connexion
            </Link>
            <Link to="/register" className="btn btn-primary">
              S'inscrire
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;