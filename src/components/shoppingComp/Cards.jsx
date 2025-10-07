// src/components/Cards.jsx
import React from "react";
import ProductCard from "./ProductCard";
import "../../style/shoppingStyle/Cards.css";
import { TbBoxOff } from "react-icons/tb";// Icône de boîte vide (tu peux changer)


  // Dans Cards.jsx
export default function Cards({ products }) {
  //cards doit recevoir les parametres de l'api puis elle doit les passer correctement à chaque ProductCard
  //les information d'un seul model de l'api 
  const hasProducts = products.length > 0;

  return (
    <div className={hasProducts ? "cards-container" : "cards-empty-container"}>
      {hasProducts ? (
        products.map((prod) => (
          <ProductCard 
            key={prod.id} 
            product={{
              ...prod,
              code: prod.code, // Assurez-vous que cela vient de l'API
              variants: prod.variants // Assurez-vous que cela vient de l'API
            }} 
          />
        ))
      ) : (
        <div className="empty-message">
          <TbBoxOff size={60} color="#999" />
          <p>لا يوجد أي موديل حالياً</p>
        </div>
      )}
    </div>
  );
}