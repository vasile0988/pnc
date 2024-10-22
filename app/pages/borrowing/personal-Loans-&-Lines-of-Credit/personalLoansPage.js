// app/pages/borrowing/personal-Loans-&-Lines-of-Credit/personalLoasPage.js

"use client"; // Assurez-vous que ceci est au tout début du fichier
import { useEffect } from "react";
import 'aos/dist/aos.css';
import AOS from 'aos'; 
import { HeroBanner } from "@/components/HeroBanner";
import { SectionImgItems, SectionCollapse, OffersEnv } from "@/components/section";
import { tabCollapse1, tabFeature1, tabFeature2, dataItems } from "@/constantes/personalLoansConstantes";
import { useTranslation } from 'next-i18next';
import {Footer} from "@/components/footer";

// 
export const PersonalLoansPage =() =>{
  const { t } = useTranslation();

  // Effet pour mettre à jour le titre de la page
  useEffect(() => {
    const title = t('metadataTitle.personalLoans') + ' - PNC'; // Utilisation de la clé de traduction
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
      imgDesktop="/assets/images/hero_personal_loans.avif"
      imgMobile="/assets/images/hero_personal_loans-mobile.png"
      title="borrowing.personalLoans.heroBanner.title"
      text="borrowing.personalLoans.heroBanner.text"
        link="/pages/signup/"
        linkText="navigation.borrowingLink"
    />
      <OffersEnv 
        title="borrowing.personalLoans.infos.title" 
        TabVal={[tabFeature1, tabFeature2]}
        classNameOffer="lg:max-w-[25rem] md:max-w-xl"
        className="w-full pt-8 pb-16"
          animation={{
            "data-aos": "fade-up", 
            "data-aos-easing": "ease-in-out", 
            "data-aos-once": true,
          }}
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
      </div>
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
      {/* <SectionTitleParagraph
        className="bg-theme1"
        dataItemsTab={dataItems}
        title="sectionTitleParagraph.banking.title"
      /> */}
      <Footer 
        className="bg-theme2 py-8"
        classNameTitle="text-white font-montserrat-bold text-xl"
        classNameLink="text-zinc-400 text-sm hover:text-white"
      />
    </div>
  );
}
