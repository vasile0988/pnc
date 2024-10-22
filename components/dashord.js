// components/Dashboard.js
"use client";
import Link from 'next/link';
import '../app/globals.css';
import { useClientId } from '@/context/IdContext';
import { useState, useEffect } from 'react';
import { NotFoundIcon } from "./icons";
import { useTranslation } from 'next-i18next';
import { fetchDashboardData } from '@/api/request';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const Dashboard = ({ className }) => {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [virements, setVirements] = useState([]);
    const [clientData, setClientData] = useState({});
    const { clientId } = useClientId(); 

    // Initialize AOS for animations
    useEffect(() => {
        AOS.init({
            duration: 500, 
            once: true, 
            easing: 'ease-in-out',
        });
        setMounted(true);
    }, []);

    // Fetch the dashboard data
    useEffect(() => {
        const loadDashboardData = async () => {
            if (!clientId) return;

            setLoading(true);
            try {
                const result = await fetchDashboardData(clientId);
                if (result.success) {
                    setClientData(result.clientData);
                    setVirements(result.virements);
                } else {
                    console.error("Erreur:", result.message);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des données:", error);
            } finally {
                setLoading(false);
            }
        };

        if (mounted && clientId) {
            loadDashboardData();
        }
    }, [clientId, mounted]);

    // Do not render until the component is mounted
    if (!mounted) return null;

    // Show a loading indicator if data is still being fetched
    if (loading) {
        return (
            <section className={`${className} py-16`}>
                <div className="container p-4 mx-auto text-center">
                    {t("dashboard.loading")}
                </div>
            </section>
        );
    }

    const noVirement = !virements || virements.length === 0;
    return (
        <section className={`${className} pb-8`}>
            <div className="container mx-auto py-8 px-4">
                {/* Title with the same structure as in Settings */}
                <h1 className="text-2xl font-montserrat-bold mb-8 text-gray-800" data-aos="fade-up">
                    {t("dashboard.title")}
                </h1>
    
                <div className="flex md:flex-row flex-col md:items-start md:justify-start gap-8 items-center justify-center" data-aos="fade-up">
                    {/* Account balance section */}
                    <div className="bg-white rounded-2xl shadow-lg p-4 w-full">
                        <div className="bg-blue-400 rounded-2xl text-white p-4 flex flex-col items-center gap-6">
                            <h2 className="text-sm">{t("dashboard.soldeLabel")}</h2>
                            <h1 className="font-montserrat-bold text-4xl">€{clientData?.solde ? Number(clientData.solde).toFixed(2) : '0.00'}</h1>
                            <div className="w-full flex items-center">
                                {clientData?.solde > 500 && (
                                    <Link href="/pages/account/virement/" className="flex justify-center rounded-xl p-2 w-full bg-white hover:bg-theme3 text-black">
                                        {t("dashboard.send")}
                                    </Link>
                                )}
                            </div>
                        </div>
                        
                        <ul className="mt-4 border-2 border-zinc-300 p-4 text-sm rounded-xl bg-theme3 space-y-4">
                            <li className="flex justify-between">
                                <span className="font-extrabold">{t("dashboard.accountTypeLabel")}</span>
                                <span className="text-zinc-500">{t("dashboard.accountTypeValue")}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="font-extrabold">IBAN</span>
                                <span className="text-zinc-500">{clientData?.iban || 'Non disponible'}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="font-extrabold">{t("dashboard.accountStatutLabel")}</span>
                                <span className={`px-1 rounded text-white ${clientData?.statut ? "bg-green-500" : "bg-orange-500"}`}>{clientData?.statut ? t("dashboard.statut.good") : t("dashboard.statut.care")}</span>
                            </li>
                        </ul>
                    </div>
    
                    {/* Transactions section */}
                    <div className="bg-white rounded-2xl shadow-lg p-4 w-full">
                        <h2 className="text-sm text-center mb-4">{t("dashboard.transactionsLabel")}</h2>
                        <ul className={`min-h-56 border-2 border-zinc-300 p-4 rounded-xl bg-theme3 ${!noVirement ? "space-y-4" : "flex flex-col items-center justify-center"}`}>
                            {noVirement ? (
                                <li className="text-zinc-500 flex flex-col items-center">
                                    <NotFoundIcon className="h-20 w-20" />
                                    <span>{t("dashboard.noVirement")}</span>
                                </li>
                            ) : (
                                virements.map((virement) => (
                                    <li key={virement.vir_id} className="flex justify-between items-center border-2 border-zinc-300 p-2 rounded-xl bg-white">
                                        <div className="flex flex-col gap-1">
                                            <span>{t("dashboard.virementTo")}{virement.vir_to}</span>
                                            <span className="text-xs text-zinc-500">
                                                {new Date(virement.vir_date).toLocaleString('fr-FR', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                    hour12: false // Pour le format 24 heures
                                                })}
                                            </span>
                                            <span className="font-montserrat-bold text-gray-800">€{Number(virement.vir_amount).toFixed(2)}</span>
                                        </div>
                                        <Link href={`/pages/account/virement-in-progress/${virement.vir_id}/`} className="p-2 bg-blue-500 text-white transition-colors duration-300 hover:bg-blue-800 text-xs rounded-md">
                                            {t("dashboard.detailsLinkText")}
                                        </Link>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
    
};
