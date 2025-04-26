// src/services/authService.js
// Service simulé pour la gestion de l'authentification
// À remplacer par une vraie API dans les prochaines phases

import mockData from '../data/mockData';

// Simuler un délai réseau
const simulateDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Vérifier si un email existe déjà
const isEmailTaken = (email) => {
  return mockData.users.some(user => user.email === email);
};

// Vérifier si un nom d'utilisateur existe déjà
const isUsernameTaken = (username) => {
  return mockData.users.some(user => user.username === username);
};

// Générer un ID unique pour un nouvel utilisateur
const generateUserId = () => {
  const lastId = mockData.users.length > 0 
    ? parseInt(mockData.users[mockData.users.length - 1].id.substring(1))
    : 0;
  
  return `u${lastId + 1}`;
};

// Simuler l'enregistrement d'un nouvel utilisateur
export const register = async (userData) => {
  await simulateDelay();
  
  // Validation des données
  if (!userData.email || !userData.password || !userData.username || !userData.firstName || !userData.lastName) {
    throw new Error('Tous les champs sont obligatoires');
  }
  
  if (userData.password.length < 8) {
    throw new Error('Le mot de passe doit contenir au moins 8 caractères');
  }
  
  if (isEmailTaken(userData.email)) {
    throw new Error('Cet email est déjà utilisé');
  }
  
  if (isUsernameTaken(userData.username)) {
    throw new Error('Ce nom d\'utilisateur est déjà pris');
  }
  
  // Créer un nouvel utilisateur
  const newUser = {
    id: generateUserId(),
    username: userData.username,
    email: userData.email,
    password: userData.password, // Dans une vraie implémentation, ce serait un hash
    firstName: userData.firstName,
    lastName: userData.lastName,
    profilePicture: userData.profilePicture || '/images/profiles/default.jpg',
    bio: userData.bio || '',
    dateJoined: new Date().toISOString(),
    preferences: {
      privacySettings: {
        showCollection: true,
        showActivity: true,
        allowMessages: true
      },
      collectionDisplay: {
        defaultView: 'shelf',
        sortBy: 'dateAdded'
      }
    }
  };
  
  // Ajouter l'utilisateur à nos données mockées
  mockData.users.push(newUser);
  
  // Retourner une version sans le mot de passe
  const { password, ...safeUser } = newUser;
  return safeUser;
};

// Simuler la connexion d'un utilisateur
export const login = async (email, password) => {
  await simulateDelay();
  
  // Rechercher l'utilisateur
  const user = mockData.users.find(u => u.email === email);
  
  if (!user || user.password !== password) {
    throw new Error('Email ou mot de passe incorrect');
  }
  
  // Retourner une version sans le mot de passe
  const { password: _, ...safeUser } = user;
  return safeUser;
};

// Simuler la mise à jour d'un profil utilisateur
export const updateProfile = async (userId, profileData) => {
  await simulateDelay();
  
  // Trouver l'utilisateur
  const userIndex = mockData.users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('Utilisateur non trouvé');
  }
  
  // Mettre à jour les données
  const updatedUser = {
    ...mockData.users[userIndex],
    ...profileData
  };
  
  // Si le mot de passe est fourni, le mettre à jour
  if (profileData.password) {
    updatedUser.password = profileData.password;
  }
  
  // Mettre à jour les données mockées
  mockData.users[userIndex] = updatedUser;
  
  // Retourner une version sans le mot de passe
  const { password, ...safeUser } = updatedUser;
  return safeUser;
};

export default {
  register,
  login,
  updateProfile
};