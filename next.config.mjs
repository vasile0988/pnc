/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Utilise 'export' si tu souhaites générer des fichiers statiques
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  trailingSlash: true, // Ajoute un slash à la fin des URL
  experimental: {
    workerThreads: false, // Désactive les threads de travail si ce n'est pas nécessaire
    cpus: 1, // Limite le nombre de CPU utilisés
  },
};

// export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'export',
//   images: {
//     unoptimized: true,
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: '**',
//       },
//     ],
//   },
//   trailingSlash: true,
//   basePath: '/pnc',  // Ajout du chemin de base
//   assetPrefix: '/pnc',  // Ajout du préfixe pour les assets
//   experimental: {
//     workerThreads: false,
//     cpus: 1,
//   },
// };

// export default nextConfig;