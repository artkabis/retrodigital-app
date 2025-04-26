import React, { createContext, useState, useEffect } from 'react';
import mockData from '../data/mockData';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simuler le chargement de l'utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Erreur lors du parsing de l\'utilisateur stocké:', err);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  // Fonction de connexion - simule une API avec nos données mockées
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Rechercher l'utilisateur dans les données mockées
      const user = mockData.users.find(u => u.email === email);
      
      if (!user || user.password !== password) { // En réalité, il faudrait comparer des hash
        throw new Error('Email ou mot de passe incorrect');
      }
      
      // Créer une version de l'utilisateur sans le mot de passe pour le stockage
      const safeUser = { ...user };
      delete safeUser.password;
      
      // Stocker l'utilisateur dans le state et le localStorage
      setCurrentUser(safeUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(safeUser));
      
      return safeUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fonction d'inscription - simule une API avec nos données mockées
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Vérifier si l'email est déjà utilisé
      const existingUser = mockData.users.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('Cet email est déjà utilisé');
      }
      
      // Générer un ID pour le nouvel utilisateur
      const newUserId = `u${mockData.users.length + 1}`;
      
      // Créer un nouvel utilisateur
      const newUser = {
        id: newUserId,
        username: userData.username,
        email: userData.email,
        password: userData.password, // En réalité, il faudrait hasher le mot de passe
        firstName: userData.firstName,
        lastName: userData.lastName,
        profilePicture: "/images/profiles/default.jpg",
        bio: "",
        dateJoined: new Date().toISOString(),
        preferences: {
          privacySettings: {
            showCollection: true,
            showActivity: true,
            allowMessages: true
          },
          collectionDisplay: {
            defaultView: "shelf",
            sortBy: "dateAdded"
          }
        }
      };
      
      // Ajouter l'utilisateur à nos données mockées
      mockData.users.push(newUser);
      
      // Créer une version de l'utilisateur sans le mot de passe pour le stockage
      const safeUser = { ...newUser };
      delete safeUser.password;
      
      // Stocker l'utilisateur dans le state et le localStorage
      setCurrentUser(safeUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(safeUser));
      
      return safeUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  // Fonction de mise à jour du profil
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!currentUser) {
        throw new Error('Utilisateur non connecté');
      }
      
      // Trouver l'utilisateur dans les données mockées
      const userIndex = mockData.users.findIndex(u => u.id === currentUser.id);
      if (userIndex === -1) {
        throw new Error('Utilisateur non trouvé');
      }
      
      // Mettre à jour les données de l'utilisateur
      const updatedUser = {
        ...mockData.users[userIndex],
        ...profileData
      };
      
      // Mettre à jour les données mockées
      mockData.users[userIndex] = updatedUser;
      
      // Créer une version de l'utilisateur sans le mot de passe pour le stockage
      const safeUser = { ...updatedUser };
      delete safeUser.password;
      
      // Mettre à jour le state et le localStorage
      setCurrentUser(safeUser);
      localStorage.setItem('currentUser', JSON.stringify(safeUser));
      
      return safeUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};