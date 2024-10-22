// /app/pages/banking/savings/savingsPage.js

"use client"; // Assurez-vous que ceci est au tout début du fichier
import { useEffect } from "react";
import 'aos/dist/aos.css';
import AOS from 'aos'; 
import { HeroBanner } from "@/components/HeroBanner";
import { SectionTitleParagraph, SectionCollapse, SectionFAQ } from "@/components/section";
import { tabCollapse1, tabCollapse2, tabCollapse3, tabCollapse4, tabCollapse5, tabFAQ, dataItems } from "@/constantes/savingConstantes";
import { useTranslation } from 'next-i18next';
import {Footer} from "@/components/footer";

export const CheckingAccountPage =() =>{
  const { t } = useTranslation();

  // Effet pour mettre à jour le titre de la page
  useEffect(() => {
    const title = t('metadataTitle.saving') + ' - PNC'; // Utilisation de la clé de traduction
    document.title = title; // Met à jour le titre de la page

    // Initialisation d'AOS
    AOS.init({
      duration: 500,
      easing: 'ease-in-out',
    });

  }, [t]);

  return (
    <div className='mt-[6.6rem] flex flex-col w-full max-w-full overflow-hidden'>
      <HeroBanner 
        imgDesktop="/assets/images/hero_p_savings-router.avif"
        imgMobile="/assets/images/hero_p_savings-router_mobile.png"
        title="banking.savings.heroBanner.title"
        text="banking.savings.heroBanner.text"
        link="/pages/sign-on/"
        linkText="navigation.signup"
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
          className="pb-16 bg-white"
          tabCollapse={tabCollapse2}
          reverse={true}
          animation={{
            "data-aos": "fade-right", 
            "data-aos-easing": "ease-in-out", 
            "data-aos-once": true,
          }}
        />
        <SectionCollapse 
          className="pb-16 bg-white"
          tabCollapse={tabCollapse3}
          animation={{
            "data-aos": "fade-left", 
            "data-aos-easing": "ease-in-out", 
            "data-aos-once": true,
          }}
        />
        <SectionCollapse 
          className="pb-16 bg-white"
          tabCollapse={tabCollapse4}
          reverse={true}
          animation={{
            "data-aos": "fade-right", 
            "data-aos-easing": "ease-in-out", 
            "data-aos-once": true,
          }}
        />
        <SectionCollapse 
          className="pb-16 bg-white"
          tabCollapse={tabCollapse5}
          animation={{
            "data-aos": "fade-left", 
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
      </div>
      <SectionTitleParagraph
        link="/pages/banking/virtual-wallet/" 
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
