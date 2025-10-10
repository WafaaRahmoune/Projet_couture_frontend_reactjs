import React, { useState, useEffect } from "react";
import ContainerPagesAdmin from "../../components/AdminComponents/ContainerPagesAdmin";
import DropshipperCard from '../../components/AdminComponents/DropshipperCard';
import Popup from "../../components/generalComponents/Popup";
import donepopup from "../../assets/areyousure.png";
import "../../style/AdminStyle/Dashboard.css";
import Vide from "../../components/generalComponents/Vide"
import useErreur401Handler from '../../components/generalComponents/Erreur401Handle'

function DropshipperPage() {
  const [dropshippers, setDropshippers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [dropshipperToRemove, setDropshipperToRemove] = useState(null);
  const [actionType, setActionType] = useState(""); // "delete", "activate", "deactivate"
  const [dropshipperForAction, setDropshipperForAction] = useState(null);
  const { handle401Error } = useErreur401Handler();

  // Obtenir le nom du mois actuel en arabe
  const getCurrentMonthInArabic = () => {
    const months = [
      "جانفي", "فيفري", "مارس", "أفريل", "ماي", "جوان",
      "جويلية", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];
    const currentDate = new Date();
    return months[currentDate.getMonth()];
  };

  // Fonction pour récupérer les dropshippers depuis l'API
  const fetchDropshippers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken"); // Changé de adminToken à accessToken
      
     
      
      const response = await fetch("https://api.kadi-inv.store/adminapi/getAllDropshippers", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return fetchDropshippers ();
        }
      }
      else
      
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des dropshippers");
      }
      
      const data = await response.json();
      
      const formattedDropshippers = data.dropshippers.map(dropshipper => ({
        id: dropshipper.id,
        nameuser: dropshipper.full_name,
        datedemande: new Date(dropshipper.created_at).toLocaleDateString('fr-FR'),
        phone: dropshipper.phone_number,
        storelink: dropshipper.store_link,
        isaccepted: dropshipper.is_accepted,
        isactive: dropshipper.is_active,
        mybenifits: parseFloat(dropshipper.ourbenificefromthisdropshipper) || 0,
        email: dropshipper.email
      }));
      
      setDropshippers(formattedDropshippers);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropshippers();
  }, []);

  // Fonction pour accepter un dropshipper
  const handleAcceptDropshipper = async (email) => {
    try {
      const token = localStorage.getItem("accessToken"); // Changé de adminToken à accessToken
      
      if (!token) {
        window.location.href = "/admin/login";
        return;
      }
      
      const response = await fetch(`https://api.kadi-inv.store/adminapi/acceptdropshipper/${email}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (response.status === 401) {
        localStorage.removeItem("accessToken"); // Changé de adminToken à accessToken
        window.location.href = "/admin/login";
        return;
      }
      
      if (!response.ok) {
        throw new Error("Erreur lors de l'acceptation du dropshipper");
      }
      
      await fetchDropshippers();
    } catch (err) {
      setError(err.message);
    }
  };

  // Fonction pour refuser un dropshipper
 // Fonction pour refuser un dropshipper (avec logs de débogage)
const handleRefuseDropshipper = async (email) => {
  try {
    console.log("Tentative de refus du dropshipper avec email:", email);
    
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      console.error("Aucun token d'authentification trouvé");
      window.location.href = "/admin/login";
      return;
    }
    
    console.log("Envoi de la requête à l'API...");
    const response = await fetch(`https://api.kadi-inv.store/adminapi/refusedropshipper/${email}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    
    console.log("Réponse reçue, statut:", response.status);
    
    if (response.status === 401) {
      console.error("Token expiré ou invalide, redirection vers la page de login");
      localStorage.removeItem("accessToken");
      window.location.href = "/admin/login";
      return;
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur détaillée du serveur:", errorText);
      throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
    }
    
    console.log("Dropshipper refusé avec succès");
    await fetchDropshippers();
    setShowPopup(false);
    setDropshipperToRemove(null);
  } catch (err) {
    console.error("Erreur complète lors du refus du dropshipper:", err);
    setError(err.message);
  }
};

  // Fonction pour activer un compte dropshipper
  const handleActivateDropshipper = async (email) => {
    try {
      const token = localStorage.getItem("accessToken"); // Changé de adminToken à accessToken
      
      if (!token) {
        window.location.href = "/admin/login";
        return;
      }
      
      const response = await fetch(`https://api.kadi-inv.store/adminapi/activatecomptedropshipper/${email}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return handleActivateDropshipper ();
        }
      }
      else
      
      if (!response.ok) {
        throw new Error("Erreur lors de l'activation du compte");
      }
      
      await fetchDropshippers();
    } catch (err) {
      setError(err.message);
    }
  };

  // Fonction pour désactiver un compte dropshipper
  const handleDeactivateDropshipper = async (email) => {
    try {
      const token = localStorage.getItem("accessToken"); // Changé de adminToken à accessToken
      
      
      const response = await fetch(`https://api.kadi-inv.store/adminapi/desactivatecomptedropshipper/${email}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return handleDeactivateDropshipper ();
        }
      }
      
      if (!response.ok) {
        throw new Error("Erreur lors de la désactivation du compte");
      }
      
      await fetchDropshippers();
    } catch (err) {
      setError(err.message);
    }
  };

  // Fonction pour mettre à jour le statut d'un dropshipper
  const handleStatusChange = (id, newAcceptedStatus, newActiveStatus) => {
    const dropshipper = dropshippers.find(d => d.id === id);
    
    if (!dropshipper) return;
    
    if (newAcceptedStatus && !dropshipper.isaccepted) {
      // Si on passe de non accepté à accepté
      handleAcceptDropshipper(dropshipper.email);
    } else if (newActiveStatus !== undefined) {
      // Pour les changements d'état actif/inactif
      // Vérifier si le statut change réellement
      if (newActiveStatus !== dropshipper.isactive) {
        if (newActiveStatus) {
          handleActivateDropshipper(dropshipper.email);
        } else {
          handleDeactivateDropshipper(dropshipper.email);
        }
      } else {
        // Le statut ne change pas, on ne fait rien
        console.log("Le statut est déjà le même, aucune action nécessaire");
      }
    }
  };

  // Fonction pour préparer la suppression (afficher le popup)
  const prepareRemoveDropshipper = (id) => {
    const dropshipper = dropshippers.find(d => d.id === id);
    if (!dropshipper) return;
    
    setDropshipperToRemove(id);
    setDropshipperForAction(dropshipper);
    setActionType("delete");
    setShowPopup(true);
  };

  // Fonction pour préparer l'activation/désactivation
  const prepareToggleStatus = (id, newStatus) => {
    const dropshipper = dropshippers.find(d => d.id === id);
    if (!dropshipper) return;
    
    // Vérifier si le statut change réellement
    if (newStatus === dropshipper.isactive) {
      console.log("Le statut est déjà le même, aucune action nécessaire");
      return;
    }
    
    setDropshipperForAction(dropshipper);
    setActionType(newStatus ? "activate" : "deactivate");
    setShowPopup(true);
  };

  // Fonction pour exécuter l'action confirmée
  const executeAction = () => {
    if (!dropshipperForAction) return;
    
    switch (actionType) {
      case "delete":
        handleRefuseDropshipper(dropshipperForAction.email);
        break;
      case "activate":
        handleActivateDropshipper(dropshipperForAction.email);
        break;
      case "deactivate":
        handleDeactivateDropshipper(dropshipperForAction.email);
        break;
      default:
        break;
    }
    
    setShowPopup(false);
    setDropshipperForAction(null);
    setActionType("");
  };

  // Obtenir le message du popup en fonction de l'action
  const getPopupMessage = () => {
    if (!dropshipperForAction) return { title: "", subtitle: "" };
    
    switch (actionType) {
      case "delete":
        return {
          title: "هل أنت متأكد من رفض هذا الدروبشيبر؟",
          subtitle: "رفضك للمترشح هو قرار نهائي و ليس فيه رجوع"
        };
      case "activate":
        return {
          title: "هل أنت متأكد من تفعيل حساب هذا الدروبشيبر؟",
          subtitle: "بعد التفعيل سيتمكن الدروبشيبر من الوصول إلى حسابه وممارسة نشاطه"
        };
      case "deactivate":
        return {
          title: "هل أنت متأكد من إيقاف حساب هذا الدروبشيبر؟",
          subtitle: "بعد الإيقاف لن يتمكن الدروبشيبر من الوصول إلى حسابه أو ممارسة نشاطه"
        };
      default:
        return { title: "", subtitle: "" };
    }
  };

  if (loading) {
    return (
      <ContainerPagesAdmin
        titre="ادارة الدروبشيبينغ"
        soustitre="عرض قائمة البائعين لمنتجاتنا و ادارة النماذج المتاحة للدروبشيبينغ"
      >
        <div className="loading">جاري التحميل...</div>
      </ContainerPagesAdmin>
    );
  }

  if (error) {
    return (
      <ContainerPagesAdmin
        titre="ادارة الدروبشيبينغ"
        soustitre="عرض قائمة البائعين لمنتجاتنا و ادارة النماذج المتاحة للدروبشيبينغ"
      >
        <div className="error">خطأ: {error}</div>
      </ContainerPagesAdmin>
    );
  }

  const popupMessage = getPopupMessage();
  const currentMonth = getCurrentMonthInArabic();

  return (
    <ContainerPagesAdmin
      titre="ادارة الدروبشيبينغ"
      soustitre="عرض قائمة البائعين لمنتجاتنا و ادارة النماذج المتاحة للدروبشيبينغ"
    >
      <div className="dropshippers-container">
        {dropshippers.length === 0 ? (
           <div className="no-data-container">
         <Vide 
        texte="لا يوجد طلب تقديم للدروبشيبينغ"
        tailleIcône={100}
        couleurIcône="#6b7280"
        className="vide-affiliates"
      />
      </div>



        ) : (
          dropshippers.map(dropshipper => (
            <DropshipperCard
              key={dropshipper.id}
              id={dropshipper.id}
              nameuser={dropshipper.nameuser}
              datedemande={dropshipper.datedemande}
              phone={dropshipper.phone}
              storelink={dropshipper.storelink}
              isaccepted={dropshipper.isaccepted}
              isactive={dropshipper.isactive}
              mybenifits={dropshipper.mybenifits}
              email={dropshipper.email}
              currentMonth={currentMonth} // Passer le mois actuel
              onStatusChange={(newAcceptedStatus, newActiveStatus) => 
                handleStatusChange(dropshipper.id, newAcceptedStatus, newActiveStatus)
              }
              onReject={() => prepareRemoveDropshipper(dropshipper.id)}
              onToggleStatus={(newStatus) => prepareToggleStatus(dropshipper.id, newStatus)}
            />
          ))
        )}
      </div>

      {showPopup && (
        <Popup
          title={popupMessage.title}
          iconPopup={donepopup}
          sousTitre={popupMessage.subtitle}
          buttons={[
            {
              text: "أتراجع",
              onClick: () => setShowPopup(false),
              backgroundColor: "#FFFFFF",
              textColor: "#444444",
              width: "fit-content",
              border: "2px solid ",
              borderColor: "Black",
              customClass: "with-border"
            },
            {
              text: actionType === "delete" ? "أؤكد الرفض" : 
                    actionType === "activate" ? "أؤكد التفعيل" : "أؤكد الإيقاف",
              onClick: executeAction,
              backgroundColor: actionType === "delete" ? "#EF4444" : 
                              actionType === "activate" ? "#22C55E" : "#F59E0B",
              textColor: "#FFFFFF",
              width: "fit-content",
              border: "2px solid",
              borderColor: "Black",
              customClass: "with-border"
            }
          ]}
          onClose={() => setShowPopup(false)}
          buttonLayout="horizontal"
          buttonGap="20px"
        />
      )}
    </ContainerPagesAdmin>
  );
}

export default DropshipperPage;
