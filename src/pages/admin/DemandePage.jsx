import React, { useState, useEffect, useCallback, useMemo } from "react";
import DemandeCard from "@/components/AdminComponents/DemandeCard";
import ContainerPagesAdmin from "../../components/AdminComponents/ContainerPagesAdmin";
import Popup from "../../components/generalComponents/Popup";
import donepopup from "../../assets/icons/donepopup.png";
import "../../style/AdminStyle/DemandePage.css";
import Vide from "../../components/generalComponents/Vide";
import useErreur401Handler from '../../components/generalComponents/Erreur401Handle'

// Composant SearchBar (inchangé)
const SearchBar = ({ onSearch, placeholder = "ابحث باسم المستخدم، الولاية أو النموذج..." }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        className="search-bar-input"
      />
    </div>
  );
};

// Composant PricePopup (MODIFIÉ)
const PricePopup = ({ isOpen, onClose, onConfirm, currentPrice }) => {
  const [price, setPrice] = useState(currentPrice || "");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [apiErrors, setApiErrors] = useState({}); // NOUVEAU: état pour les erreurs API

  const validateForm = () => {
    const newErrors = {};
    
    if (!price || isNaN(price)) {
      newErrors.price = "السعر مطلوب ويجب أن يكون رقماً";
    } else if (parseFloat(price) < 0) {
      newErrors.price = "يجب أن يكون السعر قيمة موجبة";
    }
    
    if (!email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "صيغة البريد الإلكتروني غير صحيحة";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    setApiErrors({}); // NOUVEAU: Réinitialiser les erreurs API avant validation
    if (validateForm()) {
      await onConfirm(parseInt(price), email, setApiErrors); // NOUVEAU: passer setApiErrors
    }
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
    if (errors.price) {
      setErrors(prev => ({ ...prev, price: '' }));
    }
    if (apiErrors.price) { // NOUVEAU: Effacer aussi les erreurs API
      setApiErrors(prev => ({ ...prev, price: '' }));
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
    if (apiErrors.email) { // NOUVEAU: Effacer aussi les erreurs API
      setApiErrors(prev => ({ ...prev, email: '' }));
    }
  };

  // NOUVEAU: Fonction pour fermer le popup et réinitialiser les erreurs
  const handleClose = () => {
    setApiErrors({});
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="price-popup">
        <h3>إدخال السعر للطلب المخصص</h3>
        <div className="popup-content">
          <label>السعر (دج):</label>
          <input
            type="number"
            value={price}
            onChange={handlePriceChange}
            placeholder="أدخل السعر"
            min="0"
          />
          {/* Affichage des erreurs de validation pour le prix */}
          {errors.price && (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
              {errors.price}
            </div>
          )}
          {/* NOUVEAU: Affichage des erreurs API pour le prix */}
          {apiErrors.price && (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
              {apiErrors.price}
            </div>
          )}
          
          <label style={{marginTop: '15px'}}>البريد الإلكتروني للخياطة:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="أدخل بريد الخياطة الإلكتروني"
          />
          {/* Affichage des erreurs de validation pour l'email */}
          {errors.email && (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
              {errors.email}
            </div>
          )}
          {/* NOUVEAU: Affichage des erreurs API pour l'email */}
          {apiErrors.email && (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
              {apiErrors.email}
            </div>
          )}
        </div>
        <div className="popup-actions">
          <button 
            className="confirm-btn" 
            onClick={handleConfirm}
            disabled={!price || !email}
          >
            تأكيد
          </button>
          <button className="cancel-btn" onClick={handleClose}>
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant StockPopup (inchangé)
const StockPopup = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  stockRequirements,
  modelCode 
}) => {
  const [stockAdditions, setStockAdditions] = useState([]);

  useEffect(() => {
    if (stockRequirements && stockRequirements.variants_analysis) {
      const additions = stockRequirements.variants_analysis
        .filter(variant => variant.needs_addition)
        .map(variant => ({
          size: variant.size,
          color: variant.color,
          quantity: variant.missing_quantity
        }));
      setStockAdditions(additions);
    }
  }, [stockRequirements]);

  const handleQuantityChange = (index, newQuantity) => {
    const updatedAdditions = [...stockAdditions];
    updatedAdditions[index].quantity = Math.max(0, newQuantity);
    setStockAdditions(updatedAdditions);
  };

  const handleConfirm = () => {
    onConfirm(stockAdditions);
  };

  if (!isOpen || !stockRequirements) return null;

  return (
    <div className="popup-overlay">
      <div className="stock-popup" style={{maxWidth: '600px'}}>
        <h3>إضافة المخزون المطلوب</h3>
        <div className="popup-content">
          <p style={{color: '#e74c3c', marginBottom: '20px'}}>
           المخزون الحالي غير كافٍ لمعالجة هذه الطلبية، وذلك لأن الكميات لا تُخصم إلا بعد إتمام البيع بشكل كامل. ونظراً لوجود طلبية مؤكدة أخرى على نفس النموذج، يجب إضافة الكمية أو الحد الأدنى من الفئات إلى المخزون حتى يتم قبول هذه الطلبية ومعالجتها.
          </p>
          
          <div style={{maxHeight: '300px', overflowY: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{backgroundColor: '#f8f9fa'}}>
                  <th style={{padding: '10px', border: '1px solid #ddd'}}>المقاس</th>
                  <th style={{padding: '10px', border: '1px solid #ddd'}}>اللون</th>
                  <th style={{padding: '10px', border: '1px solid #ddd'}}>الكمية الأدنى المطلوبة</th>
                  <th style={{padding: '10px', border: '1px solid #ddd'}}>الكمية المضافة</th>
                </tr>
              </thead>
              <tbody>
                {stockAdditions.map((variant, index) => {
                  const requirement = stockRequirements.variants_analysis.find(
                    v => v.size === variant.size && v.color === variant.color
                  );
                  const minRequired = requirement?.missing_quantity || 0;
                  
                  return (
                    <tr key={index}>
                      <td style={{padding: '10px', border: '1px solid #ddd', textAlign: 'center'}}>
                        {variant.size}
                      </td>
                      <td style={{padding: '10px', border: '1px solid #ddd', textAlign: 'center'}}>
                        {variant.color}
                      </td>
                      <td style={{padding: '10px', border: '1px solid #ddd', textAlign: 'center', color: '#e74c3c'}}>
                        {minRequired}
                      </td>
                      <td style={{padding: '10px', border: '1px solid #ddd', textAlign: 'center'}}>
                        <input
                          type="number"
                          min={minRequired}
                          value={variant.quantity}
                          onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 0)}
                          style={{
                            width: '80px',
                            padding: '5px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            textAlign: 'center'
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="popup-actions" style={{marginTop: '20px'}}>
          <button 
            className="confirm-btn" 
            onClick={handleConfirm}
            disabled={stockAdditions.some((variant, index) => {
              const requirement = stockRequirements.variants_analysis.find(
                v => v.size === variant.size && v.color === variant.color
              );
              return variant.quantity < (requirement?.missing_quantity || 0);
            })}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            تأكيد الإضافة
          </button>
          <button 
            className="cancel-btn" 
            onClick={onClose}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginLeft: '10px'
            }}
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

// Fonction pour générer une clé unique (inchangée)
const generateUniqueKey = (order) => {
  return `${order.typecommande}-${order.id}`;
};

// Fonction pour transformer les données de l'API (inchangée)
const transformApiDataToCardFormat = (apiOrders) => {
  return apiOrders.map(order => {
    const uniqueKey = generateUniqueKey(order);
    
    if (order.typecommande === "standard") {
      let variants = [];
      if (order.standard_command_details && order.standard_command_details.trim() !== "") {
        try {
          const variantStrings = order.standard_command_details.split('),(');
          variants = variantStrings.map(variantStr => {
            const cleanStr = variantStr.replace(/[()]/g, '');
            const [size, color, quantity] = cleanStr.split(',');
            return {
              size: size || "غير محدد",
              color: color !== "None" && color !== "null" && color ? color : "غير محدد",
              quantity: parseInt(quantity) || 0
            };
          });
        } catch (error) {
          console.error("Erreur parsing standard command details:", error);
        }
      }

      let totalPrice = 0;
      if (order.fashion_model) {
        let price =  order.fashion_model.price_per_piece_for_client;
        
        if (order.promocode && order.promocode.profit_percentage) {
          price = price * (1 - order.promocode.profit_percentage / 100);
        }
        
        totalPrice = price 
      }

      return {
        id: uniqueKey,
        deliveryprice :order.wilaya.delivery_price,
        originalId: order.id,
        typecommande: order.typecommande,
        nameuser: order.user.full_name,
        nameclientdropshipper:order.dropshipper_client?.nom_client || null,
        codemodel: order.fashion_model?.code || "غير محدد",
        codecommande: order.codecommande || order.code_order,
        typeuser: order.user.role === "client" ? "عميل" : 
                 order.user.role === "dropshipper" ? "دروبشيبينغ" : 
                 order.user.role === "admin" ? "مدير" : order.user.role,
        isCustomcommand: false,
        deadlinecustomorder: 0,
        statuscommand: order.state === "pending" ? "في الانتظار" : 
        order.state === "waiting" ? "في الانتظار" : 
                      order.state === "cancelled" ? "مرفوضة" : 
                      order.state === "done" ? "مكتملة" :
                      order.state === "inprogress" ? "قيد التنفيذ" : order.state,
        phone: order.phone_number,
        wilayaname: order.wilaya?.wilaya_name || "غير محدد",
        exactaddress: order.address,
        modelname: order.fashion_model?.name || "غير محدد",
        price: totalPrice,
        variants: variants,
        images: order.fashion_model?.images ? order.fashion_model.images.map(img => `https://api.kadi-inv.store${img}`) : [],
        profit_percentage: order.promocode?.profit_percentage ?? null
      };
    } 
    else if (order.typecommande === "custom") {
 const images = [];
  const pdfFiles = [];
      if (order.images) {
 
  
  order.images.forEach(img => {
    const imageUrl = `https://api.kadi-inv.store${img}`;
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
      let variants = [];
      if (order.command_details && order.command_details.trim() !== "") {
        try {
          const variantStrings = order.command_details.split('),(');
          variants = variantStrings.map(variantStr => {
            const cleanStr = variantStr.replace(/[()]/g, '');
            const [size, color, quantity] = cleanStr.split(',');
            return {
              size: size || "غير محدد",
              color: color !== "None" && color !== "null" && color ? color : "غير محدد",
              quantity: parseInt(quantity) || 0
            };
          });
        } catch (error) {
          console.error("Erreur parsing custom command details:", error);
        }
      }

      return {
        id: uniqueKey,
        deliveryprice :order.wilaya.delivery_price,
        originalId: order.id,
        typecommande: order.typecommande,
        nameuser: order.user.full_name,
        codemodel: null,
        codecommande: order.codeorder,
        typeuser: order.user.role === "client" ? "عميل" : 
                 order.user.role === "dropshipper" ? "دروبشيبينغ" : 
                 order.user.role === "admin" ? "مدير" : order.user.role,
        isCustomcommand: true,
        deadlinecustomorder: order.deadline_days_remaining || 0,
        statuscommand: order.state === "waiting" ? "في الانتظار" :
                       order.state === "inprogress" ? "قيد التنفيذ" : 
                      order.state === "cancelled" ? "مرفوضة" : 
                      order.state === "done" ? "مكتملة" : order.state,
        phone: order.numTelephone,
        wilayaname: order.wilaya?.wilaya_name || "غير محدد",
        exactaddress: order.exactaddress,
        modelname: order.nameorder,
        price: order.initial_price || 0,
        variants: variants,
        images: images,
    pdfFiles: pdfFiles
      };
    }
    return {
      id: uniqueKey,
      originalId: order.id,
      deliveryprice :order.wilaya.delivery_price,
      typecommande: order.typecommande,
      nameuser: order.user?.full_name || "غير معروف",
      nameclientdropshipper:order.dropshipper_client?.nom_client || null,
      codemodel: order.fashion_model?.code || null,
      codecommande: order.codecommande || order.codeorder || "غير محدد",
      typeuser: order.user?.role === "client" ? "عميل" : 
               order.user?.role === "dropshipper" ? "دروبشيبينغ" : 
               order.user?.role === "admin" ? "مدير" : order.user?.role || "غير معروف",
      isCustomcommand: order.typecommande === "custom",
      deadlinecustomorder: order.deadline_days_remaining || 0,
      statuscommand: order.state === "pending" ? "في الانتظار" : 
      order.state === "inprogress" ? "قيد التنفيذ" :
                    order.state === "cancelled" ? "مرفوضة" : 
                    order.state === "done" ? "مكتملة" : order.state || "غير معروف",
      phone: order.phone_number || order.numTelephone || "غير محدد",
      wilayaname: order.wilaya?.wilaya_name || "غير محدد",
      exactaddress: order.address || order.exactaddress || "غير محدد",
      modelname: order.fashion_model?.name || order.nameorder || "غير محدد",
      price: order.initial_price || 0,
      variants: [],
      images: [],
      profit_percentage: order.promocode?.profit_percentage ?? null


     
    };
  });
};

// Fonction pour filtrer les commandes par statut (inchangée)
const filterOrdersByStatus = (orders, status) => {
  if (status === "جميع الطلبات") return orders;
  return orders.filter(order => order.statuscommand === status);
};

// Fonction pour filtrer les commandes par terme de recherche (inchangée)
const filterOrdersBySearchTerm = (orders, searchTerm) => {
  if (!searchTerm) return orders;
  
  const lowercasedSearchTerm = searchTerm.toLowerCase();
  
  return orders.filter(order => 
    order.nameuser.toLowerCase().includes(lowercasedSearchTerm) ||
    order.wilayaname.toLowerCase().includes(lowercasedSearchTerm) ||
    order.modelname.toLowerCase().includes(lowercasedSearchTerm)
  );
};

// Composants optimisés avec React.memo et useMemo
const OrderList = React.memo(({ orders, onStatusChange }) => {
  return (
    <div className="orders-container">
      {orders.map(order => (
        <DemandeCard 
          key={order.id} 
          {...order} 
          onStatusChange={(newStatus) => onStatusChange(
            order.id, 
            order.originalId, 
            order.typecommande, 
            newStatus, 
            order.codecommande,
            order.codemodel,
            

          )}
        />
      ))}
    </div>
  );
});

function AllOrders({ orders, onStatusChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredOrders = useMemo(() => {
    return filterOrdersBySearchTerm(orders, searchTerm);
  }, [orders, searchTerm]);
  
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);
  
  return (
    <div>
      <SearchBar onSearch={handleSearch} />

      {filteredOrders.length === 0 ? (
        <Vide texte="لا توجد طلبات حالياً" tailleIcône={100} />
      ) : (
        <OrderList orders={filteredOrders} onStatusChange={onStatusChange} />
      )}
    </div>
  );
}

function Enattente({ orders, onStatusChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredOrdersByStatus = useMemo(() => {
    return filterOrdersByStatus(orders, "في الانتظار");
  }, [orders]);
  
  const filteredOrders = useMemo(() => {
    return filterOrdersBySearchTerm(filteredOrdersByStatus, searchTerm);
  }, [filteredOrdersByStatus, searchTerm]);
  
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);
  
  return (
    <div>
      <SearchBar onSearch={handleSearch} />

      {filteredOrders.length === 0 ? (
        <Vide texte="لا توجد طلبات في الانتظار" tailleIcône={100} />
      ) : (
        <OrderList orders={filteredOrders} onStatusChange={onStatusChange} />
      )}
    </div>
  );
}

function Encours({ orders, onStatusChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredOrdersByStatus = useMemo(() => {
    return filterOrdersByStatus(orders, "قيد التنفيذ");
  }, [orders]);
  
  const filteredOrders = useMemo(() => {
    return filterOrdersBySearchTerm(filteredOrdersByStatus, searchTerm);
  }, [filteredOrdersByStatus, searchTerm]);
  
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);
  
  return (
    <div>
      <SearchBar onSearch={handleSearch} />

      {filteredOrders.length === 0 ? (
        <Vide texte="لا توجد طلبات قيد التنفيذ" tailleIcône={100} />
      ) : (
        <OrderList orders={filteredOrders} onStatusChange={onStatusChange} />
      )}
    </div>
  );
}

function Finish({ orders }) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredOrdersByStatus = useMemo(() => {
    return filterOrdersByStatus(orders, "مكتملة");
  }, [orders]);
  
  const filteredOrders = useMemo(() => {
    return filterOrdersBySearchTerm(filteredOrdersByStatus, searchTerm);
  }, [filteredOrdersByStatus, searchTerm]);
  
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);
  
  return (
    <div>
      <SearchBar onSearch={handleSearch} />

      {filteredOrders.length === 0 ? (
        <Vide texte="لا توجد طلبات مكتملة" tailleIcône={100} />
      ) : (
        <div className="orders-container">
          {filteredOrders.map(order => (
            <DemandeCard 
              key={order.id} 
              {...order} 

            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DemandePage() {
  const { handle401Error } = useErreur401Handler();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPricePopup, setShowPricePopup] = useState(false);
  const [showRefusePopup, setShowRefusePopup] = useState(false);
  const [showStockPopup, setShowStockPopup] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [currentOriginalId, setCurrentOriginalId] = useState(null);
  const [currentOrderType, setCurrentOrderType] = useState(null);
  const [currentCommandCode, setCurrentCommandCode] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [stockRequirements, setStockRequirements] = useState(null);
  const [currentModelCode, setCurrentModelCode] = useState(null);
  const [currentOrderUniqueId, setCurrentOrderUniqueId] = useState(null);
  const [targetStatus, setTargetStatus] = useState(""); // "قيد التنفيذ" ou "مكتملة"


  // Récupérer les données de l'API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        
        const response = await fetch('https://api.kadi-inv.store/adminapi/ordersClientsDropshippers/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return fetchOrders ();
        }
      }
     

        const data = await response.json();
        const transformedOrders = transformApiDataToCardFormat(data.orders);
        setOrders(transformedOrders);
      } catch (err) {
        setError(err.message);
        console.error('Erreur lors de la récupération des commandes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Fonction pour exécuter le refus de commande
  const executeRefuseAction = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const commandType = currentOrderType === "custom" ? "custom" : "standard";
      
      const response = await fetch(`https://api.kadi-inv.store/adminapi/refusecommand/${commandType}/${currentCommandCode}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return executeRefuseAction();
        }
      }

      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === currentOrderId 
            ? { ...order, statuscommand: "مرفوضة" } 
            : order
        )
      );
      
      setShowRefusePopup(false);
      
    } catch (err) {
      console.error('Erreur lors du refus de la commande:', err);
      alert('Une erreur est survenue lors du refus de la commande');
      setShowRefusePopup(false);
    }
  };

  // Fonction optimisée pour mettre à jour le statut de la commande
 // Dans la fonction handleStatusChange, ajoutez ce cas pour les commandes standard vers "مكتملة"
const handleStatusChange = useCallback(async (uniqueId, originalId, orderType, status, commandCode, modelCode) => {
  const order = orders.find(o => o.id === uniqueId);
  
  // Si l'utilisateur a choisi "مرفوضة" (refusée)
  if (status === "مرفوضة") {
    setCurrentOrderId(uniqueId);
    setCurrentOriginalId(originalId);
    setCurrentOrderType(orderType);
    setCurrentCommandCode(commandCode);
    setShowRefusePopup(true);
    return;
  } 
  
  // Si la commande est personnalisée, en attente, et le nouveau statut est "قيد التنفيذ" ou "مكتملة"
  if (order && order.isCustomcommand && order.statuscommand === "في الانتظار" && 
       (status === "قيد التنفيذ" || status === "مكتملة")) {
    setCurrentOrderId(uniqueId);
    setCurrentOriginalId(originalId);
    setCurrentOrderType(orderType);
    setCurrentCommandCode(commandCode);
    setNewStatus(status);
    setShowPricePopup(true);
    return;
  } 
  
  // Si la commande est personnalisée et le nouveau statut est "مكتملة" (depuis un autre état)
  if (order && order.isCustomcommand && status === "مكتملة") {
    try {
      const accessToken = localStorage.getItem("accessToken");
      
      const response = await fetch(
        `https://api.kadi-inv.store/adminapi/MakeCustomCommandDone/${commandCode}/`, 
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            price: order.price
          })
        }
      );

      if (response.ok) {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === uniqueId 
              ? { ...order, statuscommand: status } 
              : order
          )
        );
      } else {
        console.error('Erreur API:', response.status);
        alert('Une erreur est survenue lors de la mise à jour du statut');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      alert('Une erreur est survenue lors de la mise à jour du statut');
    }
    return;
  }
  
  // NOUVEAU CAS: Si la commande est standard et le nouveau statut est "مكتملة"
  if (order && !order.isCustomcommand && status === "مكتملة") {
    try {
      // Vérifier que le code modèle et le code commande existent
      if (!modelCode || modelCode === "غير محدد" || !commandCode) {
        throw new Error('Code modèle ou code commande non disponible');
      }
      
      const accessToken = localStorage.getItem("accessToken");
      
      // D'abord vérifier la disponibilité du stock si la commande est en attente
      if (order.statuscommand === "في الانتظار") {
        // Préparer les variantes pour la vérification
        const variantsForVerification = order.variants
          .filter(variant => variant.quantity > 0)
          .map(variant => ({
            size: variant.size || "",
            color: variant.color || "",
            quantity: parseInt(variant.quantity) || 0
          }));

        const verifyResponse = await fetch(
          `https://api.kadi-inv.store/adminapi/VerifiyIfVariantModelgreaterthanOrEqualToVariantQuantity/${modelCode}/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              variants: variantsForVerification
            })
          }
        );

         if (verifyResponse.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return verifyResponse ();
        }
      }
        if (!verifyResponse.ok) {
          const errorData = await verifyResponse.json().catch(() => ({}));
          console.error('Erreur de vérification:', verifyResponse.status, errorData);
          throw new Error(`Erreur de vérification: ${verifyResponse.status}`);
        }
       
      

        const verificationResult = await verifyResponse.json();
        console.log("Résultat de vérification:", verificationResult);

        if (!verificationResult.isOkay) {
          // Stock insuffisant, afficher le popup d'ajout
          setCurrentOrderUniqueId(uniqueId);
          setCurrentCommandCode(commandCode);
          setCurrentModelCode(modelCode);
          setStockRequirements(verificationResult);
          setTargetStatus("مكتملة"); // ← AJOUTEZ CETTE LIGNE
          setShowStockPopup(true);
          return; // Sortir sans mettre à jour le statut
        }
      }
      
      // Si le stock est suffisant ou si la commande n'est pas en attente, appeler l'API pour marquer comme "done"
      const doneResponse = await fetch(
        `https://api.kadi-inv.store/adminapi/MakeStandardCommandDone/${modelCode}/${commandCode}/`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

       if (doneResponse.status === 401) {
        const refreshSuccess = await handle401Error("/admin/login");
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return doneResponse();
        }
      }

      if (doneResponse.ok) {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === uniqueId 
              ? { ...order, statuscommand: status } 
              : order
          )
        );
      } else {
        console.error('Erreur API:', doneResponse.status);
        alert('Une erreur est survenue lors de la mise à jour du statut');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      alert('Une erreur est survenue lors de la mise à jour du statut: ' + err.message);
    }
    return;
  }
  
  // Pour les commandes standard vers "قيد التنفيذ" (logique existante)
  if (order && !order.isCustomcommand && status === "قيد التنفيذ") {
    try {
      if (!modelCode || modelCode === "غير محدد") {
        throw new Error('Code modèle non disponible pour cette commande');
      }
      
      setCurrentOrderUniqueId(uniqueId);
      setCurrentCommandCode(commandCode);
      setCurrentModelCode(modelCode);
      
      const accessToken = localStorage.getItem("accessToken");
      
      const variantsForVerification = order.variants
        .filter(variant => variant.quantity > 0)
        .map(variant => ({
          size: variant.size || "",
          color: variant.color || "",
          quantity: parseInt(variant.quantity) || 0
        }));

      const verifyResponse = await fetch(
        `https://api.kadi-inv.store/adminapi/VerifiyIfVariantModelgreaterthanOrEqualToVariantQuantity/${modelCode}/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            variants: variantsForVerification
          })
        }
      );

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json().catch(() => ({}));
        console.error('Erreur de vérification:', verifyResponse.status, errorData);
        throw new Error(`Erreur de vérification: ${verifyResponse.status} - ${JSON.stringify(errorData)}`);
      }

      const verificationResult = await verifyResponse.json();
      console.log("Résultat de vérification:", verificationResult);

      if (verificationResult.isOkay) {
       
        setStockRequirements(verificationResult);
    setTargetStatus("قيد التنفيذ"); // ← AJOUTEZ CETTE LIGNE
    setShowStockPopup(true);

        const updateResponse = await fetch(`https://api.kadi-inv.store/adminapi/inprogressCommandstandard/${commandCode}/`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (updateResponse.ok) {
          setOrders(prevOrders => 
            prevOrders.map(order => 
              order.id === uniqueId 
                ? { ...order, statuscommand: status } 
                : order
            )
          );
        } else {
          console.error('Erreur API:', updateResponse.status);
          alert('Une erreur est survenue lors de la mise à jour du statut');
        }
      } else {
        setStockRequirements(verificationResult);
        setShowStockPopup(true);
      }
    } catch (err) {
      console.error('Erreur lors de la vérification du stock:', err);
      alert('Erreur lors de la vérification du stock: ' + err.message);
    }
    return;
  }
  
  // Pour les autres changements de statut simples
  setOrders(prevOrders => 
    prevOrders.map(order => 
      order.id === uniqueId 
        ? { ...order, statuscommand: status } 
        : order
    )
  );
}, [orders]);



// Fonction pour confirmer le prix et mettre à jour la commande custom (MODIFIÉE)
const handlePriceConfirm = async (price, email, setApiErrors) => { // NOUVEAU: ajouter setApiErrors en paramètre
  if (currentOrderId && newStatus && currentCommandCode) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      let response;
      
      if (newStatus === "قيد التنفيذ") {
        response = await fetch(`https://api.kadi-inv.store/adminapi/inprogressCommandcustom/${currentCommandCode}/${price}/`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email
          })
        });

        // NOUVELLE GESTION DES ERREURS : utiliser setApiErrors au lieu de alert
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          
          if (response.status === 404) {
            // Erreur 404 - Couturière non trouvée
            setApiErrors({ 
              email: "لا يوجد حساب خياطة مسجل بهذا البريد الإلكتروني" 
            });
            return; // Ne pas fermer le popup
          } else if (response.status === 400) {
            // Erreur 400 - Prix invalide
            if (errorData.error && errorData.error.includes("Le prix doit être un nombre valide")) {
              setApiErrors({ 
                price: "يجب أن يكون السعر قيمة موجبة" 
              });
            } else if (errorData.error && errorData.error.includes("L'email de la couturière est requis")) {
              setApiErrors({ 
                email: "البريد الإلكتروني للخياطة مطلوب" 
              });
            } else {
              setApiErrors({ 
                general: errorData.error || "حدث خطأ في البيانات المرسلة" 
              });
            }
            return; // Ne pas fermer le popup
          } else {
            // Autres erreurs
            console.error('Erreur API:', response.status);
            setApiErrors({ 
              general: 'حدث خطأ أثناء تحديث الحالة' 
            });
            return;
          }
        }
      } else if (newStatus === "مكتملة") {
        
        // Garder l'ancienne logique pour "مكتملة"
        response = await fetch(
          `https://api.kadi-inv.store/adminapi/MakeCustomCommandDone/${currentCommandCode}/`, 
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              price: price,
              email:email
            })
          }
        );

        if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    if (response.status === 404) {
      setApiErrors({ 
        email: "لا يوجد حساب خياطة مسجل بهذا البريد الإلكتروني" 
      });
      return;
    } else if (response.status === 400) {
      if (errorData.error && errorData.error.includes("Le prix doit être un nombre positif")) {
        setApiErrors({ 
          price: "يجب أن يكون السعر قيمة موجبة" 
        });
      } else if (errorData.error && errorData.error.includes("Aucune couturière trouvée avec cet email")) {
        setApiErrors({ 
          email: "لا يوجد حساب خياطة مسجل بهذا البريد الإلكتروني" 
        });
      } else if (errorData.error && errorData.error.includes("Le prix est requis")) {
        setApiErrors({ 
          price: "السعر مطلوب" 
        });
      } else {
        setApiErrors({ 
          general: errorData.error || "حدث خطأ في البيانات المرسلة" 
        });
      }
      return;
    } else {
      console.error('Erreur API:', response.status);
      setApiErrors({ 
        general: 'حدث خطأ أثناء تحديث الحالة' 
      });
      return;
    }
  }
      }

      // Si on arrive ici, c'est que la requête a réussi
      if (response.ok) {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === currentOrderId 
              ? { ...order, statuscommand: newStatus, price: price } 
              : order
          )
        );
        // Fermer le popup seulement en cas de succès
        setShowPricePopup(false);
        setCurrentOrderId(null);
        setCurrentOriginalId(null);
        setCurrentOrderType(null);
        setNewStatus("");
        setCurrentCommandCode(null);
      }
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      setApiErrors({ 
        general: 'حدث خطأ في الاتصال بالخادم' 
      });
      // Ne pas fermer le popup en cas d'erreur réseau
    }
  }
};

  // Fonction pour gérer l'ajout de stock
  // Fonction pour gérer l'ajout de stock
const handleStockAdd = async (stockAdditions) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    
    // Ajouter les variantes au stock
    const addResponse = await fetch(
      `https://api.kadi-inv.store/adminapi/modifyModelToBeAbleToMakeTheOrderOfClient/${currentModelCode}/`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variants: stockAdditions
        })
      }
    );

    if (!addResponse.ok) {
      throw new Error(`Erreur d'ajout: ${addResponse.status}`);
    }

    // Appeler la deuxième API
    const changeModelResponse = await fetch(
      `https://api.kadi-inv.store/adminapi/chnageModelFromNotVisibleToAccepted/${currentModelCode}/`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      }
    );

    if (!changeModelResponse.ok) {
      console.warn('Le premier appel a réussi mais le deuxième a échoué:', changeModelResponse.status);
    }

    // MODIFICATION ICI : Utiliser targetStatus au lieu de "قيد التنفيذ"
    let updateResponse;
    if (targetStatus === "مكتملة") {
      updateResponse = await fetch(
        `https://api.kadi-inv.store/adminapi/MakeStandardCommandDone/${currentModelCode}/${currentCommandCode}/`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } else {
      updateResponse = await fetch(`https://api.kadi-inv.store/adminapi/inprogressCommandstandard/${currentCommandCode}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    }

    if (updateResponse.ok) {
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === currentOrderUniqueId 
            ? { ...order, statuscommand: targetStatus } // ← ICI AUSSI
            : order
        )
      );
      setShowStockPopup(false);
      setStockRequirements(null);
      setTargetStatus(""); // ← Réinitialiser le statut cible
    } else {
      throw new Error(`Erreur de mise à jour: ${updateResponse.status}`);
    }

  } catch (err) {
    console.error('Erreur lors de l\'ajout du stock:', err);
    alert('Une erreur est survenue lors de l\'ajout du stock');
    setShowStockPopup(false);
    setTargetStatus(""); // ← Réinitialiser en cas d'erreur
  }
};

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>جاري تحميل الطلبات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>خطأ في تحميل البيانات</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>إعادة المحاولة</button>
      </div>
    );
  }

  return (
    <>
      <ContainerPagesAdmin
        titre="ادارة الطلبات"
        soustitre="متابعة و ادارة جميع طلبات العملاء و الدروبشيبينغ"
        elemnts={["جميع الطلبات", "في الانتظار", "قيد التنفيذ", "مكتملة"]}
        contenus={[
          <AllOrders orders={orders} onStatusChange={handleStatusChange} />,
          <Enattente orders={orders} onStatusChange={handleStatusChange} />,
          <Encours orders={orders} onStatusChange={handleStatusChange} />,
          <Finish orders={orders} />
        ]}
      />
      
      <PricePopup
        isOpen={showPricePopup}
        onClose={() => setShowPricePopup(false)}
        onConfirm={handlePriceConfirm}
        currentPrice={currentOrderId ? orders.find(o => o.id === currentOrderId)?.price : 0}
      />

      <StockPopup
        isOpen={showStockPopup}
        onClose={() => setShowStockPopup(false)}
        onConfirm={handleStockAdd}
        stockRequirements={stockRequirements}
        modelCode={currentModelCode}
      />

      {showRefusePopup && (
        <Popup
          title="تأكيد رفض الطلبية"
          iconPopup={donepopup}
          sousTitre="هل أنت متأكد من رفض هذه الطلبية؟ لا يمكن التراجع عن بعد رفض الطلبية."
          buttons={[
            {
              text: "أتراجع",
              onClick: () => setShowRefusePopup(false),
              backgroundColor: "#FFFFFF",
              textColor: "#444444",
              width: "fit-content",
              border: "2px solid",
              borderColor: "Black",
              customClass: "with-border"
            },
            {
              text: "أؤكد الرفض",
              onClick: executeRefuseAction,
              backgroundColor: "#EF4444",
              textColor: "#FFFFFF",
              width: "fit-content",
              border: "2px solid",
              borderColor: "Black",
              customClass: "with-border"
            }
          ]}
          onClose={() => setShowRefusePopup(false)}
          buttonLayout="horizontal"
          buttonGap="20px"
        />
      )}
    </>
  );
}
