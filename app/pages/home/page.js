// /app/pages/home/page.js

"use client"; // Assurez-vous que ceci est au tout début du fichier
import { useEffect } from "react";
import 'aos/dist/aos.css';
import AOS from 'aos'; 
import { HeroBanner } from "@/components/HeroBanner";
import { SectionImgItems, SectionHero, SectionTitleParagraph } from "@/components/section";
import { dataItemsTab, dataItems } from "@/constantes/bankingConstantes";
import { useTranslation } from 'next-i18next';
import {Footer} from "@/components/footer";

export default function HomePage() {
  const { t } = useTranslation();

  // Effet pour mettre à jour le titre de la page
  useEffect(() => {
    const title = t('metadataTitle.home') + ' - PNC'; // Utilisation de la clé de traduction
    document.title = title; // Met à jour le titre de la page
    
    // Initialisation d'AOS
    AOS.init({
      duration: 500,
      easing: 'ease-in-out',
    });

  
  }, [t]);

  return (
    <div className='mt-[6.6rem] flex flex-col w-full '>
      <HeroBanner 
        imgDesktop="/assets/images/herobanner desktop.avif"
        imgMobile="/assets/images/herobanner mobile.png"
        title="banking.home.heroBanner.title"
        text="banking.home.heroBanner.text"
        link="/pages/banking/virtual-wallet/"
        linkText="banking.home.heroBanner.learnMore"
      />
      <div className="overflow-hidden bg-white">     
        <SectionImgItems 
          dataItems={dataItems} 
          title="sectionImgItems.banking.title" 
          text="sectionImgItems.banking.text" 
          className="py-8"
          classNameDiv="gap-x-6 gap-y-8" 
          classNameChidren="p-4 rounded-lg flex flex-col items-center justify-end gap-2" 
          classNameIcon="text-orange-500" 
          widthIcon={80} 
          heightIcon={80} 
          classNameTitle="text-base" 
          classNameText="text-sm text-gray-600" 
          classNameLink="text-blue-500 underline"
          animation={{
            "data-aos": "fade-up", 
            "data-aos-easing": "ease-in-out", 
            "data-aos-once": true,
          }}
        />
      </div>
      <div className="overflow-hidden bg-orange-500">                
        <SectionHero 
          title="sectionHero.banking.title" 
          link="/pages/banking/virtual-wallet/"
          linkText="sectionHero.banking.linkText" 
          className="py-16 bg-orange-500 w-full"
          classNameChild="container px-4 py-10 mx-auto flex flex-col gap-8 items-center justify-center"
          classNameTitle="text-3xl text-white font-montserrat-bold text-center"
          classNameText="text-xl text-zinc-500 text-center"
          classNameLink="underline text-center text-zinc-800"
          animation={{
            "data-aos": "fade-up", 
            "data-aos-easing": "ease-in-out", 
            "data-aos-once": true,
          }}
        />
      </div>
      <div className="overflow-hidden bg-white">               
        <SectionHero 
          title="sectionFinancial.title"
          text="sectionFinancial.text"
          className="py-16 px-4 bg-white w-full"
          classNameChild="container max-w-[40rem] border-2 rounded-3xl px-4 py-10 mx-auto flex flex-col gap-8 items-center justify-center"
          classNameTitle="text-3xl text-blue-500 font-montserrat-bold text-center"
          classNameText="text-xl text-zinc-500 text-center"
          animation={{
            "data-aos": "fade-up", 
            "data-aos-easing": "ease-in-out", 
            "data-aos-once": true,
          }}
        />
      </div>
      <SectionTitleParagraph
        link="/pages/banking/virtual-wallet/" 
        className="bg-theme1"
        dataItemsTab={dataItemsTab}
        title="sectionTitleParagraph.banking.title"
      />
      <Footer 
        className="bg-theme2 py-8"
        classNameTitle="text-white font-montserrat-bold text-xl"
        classNameLink="text-zinc-400 text-sm hover:text-white"
      />
    </div>
  );
}
