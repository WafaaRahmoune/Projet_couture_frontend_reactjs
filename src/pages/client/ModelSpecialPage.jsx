import React, { useState, useRef } from 'react';
import Popup from "../../components/generalComponents/Popup";
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/generalComponents/Inputfield';
import Navbarshop from '../../components/shoppingComp/Navbarshop';
import plus from '../../assets/icons/plus.png';
import remove from '../../assets/icons/remove.png';
import "../../style/FormAcheterStyle/FormAcheter.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import donepopup from "../../assets/icons/donepopup.png";
import useErreur401Handler from '../../components/generalComponents/Erreur401Handle';


const wilayas = [
  "أدرار", "الشلف", "الأغواط", "أم البواقي", "باتنة", "بجاية", "بسكرة", "بشار",
  "البليدة", "البويرة", "تمنراست", "تبسة", "تلمسان", "تيارت", "تيزي وزو", "الجزائر",
  "الجلفة", "جيجل", "سطيف", "سعيدة", "سكيكدة", "سيدي بلعباس", "عنابة", "قالمة",
  "قسنطينة", "المدية", "مستغانم", "المسيلة", "معسكر", "ورقلة", "وهران", "البيض",
  "إليزي", "برج بوعريريج", "بومرداس", "الطارف", "تندوف", "تيسمسيلت",
  "الوادي", "خنشلة", "سوق أهراس", "تيبازة", "ميلة", "عين الدفلى", "النعامة", "عين تموشنت",
  "غرداية", "غليزان", "تيميمون", "برج باجي مختار", "أولاد جلال", "بني عباس",
  "عين صالح", "عين قزّام", "تقرت", "جانت", "المغير", "المنيعة"
];

const sizes = ["S", "M", "L", "XL", "XXL", "3XL", "4XL"];

function ModelSpecialPage() {
  const navigate = useNavigate();
  const [shake, setShake] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { handle401Error } = useErreur401Handler();


  const [products, setProducts] = useState([{ 
    id: Date.now(),
    size: "",
    quantity: ""
  }]);

  const [form, setForm] = useState({
    nameorder: "",
    phone: "",
    wilaya: "",
    address: "",
    deadline: "",
    images: [],
    description: "",
  });

  const [errors, setErrors] = useState({
    nameorder: "",
    phone: "",
    wilaya: "",
    address: "",
    size: "",
    quantity: "",
    deadline: "",
    images: "",
    description: "",
  });

  const handleAddLine = () => {
    setProducts([...products, { 
      id: Date.now(),
      size: "",
      quantity: ""
    }]);
  };

  const handleRemoveLine = (id) => {
    if (products.length > 1) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const handleProductChange = (id, name, value) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, [name]: value } : product
    ));
    validateProductField(id, name);
  };

  const validateProductField = (id, name) => {
    let error = "";
    setErrors(prev => ({
      ...prev,
      [`${name}-${id}`]: error
    }));
  };

  const validateFileExtension = (files) => {
    if (!files || files.length === 0) return false;
    
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    
    for (let i = 0; i < files.length; i++) {
      const fileName = files[i].name.toLowerCase();
      const isValid = allowedExtensions.some(ext => fileName.endsWith(ext));
      if (!isValid) return false;
    }
    
    return true;
  };

  const validateField = (name, value) => {
    let error = "";

    if (name === "phone") {
      const regex = /^0[5-7][0-9]{8}$/;
      if (!regex.test(value)) error = "يجب أن يتكون الرقم من 10 أرقام";
    }
    if (name === "description") {
      if (value && value.length > 500) {
        error = "الوصف يجب ألا يتجاوز 500 حرفاً";
      }
    }
    
    if (name === "deadline") {
      if (value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate <= today) {
          error = "يجب أن يكون التاريخ في المستقبل";
        }
      }
    }

    if (name === "nameorder") {
      if (value && value.length > 20) {
        error = "اسم الموديل يجب ألا يتجاوز 20 حرفاً";
      }
    }

     if (name === "address") {
      if (value === "" || value.trim() === "") { 
        error = "الرجاء ملء هذا الحقل لإتمام العملية بنجاح";
      } else if (/^\d+$/.test(value.replace(/\s/g, ''))) {
        error = "العنوان لا يجب أن يحتوي على أرقام فقط";
      } else if (!/[\u0600-\u06FF]/.test(value)) {
        error = "يرجى إدخال العنوان باللغة العربية";
      }
    }

    if (name === "images") {
      if (value && !validateFileExtension(value)) {
        error = "يُسمح فقط بملفات PDF أو الصور (JPG, PNG, GIF, BMP, WEBP)";
      }
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleInputChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleFileChange = (files) => {
    if (files && files.length > 0) {
      handleInputChange('images', [...form.images, ...files]);
    }
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...form.images];
    newFiles.splice(index, 1);
    handleInputChange('images', newFiles);
  };

  const isFormValid = () => {
  const requiredFields = {
    nameorder: form.nameorder,
    phone: form.phone,
    wilaya: form.wilaya,
    address: form.address,
    images: form.images,
    deadline: form.deadline,
    description: form.description,
  };

  const newErrors = {};

  // Validation des champs obligatoires du formulaire principal
  Object.entries(requiredFields).forEach(([key, value]) => {
    // ... (votre code existant)
  });

  // Validation des champs dans les produits
  products.forEach((product) => {
    if (!product.size || product.size.trim() === "") {
      newErrors[`size-${product.id}`] = "الرجاء ملء الحقلين معا: المقاس، وعدد القطع لإتمام الطلب.";
    }
    
    if (!product.quantity || product.quantity.trim() === "") {
      newErrors[`quantity-${product.id}`] = "الرجاء ملء الحقلين معا: المقاس، وعدد القطع لإتمام الطلب.";
    } else if (parseInt(product.quantity) <= 0) {
      // Message spécifique pour la quantité négative ou nulle
      newErrors[`quantity-${product.id}`] = "عدد القطع يجب أن يكون أكبر من 0";
    }
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
  // Fonction pour envoyer les données à l'API
 const submitOrder = async () => {
  setIsLoading(true);
  
  try {
    const formData = new FormData();
    
    // Ajouter les champs texte
    formData.append('nameorder', form.nameorder);
    formData.append('description', form.description);
    formData.append('deadline', form.deadline);
    formData.append('numTelephone', form.phone);
    formData.append('wilaya_name', form.wilaya);
    formData.append('exactaddress', form.address);
    formData.append('command_type', 'personalized');
    
    // Ajouter les variants (tailles et quantités)
    const variants = products.map(product => ({
      size: product.size,
      quantity: parseInt(product.quantity)
    }));
    formData.append('variants', JSON.stringify(variants));

    // Ajouter les images
    form.images.forEach((image, index) => {
      formData.append('images', image);
    });
    
    // Afficher le contenu de FormData
    console.log("=== DONNÉES ENVOYÉES À L'API ===");
    
    // Afficher les champs texte
    console.log("nameorder:", form.nameorder);
    console.log("description:", form.description);
    console.log("deadline:", form.deadline);
    console.log("numTelephone:", form.phone);
    console.log("wilaya_name:", form.wilaya);
    console.log("exactaddress:", form.address);
    console.log("command_type:", "personalized");
    console.log("variants:", variants);
    
    // Afficher les informations sur les fichiers
    console.log("images:", form.images.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size
    })));
    

const token = localStorage.getItem("accessToken");
  

    const response = await fetch(`https://api.kadi-inv.store/clientapi/specialcommand/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        
        
      },
      body: formData
    });


    
    
    const data = await response.json();
    


 if (!data.ok) {
         if (response.status === 401) {
        const refreshSuccess = await handle401Error();
        if (refreshSuccess) {
          // Réessayer la requête avec le nouveau token
          return submitOrder();
        }
         }} 

    
    
    console.log('Commande créée avec succès:', data);
    setShowPopup(true);
    
  } catch (error) {
  console.error('Erreur lors de la création de la commande:', error);
  
  // Afficher la réponse du serveur si disponible
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
    console.error('Headers:', error.response.headers);
  } else if (error.request) {
    console.error('Request:', error.request);
  }
  
  alert("Une erreur s'est produite lors de l'envoi de votre commande. Veuillez réessayer.");
}

 
};

  return (
    <>
      <Navbarshop defaultSection="" />
      <div className="containershop">
        <div className="shop-wrapper">
          <ArrowBackIcon className='retouricon' onClick={() => navigate(-2)} style={{cursor: 'pointer'}} />
          <div className='containerformachat'>

            <section className="form-header">
              <h1>تصميم خاص</h1>
              <p>يمكنك ملء المعلومات الضرورية لطلب تصميم خاص بك</p>
            </section>

            <form className="purchase-form" onSubmit={(e) => e.preventDefault()}>
              <div className="field-wrapper">
                <InputField
                  titre="اسم الموديل:"
                  placeholder='فستان أنيق'
                  type="text"
                  name="nameorder"
                  size="oneline"
                  down={false}
                  value={form.nameorder}
                  onChange={(e) => handleInputChange('nameorder', e.target.value)}
                  hasError={isSubmitted && !!errors.nameorder}
                />
                {isSubmitted && errors.nameorder && (
                  <p className="error">{errors.nameorder}</p>
                )}
              </div>
              <div className="field-wrapper">
                <InputField
                  titre="الوصف:"
                  placeholder="أدخل وصفاً مفصلاً لطلبك"
                  type="text"
                  name="description"
                  size="oneline"
                  down={false}
                  value={form.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  hasError={isSubmitted && !!errors.description}
                />
                {isSubmitted && errors.description && (
                  <p className="error">{errors.description}</p>
                )}
              </div>

              {products.map((product) => (
                <div className="flex-row" key={product.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <InputField 
                    titre="المقاس:" 
                    special={true}
                    placeholderSpecial='اختر'
                    type="text" 
                    name="size" 
                    placeholder="S" 
                    size="quarter" 
                    down={false} 
                    value={product.size} 
                    onChange={(e) => handleProductChange(product.id, 'size', e.target.value)}
                    hasError={isSubmitted && !!errors[`size-${product.id}`]}
                    options={sizes}
                  />
                   
                  <InputField 
                    titre="عدد القطع:" 
                    type="number"  
                    name="quantity"
                    placeholder="1" 
                    size="quarter" 
                    down={false}  
                    value={product.quantity} 
                    onChange={(e) => handleProductChange(product.id, 'quantity', e.target.value)}
                    hasError={isSubmitted && !!errors[`quantity-${product.id}`]}
                  />

                  {product.id === products[products.length - 1].id && (
                    <img
                      src={plus}
                      alt="plus"
                      className="iconplus"
                      onClick={handleAddLine}
                      style={{ cursor: "pointer", width: "25px", height: "25px" }}
                    />
                  )}
                  {products.length > 1 && (
                    <img
                      src={remove}
                      alt="minus"
                      className="minus"
                      onClick={() => handleRemoveLine(product.id)}
                      style={{ cursor: 'pointer', width: '25px', height: '25px' }}
                    />
                  )}
                 <div className='errorsauterlaligne'>
  {errors[`size-${product.id}`] && (
    <p className="error">{errors[`size-${product.id}`]}</p>
  )}
  {errors[`quantity-${product.id}`] && (
    <p className="error">{errors[`quantity-${product.id}`]}</p>
  )}
</div>
                  <div className='espace'></div>
                </div>
              ))}

              <div className="field-wrapper">
                <InputField
                  titre="ارفاق صورة أو ملف PDF:"
                  type="file"
                  name="images"
                  size="oneline"
                  onChange={handleFileChange}
                  hasError={isSubmitted && !!errors.images}
                  accept="image/*,application/pdf"
                  multiple={true}
                  uploadedFiles={form.images}
                  onRemoveFile={handleRemoveFile}
                  inputRef={fileInputRef}
                />
                {isSubmitted && errors.images && (
                  <p className="error">{errors.images}</p>
                )}
              </div>

              <div className="field-wrapper">
                <InputField
                  titre="التاريخ الأقصى للتسليم:"
                  placeholder="jj/mm/yyyy"
                  type="date"
                  name="deadline"
                  size="oneline"
                  value={form.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                  hasError={isSubmitted && !!errors.deadline}
                />
                {isSubmitted && errors.deadline && (
                  <p className="error">{errors.deadline}</p>
                )}
              </div>

              <div className="field-wrapper">
                <InputField
                  titre="رقم الهاتف:"
                  placeholder="مثال: 0695449925"
                  type="number"
                  name="phone"
                  size="oneline"
                  down={false}
                  value={form.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  hasError={isSubmitted && !!errors.phone}
                />
                {isSubmitted && errors.phone && (
                  <p className="error">{errors.phone}</p>
                )}
              </div>

              <div className="field-wrapper">
                <InputField
                  titre="الولاية:"
                  name="wilaya"
                  special={true}
                  placeholderSpecial="اختر الولاية"
                  down={true}
                  size="oneline"
                  value={form.wilaya}
                  onChange={(e) => handleInputChange('wilaya', e.target.value)}
                  options={wilayas}
                  hasError={isSubmitted && !!errors.wilaya}
                />
                {isSubmitted && errors.wilaya && (
                  <p className="error">{errors.wilaya}</p>
                )}
              </div>

              <div className="field-wrapper">
                <InputField
                  titre="العنوان:"
                  placeholder='البلدية و اسم الحي أو الشارع'
                  type="text"
                  name="address"
                  size="oneline"
                  down={false}
                  value={form.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  hasError={isSubmitted && !!errors.address}
                />
                {isSubmitted && errors.address && (
                  <p className="error">{errors.address}</p>
                )}
              </div>

              <div className="button-group">
                <button
                  type="submit"
                  className={`btn-confirm ${shake ? "shake" : ""}`}
                  onClick={async (e) => {
                    e.preventDefault();
                    setIsSubmitted(true);

                    if (isFormValid()) {
                      await submitOrder();
                    } else {
                      setShake(true);
                      setTimeout(() => setShake(false), 500);
                    }
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? 'جاري الإرسال...' : 'تأكيد الطلب'}
                </button>
               {showPopup && (
  <Popup
    title="تم استلام طلبيتك "
    iconPopup={donepopup}
    contenu="سنتواصل معك قريبا عير الهاتف أو الواتساب لمناقشة جميع التفاصيل و تحديد السعر المناسب .يرجى البقاء متاحا و شكرا ."
    buttons={[
      {
        text: "حسنا",
        navigateTo: "/mycommands", // ← Utilise navigateTo au lieu de onConfirm
        backgroundColor: "#22C55E",
        textColor: "#FFFFFF"
      }
    ]}
    onClose={() => setShowPopup(false)}
     onConfirm={() => {
                        setShowPopup(false);
                    }}
  />
)}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModelSpecialPage;
