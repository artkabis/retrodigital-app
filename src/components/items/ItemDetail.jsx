import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CollectionContext } from '../../context/CollectionContext';
import LoadingIndicator from '../common/LoadingIndicator';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getItemById, getCollectionById, deleteItem, loading, error } = useContext(CollectionContext);
  
  const [item, setItem] = useState(null);
  const [collection, setCollection] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    // Charger l'item
    const itemData = getItemById(id);
    if (itemData) {
      setItem(itemData);
      
      // Charger la collection associée
      const collectionData = getCollectionById(itemData.userSpecific.collectionId);
      if (collectionData) {
        setCollection(collectionData);
      }
    } else if (!loading) {
      // Item non trouvé et pas en cours de chargement
      navigate('/collections');
    }
  }, [id, getItemById, getCollectionById, navigate, loading]);
  
  const handleDeleteClick = () => {
    setDeleteConfirmation(true);
  };
  
  const handleCancelDelete = () => {
    setDeleteConfirmation(false);
  };
  
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    
    try {
      await deleteItem(id);
      navigate(`/collections/${item.userSpecific.collectionId}`);
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
  
  if (loading || !item) {
    return <LoadingIndicator message="Chargement de l'item..." />;
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
    <div className="item-detail-container">
      {deleteConfirmation && (
        <div className="delete-confirmation-modal">
          <div className="delete-confirmation-content">
            <h3>Confirmer la suppression</h3>
            <p>Êtes-vous sûr de vouloir supprimer <strong>{item.title}</strong> de votre collection ?</p>
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
      
      <div className="item-detail-header">
        <div className="item-breadcrumb">
          <Link to="/collections">Collections</Link> {' > '}
          {collection && (
            <Link to={`/collections/${collection.id}`}>{collection.name}</Link>
          )}
          {' > '}
          <span className="current-item">{item.title}</span>
        </div>
        
        <div className="item-actions">
          <Link 
            to={`/items/${id}/edit`}
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
      
      <div className="item-detail-content">
        <div className="item-detail-main">
          <div className="item-detail-image">
            {item.images && item.images[0] ? (
              <img src={item.images[0]} alt={item.title} className="item-main-image" />
            ) : (
              <div className="item-placeholder-image">
                <span className="icon-image">📚</span>
              </div>
            )}
            
            {item.userSpecific.favorite && (
              <div className="favorite-badge">
                <span className="icon-favorite">⭐</span>
              </div>
            )}
          </div>
          
          <div className="item-detail-info">
            <h1 className="item-title">{item.title}</h1>
            
            <div className="item-meta">
              <span className="item-type">{item.type}</span>
              <span className="item-year">{item.year}</span>
            </div>
            
            <p className="item-description">{item.description}</p>
            
            {item.type === 'book' && (
              <div className="item-metadata">
                <h3>Détails</h3>
                <div className="metadata-grid">
                  <div className="metadata-item">
                    <span className="metadata-label">Auteur</span>
                    <span className="metadata-value">{item.metadata.author}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Éditeur</span>
                    <span className="metadata-value">{item.metadata.publisher}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">ISBN</span>
                    <span className="metadata-value">{item.metadata.isbn}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Format</span>
                    <span className="metadata-value">{item.metadata.format}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Langue</span>
                    <span className="metadata-value">{item.metadata.language}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Pages</span>
                    <span className="metadata-value">{item.metadata.pageCount}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Genre</span>
                    <span className="metadata-value">{item.metadata.genre}</span>
                  </div>
                </div>
              </div>
            )}
            
            {item.type === 'vinyl' && (
              <div className="item-metadata">
                <h3>Détails</h3>
                <div className="metadata-grid">
                  <div className="metadata-item">
                    <span className="metadata-label">Artiste</span>
                    <span className="metadata-value">{item.metadata.artist}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Label</span>
                    <span className="metadata-value">{item.metadata.label}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Format</span>
                    <span className="metadata-value">{item.metadata.format}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Date de sortie</span>
                    <span className="metadata-value">{item.metadata.releaseDate}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Genre</span>
                    <span className="metadata-value">{item.metadata.genre}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">État</span>
                    <span className="metadata-value">{item.metadata.condition}</span>
                  </div>
                </div>
              </div>
            )}
            
            {item.type === 'film' && (
              <div className="item-metadata">
                <h3>Détails</h3>
                <div className="metadata-grid">
                  <div className="metadata-item">
                    <span className="metadata-label">Réalisateur</span>
                    <span className="metadata-value">{item.metadata.director}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Studio</span>
                    <span className="metadata-value">{item.metadata.studio}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Format</span>
                    <span className="metadata-value">{item.metadata.format}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Durée</span>
                    <span className="metadata-value">{item.metadata.runtime} min</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Genre</span>
                    <span className="metadata-value">{item.metadata.genre}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Langue</span>
                    <span className="metadata-value">{item.metadata.language}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="item-detail-sidebar">
          <div className="item-market-info">
            <h3>Informations de marché</h3>
            <div className="market-value">
              <span className="value-label">Valeur estimée</span>
              <span className="value-amount">{item.market.estimatedValue.toFixed(2)} €</span>
            </div>
            <div className="market-condition">
              <span className="condition-label">État</span>
              <span className="condition-value">{item.market.condition}</span>
            </div>
            <div className="market-update">
              <span className="update-text">
                Dernière mise à jour: {formatDate(item.market.lastUpdated)}
              </span>
            </div>
          </div>
          
          <div className="item-user-info">
            <h3>Notes personnelles</h3>
            <div className="user-notes">
              <p>{item.userSpecific.notes || 'Aucune note personnelle'}</p>
            </div>
            
            {item.userSpecific.tags.length > 0 && (
              <div className="user-tags">
                <h4>Tags</h4>
                <div className="tags-list">
                  {item.userSpecific.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="user-dates">
              <p className="date-added">
                Ajouté le {formatDate(item.userSpecific.dateAdded)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;