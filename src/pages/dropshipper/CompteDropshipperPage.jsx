import ChangeNameComp from '../../components/generalComponents/ChangePassword';
import ChangeName from '../../components/compteComp/ChangeName';
import Navbarshop from '../../components/shoppingComp/Navbarshop';
import { useNavigate } from 'react-router-dom';

export default function CompteDropshipperPage(){
  const navigate = useNavigate();
  
  const handleLogout = () => {
     navigate("/login")
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