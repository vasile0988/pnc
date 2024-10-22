// app/pages/admin/clients/ClientsPage.js

"use client"; // Assurez-vous que ceci est au tout début du fichier
import { useEffect } from "react";
import AOS from 'aos'; 
import { useTranslation } from 'next-i18next';
import { Clients } from "@/components/clients";

export const ClientsPage = () =>{

    const { t } = useTranslation();
  
    useEffect(() => {
      const title = t('metadataTitle.dashboard') + ' - PNC'; 
      document.title = title; 
      
      AOS.init({
        duration: 500,
        easing: 'ease-in-out',
      });
    }, [t]);
  
    return (
        <div className='mt-[6.6rem] flex flex-col w-full'>
            <Clients/>
        </div>
    )
}