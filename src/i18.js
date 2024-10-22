// src/i18.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false, // Activez le mode debug temporairement
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr', 'es', 'de', 'pt'],
    defaultNS: 'common',
    ns: ['common'],
    interpolation: {
      escapeValue: false,
    },
    // Configuration importante pour Next.js
    react: {
      useSuspense: false, // Désactivez Suspense car il peut causer des problèmes avec SSR
    },
    // Spécifiez le chemin correct vers vos fichiers de traduction
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
});

export default i18n;




// // src/i18n.js
// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';

// i18n
//   .use(LanguageDetector)
//   .use(initReactI18next)
//   .init({
//     debug: process.env.NODE_ENV === 'development',
//     fallbackLng: 'en',
//     supportedLngs: ['en', 'fr', 'es', 'de', 'pt'],
//     defaultNS: 'common',
//     ns: ['common'],
//     interpolation: {
//       escapeValue: false,
//     },
//     resources: {
//       fr: {
//         common: {
//           navigation: {
//             menu: "Menu",
//             banking: {
//               title: "Banque",
//               virtualWallet: "Portefeuille virtuel",
//               checking: "Compte courant",
//               saving: "Épargne",
//               creditCards: "Cartes de crédit",
//               studentBanking: "Banque étudiante",
//               militaryBanking: "Banque militaire"
//             },
//             borrowing: {
//               title: "Emprunt",
//               mortgagePurchase: "Achat et refinancement hypothécaire",
//               homeEquity: "Lignes de crédit sur valeur domiciliaire",
//               constructionLoans: "Prêts de construction et de terrain",
//               autoLoans: "Prêts auto",
//               personalLoans: "Prêts personnels et lignes de crédit",
//               studentLoans: "Prêts étudiants",
//               studentLoanRefinancing: "Refinancement de prêts étudiants"
//             },
//             investing: {
//               title: "Investissement et gestion de patrimoine",
//               pncInvestments: "Investissements PNC",
//               pncPrivateBank: "Banque privée PNC"
//             },
//             aboutUs: "À propos de nous",
//             contactUs: "Contactez-nous",
//             login: "Se connecter"
//           },
//           heroBanner: {
//             title: "Change the Way You Bank",
//             text: "Take your next step with  PNC Virtual Wallet - checking, savings and financial tools designed to go wherever you do.",
//             learnMore: "Learn more"
//           }
//         },
//       },
//       es: {
//         common: {
//           navigation: {
//             menu: "Menú",
//             banking: {
//               title: "Banca",
//               virtualWallet: "Billetera virtual",
//               checking: "Cuenta corriente",
//               saving: "Ahorro",
//               creditCards: "Tarjetas de crédito",
//               studentBanking: "Banca estudiantil",
//               militaryBanking: "Banca militar"
//             },
//             borrowing: {
//               title: "Préstamos",
//               mortgagePurchase: "Compra y refinanciamiento de hipotecas",
//               homeEquity: "Líneas de crédito sobre el valor de la vivienda",
//               constructionLoans: "Préstamos de construcción y terrenos",
//               autoLoans: "Préstamos para automóviles",
//               personalLoans: "Préstamos personales y líneas de crédito",
//               studentLoans: "Préstamos estudiantiles",
//               studentLoanRefinancing: "Refinanciamiento de préstamos estudiantiles"
//             },
//             investing: {
//               title: "Inversiones y gestión de patrimonio",
//               pncInvestments: "Inversiones PNC",
//               pncPrivateBank: "Banco privado PNC"
//             },
//             aboutUs: "Sobre nosotros",
//             contactUs: "Contáctenos",
//             login: "Iniciar sesión"
//           }
//         }
//       },
//       // Ajoutez les autres langues de la même manière
//     }
//   });

// export default i18n;