import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext.jsx';
import { CollectionProvider } from './context/CollectionContext';

// Composants communs
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Sidebar from './components/common/Sidebar';

// Composants d'authentification
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/auth/Profile';

// Composants de collections
import CollectionList from './components/collections/CollectionList';
import CollectionDetail from './components/collections/CollectionDetail';
import CollectionForm from './components/collections/CollectionForm';

// Composants d'items
import ItemDetail from './components/items/ItemDetail';
import ItemForm from './components/items/ItemForm';

// Composants de scan
import BarcodeScanner from './components/scanning/BarcodeScanner';
import ImageScanner from './components/scanning/ImageScanner';

// Styles
import './styles/global.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AuthProvider>
      <CollectionProvider>
        <Router>
          <div className="app-container">
            <Header toggleSidebar={toggleSidebar} />
            <div className="main-content">
              <Sidebar isOpen={sidebarOpen} />
              <div className="content-area">
                <Routes>
                  {/* Routes publiques */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Routes protégées */}
                  <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                  <Route path="/collections" element={<PrivateRoute><CollectionList /></PrivateRoute>} />
                  <Route path="/collections/new" element={<PrivateRoute><CollectionForm /></PrivateRoute>} />
                  <Route path="/collections/:id" element={<PrivateRoute><CollectionDetail /></PrivateRoute>} />
                  <Route path="/collections/:id/edit" element={<PrivateRoute><CollectionForm /></PrivateRoute>} />
                  <Route path="/items/:id" element={<PrivateRoute><ItemDetail /></PrivateRoute>} />
                  <Route path="/items/new" element={<PrivateRoute><ItemForm /></PrivateRoute>} />
                  <Route path="/items/:id/edit" element={<PrivateRoute><ItemForm /></PrivateRoute>} />
                  <Route path="/scan/barcode" element={<PrivateRoute><BarcodeScanner /></PrivateRoute>} />
                  <Route path="/scan/image" element={<PrivateRoute><ImageScanner /></PrivateRoute>} />
                  
                  {/* Route par défaut */}
                  <Route path="/" element={<Navigate replace to="/collections" />} />
                </Routes>
              </div>
            </div>
            <Footer />
          </div>
        </Router>
      </CollectionProvider>
    </AuthProvider>
  );
}

// Composant PrivateRoute pour protéger les routes
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Hook personnalisé pour utiliser le contexte d'authentification
const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default App;