// DecisionToMakeForPath.jsx
import { useNavigate } from 'react-router-dom';

// Liste 1: Redirections pour utilisateurs non authentifiés
const list1 = {
  'تسوق الان': '/registerclient',
  'تصميم خاص': '/registerclient', 
  'اكتشف المزيد': '/registerclient',
  'انضم الان': '/signup',
  'تصفح المتجر': '/SignupDropshipper',
  'الدخول للمنصة': '/signup',
  'التسجيل في الدروبشيبينغ': '/SignupDropshipper'
};

// Liste 2: Redirections pour utilisateurs authentifiés selon le rôle
const list2 = {
  'client': {
    'تسوق الان': '/shopping',
    'تصميم خاص': '/special',
    'اكتشف المزيد': '/shopping'
  },
  'dropshipper': {
    'تسوق الان': '/shoppingDropshipper',
    'تصفح المتجر': '/shoppingDropshipper',
    'التسجيل في الدروبشيبينغ': '/shoppingDropshipper'
  },
  'couturiere': {
    'انضم الان': '/MesModels',
    'الدخول للمنصة': '/MesModels'
  },
  
};

// Vérifier si le token est valide (non expiré)
const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    return false;
  }
};

export const useNavigationDecision = () => {
  const navigate = useNavigate();

  const handleNavigation = (buttonName) => {
    // Récupérer les données du localStorage
    const accessToken = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    
    let user = null;
    try {
      user = userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Erreur lors du parsing des données utilisateur:', error);
    }

    const tokenValid = isTokenValid(accessToken);
    const userRole = user?.role;

    // Vérifier si l'utilisateur est authentifié et a un token valide
    if (tokenValid && userRole) {
      // Utiliser la liste 2: utilisateur authentifié
      const rolePaths = list2[userRole];
      
      if (rolePaths && rolePaths[buttonName]) {
        // Redirection selon le rôle et le bouton
        navigate(rolePaths[buttonName]);
        return true;
      } else {
        // Si le bouton n'existe pas pour ce rôle, utiliser la liste 1
        console.warn(`Bouton "${buttonName}" non configuré pour le rôle ${userRole}`);
      }
    }

    // Utiliser la liste 1: utilisateur non authentifié ou rôle non correspondant
    const path = list1[buttonName];
    if (path) {
      // Rediriger vers /login avec le path en paramètre
      navigate('/login', { 
        state: { 
          redirectPath: path,
          buttonName: buttonName 
        } 
      });
      return false;
    } else {
      console.error(`Bouton "${buttonName}" non trouvé dans la configuration`);
      return false;
    }
  };

  return handleNavigation;
};

export default useNavigationDecision;