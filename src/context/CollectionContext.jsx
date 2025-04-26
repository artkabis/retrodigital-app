import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import mockData from '../data/mockData';

export const CollectionContext = createContext();

export const CollectionProvider = ({ children }) => {
  const [collections, setCollections] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { currentUser } = useContext(AuthContext);
  
  // Charger les collections et items de l'utilisateur connecté
  useEffect(() => {
    if (currentUser) {
      fetchUserCollections();
    } else {
      setCollections([]);
      setItems([]);
    }
  }, [currentUser]);
  
  // Simuler la récupération des collections de l'utilisateur depuis l'API
  const fetchUserCollections = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Récupérer les collections de l'utilisateur depuis les données mockées
      const userCollections = mockData.collections.filter(
        collection => collection.ownerId === currentUser.id
      );
      
      // Récupérer tous les items des collections de l'utilisateur
      const itemIds = userCollections.reduce((ids, collection) => {
        return [...ids, ...collection.items];
      }, []);
      
      const userItems = mockData.items.filter(item => itemIds.includes(item.id));
      
      setCollections(userCollections);
      setItems(userItems);
    } catch (err) {
      setError('Erreur lors de la récupération des collections: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Récupérer une collection par son ID
  const getCollectionById = (collectionId) => {
    return collections.find(collection => collection.id === collectionId);
  };
  
  // Récupérer les items d'une collection
  const getItemsByCollectionId = (collectionId) => {
    const collection = getCollectionById(collectionId);
    if (!collection) return [];
    
    return items.filter(item => collection.items.includes(item.id));
  };
  
  // Récupérer un item par son ID
  const getItemById = (itemId) => {
    return items.find(item => item.id === itemId);
  };
  
  // Créer une nouvelle collection
  const createCollection = async (collectionData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Générer un ID pour la nouvelle collection
      const newCollectionId = `c${mockData.collections.length + 1}`;
      
      // Créer une nouvelle collection
      const newCollection = {
        id: newCollectionId,
        ownerId: currentUser.id,
        name: collectionData.name,
        description: collectionData.description || "",
        coverImage: collectionData.coverImage || "/images/collections/default.jpg",
        isPublic: collectionData.isPublic || false,
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        items: []
      };
      
      // Ajouter la collection à nos données mockées
      mockData.collections.push(newCollection);
      
      // Mettre à jour le state
      setCollections([...collections, newCollection]);
      
      return newCollection;
    } catch (err) {
      setError('Erreur lors de la création de la collection: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Mettre à jour une collection existante
  const updateCollection = async (collectionId, collectionData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Trouver la collection dans nos données mockées
      const collectionIndex = mockData.collections.findIndex(c => c.id === collectionId);
      if (collectionIndex === -1) {
        throw new Error('Collection non trouvée');
      }
      
      // Vérifier que l'utilisateur est bien le propriétaire
      if (mockData.collections[collectionIndex].ownerId !== currentUser.id) {
        throw new Error('Vous n\'êtes pas autorisé à modifier cette collection');
      }
      
      // Mettre à jour la collection
      const updatedCollection = {
        ...mockData.collections[collectionIndex],
        ...collectionData,
        lastModified: new Date().toISOString()
      };
      
      // Mettre à jour nos données mockées
      mockData.collections[collectionIndex] = updatedCollection;
      
      // Mettre à jour le state
      const updatedCollections = collections.map(collection => 
        collection.id === collectionId ? updatedCollection : collection
      );
      setCollections(updatedCollections);
      
      return updatedCollection;
    } catch (err) {
      setError('Erreur lors de la mise à jour de la collection: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Supprimer une collection
  const deleteCollection = async (collectionId) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Trouver la collection dans nos données mockées
      const collectionIndex = mockData.collections.findIndex(c => c.id === collectionId);
      if (collectionIndex === -1) {
        throw new Error('Collection non trouvée');
      }
      
      // Vérifier que l'utilisateur est bien le propriétaire
      if (mockData.collections[collectionIndex].ownerId !== currentUser.id) {
        throw new Error('Vous n\'êtes pas autorisé à supprimer cette collection');
      }
      
      // Supprimer la collection de nos données mockées
      mockData.collections.splice(collectionIndex, 1);
      
      // Mettre à jour le state
      setCollections(collections.filter(collection => collection.id !== collectionId));
      
      return true;
    } catch (err) {
      setError('Erreur lors de la suppression de la collection: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Ajouter un nouvel item à une collection
  const addItem = async (collectionId, itemData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Vérifier que la collection existe et appartient à l'utilisateur
      const collection = mockData.collections.find(c => c.id === collectionId);
      if (!collection) {
        throw new Error('Collection non trouvée');
      }
      
      if (collection.ownerId !== currentUser.id) {
        throw new Error('Vous n\'êtes pas autorisé à ajouter des items à cette collection');
      }
      
      // Générer un ID pour le nouvel item
      const newItemId = `i${mockData.items.length + 1}`;
      
      // Créer un nouvel item
      const newItem = {
        id: newItemId,
        type: itemData.type,
        title: itemData.title,
        description: itemData.description || "",
        year: itemData.year || null,
        images: itemData.images || ["/images/items/default.jpg"],
        metadata: itemData.metadata || {},
        market: {
          estimatedValue: itemData.market?.estimatedValue || 0,
          lastUpdated: new Date().toISOString(),
          condition: itemData.market?.condition || "Bon état"
        },
        userSpecific: {
          ownerId: currentUser.id,
          collectionId: collectionId,
          dateAdded: new Date().toISOString(),
          notes: itemData.userSpecific?.notes || "",
          tags: itemData.userSpecific?.tags || [],
          favorite: itemData.userSpecific?.favorite || false
        }
      };
      
      // Ajouter l'item à nos données mockées
      mockData.items.push(newItem);
      
      // Ajouter l'ID de l'item à la collection
      const collectionIndex = mockData.collections.findIndex(c => c.id === collectionId);
      mockData.collections[collectionIndex].items.push(newItemId);
      mockData.collections[collectionIndex].lastModified = new Date().toISOString();
      
      // Mettre à jour le state
      setItems([...items, newItem]);
      
      const updatedCollections = collections.map(c => {
        if (c.id === collectionId) {
          return {
            ...c,
            items: [...c.items, newItemId],
            lastModified: new Date().toISOString()
          };
        }
        return c;
      });
      
      setCollections(updatedCollections);
      
      return newItem;
    } catch (err) {
      setError('Erreur lors de l\'ajout de l\'item: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Mettre à jour un item existant
  const updateItem = async (itemId, itemData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Trouver l'item dans nos données mockées
      const itemIndex = mockData.items.findIndex(i => i.id === itemId);
      if (itemIndex === -1) {
        throw new Error('Item non trouvé');
      }
      
      // Vérifier que l'utilisateur est bien le propriétaire
      if (mockData.items[itemIndex].userSpecific.ownerId !== currentUser.id) {
        throw new Error('Vous n\'êtes pas autorisé à modifier cet item');
      }
      
      // Mettre à jour l'item
      const updatedItem = {
        ...mockData.items[itemIndex],
        ...itemData,
        metadata: {
          ...mockData.items[itemIndex].metadata,
          ...itemData.metadata
        },
        market: {
          ...mockData.items[itemIndex].market,
          ...itemData.market,
          lastUpdated: new Date().toISOString()
        },
        userSpecific: {
          ...mockData.items[itemIndex].userSpecific,
          ...itemData.userSpecific
        }
      };
      
      // Mettre à jour nos données mockées
      mockData.items[itemIndex] = updatedItem;
      
      // Mettre à jour le state
      const updatedItems = items.map(item => 
        item.id === itemId ? updatedItem : item
      );
      setItems(updatedItems);
      
      return updatedItem;
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'item: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Supprimer un item
  const deleteItem = async (itemId) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Trouver l'item dans nos données mockées
      const itemIndex = mockData.items.findIndex(i => i.id === itemId);
      if (itemIndex === -1) {
        throw new Error('Item non trouvé');
      }
      
      // Vérifier que l'utilisateur est bien le propriétaire
      if (mockData.items[itemIndex].userSpecific.ownerId !== currentUser.id) {
        throw new Error('Vous n\'êtes pas autorisé à supprimer cet item');
      }
      
      const collectionId = mockData.items[itemIndex].userSpecific.collectionId;
      
      // Supprimer l'item de la collection
      const collectionIndex = mockData.collections.findIndex(c => c.id === collectionId);
      if (collectionIndex !== -1) {
        mockData.collections[collectionIndex].items = mockData.collections[collectionIndex].items.filter(
          id => id !== itemId
        );
        mockData.collections[collectionIndex].lastModified = new Date().toISOString();
      }
      
      // Supprimer l'item de nos données mockées
      mockData.items.splice(itemIndex, 1);
      
      // Mettre à jour le state
      setItems(items.filter(item => item.id !== itemId));
      
      const updatedCollections = collections.map(c => {
        if (c.id === collectionId) {
          return {
            ...c,
            items: c.items.filter(id => id !== itemId),
            lastModified: new Date().toISOString()
          };
        }
        return c;
      });
      
      setCollections(updatedCollections);
      
      return true;
    } catch (err) {
      setError('Erreur lors de la suppression de l\'item: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Simuler la numérisation d'un code-barres
  const scanBarcode = async (barcodeData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Simuler une recherche dans une base de données externe
      // Pour le MVP, on va simplement chercher un item avec un ISBN similaire dans nos données mockées
      const matchingItem = mockData.items.find(item => 
        item.metadata.isbn && item.metadata.isbn.includes(barcodeData)
      );
      
      if (!matchingItem) {
        throw new Error('Aucun item correspondant trouvé pour ce code-barres');
      }
      
      // Créer un nouvel objet pour simuler une API externe
      const scannedItem = {
        type: matchingItem.type,
        title: matchingItem.title,
        description: matchingItem.description,
        year: matchingItem.year,
        metadata: { ...matchingItem.metadata },
        market: {
          estimatedValue: matchingItem.market.estimatedValue,
          condition: "À définir"
        },
        userSpecific: {
          notes: "",
          tags: [],
          favorite: false
        }
      };
      
      return scannedItem;
    } catch (err) {
      setError('Erreur lors de la numérisation: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Simuler la reconnaissance d'image
  const scanImage = async (imageData) => {
    console.log({imageData});
    setLoading(true);
    setError(null);
    
    try {
      // Simuler un délai de réseau plus long pour la reconnaissance d'image
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Dans un vrai système, on enverrait l'image à un service de reconnaissance
      // Pour le MVP, on va simuler une détection aléatoire parmi nos items
      const randomIndex = Math.floor(Math.random() * mockData.items.length);
      const matchingItem = mockData.items[randomIndex];
      
      // Créer un nouvel objet pour simuler une API externe
      const scannedItem = {
        type: matchingItem.type,
        title: matchingItem.title,
        description: matchingItem.description,
        year: matchingItem.year,
        metadata: { ...matchingItem.metadata },
        market: {
          estimatedValue: matchingItem.market.estimatedValue,
          condition: "À définir"
        },
        userSpecific: {
          notes: "",
          tags: [],
          favorite: false
        }
      };
      
      return scannedItem;
    } catch (err) {
      setError('Erreur lors de la reconnaissance d\'image: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <CollectionContext.Provider
      value={{
        collections,
        items,
        loading,
        error,
        getCollectionById,
        getItemsByCollectionId,
        getItemById,
        createCollection,
        updateCollection,
        deleteCollection,
        addItem,
        updateItem,
        deleteItem,
        scanBarcode,
        scanImage,
        fetchUserCollections
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};