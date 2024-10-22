// app/pages/borrowing/auto-loans/AutoLoansPage.js

"use client"; // Assurez-vous que ceci est au tout début du fichier
import { useEffect } from "react";
import 'aos/dist/aos.css';
import AOS from 'aos'; 
import { HeroBanner } from "@/components/HeroBanner";
import { SectionTitleParagraph, SectionHero, SectionCollapse, OffersEnv } from "@/components/section";
import { tabCollapse1, tabCollapse2, tabFeature1, tabFeature2, tabFeature3, dataItems } from "@/constantes/autoLoansConstantes";
import { useTranslation } from 'next-i18next';
import {Footer} from "@/components/footer";

export const AutoLoansPage =() =>{
  const { t } = useTranslation();

  // Effet pour mettre à jour le titre de la page
  useEffect(() => {
    const title = t('metadataTitle.autoLoans') + ' - PNC'; // Utilisation de la clé de traduction
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
        imgDesktop="/assets/images/hero_personal_borrowing_auto-loans-home.avif"
        imgMobile="/assets/images/hero_personal_borrowing_auto-loans-home-mobile.png"
        title="borrowing.autoLoans.heroBanner.title"
        text="borrowing.autoLoans.heroBanner.text"
        link="/pages/signup/"
        linkText="navigation.borrowingLink"
      />
      <div className="overflow-hidden bg-white">
        <div className="md:max-w-4xl pt-16 mx-auto flex-col flex items-center justify-center max-w-[80%]">
            <h1 className="text-3xl text-center font-montserrat-bold">{t("borrowing.sectionCollapse.autoLoans.title")}</h1>
        </div>
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
      </div>
      <OffersEnv 
        title="borrowing.autoLoans.infos.title" 
        text="borrowing.autoLoans.infos.text" 
        TabVal={[tabFeature1, tabFeature2, tabFeature3]}
        classNameOffer="lg:max-w-[25rem] md:max-w-xl"
        className="w-full py-16"
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
