// components/ProtectedRoute.js
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredUserType = null }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);

  // Fonction pour décoder le JWT
  const decodeToken = (token) => {
    try {
      if (!token) return null;
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(payload);
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  };

  // Vérifier si un token est expiré
  const isTokenExpired = (token) => {
    if (!token) return true;
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  };

  // Obtenir le type d'utilisateur depuis le localStorage
  const getUserTypeFromStorage = () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return null;
      
      const parsedData = JSON.parse(userData);
      return parsedData.role || parsedData.userType || parsedData.user_type;
    } catch (error) {
      console.error('Erreur lors de la lecture du userData:', error);
      return null;
    }
  };

  // Vérifier si l'utilisateur est authentifié
  const checkAuthStatus = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshTokenValue = localStorage.getItem('refreshToken');
    
    // Cas 1: Aucun token trouvé
    if (!accessToken && !refreshTokenValue) {
      console.log('Aucun token disponible');
      return { authenticated: false, userType: null };
    }
    
    let validAccessToken = accessToken;
    let currentUserType = getUserTypeFromStorage();
    
    // Vérifier si le token d'accès est expiré
    const isAccessTokenExpired = accessToken ? isTokenExpired(accessToken) : true;
    const isRefreshTokenExpired = refreshTokenValue ? isTokenExpired(refreshTokenValue) : true;
    
    // Cas 2: Les deux tokens sont expirés
    if (isAccessTokenExpired && isRefreshTokenExpired) {
      console.log('Les deux tokens sont expirés - déconnexion nécessaire');
      // Nettoyer le localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      return { authenticated: false, userType: null };
    }
    
    // Cas 3: Token d'accès expiré mais refresh token valide
    if (isAccessTokenExpired && !isRefreshTokenExpired) {
      console.log('Token d\'accès expiré, tentative de rafraîchissement');
      try {
        const response = await fetch('https://api.kadi-inv.store/api/token/refresh/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: refreshTokenValue }),
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.access) {
            validAccessToken = data.access;
            localStorage.setItem('accessToken', data.access);
            console.log('Token rafraîchi avec succès');
          } else {
            throw new Error('Format de réponse invalide');
          }
        } else {
          throw new Error(`Échec du rafraîchissement: ${response.status}`);
        }
      } catch (error) {
        console.error('Impossible de rafraîchir le token:', error);
        // Nettoyer en cas d'erreur
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return { authenticated: false, userType: null };
      }
    }
    
    // Cas 4: Token d'accès valide
    if (validAccessToken && !isTokenExpired(validAccessToken)) {
      console.log('Authentification réussie - userType:', currentUserType);
      return { 
        authenticated: true, 
        userType: currentUserType 
      };
    }
    
    // Cas 5: Aucun cas valide
    return { authenticated: false, userType: null };
  };

  useEffect(() => {
    const validateAuth = async () => {
      try {
        const authStatus = await checkAuthStatus();
        
        setIsAuthenticated(authStatus.authenticated);
        setUserType(authStatus.userType);
        
        // Vérification du type d'utilisateur si requis
        if (requiredUserType && authStatus.userType !== requiredUserType) {
          console.warn(`Accès refusé: ${authStatus.userType} tentant d'accéder à une page ${requiredUserType}`);
          // Nettoyer les données si mauvais type d'utilisateur
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

        }
        
      } catch (error) {
        console.error('Erreur lors de la validation de l\'authentification:', error);
        // En cas d'erreur, considérer comme non authentifié
        setIsAuthenticated(false);
        setUserType(null);
      } finally {
        setIsValidating(false);
      }
    };

    validateAuth();
  }, [requiredUserType]);

  // Pendant la validation, afficher un indicateur de chargement
  if (isValidating) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', 
                     borderTop: '4px solid #3498db', borderRadius: '50%', 
                     animation: 'spin 1s linear infinite' }}></div>
        <div>Vérification de l'authentification...</div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // Redirection vers la page de login appropriée si non authentifié
  if (!isAuthenticated) {
    // Déterminer le chemin de login en fonction du requiredUserType
    let loginPath = '/login';
    
    if (requiredUserType === 'admin') {
      loginPath = '/admin/login';
    } else if (requiredUserType === 'client') {
      loginPath = '/login';
    } else if (requiredUserType === 'couturiere') {
      loginPath = '/login';
    } else if (requiredUserType === 'dropshipper') {
      loginPath = '/login';
    }
    
    console.log(`Redirection vers: ${loginPath} (userType: ${userType}, required: ${requiredUserType})`);
    
    return <Navigate to={loginPath} replace />;
  }

  // Vérification supplémentaire du type d'utilisateur (au cas où)
  if (requiredUserType && userType !== requiredUserType) {
    console.warn(`Accès final refusé: ${userType} != ${requiredUserType}`);
    
    // Nettoyer et rediriger
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    
    let loginPath = '/login';
    if (requiredUserType === 'admin') {
      loginPath = '/admin/login';
    }

    localStorage.removeItem('user');
    
    return <Navigate to={loginPath} replace />;
  }

  // Si authentifié, afficher le contenu protégé
  return children;
};

export default ProtectedRoute;
