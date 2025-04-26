import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CollectionContext } from '../../context/CollectionContext';
import LoadingIndicator from '../common/LoadingIndicator';

const ImageScanner = () => {
  const [imagePreview, setImagePreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [scannedItem, setScannedItem] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  
  const { collections, loading, error, scanImage, addItem } = useContext(CollectionContext);
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  
  // Extraire l'ID de collection des paramètres d'URL (si disponible)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const collectionId = params.get('collectionId');
    
    if (collectionId && collections.some(c => c.id === collectionId)) {
      setSelectedCollection(collectionId);
    } else if (collections.length > 0) {
      setSelectedCollection(collections[0].id);
    }
  }, [location, collections]);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setSelectedFile(file);
    
    // Créer un aperçu de l'image
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleScan = async () => {
    if (!selectedFile) {
      setScanError('Veuillez sélectionner une image');
      return;
    }
    
    setScanning(true);
    setScanError('');
    
    try {
      // Pour le MVP, on simule un scan d'image
      // Dans une version réelle, on enverrait l'image à un service de reconnaissance
      const imageData = selectedFile.name; // Juste pour simuler des données à envoyer
      const itemData = await scanImage(imageData);
      setScannedItem(itemData);
    } catch (err) {
      setScanError(err.message || 'Erreur lors de la reconnaissance d\'image');
      setScannedItem(null);
    } finally {
      setScanning(false);
    }
  };
  
  const handleAddItem = async () => {
    if (!scannedItem || !selectedCollection) return;
    
    try {
      // Ajouter les données utilisateur spécifiques
      const itemToAdd = {
        ...scannedItem,
        userSpecific: {
          ...scannedItem.userSpecific,
          notes: '',
          tags: [],
          favorite: false
        }
      };
      
      await addItem(selectedCollection, itemToAdd);
      navigate(`/collections/${selectedCollection}`);
    } catch (err) {
      setScanError(`Erreur lors de l'ajout de l'item: ${err.message}`);
    }
  };
  
  const handleReset = () => {
    setSelectedFile(null);
    setImagePreview('');
    setScannedItem(null);
    setScanError('');
    
    // Réinitialiser l'input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  if (loading) {
    return <LoadingIndicator message="Préparation du scanner..." />;
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
    <div className="scanner-container">
      <div className="scanner-header">
        <h2>Reconnaissance d'image</h2>
        <p>Prenez une photo de la couverture de votre livre, vinyle ou film</p>
      </div>
      
      {scanError && (
        <div className="scanner-error">
          <p>{scanError}</p>
        </div>
      )}
      
      {!scannedItem ? (
        <>
          <div className="image-upload-container">
            {imagePreview ? (
              <div className="image-preview-container">
                <img src={imagePreview} alt="Aperçu" className="image-preview" />
                <button
                  className="btn btn-text btn-icon remove-image"
                  onClick={handleReset}
                  title="Supprimer l'image"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="image-upload-placeholder" onClick={() => fileInputRef.current.click()}>
                <div className="placeholder-content">
                  <span className="upload-icon">📷</span>
                  <p>Cliquez pour sélectionner une image</p>
                </div>
              </div>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden-file-input"
            />
          </div>
          
          <div className="scanner-actions">
            <button
              className="btn btn-primary"
              onClick={handleScan}
              disabled={!selectedFile || scanning}
            >
              {scanning ? 'Analyse en cours...' : 'Analyser l\'image'}
            </button>
            
            <div className="scanner-secondary-actions">
              <button
                className="btn btn-text"
                onClick={() => navigate('/scan/barcode')}
              >
                Passer au scan de code-barres
              </button>
              <button
                className="btn btn-text"
                onClick={() => navigate('/collections')}
              >
                Retour aux collections
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="scanned-result">
          <div className="result-header">
            <h3>Élément trouvé !</h3>
          </div>
          
          <div className="result-content">
            <div className="result-image">
              {scannedItem.images && scannedItem.images[0] ? (
                <img src={scannedItem.images[0]} alt={scannedItem.title} />
              ) : (
                <div className="placeholder-image">
                  <span className="icon-image">📚</span>
                </div>
              )}
            </div>
            
            <div className="result-details">
              <h4>{scannedItem.title}</h4>
              <p className="item-type">{scannedItem.type}</p>
              
              {scannedItem.type === 'book' && (
                <div className="metadata">
                  <p><strong>Auteur:</strong> {scannedItem.metadata?.author}</p>
                  <p><strong>Éditeur:</strong> {scannedItem.metadata?.publisher}</p>
                  <p><strong>ISBN:</strong> {scannedItem.metadata?.isbn}</p>
                  <p><strong>Année:</strong> {scannedItem.year}</p>
                </div>
              )}
              
              {scannedItem.type === 'vinyl' && (
                <div className="metadata">
                  <p><strong>Artiste:</strong> {scannedItem.metadata?.artist}</p>
                  <p><strong>Label:</strong> {scannedItem.metadata?.label}</p>
                  <p><strong>Année:</strong> {scannedItem.year}</p>
                </div>
              )}
              
              {scannedItem.type === 'film' && (
                <div className="metadata">
                  <p><strong>Réalisateur:</strong> {scannedItem.metadata?.director}</p>
                  <p><strong>Studio:</strong> {scannedItem.metadata?.studio}</p>
                  <p><strong>Année:</strong> {scannedItem.year}</p>
                </div>
              )}
              
              <div className="add-options">
                <label htmlFor="collection-select">Ajouter à la collection:</label>
                <select
                  id="collection-select"
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                >
                  {collections.map(collection => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="result-actions">
            <button
              className="btn btn-text"
              onClick={handleReset}
            >
              Annuler
            </button>
            <button
              className="btn btn-primary"
              onClick={handleAddItem}
              disabled={!selectedCollection}
            >
              Ajouter à ma collection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageScanner;