// app/pages/account/virement/virementPage.js

"use client"; // Assurez-vous que ceci est au tout début du fichier
import { useEffect } from "react";
import AOS from 'aos'; 
import { useTranslation } from 'next-i18next';
import { Virement } from "@/components/virement";

export const VirementPage = () =>{

    const { t } = useTranslation();
  
    useEffect(() => {
      const title = t('metadataTitle.virement') + ' - PNC'; 
      document.title = title; 
      
      AOS.init({
        duration: 500,
        easing: 'ease-in-out',
      });
    }, [t]);
  
    return (
        <div className='mt-[6.6rem] flex flex-col w-full'>
            <Virement/>
        </div>
    )
}