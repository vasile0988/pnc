// app/pages/contact/contactPage.js

"use client"; // Assurez-vous que ceci est au tout début du fichier
import { useEffect } from "react";
import 'aos/dist/aos.css';
import AOS from 'aos'; 
import { useTranslation } from 'next-i18next';
import { ContactForm } from "@/components/contactForm";
import {Footer} from "@/components/footer";

// 
export const ContactPage =() =>{
  const { t } = useTranslation();

  // Effet pour mettre à jour le titre de la page
  useEffect(() => {
    const title = t('metadataTitle.contact') + ' - PNC'; // Utilisation de la clé de traduction
    document.title = title; // Met à jour le titre de la page
    
    // Initialisation d'AOS
    AOS.init({
      duration: 500,
      easing: 'ease-in-out',
    });

  }, [t]);

  return (
    <div className='mt-[6.6rem] flex flex-col w-full '>
        <div className="flex flex-col items-center mx-auto justify-center sm:max-w-4xl max-w-[80%] gap-4 pt-8 pb-12">
            <h1 className="text-3xl font-montserrat-bold text-center">{t("contact.title")}</h1>
            <p className="text-sm text-zinc-500 text-center">{t("contact.text")}</p>
        </div>
        <ContactForm className="pb-16" />
      <Footer 
        className="bg-theme2 py-8"
        classNameTitle="text-white font-montserrat-bold text-xl"
        classNameLink="text-zinc-400 text-sm hover:text-white"
      />
    </div>
  );
}
