import { useState, useEffect } from "react";
import ContainerPagesAdmin from "../../components/AdminComponents/ContainerPagesAdmin";
import machinecouture from "../../assets/machinecouture.png";
import revenir from "../../assets/avancerjaune.png";
import avancer from "../../assets/revenirjaune.png";
import "../../style/AdminStyle/Dashboard.css";
import Courbe from "@/components/AdminComponents/Courbe";
import { useNavigate } from "react-router-dom";
import useErreur401Handler from '../../components/generalComponents/Erreur401Handle'

function Dashboard() {
  const navigate = useNavigate();
    const { handle401Error } = useErreur401Handler();

  // États pour suivre l'index courant de chaque section
  const [currentCouturiereIndex, setCurrentCouturiereIndex] = useState(0);
  const [currentAffiliateIndex, setCurrentAffiliateIndex] = useState(0);
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  
  // État pour les modèles les plus vendus
  const [mostSoldModels, setMostSoldModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(true);
  const [errorModels, setErrorModels] = useState(null);
  
  // État pour les couturières les plus actives
  const [mostActiveCouturieres, setMostActiveCouturieres] = useState([]);
  const [loadingCouturieres, setLoadingCouturieres] = useState(true);
  const [errorCouturieres, setErrorCouturieres] = useState(null);
  const [isTie, setIsTie] = useState(false);
  const [hasActiveCouturiere, setHasActiveCouturiere] = useState(false);

  // État pour les affiliés les plus actifs
  const [mostActiveAffiliates, setMostActiveAffiliates] = useState([]);
  const [loadingAffiliates, setLoadingAffiliates] = useState(true);
  const [errorAffiliates, setErrorAffiliates] = useState(null);
  const [isTieAffiliates, setIsTieAffiliates] = useState(false);
  const [hasActiveAffiliate, setHasActiveAffiliate] = useState(false);

  // Fonction pour récupérer les modèles les plus vendus
  const fetchMostSoldModels = async () => {
    try {
      setLoadingModels(true);
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        navigate("/admin/login");
        return;
      }
      
      const response = await fetch("api.kadi-inv.store/login/adminapi/most-demanded-models", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return fetchMostSoldModels();
        }
      }
      else
      
      if (response.status === 403) {
        setErrorModels("Permission refusée. Seuls les administrateurs peuvent accéder à ces données.");
        setLoadingModels(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.most_sold_models === 'none') {
        setMostSoldModels([]);
      } else {
        setMostSoldModels(data.most_sold_models);
      }
      
      setLoadingModels(false);
    } catch (err) {
      console.error("Erreur lors de la récupération des modèles:", err);
      setErrorModels("Erreur lors de la récupération des données");
      setLoadingModels(false);
    }
  };

  // Fonction pour récupérer les couturières les plus actives
  const fetchMostActiveCouturieres = async () => {
    try {
      setLoadingCouturieres(true);
      const token = localStorage.getItem("accessToken");
      
     
      
      const response = await fetch("https://api.kadi-inv.store/adminapi/GetMostActiveCouturiere", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return fetchMostActiveCouturieres ();
        }
      }
      else
      
      if (response.status === 403) {
        setErrorCouturieres("Permission refusée. Seuls les administrateurs peuvent accéder à ces données.");
        setLoadingCouturieres(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Traitement des différents cas de réponse
      if (!data.has_active_couturiere) {
        // Aucune couturière active trouvée
        setMostActiveCouturieres([]);
        setHasActiveCouturiere(false);
      } else if (data.is_tie) {
        // Plusieurs couturières avec le même nombre de ventes
        setMostActiveCouturieres(data.most_active_couturieres || []);
        setIsTie(true);
        setHasActiveCouturiere(true);
      } else {
        // Une seule couturière la plus active
        setMostActiveCouturieres(data.most_active_couturiere ? [data.most_active_couturiere] : []);
        setIsTie(false);
        setHasActiveCouturiere(true);
      }
      
      setLoadingCouturieres(false);
    } catch (err) {
      console.error("Erreur lors de la récupération des couturières:", err);
      setErrorCouturieres("Erreur lors de la récupération des données");
      setLoadingCouturieres(false);
    }
  };

  // Fonction pour récupérer les affiliés les plus actifs
  const fetchMostActiveAffiliates = async () => {
    try {
      setLoadingAffiliates(true);
      const token = localStorage.getItem("accessToken");
      
     
      
      const response = await fetch("https://api.kadi-inv.store/adminapi/getmostActifAffilier", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return fetchMostActiveAffiliates ();
        }
      }
      else
      
      if (response.status === 403) {
        setErrorAffiliates("Permission refusée. Seuls les administrateurs peuvent accéder à ces données.");
        setLoadingAffiliates(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Traitement des différents cas de réponse
      if (data.most_active_affiliates.length === 0) {
        // Aucun affilié actif trouvé
        setMostActiveAffiliates([]);
        setHasActiveAffiliate(false);
      } else if (data.most_active_affiliates.length > 1) {
        // Plusieurs affiliés avec le même nombre de commandes
        setMostActiveAffiliates(data.most_active_affiliates);
        setIsTieAffiliates(true);
        setHasActiveAffiliate(true);
      } else {
        // Un seul affilié le plus actif
        setMostActiveAffiliates(data.most_active_affiliates);
        setIsTieAffiliates(false);
        setHasActiveAffiliate(true);
      }
      
      setLoadingAffiliates(false);
    } catch (err) {
      console.error("Erreur lors de la récupération des affiliés:", err);
      setErrorAffiliates("Erreur lors de la récupération des données");
      setLoadingAffiliates(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchMostSoldModels();
    fetchMostActiveCouturieres();
    fetchMostActiveAffiliates();
  }, []);

  // Fonctions pour naviguer vers l'élément précédent
  const prevCouturiere = () => {
    if (mostActiveCouturieres.length <= 1) return;
    setCurrentCouturiereIndex(prevIndex => 
      prevIndex === 0 ? mostActiveCouturieres.length - 1 : prevIndex - 1
    );
  };

  const prevAffiliate = () => {
    if (mostActiveAffiliates.length <= 1) return;
    setCurrentAffiliateIndex(prevIndex => 
      prevIndex === 0 ? mostActiveAffiliates.length - 1 : prevIndex - 1
    );
  };

  const prevModel = () => {
    if (mostSoldModels.length <= 1) return;
    setCurrentModelIndex(prevIndex => 
      prevIndex === 0 ? mostSoldModels.length - 1 : prevIndex - 1
    );
  };

  // Fonctions pour naviguer vers l'élément suivant
  const nextCouturiere = () => {
    if (mostActiveCouturieres.length <= 1) return;
    setCurrentCouturiereIndex(prevIndex => 
      prevIndex === mostActiveCouturieres.length - 1 ? 0 : prevIndex + 1
    );
  };

  const nextAffiliate = () => {
    if (mostActiveAffiliates.length <= 1) return;
    setCurrentAffiliateIndex(prevIndex => 
      prevIndex === mostActiveAffiliates.length - 1 ? 0 : prevIndex + 1
    );
  };

  const nextModel = () => {
    if (mostSoldModels.length <= 1) return;
    setCurrentModelIndex(prevIndex => 
      prevIndex === mostSoldModels.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <ContainerPagesAdmin
      titre="لوحة التحكم"
      soustitre="احصائيات عامة حول مداخيل المتجر و نشاط العملاء"
    >
      {/* Cartes machines */}
      <div className="Cardselements">
        {/* Couturière - Affiche les flèches seulement s'il y a plusieurs éléments */}
        <div className="machine-card">
          <img src={machinecouture} alt="machine" className="machine-img" />
          <div className="machine-content">
            <p className="title">الخياطة الأكثر مهارة</p>
            
            {loadingCouturieres ? (
              <div className="value-container">
                <p>جاري التحميل...</p>
              </div>
            ) : errorCouturieres ? (
              <div className="value-container">
                <p className="error">{errorCouturieres}</p>
              </div>
            ) : !hasActiveCouturiere ? (
              <div className="value-container">
                <h3 className="value">لا يوجد</h3>
              </div>
            ) : (
              <div className={`containerarrow-elements ${mostActiveCouturieres.length === 1 ? 'single-item-center' : ''}`}>
                {mostActiveCouturieres.length > 1 && (
                  <img 
                    src={revenir} 
                    alt="prev" 
                    className="arrow" 
                    onClick={prevCouturiere}
                  />
                )}
                
                <div className="value-container">
                  <h3 className="value">{mostActiveCouturieres[currentCouturiereIndex]?.full_name}</h3>
                  
                  <div className="code">{mostActiveCouturieres[currentCouturiereIndex]?.phone_number}</div>
                </div>
                
                {mostActiveCouturieres.length > 1 && (
                  <img 
                    src={avancer} 
                    alt="next" 
                    className="arrow" 
                    onClick={nextCouturiere}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Affiliate - Section réelle avec données de l'API */}
        <div className="machine-card">
          <img src={machinecouture} alt="machine" className="machine-img" />
          <div className="machine-content">
            <p className="title">المروج الأكثر نشاطا</p>
            
            {loadingAffiliates ? (
              <div className="value-container">
                <p>جاري التحميل...</p>
              </div>
            ) : errorAffiliates ? (
              <div className="value-container">
                <p className="error">{errorAffiliates}</p>
              </div>
            ) : !hasActiveAffiliate ? (
              <div className="value-container">
                <h3 className="value">لا يوجد</h3>
              </div>
            ) : (
              <div className={`containerarrow-elements ${mostActiveAffiliates.length === 1 ? 'single-item-center' : ''}`}>
                {mostActiveAffiliates.length > 1 && (
                  <img 
                    src={revenir} 
                    alt="prev" 
                    className="arrow" 
                    onClick={prevAffiliate}
                  />
                )}
                
                <div className="value-container">
                  <h3 className="value">{mostActiveAffiliates[currentAffiliateIndex]?.full_name}</h3>
                  <div className="code">{mostActiveAffiliates[currentAffiliateIndex]?.phone_number || "لا يوجد رقم"}</div>
                
                </div>
                
                {mostActiveAffiliates.length > 1 && (
                  <img 
                    src={avancer} 
                    alt="next" 
                    className="arrow" 
                    onClick={nextAffiliate}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Meilleur modèle - Affiche les flèches seulement s'il y a plusieurs éléments */}
        <div className="machine-card">
          <img src={machinecouture} alt="machine" className="machine-img" />
          <div className="machine-content">
            <p className="title">النموذج الأكثر مبيعاً</p>
            
            {loadingModels ? (
              <div className="value-container">
                <p>جاري التحميل...</p>
              </div>
            ) : errorModels ? (
              <div className="value-container">
                <p className="error">{errorModels}</p>
              </div>
            ) : mostSoldModels.length === 0 ? (
              <div className="value-container">
                <h3 className="value">لا يوجد</h3>
              </div>
            ) : (
              <div className={`containerarrow-elements ${mostSoldModels.length === 1 ? 'single-item-center' : ''}`}>
                {mostSoldModels.length > 1 && (
                  <img 
                    src={revenir} 
                    alt="prev" 
                    className="arrow" 
                    onClick={prevModel}
                  />
                )}
                
                <div className="value-container">
                  <h3 className="value">{mostSoldModels[currentModelIndex].name}</h3>
                  <div className="code">{mostSoldModels[currentModelIndex].code}</div>
                </div>
                
                {mostSoldModels.length > 1 && (
                  <img 
                    src={avancer} 
                    alt="next" 
                    className="arrow" 
                    onClick={nextModel}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section graphe */}
      <div className="courbesection">
        <Courbe/>
      </div>
    </ContainerPagesAdmin>
  );
}

export default Dashboard;
