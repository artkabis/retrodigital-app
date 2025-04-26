import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, error } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation simple
    if (!email || !password) {
      setFormError('Veuillez remplir tous les champs');
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');
    
    try {
      await login(email, password);
      navigate('/collections');
    } catch (error) {
      setFormError(error.message || 'Erreur de connexion');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="login-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Connexion à RetroDigital</h2>
          <p>Accédez à votre collection numérisée</p>
        </div>
        
        {(formError || error) && (
          <div className="error-message">
            {formError || error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </div>
        </form>
        
        <div className="auth-footer">
          <p>
            Pas encore de compte ? <Link to="/register">S'inscrire</Link>
          </p>
          {/* Pour le MVP, pas de "mot de passe oublié" */}
        </div>
        
        {/* Pour faciliter les tests du MVP */}
        <div className="demo-accounts">
          <p>Comptes de démonstration :</p>
          <button
            className="btn btn-text"
            onClick={() => {
              setEmail('martin@example.com');
              setPassword('hashed_password_here');
            }}
          >
            Remplir avec compte demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;