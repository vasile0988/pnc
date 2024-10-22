// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import BefLayout from './befLayout';
// import { LoadingIndicator } from '@/components/loader';
// import './globals.css';
// import { usePathname, useSearchParams } from 'next/navigation';

// export default function RootLayout({ children }) {
//   const { i18n } = useTranslation();
//   const [documentLang, setDocumentLang] = useState('en');
//   const [loading, setLoading] = useState(false);
  
//   // Utilisez usePathname et useSearchParams pour suivre les changements de route
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   // Effet pour gérer l'indicateur de chargement
//   useEffect(() => {
//     const handleRouteChange = () => {
//       setLoading(true);
//       // Simulez un délai de chargement minimum pour une meilleure UX
//       setTimeout(() => setLoading(false), 300);
//     };

//     // Déclenchez handleRouteChange lorsque le pathname ou les searchParams changent
//     handleRouteChange();

//     // Nettoyage non nécessaire car nous n'ajoutons pas d'écouteurs d'événements
//   }, [pathname, searchParams]);

//   // Effet pour mettre à jour la langue du document
//   useEffect(() => {
//     setDocumentLang(i18n.language || 'en');
//   }, [i18n.language]);

//   return (
//     <html lang={documentLang}>
//       <body className="antialiased font-dmsans bg-theme3 !tabular-nums overflow-x-hidden">
//         <LoadingIndicator loading={loading} />
//         <BefLayout>
//           {children}
//         </BefLayout>
//       </body>
//     </html>
//   );
// }
// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import BefLayout from './befLayout';
// import { ProgressLoadingIndicator } from '@/components/loader';
// import './globals.css';
// import { usePathname, useSearchParams } from 'next/navigation';

// export default function RootLayout({ children }) {
//   const { i18n } = useTranslation();
//   const [documentLang, setDocumentLang] = useState('en');
//   const [loading, setLoading] = useState(false);
  
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const handleRouteChange = () => {
//       setLoading(true);
//       // Simuler un temps de chargement minimum
//       setTimeout(() => setLoading(false), 1000);
//     };

//     handleRouteChange();
//   }, [pathname, searchParams]);

//   useEffect(() => {
//     setDocumentLang(i18n.language || 'en');
//   }, [i18n.language]);

//   return (
//     <html lang={documentLang}>
//       <body className="antialiased font-dmsans bg-theme3 !tabular-nums overflow-x-hidden">
//         <ProgressLoadingIndicator loading={loading} />
//         <BefLayout>
//           {children}
//         </BefLayout>
//       </body>
//     </html>
//   );
// }

// app/layout.js
'use client';
import React, { useEffect, useState, Suspense } from 'react'; // Ajout de Suspense
import { useTranslation } from 'react-i18next';
import BefLayout from './befLayout';
import { ProgressLoadingIndicator } from '@/components/loader';
import './globals.css';
import { usePathname, useSearchParams } from 'next/navigation';

// Composant de chargement pour Suspense
const Loading = () => {
  return <div>Chargement...</div>;
};

// Composant qui utilise useSearchParams
const NavigationAwareComponent = ({ children }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleRouteChange = () => {
      setLoading(true);
      // Simuler un temps de chargement minimum
      setTimeout(() => setLoading(false), 1000);
    };

    handleRouteChange();
  }, [pathname, searchParams]);

  return (
    <>
      <ProgressLoadingIndicator loading={loading} />
      {children}
    </>
  );
};

export default function RootLayout({ children }) {
  const { i18n } = useTranslation();
  const [documentLang, setDocumentLang] = useState('en');

  useEffect(() => {
    setDocumentLang(i18n.language || 'en');
  }, [i18n.language]);

  return (
    <html lang={documentLang}>
      <body className="antialiased font-dmsans bg-theme3 !tabular-nums overflow-x-hidden">
        {/* Envelopper avec Suspense le composant qui utilise useSearchParams */}
        <Suspense fallback={<Loading />}>
          <NavigationAwareComponent>
            <BefLayout>
              {children}
            </BefLayout>
          </NavigationAwareComponent>
        </Suspense>
      </body>
    </html>
  );
}