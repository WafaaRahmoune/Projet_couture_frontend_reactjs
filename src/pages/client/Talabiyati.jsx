import { useState, useEffect } from "react";
import CommandCard from "../../components/generalComponents/Commandcard";
import { TbBoxOff } from "react-icons/tb";
import photo from '../../assets/icons/photo.png';
import imageaffichage from '../../assets/icons/two.png';
import date from '../../assets/icons/date.png';
import price from '../../assets/icons/price.png';
import telephone from '../../assets/icons/whatsapp.png';
import refuse from '../../assets/icons/refuse.png';
import Navbarshop from "../../components/shoppingComp/Navbarshop";
import useErreur401Handler from '../../components/generalComponents/Erreur401Handle'

function Talabiyati() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { handle401Error } = useErreur401Handler();


  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        // Vérification préalable des tokens - si pas de refresh token, on ne fait même pas la requête
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // Redirection immédiate vers le login
          window.location.href = '/login';
          return;
        }
        


            const token = localStorage.getItem("accessToken");
  
  
const response = await fetch(`http://127.0.0.1:8000/clientapi/allorders/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    
    const data = await response.json();

        const transformedData = transformApiData(data);
        setCommandes(transformedData);
      } catch (err) {
        console.error("Erreur détaillée:", err);
        
      
         if (err.response?.status === 401) {
        const refreshSuccess = await handle401Error();
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return fetchCommandes ();
        }
      }
        // Pour les autres erreurs, on les affiche
        if (err.response?.status === 403) {
          setError('Vous n\'avez pas les permissions nécessaires.');
        } else {
          setError(`Erreur: ${err.message || 'Une erreur est survenue'}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();
  }, []);

 const transformApiData = (apiData) => {
  const transformedCommandes = [];
  const API_BASE_URL = "http://127.0.0.1:8000";

  // Traiter les commandes standard
  if (apiData.standard_orders && apiData.standard_orders.length > 0) {
    apiData.standard_orders.forEach(order => {
      // Séparer les images des PDFs
      const images = [];
      const pdfFiles = [];
      
      if (order.images && order.images.length > 0) {
        order.images.forEach(img => {
          const imageUrl = `${API_BASE_URL}${img.image}`;
          if (imageUrl.toLowerCase().endsWith('.pdf')) {
            pdfFiles.push({
              name: imageUrl.split('/').pop(),
              url: imageUrl
            });
          } else {
            images.push(imageUrl);
          }
        });
      }
      
      // Préparer les variantes pour l'affichage tabulaire
      const variants = order.variants || [];
      
      // CALCULER LE PRIX TOTAL: final_price * total_quantity
      const totalPrice = order.final_price * order.total_quantity +order.pricewilaya;
      
      transformedCommandes.push({
        id: `standard_${order.id}`,
        namecommand: order.model_name || "طلبية قياسية",
        photobutton: ["عرض الصور", photo],
        date: [order.created_at.split('T')[0], date],
        telephone: [order.phone_number, telephone],
        prix: [`${totalPrice || 0}دج`, price], // Utiliser totalPrice au lieu de final_price
        total_quantity: order.total_quantity, // Ajouter la quantité totale si nécessaire
        status: getStatus(order.state),
        selectedImages: images.length > 0 ? images : [imageaffichage],
        pdfFiles: pdfFiles,
        variants: variants,
        isCustom: false
      });
    });
  }

  // Traiter les commandes personnalisées
  if (apiData.custom_orders && apiData.custom_orders.length > 0) {
    apiData.custom_orders.forEach(order => {
      // Séparer les images des PDFs
      const images = [];
      const pdfFiles = [];
      
      if (order.images && order.images.length > 0) {
        order.images.forEach(img => {
          const imageUrl = `${API_BASE_URL}${img.image}`;
          if (imageUrl.toLowerCase().endsWith('.pdf')) {
            pdfFiles.push({
              name: imageUrl.split('/').pop(),
              url: imageUrl
            });
          } else {
            images.push(imageUrl);
          }
        });
      }
      
      // Préparer les variantes pour l'affichage tabulaire
      const variants = order.variants || [];
      
      // Pour les commandes personnalisées, vérifier si initial_price existe
      let customPrice = null;
      if (order.initial_price !== null) {
        // Si total_quantity existe pour les commandes personnalisées, multiplier
        const totalQuantity = order.total_quantity || 1;
        customPrice = `${order.initial_price * totalQuantity +order.pricewilaya}دج`;
      }
      
      transformedCommandes.push({
        id: `custom_${order.id}`,
        namecommand: order.nameorder || "طلبية مخصصة",
        photobutton: ["عرض الصور", photo],
        date: [order.created_at.split('T')[0], date],
        telephone: [order.numTelephone, telephone],
        prix: customPrice === null ? null : [customPrice, price],
        total_quantity: order.total_quantity || 1, // Ajouter la quantité totale
        status: getStatus(order.state),
        selectedImages: images.length > 0 ? images : [imageaffichage],
        pdfFiles: pdfFiles,
        variants: variants,
        isCustom: true
      });
    });
  }

  return transformedCommandes;
};

  const getStatus = (state) => {
    // Normaliser le statut en minuscules pour éviter les problèmes de casse
    const normalizedState = state ? state.toLowerCase() : '';
    
    switch(normalizedState) {
      case 'done':
      case 'completed':
        return ["مكتملة", "#22C55E", ""];
      case 'cancelled':
      case 'canceled':
        return ["ملغية", "#EF4444", refuse];
      case 'pending':
      case 'waiting':
        return ["في الانتظار", "rgb(23, 162, 184) ", ""];
      case 'inprogress':
      case 'in_progress':
      case 'in progress':
        return ["قيدالتنفيذ", "#F59E0B", ""];
      default:
        return [state || "غير معروف", "#9CA3AF", ""];
    }
  };

  // Fonction pour se déconnecter
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  };

  // Fonction pour rafraîchir la page
  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <>
        <Navbarshop />
        <div className="containershop">
          <div className="shop-wrapper">
            <div className="cards-empty-container">
              <div style={{ textAlign: "center", color: "#9ca3af" }}>
                <p style={{ fontSize: "1.2rem", marginTop: "10px" }}>
                  جاري تحميل البيانات...
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbarshop />
        <div className="containershop">
          <div className="shop-wrapper">
            <div className="cards-empty-container">
              <div style={{ textAlign: "center", color: "#9ca3af" }}>
                <TbBoxOff size={80} />
                <p style={{ fontSize: "1.2rem", marginTop: "10px" }}>
                  {error}
                </p>
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button 
                    onClick={handleRetry}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#10B981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    إعادة المحاولة
                  </button>
                  <button 
                    onClick={handleLogout}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#EF4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    تسجيل الخروج
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbarshop />
      <div className="containershop" style={{marginBottom: "50px"}}>
        <div className="shop-wrapper">
          {commandes.length === 0 ? (
            <div className="cards-empty-container">
              <div style={{ textAlign: "center", color: "#9ca3af" }}>
                <TbBoxOff size={80} />
                <p style={{ fontSize: "1.2rem", marginTop: "10px" }}>
                  لا توجد أي طلبية حالياً
                </p>
              </div>
            </div>
          ) : (
            commandes.map((cmd) => (
              <CommandCard
                key={cmd.id}
                namecommand={cmd.namecommand}
                photobutton={cmd.photobutton}
                date={cmd.date}
                telephone={cmd.telephone}
                prix={cmd.prix}
                nbpieces={cmd.nbpieces}
                status={cmd.status}
                selectedImages={cmd.selectedImages}
                isCustom={cmd.isCustom}
                pdfFiles={cmd.pdfFiles}
                variants={cmd.variants}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Talabiyati;