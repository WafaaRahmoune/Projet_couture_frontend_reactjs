// src/components/Recherchefilter.jsx
import React, { useState, useEffect } from "react";
import "../../style/shoppingStyle/Recherchefilter.css";
import Cards from "./CardsDropshipper";
import { FiSearch } from "react-icons/fi";
import useErreur401Handler from '../../components/generalComponents/Erreur401Handle'

const categories = ["الكل", "نساء", "رجال", "أطفال"];

// URLs API selon la catégorie
const apiUrls = {
  "الكل": "https://api.kadi-inv.store/clientapi/models/all",
  "نساء": "https://api.kadi-inv.store/clientapi/models/femmes/",
  "رجال": "https://api.kadi-inv.store/clientapi/models/hommes/",
  "أطفال": "https://api.kadi-inv.store/clientapi/models/enfants/",
};

export default function RecherchefilterDropshipper() {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topDemandData, setTopDemandData] = useState(null);
  const { handle401Error } = useErreur401Handler();


  // Fonction utilitaire pour les requêtes authentifiées
  const authenticatedFetch = async (url) => {
    const accessToken = localStorage.getItem("accessToken");
    
    
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    
     if (!response.ok) {
         if (response.status === 401) {
        const refreshSuccess = await handle401Error();
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return authenticatedFetch ();
        }
      }
    }
    
    return response.json();
  };

  // Dans la fonction fetchProducts de RecherchefilterDropshipper
const fetchProducts = async (category) => {
  setLoading(true);
  try {
    const data = await authenticatedFetch(apiUrls[category]);

    // Adapter les données au format attendu par ProductCard
    const formatted = data.map((prod, idx) => ({
      id: idx,
      title: prod.name,
      price: prod.price_per_piece_for_dropshipper,
      min_pieces_for_dropshipper: prod.min_pieces_for_dropshipper,
      images: prod.images.map((img) => img.image),
      sizes: prod.sizes || [],
      description: prod.description,
      code: prod.code,
      variants: prod.variants || [],
      colors: prod.colors || []
    }));

    setProducts(formatted);
  } catch (error) {
    console.error("Erreur lors du fetch :", error);
    setProducts([]);
  } finally {
    setLoading(false);
  }
};

// Et dans fetchTopDemandProducts
const fetchTopDemandProducts = async () => {
  setLoading(true);
  try {
    const data = await authenticatedFetch("http://127.0.0.1:8000/dropshipper/top-demandingmodels");
    
    if (data.count > 0) {
      // Adapter les données au format attendu par ProductCard
      const formatted = data.results.map((prod, idx) => ({
        id: idx,
        title: prod.name,
        price: prod.price_per_piece_for_dropshipper,
        price_per_piece_for_dropshipper: prod.price_per_piece_for_dropshipper,
        min_pieces_for_dropshipper: prod.min_pieces_for_dropshipper,
        images: prod.images.map((img) => img.image_url || img.image),
        sizes: prod.variants.map(v => v.size) || [],
        description: prod.description,
        code: prod.code,
        variants: prod.variants || [],
        colors: prod.colors || []
      }));
      
      setProducts(formatted);
      setSelectedCategory("aktar-talaban");
    }
  } catch (error) {
    console.error("Erreur lors du fetch des produits populaires :", error);
  } finally {
    setLoading(false);
  }
};

  // Fonction pour charger les données de popularité
  const fetchTopDemandData = async () => {
    try {
      const data = await authenticatedFetch("http://127.0.0.1:8000/dropshipper/top-demandingmodels");
      setTopDemandData(data);
    } catch (error) {
      console.error("Erreur lors du fetch des données de popularité :", error);
    }
  };

  // Charger les produits quand la catégorie change
  useEffect(() => {
    if (selectedCategory !== "aktar-talaban") {
      fetchProducts(selectedCategory);
    }
  }, [selectedCategory]);

  // Charger les données des produits les plus demandés au montage du composant
  useEffect(() => {
    fetchTopDemandData();
  }, []);

  // Filtrer côté front pour la recherche
  const filteredProducts = products.filter(
    (product) =>
      product.title.includes(searchTerm) ||
      product.description.includes(searchTerm)
  );

  return (
    <div className="containershop">
      <div className="shop-wrapper">
        <div className="recherche-section">
          <div className="filter-bar">
            {/* Champ de recherche */}
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="ابحث عن موديل ..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Conteneur scrollable pour les boutons de filtre */}
            <div className="filter-buttons-scroll-container">
              <div className="filter-buttons-wrapper">
                {topDemandData && topDemandData.count > 0 && (
                  <button
                    className={`filter-btn ${selectedCategory === "aktar-talaban" ? "active" : ""}`}
                    onClick={fetchTopDemandProducts}
                  >
                    الأكثر طلباً
                  </button>
                )}
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`filter-btn ${selectedCategory === cat ? "active" : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Loader ou affichage des produits */}
        {loading ? (
          <p className="loading-text">جار التحميل...</p>
        ) : (
          <Cards products={filteredProducts} />
        )}
      </div>
    </div>
  );
}
