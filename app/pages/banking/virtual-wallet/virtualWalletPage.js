// /app/pages/banking/virtual-wallet/VirtualWalletPage.js

"use client"; // Assurez-vous que ceci est au tout début du fichier
import { useEffect } from "react";
import 'aos/dist/aos.css';
import AOS from 'aos'; 
import { HeroBanner } from "@/components/HeroBanner";
import { SectionImgItems, SectionHero, SectionTitleParagraph, OffersEnv } from "@/components/section";
import { dataItemsTab2, dataHeroTab, tabFeature1, tabFeature2, tabFeature3, tabFeature4, tabFeature5 } from "@/constantes/virtualWalletConstantes";
import { useTranslation } from 'next-i18next';
import {Footer} from "@/components/footer";

export const VirtualWalletPage =() =>{
  const { t } = useTranslation();

  // Effet pour mettre à jour le titre de la page
  useEffect(() => {
    const title = t('metadataTitle.virtualWallet') + ' - PNC'; // Utilisation de la clé de traduction
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
        imgDesktop="/assets/images/vw_hero_phone-screen.webp"
        imgMobile="/assets/images/vw_hero_phone-screen-mobile.jpg"
        title="banking.virtualWallet.heroBanner.title"
        text="banking.virtualWallet.heroBanner.text"
        link="/pages/sign-on/"
        linkText="navigation.signup"
        srcDiv="/assets/images/vw_logo_wo_parent.avif"
        altDiv="image"
        widthDiv={100}
        heightDiv={100}
      />
      <div className="overflow-hidden bg-theme2 w-full">
        <SectionHero 
          title="sectionHero.virtualWallet.title" 
          text="sectionHero.virtualWallet.text" 
          className="py-16 bg-theme2 w-full"
          classNameChild="container px-4 py-10 mx-auto flex flex-col gap-8 items-center justify-center"
          classNameTitle="text-3xl text-white font-montserrat-bold text-center"
          classNameText="text-xl text-zinc-400 mt-8 text-center"
          animation={{
            "data-aos": "fade-up", 
            "data-aos-easing": "ease-in-out", 
            "data-aos-once": true,
          }}
        />
      </div>
      <div className="overflow-hidden">
        <SectionImgItems 
          dataItems={dataHeroTab} 
          title="sectionImgItems.virtualWallet.title" 
          text="sectionImgItems.virtualWallet.text" 
          className="py-8"
          classNameDiv="gap-x-6 gap-y-8 mt-6" 
          classNameChidren="p-4 rounded-lg flex flex-col items-center justify-end gap-2" 
          classNameIcon="text-orange-500" 
          widthIcon={80} 
          heightIcon={80} 
          classNameTitle="text-base" 
          classNameText="text-lg text-gray-600 max-w-80 text-center" 
          classNameLink="text-blue-500 underline"
          animation={{
            "data-aos": "fade-up", 
            "data-aos-easing": "ease-in-out", 
            "data-aos-once": true,
          }}
        />
        <OffersEnv 
          title="banking.virtualWallet.offers.title" 
          text="banking.virtualWallet.offers.text"
          TabVal={[tabFeature1, tabFeature2, tabFeature3]}
          classNameOffer="lg:max-w-[25rem] md:max-w-xl"
          className="w-full py-16"
          animation={{
            "data-aos": "fade-up", 
            "data-aos-easing": "ease-in-out", 
            "data-aos-once": true,
          }}
        />
        <OffersEnv 
          title="banking.virtualWallet.offers.title" 
          text="banking.virtualWallet.offers.text"
          TabVal={[tabFeature4, tabFeature5]}
          classNameOffer="max-w-xl"
          classNameImg="w-auto h-auto rounded-xl"
          className="w-full pt-8 pb-16"
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
        dataItemsTab={dataItemsTab2}
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
