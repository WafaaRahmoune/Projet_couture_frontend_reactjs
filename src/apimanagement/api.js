// api.js
import axios from 'axios';
import { showReconnectPopup } from './PopupManager';

const api = axios.create({
  baseURL: 'https://api.kadi-inv.store',
});

// Interceptor pour ajouter le token SEULEMENT si requis
api.interceptors.request.use(
  (config) => {
    // N'ajoute le token que si requireAuth est true (valeur par défaut: false)
    const requireAuth = config.requireAuth !== false; // Default: no auth required
    
    if (requireAuth) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // Ne pas rejeter immédiatement si pas de token, laisser l'interceptor de réponse gérer
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor pour gérer les réponses (UNIQUEMENT pour les requêtes authentifiées)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Ne gère les 401 que pour les requêtes qui requirent l'authentification
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.requireAuth !== false) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // Si pas de refresh token, on redirige directement vers le login
          localStorage.removeItem('accessToken');
          window.location.href = '/loginClient';
          return Promise.reject(new Error('No refresh token, redirecting to login'));
        }

        const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
          refresh: refreshToken
        });

        const newAccessToken = response.data.access;
        localStorage.setItem('accessToken', newAccessToken);
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        
        const showPopup = originalRequest.showPopupOnAuthFailure !== false;
        
        if (showPopup) {
          showReconnectPopup(() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/loginClient';
          });
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/loginClient';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Méthodes pratiques
api.withAuth = (requireAuth = true, showPopup = true) => {
  return {
    get: (url, config = {}) => {
      return api.get(url, { ...config, requireAuth, showPopupOnAuthFailure: showPopup });
    },
    post: (url, data, config = {}) => {
      return api.post(url, data, { ...config, requireAuth, showPopupOnAuthFailure: showPopup });
    },
    put: (url, data, config = {}) => {
      return api.put(url, data, { ...config, requireAuth, showPopupOnAuthFailure: showPopup });
    },
    delete: (url, config = {}) => {
      return api.delete(url, { ...config, requireAuth, showPopupOnAuthFailure: showPopup });
    }
  };
};

export default api;
