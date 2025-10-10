// Erreur401Handle.jsx
import { useNavigate } from 'react-router-dom';

const useErreur401Handler = () => {
  const navigate = useNavigate();
  
  const handle401Error = async (redirectPath = "/login") => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    // Cas 1: Ni accessToken ni refreshToken → redirection
    if (!accessToken && !refreshToken) {
      cleanupTokens();
      navigate(redirectPath);
      return false;
    }
    
    // Cas 2: AccessToken existe et n'est pas expiré, mais erreur 401 → problème d'authentification
    if (accessToken && !checkTokenExpiration(accessToken)) {
      console.error('Token valide mais erreur 401 - problème d\'authentification');
      cleanupTokens();
      navigate(redirectPath);
      return false;
    }
    
    // Cas 3: AccessToken expiré ou absent, mais refreshToken existe → tentative de refresh
    if (refreshToken) {
      try {
        // Faire la requête de refresh
        const response = await fetch('https://api.kadi-inv.store/api/token/refresh/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh: refreshToken
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Sauvegarder le nouveau token
          localStorage.setItem('accessToken', data.access);
          // Optionnel: si un nouveau refresh token est retourné
          if (data.refresh) {
            localStorage.setItem('refreshToken', data.refresh);
          }
          return true; // Refresh réussi
        } else {
          // Refresh échoué (refreshToken invalide ou expiré)
          console.error('Refresh token invalide ou expiré');
          cleanupTokens();
          navigate(redirectPath);
          return false;
        }
      } catch (error) {
        console.error('Erreur lors du refresh token:', error);
        cleanupTokens();
        navigate(redirectPath);
        return false;
      }
    }
    
    // Cas 4: AccessToken expiré ou absent, et pas de refreshToken → redirection
    cleanupTokens();
    navigate(redirectPath);
    return false;
  };

  // Fonction pour vérifier l'expiration du token
  const checkTokenExpiration = (token) => {
    try {
      // Si vous utilisez JWT, vous pouvez décoder le token pour vérifier l'expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convertir en millisecondes
      return Date.now() >= expirationTime;
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      return true; // Considérer comme expiré en cas d'erreur
    }
  };

  // Fonction pour nettoyer les tokens
  const cleanupTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  return { handle401Error };
};

export default useErreur401Handler;
