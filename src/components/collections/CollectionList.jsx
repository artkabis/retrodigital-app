import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CollectionContext } from '../../context/CollectionContext';
import { AuthContext } from '../../context/AuthContext';
import LoadingIndicator from '../common/LoadingIndicator';

const CollectionList = () => {
  const { collections, loading, error, fetchUserCollections } = useContext(CollectionContext);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Rafraîchir les collections au chargement du composant
    if (currentUser) {
      fetchUserCollections();
    }
  }, [currentUser]);
  
  const getItemCount = (collectionId) => {
    const collection = collections.find(c => c.id === collectionId);
    return collection ? collection.items.length : 0;
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  if (loading) {
    return <LoadingIndicator message="Chargement de vos collections..." />;
  }
  
  if (error) {
    return (
      <div className="error-container">
        <h3>Une erreur est survenue</h3>
        <p>{error}</p>
        <button 
          className="btn btn-primary"
          onClick={() => fetchUserCollections()}
        >
          Réessayer
        </button>
      </div>
    );
  }
  
  return (
    <div className="collections-container">
      <div className="collections-header">
        <h2>Mes Collections</h2>
        <Link to="/collections/new" className="btn btn-primary">
          Nouvelle Collection
        </Link>
      </div>
      
      {collections.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-content">
            <h3>Vous n'avez pas encore de collection</h3>
            <p>
              Commencez par créer votre première collection pour organiser vos livres, 
              vinyles, films et autres objets de collection.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/collections/new')}
            >
              Créer ma première collection
            </button>
          </div>
        </div>
      ) : (
        <div className="collections-grid">
          {collections.map(collection => (
            <div key={collection.id} className="collection-card">
              <Link to={`/collections/${collection.id}`} className="collection-card-link">
                <div 
                  className="collection-cover"
                  style={{ backgroundImage: `url(${collection.coverImage})` }}
                >
                  <div className="collection-items-count">
                    {getItemCount(collection.id)} items
                  </div>
                </div>
                <div className="collection-info">
                  <h3 className="collection-name">{collection.name}</h3>
                  <p className="collection-description">
                    {collection.description.length > 100
                      ? `${collection.description.substring(0, 100)}...`
                      : collection.description}
                  </p>
                  <div className="collection-meta">
                    <span className="collection-date">
                      Modifié le {formatDate(collection.lastModified)}
                    </span>
                    {collection.isPublic ? (
                      <span className="collection-visibility public">Public</span>
                    ) : (
                      <span className="collection-visibility private">Privé</span>
                    )}
                  </div>
                </div>
              </Link>
              <div className="collection-actions">
                <Link 
                  to={`/collections/${collection.id}/edit`}
                  className="btn btn-text"
                >
                  Modifier
                </Link>
                <Link 
                  to={`/scan/barcode?collectionId=${collection.id}`}
                  className="btn btn-secondary"
                >
                  Ajouter un item
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="scan-floating-button">
        <button 
          className="btn-floating"
          onClick={() => navigate('/scan/barcode')}
          title="Scanner un objet"
        >
          <span className="icon-scan">+</span>
        </button>
      </div>
    </div>
  );
};

export default CollectionList;