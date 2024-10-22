// app/pages/account/profil/profilPage.js

"use client"; // Assurez-vous que ceci est au tout début du fichier
import { useEffect } from "react";
import AOS from 'aos'; 
import { useTranslation } from 'next-i18next';
import {Profil} from '@/components/profil'

export const ProfilPage = () =>{
    
    const { t } = useTranslation();

    useEffect(() => {
    const title = t('metadataTitle.profile') + ' - PNC'; 
    document.title = title; 
    
    AOS.init({
        duration: 500,
        easing: 'ease-in-out',
    });
    }, [t]);
    return (
        <div className='mt-[6.6rem] flex flex-col w-full'>
            <Profil/>
        </div>
    )
}