import ChangeNameComp from '../../components/generalComponents/ChangePassword';
import ChangeName from '../../components/compteComp/ChangeName';
import Navbarshop from '../../components/shoppingComp/Navbarshop';
import { useNavigate } from 'react-router-dom';

export default function CompteclientPage(){
  const navigate = useNavigate();
  
 const handleLogout = () => {
  
  
  // Récupérer les informations de l'utilisateur depuis le localStorage
  const userData = localStorage.getItem('user');
  
  if (userData) {
    try {
      const user = JSON.parse(userData);
      
      // Vérifier le rôle de l'utilisateur
      if (user.role === 'dropshipper') {
        localStorage.setItem("login_redirect_path", JSON.stringify({
          "path": "/SignupDropshipper",
          "button": "التسجيل في الدروبشيبينغ"
        }));
      } else if (user.role === 'client') {
        localStorage.setItem("login_redirect_path", JSON.stringify({
          "path": "/registerclient",
          "button": "تسوق الان"
        }));
      }
      // Vous pouvez ajouter d'autres conditions pour d'autres rôles si nécessaire
    } catch (error) {
      console.error("Erreur lors de l'analyse des données utilisateur:", error);
    }
  }
  
  navigate("/login");
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

  return(
    <>
      <Navbarshop defaultSection="" />
      <div className="containershop">
        <div className="shop-wrapper">
          <section className="form-header">
            <h1>الملف الشخصي</h1>
          </section>
          
          <ChangeName path='/login' align="center" />
          <ChangeNameComp path='/login'/>
          
          <a href="#" onClick={handleLogout} style={{
            display: 'block',
            textAlign: 'center',
            marginTop: '20px',
            marginBottom: '20px',
            textDecoration: 'underline',
            color:"#182544"
          }}>تسجيل الخروج</a>
        </div>
      </div>
    </>
  );
}

