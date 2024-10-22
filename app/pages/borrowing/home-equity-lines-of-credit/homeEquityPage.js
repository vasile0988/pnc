// /app/pages/borrwing/home-equity-lines-of-credit/homeEquityPage.js

"use client"; // Assurez-vous que ceci est au tout début du fichier
import { useEffect } from "react";
import 'aos/dist/aos.css';
import AOS from 'aos'; 
import { HeroBanner } from "@/components/HeroBanner";
import { SectionTitleParagraph, SectionHero, SectionCollapse, OffersEnv, SectionFAQ } from "@/components/section";
import { tabCollapse1, tabCollapse2, tabCollapse3, tabCollapse4, tabFeature1, tabFeature2, tabFeature3, tabFeature4, tabFeature5, dataItems } from "@/constantes/homeEquityConstantes";
import { useTranslation } from 'next-i18next';
import {Footer} from "@/components/footer";

// 
export const HomeEquityPage =() =>{
  const { t } = useTranslation();

  // Effet pour mettre à jour le titre de la page
  useEffect(() => {
    const title = t('metadataTitle.homeEquity') + ' - PNC'; // Utilisation de la clé de traduction
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
      imgDesktop="/assets/images/hero-home-lending-cheloc.png"
      imgMobile="/assets/images/hero-home-lending-cheloc-mobile.png"
      title="borrowing.homeEquity.heroBanner.title"
      text="borrowing.homeEquity.heroBanner.text"
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
          className="pt-8 pb-16 bg-white"
          tabCollapse={tabCollapse2}
          reverse={true}
          animation={{
            "data-aos": "fade-right", 
            "data-aos-easing": "ease-in-out", 
            "data-aos-once": true,
          }}
        />
        <SectionCollapse 
          className="pt-8 pb-16 bg-white"
          tabCollapse={tabCollapse3}
          animation={{
            "data-aos": "fade-left", 
            "data-aos-easing": "ease-in-out", 
            "data-aos-once": true,
          }}
        />
        <SectionCollapse 
          className="pt-8 pb-16 bg-white"
          tabCollapse={tabCollapse4}
          reverse={true}
          animation={{
            "data-aos": "fade-right", 
            "data-aos-easing": "ease-in-out", 
            "data-aos-once": true,
          }}
        />
      </div>
      <OffersEnv 
        title="borrowing.homeEquity.infos.title" 
        TabVal={[tabFeature1, tabFeature2, tabFeature3]}
        classNameOffer="lg:max-w-[25rem] md:max-w-xl"
        className="w-full pt-8 pb-16"
          animation={{
            "data-aos": "fade-up", 
            "data-aos-easing": "ease-in-out", 
            "data-aos-once": true,
          }}
      />
      <OffersEnv 
        title="borrowing.homeEquity.tips.title" 
        text="borrowing.homeEquity.tips.text"
        TabVal={[tabFeature4, tabFeature5]}
        classNameOffer="lg:max-w-[25rem] md:max-w-xl"
        className="w-full pt-8 pb-16"
          animation={{
            "data-aos": "fade-up", 
            "data-aos-easing": "ease-in-out", 
            "data-aos-once": true,
          }}
      />
      <SectionTitleParagraph
        className="bg-theme1"
        dataItemsTab={dataItems}
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
