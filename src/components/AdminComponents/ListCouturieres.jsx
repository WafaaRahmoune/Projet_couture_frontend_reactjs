import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import CoutureInfo from "./CoutureInfo";
import Popup from "../../components/generalComponents/Popup";
import areyousure from "../../assets/areyousure.png";
import youwonnaaccept from "../../assets/icons/youwonnaaccept.png";
import "../../style/AdminStyle/ListCouturieres.css";
import Vide from "../../components/generalComponents/Vide";
import useErreur401Handler from '../generalComponents/Erreur401Handle';


export default function ListCouturieres({ filter = "all" }) {
  const [couturieres, setCouturieres] = useState([]);
  const [allCouturieres, setAllCouturieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [couturiereForAction, setCouturiereForAction] = useState(null);
  const [actionType, setActionType] = useState("");
  const navigate = useNavigate();
  const { handle401Error } = useErreur401Handler();
  

  useEffect(() => {
    fetchCouturieres();
  }, []);

  const fetchCouturieres = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
     

      const response = await fetch('http://127.0.0.1:8000/adminapi/listCouturieres', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

       if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return fetchCouturieres();
        }
      }
      else 

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === "success") {
        const transformedData = data.data.map(couturiere => ({
          id: couturiere.id,
          user_id: couturiere.user_id,
          full_name: couturiere.full_name,
          phonenumber: couturiere.phonenumber,
          address: couturiere.address,
          created_at: couturiere.created_at,
          isaccepted: couturiere.isaccepted,
          isactive: couturiere.isactive,
          pdfFiles: couturiere.documents ? couturiere.documents
            .filter(doc => doc.file_url.toLowerCase().endsWith('.pdf'))
            .map(doc => ({
              name: doc.file_name,
              url: doc.file_url
            })) : [],
          images: couturiere.documents ? couturiere.documents
            .filter(doc => {
              const lowerUrl = doc.file_url.toLowerCase();
              return lowerUrl.endsWith('.jpg') || 
                     lowerUrl.endsWith('.jpeg') || 
                     lowerUrl.endsWith('.png') || 
                     lowerUrl.endsWith('.gif');
            })
            .map(doc => doc.file_url) : []
        }));
        
        setAllCouturieres(transformedData);
      } else {
        throw new Error(data.message || "Erreur lors de la récupération des données");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les couturières en fonction du filtre sélectionné
  const filteredCouturieres = useMemo(() => {
    if (filter === "all") return allCouturieres;
    
    return allCouturieres.filter(couturiere => {
      switch (filter) {
        case "accepted":
          return couturiere.isaccepted;
        case "pending":
          return !couturiere.isaccepted;
        case "active":
          return couturiere.isactive;
        case "inactive":
          return !couturiere.isactive;
        default:
          return true;
      }
    });
  }, [allCouturieres, filter]);

  // Mettre à jour la liste affichée quand le filtre change
  useEffect(() => {
    setCouturieres(filteredCouturieres);
  }, [filteredCouturieres]);

  const prepareStatusChange = (id, newStatus) => {
    const couturiere = allCouturieres.find(c => c.id === id);
    if (!couturiere) return;
    
    setCouturiereForAction(couturiere);
    setActionType(newStatus ? "accept" : "reject");
    setShowPopup(true);
  };

  const handleStatusChangeConfirmed = async () => {
    try {
      if (!couturiereForAction) return;
      
      const newStatus = actionType === "accept";
      const token = localStorage.getItem('accessToken');
      
      

      // Mettre à jour l'état local immédiatement
      setAllCouturieres(prev =>
        prev.map(couturiere =>
          couturiere.id === couturiereForAction.id
            ? {
                ...couturiere,
                isaccepted: newStatus,
                isactive: newStatus === true ? true : couturiere.isactive,
              }
            : couturiere
        )
      );

      // Appel API pour mettre à jour le statut
      const response = await fetch(`http://127.0.0.1:8000/adminapi/updateCouturiereStatus/${couturiereForAction.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isaccepted: newStatus }),
      });

       if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return handleStatusChangeConfirmed();
        }
      }
      else

      if (!response.ok) {
        // Si l'API échoue, annuler la modification locale
        setAllCouturieres(prev =>
          prev.map(couturiere =>
            couturiere.id === couturiereForAction.id
              ? {
                  ...couturiere,
                  isaccepted: !newStatus,
                }
              : couturiere
          )
        );
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.message && result.message.includes("succès")) {
        fetchCouturieres();
      } else {
        setAllCouturieres(prev =>
          prev.map(couturiere =>
            couturiere.id === couturiereForAction.id
              ? {
                  ...couturiere,
                  isaccepted: !newStatus,
                }
              : couturiere
          )
        );
        throw new Error(result.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      alert("Erreur lors de la mise à jour: " + error.message);
    } finally {
      setShowPopup(false);
      setCouturiereForAction(null);
      setActionType("");
    }
  };

  const handleActiveStatusChange = async (id, newActiveStatus) => {
    try {
      const token = localStorage.getItem('accessToken');
      

      // Mettre à jour l'état local immédiatement
      setAllCouturieres(prev =>
        prev.map(couturiere =>
          couturiere.id === id ? { ...couturiere, isactive: newActiveStatus } : couturiere
        )
      );

      // Appel API pour mettre à jour le statut actif
      const response = await fetch(`http://127.0.0.1:8000/adminapi/updateCouturiereActiveStatus/${id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isactive: newActiveStatus }),
      });

       if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return handleActiveStatusChange();
        }
      }
      else 

      if (!response.ok) {
        setAllCouturieres(prev =>
          prev.map(couturiere =>
            couturiere.id === id ? { ...couturiere, isactive: !newActiveStatus } : couturiere
          )
        );
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.message && result.message.includes("succès")) {
        fetchCouturieres();
      } else {
        setAllCouturieres(prev =>
          prev.map(couturiere =>
            couturiere.id === id ? { ...couturiere, isactive: !newActiveStatus } : couturiere
          )
        );
        throw new Error(result.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut actif:", error);
      alert("Erreur lors de la mise à jour: " + error.message);
    }
  };

  // Obtenir le message du popup en fonction de l'action
  const getPopupMessage = () => {
    if (!couturiereForAction) return { title: "", subtitle: "" };
    
    if (actionType === "accept") {
      return {
        title: "هل أنت متأكد من قبول هذه الخياطة؟",
        subtitle: "قبولك للخياطة سيمكنها من الوصول إلى حسابها وممارسة نشاطها"
      };
    } else {
      return {
        title: "هل أنت متأكد من رفض هذه الخياطة؟",
        subtitle: "رفضك للخياطة هو قرار نهائي وليس فيه رجوع"
      };
    }
  };

  if (loading) {
    return <div className="loading">Chargement des couturières...</div>;
  }

  if (error) {
    return <div className="error">Erreur: {error}</div>;
  }

  const popupMessage = getPopupMessage();

  return (
     <div className="list-container">
    {couturieres.length === 0 ? (
      <Vide 
        texte="لا يوجد"
        tailleIcône={100}
        couleurIcône="#6b7280"
        className="vide-couturieres"
      />
    ) : (
      couturieres.map(couturiere => (
        <CoutureInfo
          key={couturiere.id}
          full_name={couturiere.full_name}
          phonenumber={couturiere.phonenumber}
          address={couturiere.address}
          created_at={couturiere.created_at}
          isaccepted={couturiere.isaccepted}
          isactive={couturiere.isactive}
          pdfFiles={couturiere.pdfFiles}
          images={couturiere.images}
          onStatusChange={(status) => prepareStatusChange(couturiere.id, status)}
          onActiveStatusChange={(status) => handleActiveStatusChange(couturiere.id, status)}
        />
      ))
    )}

      {showPopup && (
        <Popup
          title={popupMessage.title}
          iconPopup={actionType === "accept" ? youwonnaaccept : areyousure}
          sousTitre={popupMessage.subtitle}
          buttons={[
            {
              text: "أتراجع",
              onClick: () => setShowPopup(false),
              backgroundColor: "#FFFFFF",
              textColor: "#444444",
              width: "fit-content",
              border: "2px solid",
              borderColor: "Black",
              customClass: "with-border"
            },
            {
              text: actionType === "accept" ? "أؤكد القبول" : "أؤكد الرفض",
              onClick: handleStatusChangeConfirmed,
              backgroundColor: actionType === "accept" ? "#22C55E" : "#EF4444",
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
    </div>
  );
}