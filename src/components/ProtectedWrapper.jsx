// components/ProtectedWrapper.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { checkInitialAuth } from "../utils/auth"; 

function ProtectedWrapper({ children }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Fonction pour obtenir le rôle de l'utilisateur depuis le localStorage
  const getUserRole = () => {
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

  useEffect(() => {
    (async () => {
      const ok = await checkInitialAuth(location.pathname);
      if (!ok) {
        const publicRoutes = [
          "/login", "/signup", "/verification", "/forgot-password", 
          "/reset-password", "/registration-success", "/", 
          "/password-success", "/rules", "/rulesdropshipper",
          "/admin/login", "/SignupDropshipper", "/RegistrationSucess",
          "/RefuseDropshipperPage", "/registration-couturiere-refused",
          "/NotActiveDropshipper", "/NotActiveCouturiere"
        ];
        
        if (!publicRoutes.includes(location.pathname)) {
          // Déterminer la page de login en fonction du rôle
          const userRole = getUserRole();
          const loginPath = userRole === 'admin' ? '/admin/login' : '/login';
          
          console.log(`Redirection vers: ${loginPath} (rôle détecté: ${userRole})`);
          navigate(loginPath);
        }
      }
      setLoading(false);
    })();
  }, [location.pathname, navigate]);

  if (loading) {
    return <div>Chargement...</div>; // Ou ton composant de loading
  }

  return children;
}

export default ProtectedWrapper;