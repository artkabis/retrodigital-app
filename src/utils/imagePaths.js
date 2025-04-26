import defaultProfile from '../assets/images/profiles/default.jpg';
import martinProfile from '../assets/images/profiles/martin.jpg';
import sophieProfile from '../assets/images/profiles/sophie.jpg';

// Importer toutes les images de collections
import defaultCollection from '../assets/images/collections/default.jpg';
import scifiCollection from '../assets/images/collections/scifi.jpg';
import vinylesCollection from '../assets/images/collections/vinyles.jpg';
import filmsCollection from '../assets/images/collections/films.jpg';

// Importer toutes les images d'items
import defaultItem from '../assets/images/items/default.jpg';
import fondationItem from '../assets/images/items/fondation.jpg';
import duneItem from '../assets/images/items/dune.jpg';
import dsotmltem from '../assets/images/items/dsotm.jpg';
import ctteItem from '../assets/images/items/ctte.jpg';
import neuromancerItem from '../assets/images/items/neuromancer.jpg';
import casablancaItem from '../assets/images/items/casablanca.jpg';
import godfatherItem from '../assets/images/items/godfather.jpg';

// Mapper les anciens chemins aux nouveaux imports
const imageMap = {
  // Profils
  '/images/profiles/default.jpg': defaultProfile,
  '/images/profiles/martin.jpg': martinProfile,
  '/images/profiles/sophie.jpg': sophieProfile,
  
  // Collections
  '/images/collections/default.jpg': defaultCollection,
  '/images/collections/scifi.jpg': scifiCollection,
  '/images/collections/vinyles.jpg': vinylesCollection,
  '/images/collections/films.jpg': filmsCollection,
  
  // Items
  '/images/items/default.jpg': defaultItem,
  '/images/items/fondation.jpg': fondationItem,
  '/images/items/dune.jpg': duneItem,
  '/images/items/dsotm.jpg': dsotmltem,
  '/images/items/ctte.jpg': ctteItem,
  '/images/items/neuromancer.jpg': neuromancerItem,
  '/images/items/casablanca.jpg': casablancaItem,
  '/images/items/godfather.jpg': godfatherItem
};

/**
 * Convertit un chemin d'image de l'ancien format au nouveau format Vite
 * @param {string} oldPath - Ancien chemin (ex: /images/profiles/default.jpg)
 * @returns {string} - Nouveau chemin compatible avec Vite
 */
export const getImagePath = (oldPath) => {
  return imageMap[oldPath] || defaultItem; // Fallback sur l'image par défaut
};

export default {
  getImagePath,
  profiles: {
    default: defaultProfile,
    martin: martinProfile,
    sophie: sophieProfile
  },
  collections: {
    default: defaultCollection,
    scifi: scifiCollection,
    vinyles: vinylesCollection,
    films: filmsCollection
  },
  items: {
    default: defaultItem,
    fondation: fondationItem,
    dune: duneItem,
    dsotm: dsotmltem,
    ctte: ctteItem,
    neuromancer: neuromancerItem,
    casablanca: casablancaItem,
    godfather: godfatherItem
  }
};