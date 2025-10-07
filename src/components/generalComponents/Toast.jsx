// src/components/generalComponents/Toast.jsx
import React, { useEffect } from 'react';
import '../../style/generalStyle/Toast.css';

const Toast = ({ 
  show, 
  onClose, 
  type = 'success', 
  title, 
  message, 
  duration = 5000,
  position = 'bottom-right'
}) => {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '✓';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success':
        return '#28a745';
      case 'error':
        return '#dc3545';
      case 'warning':
        return '#ffc107';
      case 'info':
        return '#17a2b8';
      default:
        return '#28a745';
    }
  };

  return (
    <div className={`toast toast-${position} toast-${type} show`}>
      <div className="toast-content">
        <div 
          className="toast-icon"
          style={{ backgroundColor: getColor() }}
        >
          {getIcon()}
        </div>
        <div className="toast-text">
          {title && <p className="toast-title">{title}</p>}
          <p className="toast-message">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;