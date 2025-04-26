import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CollectionContext } from '../../context/CollectionContext';
import LoadingIndicator from '../common/LoadingIndicator';

// Pour le MVP, nous allons simuler la numérisation par code-barres
// Dans une version réelle, nous utiliserions une bibliothèque comme quagga.js

const BarcodeScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');
  const [scannedItem, setScannedItem] = useState(null);
  const [scanError, setScanError] = useState('');
  
  const { collections, loading, error, scanBarcode, addItem } = useContext(CollectionContext);
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef(null);
  
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
  
  const startScanning = () => {
    setScanning(true);
    setScanError('');
    
    // Dans une vraie application, nous initialiserions ici la caméra
    // Pour le MVP, nous simulons l'expérience
    
    // Simuler une prévisualisation de caméra avec un délai pour l'UX
    setTimeout(() => {
      // Simuler une numérisation automatique après 3 secondes
      if (Math.random() > 0.3) { // 70% de chance de succès
        handleScan('978-2-07-036053-6'); // Un ISBN fictif (ou celui de Fondation dans nos données)
      } else {
        setScanError('La numérisation a échoué. Veuillez réessayer ou saisir le code manuellement.');
        setScanning(false);
      }
    }, 3000);
  };
  
  const stopScanning = () => {
    setScanning(false);
    
    // Dans une vraie application, nous arrêterions ici la caméra
  };
  
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      handleScan(manualInput.trim());
    }
  };
  
  const handleScan = async (barcodeData) => {
    setScanning(false);
    
    try {
      const itemData = await scanBarcode(barcodeData);
      setScannedItem(itemData);
      setScanError('');
    } catch (err) {
      setScanError(`Aucun résultat trouvé pour ce code-barres: ${barcodeData}, error : ${err}`);
      setScannedItem(null);
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
        <h2>Scanner un code-barres</h2>
        <p>Positionnez le code-barres de votre objet face à la caméra</p>
      </div>
      
      {scanError && (
        <div className="scanner-error">
          <p>{scanError}</p>
        </div>
      )}
      
      {!scannedItem ? (
        <>
          <div className="scanner-preview">
            {scanning ? (
              <div className="camera-container">
                <video ref={videoRef} className="camera-feed" autoPlay playsInline muted />
                <div className="scanner-overlay">
                  <div className="scanner-target"></div>
                </div>
                <button
                  className="btn btn-secondary scanner-cancel"
                  onClick={stopScanning}
                >
                  Annuler
                </button>
              </div>
            ) : (
              <div className="scanner-placeholder">
                <div className="placeholder-content">
                  <p>Prêt à scanner votre objet</p>
                  <button
                    className="btn btn-primary"
                    onClick={startScanning}
                  >
                    Démarrer la caméra
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="manual-input">
            <h3>Ou saisissez le code manuellement</h3>
            <form onSubmit={handleManualSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Ex: 9782070360536"
                  disabled={scanning}
                />
                <button
                  type="submit"
                  className="btn btn-secondary"
                  disabled={scanning || !manualInput.trim()}
                >
                  Rechercher
                </button>
              </div>
            </form>
          </div>
          
          <div className="scanner-actions">
            <button
              className="btn btn-text"
              onClick={() => navigate('/scan/image')}
            >
              Passer à la reconnaissance d'image
            </button>
            <button
              className="btn btn-text"
              onClick={() => navigate('/collections')}
            >
              Retour aux collections
            </button>
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
              onClick={() => {
                setScannedItem(null);
                setScanError('');
              }}
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

export default BarcodeScanner;