import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LoadingIndicator from '../common/LoadingIndicator';

const Profile = () => {
  const { currentUser, updateProfile, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    bio: currentUser?.bio || '',
    profilePicture: currentUser?.profilePicture || '',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Vérifier si l'utilisateur est connecté
  if (!currentUser) {
    navigate('/login');
    return null;
  }
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Si on annule l'édition, on réinitialise le formulaire
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        bio: currentUser.bio || '',
        profilePicture: currentUser.profilePicture || '',
      });
    }
    setIsEditing(!isEditing);
    setFormError('');
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation simple
    if (!formData.firstName || !formData.lastName) {
      setFormError('Le prénom et le nom sont obligatoires');
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');
    
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (err) {
      setFormError(err.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return <LoadingIndicator message="Chargement du profil..." />;
  }
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Mon profil</h2>
        <button
          className={`btn ${isEditing ? 'btn-text' : 'btn-primary'}`}
          onClick={handleEditToggle}
        >
          {isEditing ? 'Annuler' : 'Modifier'}
        </button>
      </div>
      
      {(formError || error) && (
        <div className="error-message">
          {formError || error}
        </div>
      )}
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-edit-form">
          <div className="profile-image-section">
            <div 
              className="profile-image" 
              style={{ backgroundImage: `url(${formData.profilePicture || '/images/profiles/default.jpg'})` }}
            ></div>
            <div className="profile-image-actions">
              <p className="text-sm">Photo de profil</p>
              {/* Pour le MVP, on ne gère pas l'upload d'image */}
            </div>
          </div>
          
          <div className="profile-details">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Prénom</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Nom</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="bio">Biographie</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                disabled={isSubmitting}
              ></textarea>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-text"
                onClick={handleEditToggle}
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="profile-view">
          <div className="profile-image-section">
            <div 
              className="profile-image" 
              style={{ backgroundImage: `url(${currentUser.profilePicture || '/images/profiles/default.jpg'})` }}
            ></div>
            <div className="profile-username">
              <p>@{currentUser.username}</p>
            </div>
          </div>
          
          <div className="profile-details">
            <div className="profile-info-section">
              <h3>Informations personnelles</h3>
              <div className="profile-info-item">
                <span className="info-label">Nom complet</span>
                <span className="info-value">{currentUser.firstName} {currentUser.lastName}</span>
              </div>
              <div className="profile-info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{currentUser.email}</span>
              </div>
              <div className="profile-info-item">
                <span className="info-label">Membre depuis</span>
                <span className="info-value">
                  {new Date(currentUser.dateJoined).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
            
            <div className="profile-info-section">
              <h3>Biographie</h3>
              <p className="profile-bio">
                {currentUser.bio || 'Aucune biographie renseignée.'}
              </p>
            </div>
            
            <div className="profile-info-section">
              <h3>Préférences</h3>
              <div className="profile-info-item">
                <span className="info-label">Vue par défaut</span>
                <span className="info-value">
                  {currentUser.preferences?.collectionDisplay?.defaultView === 'shelf' ? 'Étagère' : 'Liste'}
                </span>
              </div>
              <div className="profile-info-item">
                <span className="info-label">Trier par</span>
                <span className="info-value">
                  {(() => {
                    const sortBy = currentUser.preferences?.collectionDisplay?.sortBy;
                    switch (sortBy) {
                      case 'title': return 'Titre';
                      case 'author': return 'Auteur/Artiste';
                      case 'year': return 'Année';
                      case 'dateAdded': return 'Date d\'ajout';
                      default: return 'Titre';
                    }
                  })()}
                </span>
              </div>
              <div className="profile-info-item">
                <span className="info-label">Visibilité des collections</span>
                <span className="info-value">
                  {currentUser.preferences?.privacySettings?.showCollection ? 'Publique' : 'Privée'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;