import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleNavigationWithAuth } from "../../apimanagement/authUtils";
import api from "../../apimanagement/api";
import "../../style/landingStyle/ProductSection.css";
import useNavigationDecision from '../generalComponents/DecisionToMakeForPath';

// Icônes de flèche
const ArrowRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function ProductImageSlider({ images, isTopSeller }) {
     const handleNavigation = useNavigationDecision();
    
      const handleButtonClick = (buttonName) => {
      handleNavigation(buttonName);
    };
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="shopping-product-img-container">
      {images.length > 0 ? (
        <img 
          src={images[currentIndex]} 
          alt={`Product view ${currentIndex + 1}`} 
          className="shopping-product-image" 
        />
      ) : (
        <div className="no-image">لا توجد صورة</div>
      )}
      
      {/* Afficher le badge seulement si c'est un top seller */}
      {isTopSeller && <span className="shopping-badge">الأكثر مبيعًا</span>}

      {images.length > 1 && (
        <>
          <button className="shopping-nav-btn shopping-prev-btn" onClick={(e) => { e.stopPropagation(); goToPrevious(); }}>
            <ArrowLeft />
          </button>
          <button className="shopping-nav-btn shopping-next-btn" onClick={(e) => { e.stopPropagation(); goToNext(); }}>
            <ArrowRight />
          </button>

          <div className="shopping-image-indicators">
            {images.map((_, index) => (
              <span
                key={index}
                className={`shopping-indicator ${index === currentIndex ? "shopping-indicator-active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
              ></span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ProductSection() {

   const handleNavigation = useNavigationDecision();
  
     const handleButtonClick = (buttonName) => {
      handleNavigation(buttonName);
    };
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleProtectedNavigation = async (path) => {
    try {
      await handleNavigationWithAuth(navigate, path, false);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

 


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // ✅ Requête publique - pas d'authentification nécessaire
        const response = await api.withAuth(false).get("/clientapi/top-selling-models/");
        
        // Vérifier si la réponse contient des données
        if (response.data && response.data.length > 0) {
          const formatted = response.data.map((item, index) => ({
            id: index,
            title: item.name,
            price: item.price_per_piece_for_client + " دج",
            sizes: item.sizes || [],
            images: item.images.map((img) => img.image),
            selectionType: item.selection_type, // Conserver le type de sélection
            isTopSeller: item.selection_type === "top" // Ajouter un flag pour les tops
          }));
          
          setProducts(formatted);
        } else {
          // Si pas de données, on garde products comme tableau vide
          setProducts([]);
        }
      } catch (error) {
        console.error("Erreur API:", error);
        setProducts([]); // En cas d'erreur, on vide aussi les produits
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="product-section">
        <div className="loading-container">
          <p>جاري تحميل المنتجات...</p>
        </div>
      </section>
    );
  }

  // Si le chargement est terminé mais il n'y a pas de produits
  if (!loading && products.length < 2) {
    return null; // Ne rien afficher
  }

  return (
    <>
      <section className="product-section">
        <h2 className="section-title">تسوّق من مجموعتنا الحصرية</h2>
        <p className="section-subtitle">
          اكتشف جودة تصاميمنا أو اطلب تصميماً مخصصاً يناسب ذوقك
        </p>

        <div className="product-scroll-container">
          <div className="product-grid">
            {products.map((product) => (
              <div className="shopping-product-card" key={product.id}>
                {/* Passer isTopSeller au slider */}
                <ProductImageSlider 
                  images={product.images} 
                  isTopSeller={product.isTopSeller} 
                />
                <div className="shopping-product-info">
                  <div className="shopping-product-header">
                    <h3 className="shopping-product-title">{product.title}</h3>
                    <span className="shopping-product-price">{product.price}</span>
                  </div>
                  <p className="shopping-product-sizes">
                    <span>المقاسات:</span>
                    {product.sizes.length > 0 ? (
                      product.sizes.map((size, idx) => (
                        <span key={idx} className="shopping-size-item">{size}</span>
                      ))
                    ) : (
                      <span className="shopping-size-item">غير متوفر</span>
                    )}
                  </p>
                  <button className="shopping-buy-btn" onClick={() => handleButtonClick("اكتشف المزيد")}>
                    اكتشف المزيد
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="product-section">
        <h2 className="section-title" >لم تَجِد ما تبحث عنه؟</h2>
        <p className="section-subtitle">
          اطلب تصميما مخصصا بالكامل يناسب ذوقك و مقاساتك الخاصة
        </p>
        <div className="notfound-buttons">
          <button className="notfound-btn filled" onClick={() => handleButtonClick("تصميم خاص")}>
            اطلب تصميم مخصص
          </button>
          <button className="notfound-btn outlined" onClick={() => handleButtonClick("اكتشف المزيد")} >
            تصفّح كامل العرض
          </button>
        </div>
      </section>
    </>
  );
}