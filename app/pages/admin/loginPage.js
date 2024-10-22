// app/pages/login/loginPage.js

"use client"; // Assurez-vous que ceci est au tout début du fichier
import { useEffect } from "react";
import AOS from 'aos'; 
import { LoginForm } from "@/components/loginForm";
import { useTranslation } from 'next-i18next';

export const LoginPage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const title = t('metadataTitle.login') + ' - PNC'; 
    document.title = title; 
    
    AOS.init({
      duration: 500,
      easing: 'ease-in-out',
    });
  }, [t]);

  return (
    <div className='mt-[6.6rem] flex flex-col w-full'>
      <div className="flex flex-col items-center mx-auto justify-center sm:max-w-4xl max-w-[80%] gap-4 pt-8 pb-12">
        <h1 className="text-3xl font-montserrat-bold text-center">{t("login.title")}</h1>
        <p className="text-sm text-zinc-500 text-center">{t("login.text")}</p>
      </div>
      <LoginForm  api="admin" />
    </div>
  );
};
