import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CollectionContext } from '../../context/CollectionContext';
import LoadingIndicator from '../common/LoadingIndicator';

const CollectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCollectionById, getItemsByCollectionId, deleteCollection, loading, error } = useContext(CollectionContext);
  
  const [collection, setCollection] = useState(null);
  const [items, setItems] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid ou list
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    // Charger la collection et ses items
    const collectionData = getCollectionById(id);
    if (collectionData) {
      setCollection(collectionData);
      
      const collectionItems = getItemsByCollectionId(id);
      setItems(collectionItems);
    } else if (!loading) {
      // Collection non trouvée et pas en cours de chargement
      navigate('/collections');
    }
  }, [id, getCollectionById, getItemsByCollectionId, navigate, loading]);
  
  const handleDeleteClick = () => {
    setDeleteConfirmation(true);
  };
  
  const handleCancelDelete = () => {
    setDeleteConfirmation(false);
  };
  
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    
    try {
      await deleteCollection(id);
      navigate('/collections');
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation(false);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  if (loading || !collection) {
    return <LoadingIndicator message="Chargement de la collection..." />;
  }
  
  if (error) {
    return (
      <div className="error-container">
        <h3>Une erreur est survenue</h3>
        <p>{error}</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/collections')}
        >
          Retour aux collections
        </button>
      </div>
    );
  }
  
  return (
    <div className="collection-detail-container">
      {deleteConfirmation && (
        <div className="delete-confirmation-modal">
          <div className="delete-confirmation-content">
            <h3>Confirmer la suppression</h3>
            <p>Êtes-vous sûr de vouloir supprimer la collection <strong>{collection.name}</strong> ?</p>
            <p>Cette action est irréversible et tous les items associés seront également supprimés.</p>
            <div className="confirmation-actions">
              <button 
                className="btn btn-text"
                onClick={handleCancelDelete}
                disabled={isDeleting}
              >
                Annuler
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Suppression...' : 'Supprimer définitivement'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="collection-detail-header">
        <div className="collection-detail-banner" style={{ backgroundImage: `url(${collection.coverImage})` }}>
          <div className="collection-detail-overlay">
            <h1 className="collection-detail-title">{collection.name}</h1>
            <div className="collection-detail-meta">
              <span className="collection-detail-date">
                Créée le {formatDate(collection.dateCreated)}
              </span>
              {collection.isPublic ? (
                <span className="collection-visibility public">Public</span>
              ) : (
                <span className="collection-visibility private">Privé</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="collection-detail-actions">
          <div className="collection-view-controls">
            <button 
              className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Vue grille"
            >
              <span className="icon-grid">□</span>
            </button>
            <button 
              className={`btn-icon ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="Vue liste"
            >
              <span className="icon-list">☰</span>
            </button>
          </div>
          
          <div className="collection-management-actions">
            <Link 
              to={`/collections/${id}/edit`}
              className="btn btn-text"
            >
              Modifier
            </Link>
            <button 
              className="btn btn-danger"
              onClick={handleDeleteClick}
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
      
      <div className="collection-detail-description">
        <p>{collection.description || 'Aucune description'}</p>
      </div>
      
      <div className="collection-items-section">
        <div className="collection-items-header">
          <h2>Items ({items.length})</h2>
          <Link 
            to={`/scan/barcode?collectionId=${id}`}
            className="btn btn-primary"
          >
            Ajouter un item
          </Link>
        </div>
        
        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <h3>Cette collection est vide</h3>
              <p>Commencez à scanner vos objets pour les ajouter à cette collection.</p>
              <Link 
                to={`/scan/barcode?collectionId=${id}`}
                className="btn btn-primary"
              >
                Scanner un objet
              </Link>
            </div>
          </div>
        ) : (
          <div className={`collection-items ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}>
            {items.map(item => (
              <div key={item.id} className="item-card">
                <Link to={`/items/${item.id}`} className="item-card-link">
                  <div 
                    className="item-image"
                    style={{ backgroundImage: `url(${item.images && item.images[0] ? item.images[0] : '/images/items/default.jpg'})` }}
                  >
                    <div className="item-type-badge">{item.type}</div>
                  </div>
                  
                  <div className="item-info">
                    <h3 className="item-title">{item.title}</h3>
                    
                    {item.type === 'book' && (
                      <p className="item-subtitle">{item.metadata.author}, {item.year}</p>
                    )}
                    
                    {item.type === 'vinyl' && (
                      <p className="item-subtitle">{item.metadata.artist}, {item.year}</p>
                    )}
                    
                    {item.type === 'film' && (
                      <p className="item-subtitle">{item.metadata.director}, {item.year}</p>
                    )}
                    
                    <p className="item-description">
                      {item.description && item.description.length > 100
                        ? `${item.description.substring(0, 100)}...`
                        : item.description}
                    </p>
                    
                    {viewMode === 'list' && (
                      <div className="item-details">
                        <div className="item-market-info">
                          <span className="item-value">{item.market.estimatedValue.toFixed(2)} €</span>
                          <span className="item-condition">{item.market.condition}</span>
                        </div>
                        <div className="item-dates">
                          <span className="item-added-date">
                            Ajouté le {formatDate(item.userSpecific.dateAdded)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
                
                {viewMode === 'grid' && (
                  <div className="item-actions">
                    <Link 
                      to={`/items/${item.id}/edit`}
                      className="btn btn-text btn-sm"
                    >
                      Modifier
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionDetail;