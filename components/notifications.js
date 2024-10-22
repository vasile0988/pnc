import React, { useState, useEffect } from 'react';
import { useClientId } from '@/context/IdContext';
import { NotFoundIcon } from "./icons";
import { useTranslation } from 'next-i18next';
import { fetchNotifications, markAllNotificationsAsRead } from '@/api/request';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const Notifications = ({ className }) => {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const { clientId } = useClientId(); 

    useEffect(() => {
        AOS.init({
            duration: 500,
            once: true,
            easing: 'ease-in-out',
        });
        setMounted(true);
    }, []);

    useEffect(() => {
        const loadNotifications = async () => {
            if (!clientId) return;

            setLoading(true);
            try {
                const result = await fetchNotifications(clientId);
                if (result.success) {
                    setNotifications(result.notifications);
                } else {
                    console.error("Erreur:", result.message);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        if (mounted && clientId) {
            loadNotifications();
        }
    }, [clientId, mounted]);

    useEffect(() => {
        const markNotificationsAsRead = async () => {
            if (!clientId) return;

            const result = await markAllNotificationsAsRead(clientId);
            if (!result.success) {
                console.error("Erreur lors du marquage des notifications:", result.message);
            }
        };

        if (mounted) {
            markNotificationsAsRead();
        }
    }, [mounted, clientId]);

    const formatNotificationMessage = (message) => {
        if (!message.includes('receivedMessage')) {
            return t(message);
        }
    
        const regex = /^(notifications\.receivedMessage\d*)([,\d]+(\.\d{1,2})?)$/;
        const match = message.match(regex);
    
        if (match) {
            let [, key, amount] = match;
            
            const keyNumberMatch = key.match(/(\d+)$/);
            if (keyNumberMatch) {
                const keyNumber = keyNumberMatch[1];
                key = key.replace(/\d+$/, '');
                amount = keyNumber + (amount || ''); // Ajoute une vérification pour amount
            }
    
            const translatedKey = t(key);
    
            return `${translatedKey} €${amount}`; // Retourne une chaîne formatée
        }
    
        return t(message);
    };
    
    const renderNotificationMessage = (message) => {
        const formattedMessage = formatNotificationMessage(message);
        return formattedMessage; // Retourne directement le message formaté
    };
    


    if (!mounted) return null;

    if (loading) {
        return (
            <section className={`${className} py-16`}>
                <div className="container p-4 mx-auto text-center">
                    {t("notifications.loading")}
                </div>
            </section>
        );
    }

    return (
        <section className={`${className}`}>
            <div className="container mx-auto p-4 text-sm text-black flex flex-col gap-8 py-8 justify-center">
                <h1 className="text-2xl font-montserrat-bold text-gray-800" data-aos="fade-up">
                    {t("notifications.title")}
                </h1>

                <div className='max-w-4xl container mx-auto' data-aos="fade-up">
                    {notifications.length > 0 ? (
                        <div className='w-full flex flex-col container gap-8 justify-center'>
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`bg-white rounded-2xl p-4 shadow-lg shadow-zinc-300 flex flex-col gap-2 
                                        ${notification.read === "0" ? 'border-l-4 border-blue-500' : ''}`}
                                >
                                    <h2 className='font-montserrat-bold'>{t(notification.title)}</h2>
                                    <div className='flex flex-col gap-2 justify-center'>
                                        <p>{formatNotificationMessage(notification.message)}</p>
                                        <p className='text-xs text-zinc-500 flex justify-end'>
                                            {new Date(notification.date).toLocaleString('fr-FR', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                                hour12: false
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-zinc-500 flex flex-col items-center">
                            <NotFoundIcon className="h-20 w-20" />
                            <span>{t("notifications.nonotif")}</span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};