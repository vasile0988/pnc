// // components/ProgressBar.js
// export const ProgressBar = ({ progress, isVisible }) => {
//     return (
//         <div className="relative w-full h-6 bg-gray-100 rounded-full overflow-hidden shadow-inner">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-blue-100 animate-pulse"></div>
//             <div
//                 className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000 ease-out"
//                 style={{
//                     width: isVisible ? `${progress}%` : '0%',
//                     boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)'
//                 }}
//             >
//                 <div className="absolute top-0 right-0 bottom-0 w-20 animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12"></div>
//             </div>
//             <div className="absolute inset-0 flex items-center justify-center">
//                 <span className="text-sm font-bold text-white drop-shadow-md">
//                     {isVisible ? `${progress}%` : '0%'}
//                 </span>
//             </div>
//         </div>
//     );
// };


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Composant de barre de progression avec animation de particules
export const ProgressBar = ({ progress, isVisible }) => {
  const [particles, setParticles] = useState([]);

  // Génération de particules pour l'effet visuel
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setParticles((prev) => [
          ...prev,
          {
            id: Date.now(),
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 2,
          },
        ].slice(-20));
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden shadow-lg">
      {/* Fond animé */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-20"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%'],
        }}
        transition={{ duration: 3, ease: 'linear', repeat: Infinity }}
      />
      {/* Barre de progression principale */}
      <motion.div
        className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-600"
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      >
        {/* Effet de brillance */}
        <div className="absolute top-0 right-0 bottom-0 w-20 animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12"></div>
      </motion.div>
      {/* Animation des particules */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-white rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            initial={{ opacity: 0.8, scale: 0 }}
            animate={{ opacity: 0, scale: 2, y: -20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        ))}
      </AnimatePresence>
      {/* Affichage du pourcentage */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-sm font-bold text-gray-800 drop-shadow-md"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {`${progress}%`}
        </motion.span>
      </div>
    </div>
  );
};
