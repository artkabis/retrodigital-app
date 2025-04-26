import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CollectionContext } from '../../context/CollectionContext.jsx';
import { getImagePath } from '../../utils/imagePaths.js';
import LoadingIndicator from '../common/LoadingIndicator.jsx';

const ItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isNewItem = location.pathname.includes('/items/new');
  
  const { 
    collections, 
    getItemById, 
    addItem, 
    updateItem, 
    loading, 
    error 
  } = useContext(CollectionContext);
  
  // État initial du formulaire
  const initialFormState = {
    type: 'book',
    title: '',
    description: '',
    year: new Date().getFullYear(),
    images: [getImagePath('/images/items/default.jpg')],
    metadata: {
      // Livre (par défaut)
      author: '',
      publisher: '',
      isbn: '',
      genre: '',
      format: '',
      language: '',
      pageCount: ''
    },
    market: {
      estimatedValue: 0,
      condition: 'Bon état'
    },
    userSpecific: {
      collectionId: '',
      notes: '',
      tags: [],
      favorite: false
    }
  };
  
  // État du formulaire
  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState('');
  
  // Charger les données de l'item si on est en mode édition
  useEffect(() => {
    if (!isNewItem && id) {
      const item = getItemById(id);
      if (item) {
        // Adapter les données de l'item au format du formulaire
        setFormData({
          type: item.type || 'book',
          title: item.title || '',
          description: item.description || '',
          year: item.year || new Date().getFullYear(),
          images: item.images || [getImagePath('/images/items/default.jpg')],
          metadata: {
            // Livre
            author: item.metadata?.author || '',
            publisher: item.metadata?.publisher || '',
            isbn: item.metadata?.isbn || '',
            genre: item.metadata?.genre || '',
            format: item.metadata?.format || '',
            language: item.metadata?.language || '',
            pageCount: item.metadata?.pageCount || '',
            // Vinyle
            artist: item.metadata?.artist || '',
            label: item.metadata?.label || '',
            releaseDate: item.metadata?.releaseDate || '',
            // Film
            director: item.metadata?.director || '',
            studio: item.metadata?.studio || '',
            runtime: item.metadata?.runtime || ''
          },
          market: {
            estimatedValue: item.market?.estimatedValue || 0,
            condition: item.market?.condition || 'Bon état'
          },
          userSpecific: {
            collectionId: item.userSpecific?.collectionId || '',
            notes: item.userSpecific?.notes || '',
            tags: item.userSpecific?.tags || [],
            favorite: item.userSpecific?.favorite || false
          }
        });
      } else if (!loading) {
        // Item non trouvé et pas en cours de chargement
        navigate('/collections');
      }
    } else if (isNewItem && collections.length > 0) {
      // Pour un nouvel item, préremplir la collection si possible
      const query = new URLSearchParams(location.search);
      const collectionId = query.get('collectionId');
      
      if (collectionId && collections.some(c => c.id === collectionId)) {
        setFormData(prev => ({
          ...prev,
          userSpecific: {
            ...prev.userSpecific,
            collectionId
          }
        }));
      } else {
        // Sinon, utiliser la première collection par défaut
        setFormData(prev => ({
          ...prev,
          userSpecific: {
            ...prev.userSpecific,
            collectionId: collections[0].id
          }
        }));
      }
    }
  }, [id, isNewItem, getItemById, navigate, loading, collections, location.search]);
  
  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Champ imbriqué (ex: metadata.author)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? parseFloat(value) : value
        }
      }));
    } else if (name === 'type') {
      // Réinitialiser les métadonnées spécifiques au type
      const newMetadata = {};
      
      if (value === 'book') {
        newMetadata.author = '';
        newMetadata.publisher = '';
        newMetadata.isbn = '';
        newMetadata.genre = '';
        newMetadata.format = '';
        newMetadata.language = '';
        newMetadata.pageCount = '';
      } else if (value === 'vinyl') {
        newMetadata.artist = '';
        newMetadata.label = '';
        newMetadata.format = '';
        newMetadata.releaseDate = '';
        newMetadata.genre = '';
      } else if (value === 'film') {
        newMetadata.director = '';
        newMetadata.studio = '';
        newMetadata.format = '';
        newMetadata.runtime = '';
        newMetadata.genre = '';
        newMetadata.language = '';
      }
      
      setFormData(prev => ({
        ...prev,
        type: value,
        metadata: newMetadata
      }));
    } else {
      // Champ simple
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' 
          ? checked 
          : type === 'number' 
            ? parseFloat(value) 
            : value
      }));
    }
  };
  
  // Gérer les changements de favorites
  const handleFavoriteChange = (e) => {
    setFormData(prev => ({
      ...prev,
      userSpecific: {
        ...prev.userSpecific,
        favorite: e.target.checked
      }
    }));
  };
  
  // Gérer l'ajout d'un tag
  const handleAddTag = () => {
    if (newTag.trim() && !formData.userSpecific.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        userSpecific: {
          ...prev.userSpecific,
          tags: [...prev.userSpecific.tags, newTag.trim()]
        }
      }));
      setNewTag('');
    }
  };
  
  // Gérer la suppression d'un tag
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      userSpecific: {
        ...prev.userSpecific,
        tags: prev.userSpecific.tags.filter(tag => tag !== tagToRemove)
      }
    }));
  };
  
  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setFormError('Le titre est obligatoire');
      return;
    }
    
    if (!formData.userSpecific.collectionId) {
      setFormError('Veuillez sélectionner une collection');
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');
    
    try {
      if (isNewItem) {
        // Ajouter un nouvel item
        await addItem(formData.userSpecific.collectionId, formData);
        navigate(`/collections/${formData.userSpecific.collectionId}`);
      } else {
        // Mettre à jour un item existant
        await updateItem(id, formData);
        navigate(`/items/${id}`);
      }
    } catch (err) {
      setFormError(err.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return <LoadingIndicator message="Chargement..." />;
  }
  
  if (collections.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-content">
          <h3>Vous n'avez pas encore de collection</h3>
          <p>Créez d'abord une collection pour pouvoir y ajouter des items.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/collections/new')}
          >
            Créer ma première collection
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="item-form-container">
      <div className="form-header">
        <h2>{isNewItem ? 'Ajouter un nouvel item' : 'Modifier l\'item'}</h2>
      </div>
      
      {(formError || error) && (
        <div className="error-message">
          {formError || error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="item-form">
        <div className="form-section">
          <h3>Informations générales</h3>
          
          <div className="form-group">
            <label htmlFor="type">Type d'item *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={isSubmitting || !isNewItem}
            >
              <option value="book">Livre</option>
              <option value="vinyl">Vinyle</option>
              <option value="film">Film</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="title">Titre *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Titre de l'item"
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
              placeholder="Description de l'item"
              rows="3"
              disabled={isSubmitting}
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="year">Année</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="1800"
              max={new Date().getFullYear()}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="collection">Collection *</label>
            <select
              id="collection"
              name="userSpecific.collectionId"
              value={formData.userSpecific.collectionId}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            >
              <option value="">Sélectionnez une collection</option>
              {collections.map(collection => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Métadonnées spécifiques au type */}
        <div className="form-section">
          <h3>Détails {formData.type === 'book' ? 'du livre' : formData.type === 'vinyl' ? 'du vinyle' : 'du film'}</h3>
          
          {formData.type === 'book' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="author">Auteur</label>
                  <input
                    type="text"
                    id="author"
                    name="metadata.author"
                    value={formData.metadata.author || ''}
                    onChange={handleChange}
                    placeholder="Auteur"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="publisher">Éditeur</label>
                  <input
                    type="text"
                    id="publisher"
                    name="metadata.publisher"
                    value={formData.metadata.publisher || ''}
                    onChange={handleChange}
                    placeholder="Éditeur"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="isbn">ISBN</label>
                  <input
                    type="text"
                    id="isbn"
                    name="metadata.isbn"
                    value={formData.metadata.isbn || ''}
                    onChange={handleChange}
                    placeholder="ISBN"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="format">Format</label>
                  <input
                    type="text"
                    id="format"
                    name="metadata.format"
                    value={formData.metadata.format || ''}
                    onChange={handleChange}
                    placeholder="Format (poche, broché, etc.)"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="genre">Genre</label>
                  <input
                    type="text"
                    id="genre"
                    name="metadata.genre"
                    value={formData.metadata.genre || ''}
                    onChange={handleChange}
                    placeholder="Genre littéraire"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="language">Langue</label>
                  <input
                    type="text"
                    id="language"
                    name="metadata.language"
                    value={formData.metadata.language || ''}
                    onChange={handleChange}
                    placeholder="Langue"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="pageCount">Nombre de pages</label>
                <input
                  type="number"
                  id="pageCount"
                  name="metadata.pageCount"
                  value={formData.metadata.pageCount || ''}
                  onChange={handleChange}
                  placeholder="Nombre de pages"
                  min="1"
                  disabled={isSubmitting}
                />
              </div>
            </>
          )}
          
          {formData.type === 'vinyl' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="artist">Artiste</label>
                  <input
                    type="text"
                    id="artist"
                    name="metadata.artist"
                    value={formData.metadata.artist || ''}
                    onChange={handleChange}
                    placeholder="Artiste"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="label">Label</label>
                  <input
                    type="text"
                    id="label"
                    name="metadata.label"
                    value={formData.metadata.label || ''}
                    onChange={handleChange}
                    placeholder="Label"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="vinylFormat">Format</label>
                  <select
                    id="vinylFormat"
                    name="metadata.format"
                    value={formData.metadata.format || ''}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  >
                    <option value="">Sélectionnez un format</option>
                    <option value="LP">LP (33 tours)</option>
                    <option value="EP">EP</option>
                    <option value="Single">Single (45 tours)</option>
                    <option value="78 tours">78 tours</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="genre">Genre</label>
                  <input
                    type="text"
                    id="genre"
                    name="metadata.genre"
                    value={formData.metadata.genre || ''}
                    onChange={handleChange}
                    placeholder="Genre musical"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="releaseDate">Date de sortie</label>
                <input
                  type="text"
                  id="releaseDate"
                  name="metadata.releaseDate"
                  value={formData.metadata.releaseDate || ''}
                  onChange={handleChange}
                  placeholder="Date de sortie (AAAA-MM-JJ)"
                  disabled={isSubmitting}
                />
              </div>
            </>
          )}
          
          {formData.type === 'film' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="director">Réalisateur</label>
                  <input
                    type="text"
                    id="director"
                    name="metadata.director"
                    value={formData.metadata.director || ''}
                    onChange={handleChange}
                    placeholder="Réalisateur"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="studio">Studio</label>
                  <input
                    type="text"
                    id="studio"
                    name="metadata.studio"
                    value={formData.metadata.studio || ''}
                    onChange={handleChange}
                    placeholder="Studio"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="filmFormat">Format</label>
                  <select
                    id="filmFormat"
                    name="metadata.format"
                    value={formData.metadata.format || ''}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  >
                    <option value="">Sélectionnez un format</option>
                    <option value="DVD">DVD</option>
                    <option value="Blu-ray">Blu-ray</option>
                    <option value="4K UHD">4K UHD</option>
                    <option value="VHS">VHS</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="genre">Genre</label>
                  <input
                    type="text"
                    id="genre"
                    name="metadata.genre"
                    value={formData.metadata.genre || ''}
                    onChange={handleChange}
                    placeholder="Genre cinématographique"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="runtime">Durée (minutes)</label>
                  <input
                    type="number"
                    id="runtime"
                    name="metadata.runtime"
                    value={formData.metadata.runtime || ''}
                    onChange={handleChange}
                    placeholder="Durée en minutes"
                    min="1"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="language">Langue</label>
                  <input
                    type="text"
                    id="language"
                    name="metadata.language"
                    value={formData.metadata.language || ''}
                    onChange={handleChange}
                    placeholder="Langues disponibles"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="form-section">
          <h3>Marché</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="estimatedValue">Valeur estimée (€)</label>
              <input
                type="number"
                id="estimatedValue"
                name="market.estimatedValue"
                value={formData.market.estimatedValue || 0}
                onChange={handleChange}
                placeholder="Valeur estimée"
                min="0"
                step="0.01"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="condition">État</label>
              <select
                id="condition"
                name="market.condition"
                value={formData.market.condition || 'Bon état'}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="Neuf">Neuf</option>
                <option value="Quasi neuf">Quasi neuf</option>
                <option value="Très bon état">Très bon état</option>
                <option value="Bon état">Bon état</option>
                <option value="État correct">État correct</option>
                <option value="État médiocre">État médiocre</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Notes personnelles</h3>
          
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="userSpecific.notes"
              value={formData.userSpecific.notes || ''}
              onChange={handleChange}
              placeholder="Notes personnelles"
              rows="3"
              disabled={isSubmitting}
            ></textarea>
          </div>
          
          <div className="form-group">
            <label>Tags</label>
            <div className="tags-input">
              <div className="tags-list">
                {formData.userSpecific.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => handleRemoveTag(tag)}
                      disabled={isSubmitting}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              
              <div className="tags-add">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Ajouter un tag"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="btn btn-text"
                  onClick={handleAddTag}
                  disabled={isSubmitting || !newTag.trim()}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="favorite"
              checked={formData.userSpecific.favorite || false}
              onChange={handleFavoriteChange}
              disabled={isSubmitting}
            />
            <label htmlFor="favorite" className="checkbox-label">
              Marquer comme favori
            </label>
          </div>
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-text"
            onClick={() => navigate(isNewItem 
              ? '/collections' 
              : `/items/${id}`)}
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
              ? (isNewItem ? 'Ajout en cours...' : 'Enregistrement...') 
              : (isNewItem ? 'Ajouter' : 'Enregistrer')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemForm;