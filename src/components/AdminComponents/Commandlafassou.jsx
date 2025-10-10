import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FasouCard from "./FassouCard";
import '../../style/AdminStyle/FassouCard.css'
import Addfassou from "./Addfassou"; // Importez le composant Addfassou
import Vide from "../../components/generalComponents/Vide"
import useErreur401Handler from '../generalComponents/Erreur401Handle';

export default function Commandlafassou() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // État pour contrôler l'affichage du popup
  const navigate = useNavigate();
  const { handle401Error } = useErreur401Handler();

  // Fonction pour récupérer les commandes
  const fetchOrderData = async () => {
    try {
      // Récupérer le token depuis le stockage local
      const accessToken = localStorage.getItem("accessToken");
      
      

      const response = await fetch("https://api.kadi-inv.store/adminapi/getInfoCommandeFassou", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

       if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return fetchOrderData();
        }
      }
      else

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.orders) {
        setOrders(data.orders);
      } else {
        setError("Format de données inattendu de l'API");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour gérer le clic sur le bouton
  const handleAddModelClick = () => {
    setShowPopup(true); // Afficher le popup
  };

  // Fonction pour fermer le popup
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Fonction appelée après l'ajout réussi d'une commande fassou
  const handleAddSuccess = (result) => {
    console.log("Commande Fassou créée avec succès:", result);
    
    // Rafraîchir les données pour afficher la nouvelle commande
    fetchOrderData();
    
    // Fermer le popup
    setShowPopup(false);
  };

  useEffect(() => {
    fetchOrderData();
  }, [navigate]);

  const updateOrderStatus = async (codeorder, newStatus) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      
      if (!accessToken) {
        navigate("/admin/login");
        return false;
      }

      // Déterminer l'URL de l'API en fonction du nouveau statut
      let apiUrl = "";
      if (newStatus === "cancelled") {
        apiUrl = `https://api.kadi-inv.store/adminapi/makefassouCommandrefused/${codeorder}/`;
      } else if (newStatus === "done") {
        apiUrl = `https://api.kadi-inv.store/adminapi/makefassouCommandCompleted/${codeorder}/`;
      } else {
        console.error("Statut non supporté:", newStatus);
        return false;
      }

      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        navigate("/admin/login");
        return false;
      }

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Mettre à jour l'état local avec le nouveau statut
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.codeorder === codeorder 
              ? { ...order, state: newStatus } 
              : order
          )
        );
        return true;
      } else {
        console.error("Erreur API:", data.message);
        return false;
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut:", err.message);
      return false;
    }
  };

  const handleStatusChange = async (codeorder, newStatus) => {
    const success = await updateOrderStatus(codeorder, newStatus);
    if (success) {
      console.log(`Statut de la commande ${codeorder} changé en ${newStatus}`);
    } else {
      console.error(`Échec du changement de statut pour la commande ${codeorder}`);
      // Vous pourriez ajouter une notification d'erreur ici
    }
  };

  if (loading) {
    return <div>Chargement des données...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button 
          onClick={handleAddModelClick}
          style={{
            padding: "10px 20px",
            backgroundColor: "rgb(34, 197, 94)",
            color: "white",
            border: "none",
            borderRadius: "16px",
            cursor: "pointer",
            marginRight: "20px",
            marginLeft: "50px", 
            marginTop: "30px",
            fontSize: "16px"
          }}
        >
          إضافة طلبية لافاسو
        </button>
      </div>

      {(!orders || orders.length === 0) ? (
           <Vide 
        texte="لا توجد أي طلبية لافاصو حاليا"
        tailleIcône={100}
        couleurIcône="#6b7280"
        className="vide-couturieres"
      />
      ) : (
        <div className="containerfassoucommands">
          {orders.map((order) => (
            <FasouCard
              key={order.codeorder}
              nameorder={order.nameorder}
              codeorder={order.codeorder}
              deadline={order.deadline}
              variants={order.variants}
              model_type={order.model_type}
              state={order.state}
              initial_price={order.initial_price}
              images={order.images}
              couturiere_info={order.couturiere_info}
              onStatusChange={(newStatus) => handleStatusChange(order.codeorder, newStatus)}
            />
          ))}
        </div>
      )}

      {/* Ajout du popup */}
      <Addfassou
        isOpen={showPopup}
        onClose={handleClosePopup}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}
