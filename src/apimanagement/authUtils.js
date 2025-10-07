// authUtils.js
import { isAccessTokenExpired, refreshAccessToken } from './tokenUtils';

export const handleNavigationWithAuth = async (navigate, path, showPopup = true) => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  
  // Cas 1: Aucun token -> redirection vers login
  if (!refreshToken) {
    if (showPopup) {
      // Chargement dynamique pour éviter les dépendances circulaires
      import('./PopupManager').then(({ showReconnectPopup }) => {
        showReconnectPopup(() => {
          navigate("/loginClient");
        });
      });
    } else {
      navigate("/loginClient");
    }
    return;
  }
  
  // Cas 2: accessToken valide -> navigation directe
  if (!isAccessTokenExpired(accessToken)) {
    navigate(path);
    return;
  }
  
  // Cas 3: accessToken expiré -> tentative de rafraîchissement
  try {
    await refreshAccessToken();
    navigate(path);
  } catch (error) {
    if (showPopup) {
      import('./PopupManager').then(({ showReconnectPopup }) => {
        showReconnectPopup(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate("/loginClient");
        });
      });
    } else {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate("/loginClient");
    }
  }
};