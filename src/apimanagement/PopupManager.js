// PopupManager.js
let popupCallback = null;

export const showReconnectPopup = (onConfirm) => {
  // Crée et affiche le popup
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.top = '0';
  popup.style.left = '0';
  popup.style.width = '100%';
  popup.style.height = '100%';
  popup.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  popup.style.display = 'flex';
  popup.style.justifyContent = 'center';
  popup.style.alignItems = 'center';
  popup.style.zIndex = '1000';
  
  popup.innerHTML = `
    <div style="background: white; padding: 20px; border-radius: 10px; text-align: center; max-width: 400px;">
      <h3 style="color: #333; margin-bottom: 15px;">جلسة منتهية</h3>
      <p style="color: #666; margin-bottom: 20px;">انتهت جلستك. يرجى إعادة تسجيل الدخول للمتابعة.</p>
      <button style="background: #22C55E; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
        موافق
      </button>
    </div>
  `;
  
  const button = popup.querySelector('button');
  button.onclick = () => {
    document.body.removeChild(popup);
    if (onConfirm) onConfirm();
  };
  
  document.body.appendChild(popup);
  popupCallback = onConfirm;
};

export const hideReconnectPopup = () => {
  if (popupCallback) {
    popupCallback = null;
  }
  const existingPopup = document.querySelector('[style*="position: fixed"][style*="background-color: rgba(0, 0, 0, 0.5)"]');
  if (existingPopup) {
    document.body.removeChild(existingPopup);
  }
};