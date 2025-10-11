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
      setErrorModels(""); // Reset des erreurs
      const token = localStorage.getItem("accessToken");
      
      console.log("🔍 === DÉBUT DEBUG fetchMostSoldModels ===");
      console.log("📝 Token présent:", !!token);
      if (token) {
        console.log("📝 Token length:", token.length);
        console.log("📝 Token début:", token.substring(0, 20) + "...");
      }
      
      if (!token) {
        console.error("❌ Aucun token trouvé - redirection vers login");
        navigate("/admin/login");
        return;
      }
      
      const apiUrl = "https://api.kadi-inv.store/adminapi/most-demanded-models";
      console.log("🌐 URL appelée:", apiUrl);
      
      const requestOptions = {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        // Ajout pour éviter le cache
        cache: 'no-cache'
      };
      
      console.log("📤 Headers envoyés:", requestOptions.headers);
      
      const startTime = Date.now();
      const response = await fetch(apiUrl, requestOptions);
      const endTime = Date.now();
      
      console.log("📥 Réponse reçue en", endTime - startTime + "ms");
      console.log("📊 Status HTTP:", response.status);
      console.log("📊 Status text:", response.statusText);
      console.log("📊 OK:", response.ok);
      console.log("📊 Redirigé:", response.redirected);
      console.log("📊 Type:", response.type);
      
      // Afficher tous les headers de réponse
      console.log("📋 Headers de réponse:");
      response.headers.forEach((value, key) => {
        console.log(`   ${key}: ${value}`);
      });
      
      const contentType = response.headers.get('content-type');
      console.log("📄 Content-Type:", contentType);
      
      // Vérifier si c'est du HTML (erreur)
      if (contentType && contentType.includes('text/html')) {
        console.warn("⚠️  Réponse HTML détectée (probable page d'erreur)");
        const htmlText = await response.text();
        console.log("📝 Contenu HTML (premiers 500 caractères):", htmlText.substring(0, 500));
        
        // Vérifier les erreurs courantes dans le HTML
        if (htmlText.includes('CSRF') || htmlText.includes('csrf')) {
          throw new Error('Erreur CSRF détectée');
        }
        if (htmlText.includes('Forbidden') || htmlText.includes('403')) {
          throw new Error('Accès interdit (403)');
        }
        if (htmlText.includes('Not Found') || htmlText.includes('404')) {
          throw new Error('Endpoint non trouvé (404)');
        }
        if (htmlText.includes('Server Error') || htmlText.includes('500')) {
          throw new Error('Erreur serveur (500)');
        }
        
        throw new Error(`Réponse HTML reçue au lieu de JSON. Status: ${response.status}`);
      }
      
      if (response.status === 401) {
        console.log("🔐 401 Unauthorized - Token probablement expiré");
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          console.log("🔄 Token rafraîchi - Nouvel essai");
          return fetchMostSoldModels();
        } else {
          console.error("❌ Échec du rafraîchissement du token");
          return;
        }
      }
      
      if (response.status === 403) {
        console.log("🚫 403 Forbidden - Problème de permissions");
        const errorText = await response.text();
        console.log("📝 Contenu erreur 403:", errorText);
        setErrorModels("Permission refusée. Seuls les administrateurs peuvent accéder à ces données.");
        setLoadingModels(false);
        return;
      }
      
      if (response.status === 404) {
        console.error("❌ 404 Not Found - URL incorrecte");
        const errorText = await response.text();
        console.log("📝 Contenu erreur 404:", errorText);
        throw new Error(`Endpoint non trouvé. Vérifiez l'URL: ${apiUrl}`);
      }
      
      if (!response.ok) {
        console.error(`❌ Erreur HTTP: ${response.status}`);
        // Essayer de lire le message d'erreur
        let errorDetail = `Status: ${response.status}`;
        try {
          const errorText = await response.text();
          console.log("📝 Contenu erreur:", errorText);
          errorDetail += ` - ${errorText}`;
        } catch (e) {
          console.log("📝 Impossible de lire le contenu d'erreur");
        }
        throw new Error(errorDetail);
      }
      
      // Vérifier que c'est bien du JSON avant de parser
      if (!contentType || !contentType.includes('application/json')) {
        const rawText = await response.text();
        console.error("❌ Content-Type non-JSON:", contentType);
        console.error("📝 Contenu brut reçu:", rawText.substring(0, 500));
        throw new Error(`Content-Type invalide: ${contentType}. Attendu: application/json`);
      }
      
      console.log("✅ Format JSON détecté - parsing...");
      const data = await response.json();
      console.log("📦 Données JSON parsées:", data);
      
      if (data.most_sold_models === 'none') {
        console.log("ℹ️  Aucun modèle vendu trouvé");
        setMostSoldModels([]);
      } else {
        console.log(`✅ ${data.most_sold_models.length} modèle(s) trouvé(s)`);
        setMostSoldModels(data.most_sold_models);
      }
      
      setLoadingModels(false);
      console.log("🎉 === FIN SUCCÈS fetchMostSoldModels ===");
      
    } catch (err) {
      console.error("💥 === ERREUR COMPLÈTE fetchMostSoldModels ===");
      console.error("💥 Type d'erreur:", err.constructor.name);
      console.error("💥 Message:", err.message);
      console.error("💥 Stack:", err.stack);
      
      // Gestion spécifique des erreurs réseau
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        console.error("🌐 Erreur réseau - Vérifiez la connexion");
        setErrorModels("Erreur de connexion réseau. Vérifiez votre internet.");
      } 
      // Erreur de parsing JSON
      else if (err.name === 'SyntaxError' && err.message.includes('JSON')) {
        console.error("📄 Erreur de parsing JSON");
        setErrorModels("Erreur de format des données reçues.");
      }
      // Erreur CORS
      else if (err.name === 'TypeError' && err.message.includes('CORS')) {
        console.error("🛡️  Erreur CORS");
        setErrorModels("Erreur de sécurité CORS. Contactez l'administrateur.");
      }
      else {
        console.error("❌ Erreur non spécifique");
        setErrorModels(`Erreur détaillée: ${err.message}`);
      }
      
      setLoadingModels(false);
      console.error("💔 === FIN ERREUR fetchMostSoldModels ===");
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
