// src/components/Recherchefilter.jsx
import React, { useState, useEffect } from "react";
import "../../style/shoppingStyle/Recherchefilter.css";
import Cards from "./Cards";
import { FiSearch } from "react-icons/fi";
import useErreur401Handler from '../generalComponents/Erreur401Handle';

const categories = ["الكل", "نساء", "رجال", "أطفال"];

// URLs API selon la catégorie
const apiUrls = {
  "الكل": "https://api.kadi-inv.store/clientapi/models/all",
  "نساء": "https://api.kadi-inv.store/clientapi/models/femmes/",
  "رجال": "https://api.kadi-inv.store/clientapi/models/hommes/",
  "أطفال": "https://api.kadi-inv.store/clientapi/models/enfants/",
};

export default function Recherchefilter() {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { handle401Error } = useErreur401Handler();

  // Fonction pour récupérer le token du localStorage
  const getAuthToken = () => {
    return localStorage.getItem("accessToken");
  };

  // Fonction pour charger les produits depuis l'API
  const fetchProducts = async (category) => {
    setLoading(true);
    
    const token = getAuthToken();
    
    // Si pas de token, afficher l'erreur et arrêter
    

    try {
      const response = await fetch(apiUrls[category], {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      // Vérifier si la réponse est OK
      if (!response.ok) {
         if (response.status === 401) {
        const refreshSuccess = await handle401Error();
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return fetchProducts();
        }
      }
      else {
          console.error(`HTTP error! status: ${response.status}`);
        }
        setProducts([]);
        return;
      }

      const data = await response.json();

      // Adapter les données au format attendu par ProductCard
      const formatted = data.map((prod, idx) => ({
        id: idx,
        title: prod.name,
        price: prod.price_per_piece_for_client,
        images: prod.images.map((img) => img.image),
        sizes: prod.sizes || [],
        description: prod.description,
        code: prod.code, // Assurez-vous que l'API retourne ce champ
        variants: prod.variants || [] // Assurez-vous que l'API retourne ce champ
      }));

      setProducts(formatted);
    } catch (error) {
      console.error("Erreur lors du fetch :", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Charger les produits quand la catégorie change
  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

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

            {/* Boutons de catégories */}
            <div className="filter-buttons-wrapper">
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
