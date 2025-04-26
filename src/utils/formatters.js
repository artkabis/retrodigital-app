// src/utils/formatters.js
// Utilitaires pour le formatage des dates, prix, etc.

/**
 * Formater une date en format localisé
 * @param {string|Date} dateValue - Date à formater (ISO string ou objet Date)
 * @param {Object} options - Options de formatage
 * @returns {string} - Date formatée
 */
export const formatDate = (dateValue, options = {}) => {
  if (!dateValue) return '';
  
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  return new Intl.DateTimeFormat('fr-FR', mergedOptions).format(date);
};

/**
 * Formater un prix en format monétaire
 * @param {number} value - Valeur à formater
 * @param {string} currency - Code de devise (par défaut EUR)
 * @returns {string} - Prix formaté
 */
export const formatPrice = (value, currency = 'EUR') => {
  if (value === undefined || value === null) return '';
  
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency
  }).format(value);
};

/**
 * Tronquer un texte à une longueur maximale
 * @param {string} text - Texte à tronquer
 * @param {number} maxLength - Longueur maximale
 * @param {string} suffix - Suffixe à ajouter si tronqué (par défaut "...")
 * @returns {string} - Texte tronqué
 */
export const truncateText = (text, maxLength, suffix = '...') => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + suffix;
};

/**
 * Formater le type d'item en français
 * @param {string} type - Type d'item (book, vinyl, film, etc.)
 * @returns {string} - Type formaté
 */
export const formatItemType = (type) => {
  if (!type) return '';
  
  const typeMap = {
    'book': 'Livre',
    'vinyl': 'Vinyle',
    'film': 'Film',
    'game': 'Jeu vidéo',
    'comic': 'Bande dessinée',
    'cd': 'CD',
    'magazine': 'Magazine',
    'boardgame': 'Jeu de société',
    'toy': 'Jouet',
    'memorabilia': 'Objet de collection'
  };
  
  return typeMap[type.toLowerCase()] || type;
};

/**
 * Formater l'état d'un item en français
 * @param {string} condition - État de l'item (mint, near mint, etc.)
 * @returns {string} - État formaté
 */
export const formatCondition = (condition) => {
  if (!condition) return '';
  
  const conditionMap = {
    'mint': 'Neuf',
    'near mint': 'Quasi neuf',
    'very good': 'Très bon état',
    'good': 'Bon état',
    'fair': 'État correct',
    'poor': 'État médiocre'
  };
  
  return conditionMap[condition.toLowerCase()] || condition;
};

/**
 * Formater une liste de tags en chaîne de caractères
 * @param {Array} tags - Liste de tags
 * @param {string} separator - Séparateur (par défaut ", ")
 * @returns {string} - Tags formatés
 */
export const formatTags = (tags, separator = ', ') => {
  if (!tags || !Array.isArray(tags) || tags.length === 0) return '';
  
  return tags.join(separator);
};

/**
 * Calculer le temps écoulé depuis une date (par exemple "il y a 3 jours")
 * @param {string|Date} dateValue - Date à calculer
 * @returns {string} - Temps écoulé formaté
 */
export const timeAgo = (dateValue) => {
  if (!dateValue) return '';
  
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  const now = new Date();
  
  const seconds = Math.floor((now - date) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  
  if (years > 0) {
    return years === 1 ? 'il y a 1 an' : `il y a ${years} ans`;
  } else if (months > 0) {
    return months === 1 ? 'il y a 1 mois' : `il y a ${months} mois`;
  } else if (days > 0) {
    return days === 1 ? 'hier' : `il y a ${days} jours`;
  } else if (hours > 0) {
    return hours === 1 ? 'il y a 1 heure' : `il y a ${hours} heures`;
  } else if (minutes > 0) {
    return minutes === 1 ? 'il y a 1 minute' : `il y a ${minutes} minutes`;
  } else {
    return seconds <= 10 ? 'à l\'instant' : `il y a ${seconds} secondes`;
  }
};

/**
 * Formater un nombre avec séparateurs de milliers
 * @param {number} value - Nombre à formater
 * @returns {string} - Nombre formaté
 */
export const formatNumber = (value) => {
  if (value === undefined || value === null) return '';
  
  return new Intl.NumberFormat('fr-FR').format(value);
};

export default {
  formatDate,
  formatPrice,
  truncateText,
  formatItemType,
  formatCondition,
  formatTags,
  timeAgo,
  formatNumber
};