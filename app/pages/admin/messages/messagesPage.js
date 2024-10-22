// app/pages/admin/messages/messagesPage.js

"use client"; // Assurez-vous que ceci est au tout début du fichier
import { useEffect } from "react";
import AOS from 'aos'; 
import { Messages } from "@/components/messages";
import { useTranslation } from 'next-i18next';

export const MessagesPage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const title = 'Messages - PNC'; 
    document.title = title; 
    
    AOS.init({
      duration: 500,
      easing: 'ease-in-out',
    });
  }, [t]);

  return (
    <div className='mt-[6.6rem] flex flex-col w-full'>
      <Messages/>
    </div>
  );
};
