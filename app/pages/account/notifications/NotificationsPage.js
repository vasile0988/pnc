// app/pages/account/notifications/NotificationsPage.js

"use client"; // Assurez-vous que ceci est au tout début du fichier
import { useEffect } from "react";
import AOS from 'aos'; 
import { useTranslation } from 'next-i18next';
import {Notifications} from '@/components/notifications'

export const NotificationsPage = () =>{
    
    const { t } = useTranslation();

    useEffect(() => {
    const title = t('metadataTitle.notifications') + ' - PNC'; 
    document.title = title; 
    
    AOS.init({
        duration: 500,
        easing: 'ease-in-out',
    });
    }, [t]);
    return (
        <div className='mt-[6.6rem] flex flex-col w-full'>
            <Notifications/>
        </div>
    )
}