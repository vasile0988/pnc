// app/pages/borrowing/construction-and-lot-loans/constructionPage.js

"use client"; // Assurez-vous que ceci est au tout début du fichier
import { useEffect } from "react";
import 'aos/dist/aos.css';
import AOS from 'aos'; 
import { HeroBanner } from "@/components/HeroBanner";
import { SectionTitleParagraph, SectionCollapse, OffersEnv, SectionFAQ } from "@/components/section";
import { tabCollapse1, tabCollapse2, tabCollapse3, tabFeature1, tabFeature2, tabFeature3, tabFeature4, tabFeature5, tabFeature6, tabFAQ, dataItems } from "@/constantes/constructionConstantes";
import { useTranslation } from 'next-i18next';
import {Footer} from "@/components/footer";

export const ConstructionPage =() =>{
  const { t } = useTranslation();

  // Effet pour mettre à jour le titre de la page
  useEffect(() => {
    const title = t('metadataTitle.construction') + ' - PNC'; // Utilisation de la clé de traduction
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
        imgDesktop="/assets/images/hero_construction_lot_loans.avif"
        imgMobile="/assets/images/hero_construction_lot_loans-mobile.png"
        title="borrowing.constructionLoans.heroBanner.title"
        text="borrowing.constructionLoans.heroBanner.text"
        link="/pages/signup/"
        linkText="navigation.borrowingLink"
      />
      <div className="overflow-hidden bg-white">
        <SectionCollapse 
          className="py-16 bg-white"
          tabCollapse={tabCollapse1}
          animation={{
            "data-aos": "fade-left", 
            "data-aos-easing": "ease-in-out", 
            "data-aos-once": true,
          }}
        />
        <SectionCollapse 
          className="pt-8 pb-8 bg-white"
          tabCollapse={tabCollapse2}
          reverse={true}
          animation={{
            "data-aos": "fade-right", 
            "data-aos-easing": "ease-in-out", 
            "data-aos-once": true,
          }}
        />
      </div>
      <OffersEnv 
        title="borrowing.constructionLoans.infos.title" 
        TabVal={[tabFeature1, tabFeature2, tabFeature3, tabFeature4, tabFeature5, tabFeature6]}
        classNameOffer="lg:max-w-[25rem] md:max-w-xl"
        className="w-full py-16"
          animation={{
            "data-aos": "fade-up", 
            "data-aos-easing": "ease-in-out", 
            "data-aos-once": true,
          }}
      />
      <SectionFAQ 
        tabFAQ={tabFAQ} 
        title="banking.checkingAccount.FAQ.title" 
        animation={{
          "data-aos": "fade-up", 
          "data-aos-easing": "ease-in-out", 
          "data-aos-once": true,
        }}
      />
      <Footer 
        className="bg-theme2 py-8"
        classNameTitle="text-white font-montserrat-bold text-xl"
        classNameLink="text-zinc-400 text-sm hover:text-white"
      />
    </div>
  );
}
