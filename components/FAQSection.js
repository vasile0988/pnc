// src/components/FAQsectionImgItems.banking.js

'use client'
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ['latin'], weight: ['700'], display: 'swap' });

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`text-dark w-full`}>
      <button
        className={`w-full text-left p-4 bg-theme-prefer-nohover ${isOpen? 'rounded-t-2xl': 'rounded-2xl'} flex justify-between items-center transition-all duration-300 `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <span className='p-2 rounded-full bg-theme-prefer-contrast'>
          {!isOpen ? (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 448 512" 
              className="w-4 h-4 transition-all duration-300 ease-in-out transform"
            >
              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
            </svg>
          ) : (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 448 512" 
              className="w-4 h-4 transition-all duration-300 ease-in-out transform rotate-180"
            >
              <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
            </svg>
          )}
        </span>
      </button>
      <div
        className={`overflow-hidden text-sm text-justify bg-theme-prefer-fade transition-all duration-300 ease-in-out 
        ${isOpen ? 'max-h-96 opacity-100 mt-0 rounded-b-2xl' : 'max-h-0 opacity-0 mt-1 rounded-2xl'}`}
      >
        <p className="p-4">{answer}</p>
      </div>
    </div>
  );
};

const FAQSection = ({ title, faqData, className, loaderAnima  }) => {
    
  const { t, i18n } = useTranslation(); // Utilisation de useTranslation pour gérer les traductions
  const [isMounted, setIsMounted] = useState(false); // État pour vérifier si le composant est monté côté client
  
  // Gère l'état de montage du composant pour éviter les erreurs d'hydratation
  useEffect(() => {
      setIsMounted(true); // Marque le composant comme monté
  }, []);

  // Si le système de traduction n'est pas encore prêt ou que le composant n'est pas monté, ne rien rendre pour éviter les erreurs d'hydratation
  if (!i18n.isInitialized || !isMounted) {
      return (
        <section className={`w-full mx-auto !overflow-hidden lg:px-0 px-4 ${className}`}>
          <div className={`w-full flex h-full lg:w-4/6 flex-col lg:flex-row items-center justify-around md:mx-auto`}>
            <div className={`mx-auto flex flex-col items-center justify-center gap-4 h-full container`}>
              <div className='container h-10 w-44 rounded-2xl relative overflow-hidden'>
                <div className={`absolute shadow-theme ${loaderAnima === 2 ? 'spinner-loading' : 'spinner-loading2'}`}></div>
              </div>
              <div className='container h-8 w-80 mb-4 rounded-2xl relative overflow-hidden'>
                <div className={`absolute shadow-theme ${loaderAnima === 2 ? 'spinner-loading' : 'spinner-loading2'}`}></div>
              </div>
              <div className='mt-4 mx-auto h-80 flex gap-4 flex-col items-center container'>
                <div className='container h-12 w-full mb-4 rounded-2xl relative overflow-hidden'>
                  <div className={`absolute shadow-theme ${loaderAnima === 2 ? 'spinner-loading' : 'spinner-loading2'}`}></div>
                  <div className='cur-pointer rounded-full bg-theme-prefer w-8 h-8 absolute right-4 top-2/4 -translate-y-2/4'></div>
                </div>
                <div className='container h-12 w-full mb-4 rounded-2xl relative overflow-hidden'>
                  <div className={`absolute shadow-theme ${loaderAnima === 2 ? 'spinner-loading' : 'spinner-loading2'}`}></div>
                  <div className='cur-pointer rounded-full bg-theme-prefer w-8 h-8 absolute right-4 top-2/4 -translate-y-2/4'></div>
                </div>
                <div className='container h-12 w-full mb-4 rounded-2xl relative overflow-hidden'>
                  <div className={`absolute shadow-theme ${loaderAnima === 2 ? 'spinner-loading' : 'spinner-loading2'}`}></div>
                  <div className='cur-pointer rounded-full bg-theme-prefer w-8 h-8 absolute right-4 top-2/4 -translate-y-2/4'></div>
                </div>
                <div className='container h-12 w-full mb-4 rounded-2xl relative overflow-hidden'>
                  <div className={`absolute shadow-theme ${loaderAnima === 2 ? 'spinner-loading' : 'spinner-loading2'}`}></div>
                  <div className='cur-pointer rounded-full bg-theme-prefer w-8 h-8 absolute right-4 top-2/4 -translate-y-2/4'></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
  }

  return (
    <section className={`w-full mx-auto !overflow-hidden lg:px-0 px-4 ${className}`}>
      <div className={`w-full flex lg:w-4/6 flex-col items-center justify-around md:mx-auto`}>
        <h2 className={`${montserrat.className} text-3xl font-bold mb-6 text-center`}>{title}</h2>
        <div className='flex flex-col gap-4'>
          {faqData.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer}  />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;