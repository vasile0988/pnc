// components/AlertMessage.jsx
import React, { useEffect } from 'react';

/**
 * Composant réutilisable pour afficher des messages d'alerte
 * @param {string} message - Le message à afficher
 * @param {string} type - Le type de message ('success' ou 'error')
 * @param {function} onClose - Fonction pour fermer le message
 * @param {number} duration - Durée d'affichage en ms (défaut: 5000)
 */
export const AlertMessage = ({ message, type = 'success', onClose, duration = 5000 }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const styles = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700'
  };

  return (
    <div 
      className={`fixed bottom-5 max-w-[80%] right-5 ${styles[type]} px-4 py-3 rounded-xl transition-opacity duration-300 ease-in-out border`} 
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
    </div>
  );
};