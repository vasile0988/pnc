// app/pages/admin/logout/page.js

"use client";

import { useEffect } from 'react';
import { logout } from '@/api/request';
import { useRouter } from 'next/navigation';

const Logout = () => {
    const router = useRouter();

    useEffect(() => {
        // Appelle la fonction de déconnexion
        logout("client");
        
        // Redirige vers la page d'accueil
        router.push('/');
    }, [router]);

    return null; // Ou un loading spinner si tu préfères
};

export default Logout;