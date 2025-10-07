// tokenUtils.js

/**
 * Vérifie si un token JWT est expiré
 * @param {string} token - Le token JWT à vérifier
 * @returns {boolean} True si le token est expiré, false sinon
 */
export const isAccessTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convertir en millisecondes
    const currentTime = Date.now();
    
    // Ajouter une marge de sécurité de 5 secondes
    return expirationTime <= currentTime + 5000;
  } catch (error) {
    console.error('Erreur lors du décodage du token:', error);
    return true; // En cas d'erreur, considérer comme expiré
  }
};

/**
 * Rafraîchit le token d'accès en utilisant le refresh token
 * @returns {Promise<string>} Le nouveau access token
 */
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken })
    });
    
    if (!response.ok) {
      throw new Error(`Refresh failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    const newAccessToken = data.access;
    
    // Mettre à jour le token dans le localStorage
    localStorage.setItem('accessToken', newAccessToken);
    
    // Si un nouveau refresh token est retourné, le mettre à jour aussi
    if (data.refresh) {
      localStorage.setItem('refreshToken', data.refresh);
    }
    
    return newAccessToken;
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error);
    throw error;
  }
};

/**
 * Décode un token JWT et retourne son payload
 * @param {string} token - Le token JWT à décoder
 * @returns {Object|null} Le payload décodé ou null en cas d'erreur
 */
export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Erreur lors du décodage du token:', error);
    return null;
  }
};

/**
 * Vérifie si l'utilisateur est authentifié
 * @returns {boolean} True si l'utilisateur a un token valide, false sinon
 */
export const isAuthenticated = () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  
  return !!(accessToken && refreshToken && !isAccessTokenExpired(accessToken));
};

/**
 * Déconnecte l'utilisateur en supprimant les tokens
 */
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

/**
 * Sauvegarde les tokens après une authentification réussie
 * @param {string} accessToken - Le token d'accès
 * @param {string} refreshToken - Le token de rafraîchissement
 */
export const saveTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

/**
 * Récupère le token d'accès s'il est valide, sinon tente de le rafraîchir
 * @returns {Promise<string>} Un token d'accès valide
 */
export const getValidAccessToken = async () => {
  let accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!accessToken || !refreshToken) {
    throw new Error('No tokens available');
  }
  
  if (isAccessTokenExpired(accessToken)) {
    accessToken = await refreshAccessToken();
  }
  
  return accessToken;
};