import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CollectionContext } from '../../context/CollectionContext';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = ({ isOpen }) => {
  const { collections } = useContext(CollectionContext);
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();
  
  // Si l'utilisateur n'est pas connecté, on ne montre pas la sidebar
  if (!isAuthenticated) {
    return null;
  }
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <div className="sidebar-nav">
        <Link 
          to="/collections"
          className={`sidebar-nav-item ${isActive('/collections') ? 'active' : ''}`}
        >
          <span className="sidebar-nav-icon">📚</span>
          <span className="sidebar-nav-text">Mes Collections</span>
        </Link>
        <Link 
          to="/scan/barcode"
          className={`sidebar-nav-item ${isActive('/scan/barcode') ? 'active' : ''}`}
        >
          <span className="sidebar-nav-icon">📷</span>
          <span className="sidebar-nav-text">Scanner un code-barres</span>
        </Link>
        <Link 
          to="/scan/image"
          className={`sidebar-nav-item ${isActive('/scan/image') ? 'active' : ''}`}
        >
          <span className="sidebar-nav-icon">🖼️</span>
          <span className="sidebar-nav-text">Reconnaissance d'image</span>
        </Link>
        <Link 
          to="/profile"
          className={`sidebar-nav-item ${isActive('/profile') ? 'active' : ''}`}
        >
          <span className="sidebar-nav-icon">👤</span>
          <span className="sidebar-nav-text">Mon Profil</span>
        </Link>
      </div>
      
      {collections.length > 0 && (
        <div className="sidebar-collections">
          <div className="sidebar-collections-title">
            <span>Mes Collections</span>
            <Link to="/collections/new" className="sidebar-add-collection" title="Nouvelle collection">+</Link>
          </div>
          
          <ul className="sidebar-collection-list">
            {collections.map(collection => (
              <li key={collection.id} className="sidebar-collection-item">
                <Link 
                  to={`/collections/${collection.id}`}
                  className={`sidebar-collection-link ${isActive(`/collections/${collection.id}`) ? 'active' : ''}`}
                >
                  {collection.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;