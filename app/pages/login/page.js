// app/pages/login/page.js

import Head from 'next/head';
import {LoginPage} from './loginPage';

// Définition des métadonnées de base pour la page
export const metadata = {
  description: 'Login page - PNC',
  keywords: '',
  icons: {
    icon: '/assets/images/favicon.png',
  },
};

// Le composant principal de la page d'accueil
export default function Index() {
  return (
    <>
      <Head>
        <title></title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <link rel="icon" href={metadata.icons.icon} />
      </Head>
      <LoginPage />
    </>
  );
}
