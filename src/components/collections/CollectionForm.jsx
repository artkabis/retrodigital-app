import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CollectionContext } from '../../context/CollectionContext';
import LoadingIndicator from '../common/LoadingIndicator';

const CollectionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCollectionById, createCollection, updateCollection, loading, error } = useContext(CollectionContext);
  
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: true,
    coverImage: '/images/collections/default.jpg'
  });
  
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Si en mode édition, charger les données de la collection
  useEffect(() => {
    if (isEditing) {
      const collection = getCollectionById(id);
      if (collection) {
        setFormData({
          name: collection.name,
          description: collection.description || '',
          isPublic: collection.isPublic,
          coverImage: collection.coverImage
        });
      } else if (!loading) {
        // Collection non trouvée
        navigate('/collections');
      }
    }
  }, [id, isEditing, getCollectionById, navigate, loading]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      setFormError('Le nom de la collection est obligatoire');
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');
    
    try {
      if (isEditing) {
        await updateCollection(id, formData);
        navigate(`/collections/${id}`);
      } else {
        const newCollection = await createCollection(formData);
        navigate(`/collections/${newCollection.id}`);
      }
    } catch (err) {
      setFormError(err.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Couvertures prédéfinies pour le MVP
  const coverOptions = [
    { value: '/images/collections/default.jpg', label: 'Défaut' },
    { value: '/images/collections/scifi.jpg', label: 'Science-Fiction' },
    { value: '/images/collections/vinyles.jpg', label: 'Vinyles' },
    { value: '/images/collections/films.jpg', label: 'Films' }
  ];
  
  if (loading && isEditing) {
    return <LoadingIndicator message="Chargement de la collection..." />;
  }
  
  return (
    <div className="collection-form-container">
      <div className="form-header">
        <h2>{isEditing ? 'Modifier la collection' : 'Nouvelle collection'}</h2>
      </div>
      
      {(formError || error) && (
        <div className="error-message">
          {formError || error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="collection-form">
        <div className="form-group">
          <label htmlFor="name">Nom de la collection *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Ma collection de science-fiction"
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Décrivez votre collection..."
            rows="4"
            disabled={isSubmitting}
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="isPublic">Visibilité</label>
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="isPublic"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <label htmlFor="isPublic" className="checkbox-label">
              Collection publique (visible par tous les utilisateurs)
            </label>
          </div>
        </div>
        
        <div className="form-group">
          <label>Image de couverture</label>
          <div className="cover-options">
            {coverOptions.map(option => (
              <div 
                key={option.value}
                className={`cover-option ${formData.coverImage === option.value ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, coverImage: option.value })}
              >
                <div 
                  className="cover-preview"
                  style={{ backgroundImage: `url(${option.value})` }}
                ></div>
                <span className="cover-label">{option.label}</span>
              </div>
            ))}
          </div>
          <p className="form-help-text">
            Note: L'upload d'images personnalisées sera disponible dans une version future.
          </p>
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-text"
            onClick={() => navigate(isEditing ? `/collections/${id}` : '/collections')}
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (isEditing ? 'Enregistrement...' : 'Création...') 
              : (isEditing ? 'Enregistrer' : 'Créer la collection')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CollectionForm;