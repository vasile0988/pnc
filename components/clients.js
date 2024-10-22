// components/clients.js

import Image from 'next/image';
import Link from 'next/link';
import '../app/globals.css';
import { useAdminId } from '@/context/AdminContext';
import { useState, useEffect } from 'react';
import { UserIcon, NotFoundIcon } from "./icons";
import { useTranslation } from 'next-i18next';
import { fetchClients } from '@/api/request'; // Importez la nouvelle fonction
import AOS from 'aos';
import 'aos/dist/aos.css';

export const Clients = ({ className }) => {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [clients, setClients] = useState([]); // État pour stocker les clients
    const { adminId } = useAdminId();

    // Initialize AOS for animations
    useEffect(() => {
        AOS.init({
            duration: 500,
            once: true,
            easing: 'ease-in-out',
        });
        setMounted(true);
    }, []);

    // Fetch clients data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchClients(); // Utilisez la nouvelle fonction
                if (response.success) {
                    setClients(response.data); // Stocker les clients dans l'état
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des clients:", error);
            } finally {
                setLoading(false); // Arrêter le chargement
            }
        };
        fetchData();
    }, []);

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

    return (
        <section className={`${className} pb-8`}>
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-2xl font-montserrat-bold mb-8 text-gray-800" data-aos="fade-up">
                    {t("dashboard.title")}
                </h1>
                {clients.length > 0 ?
                    (
                        <div className="flex md:flex-row flex-col md:items-start md:justify-center gap-8 items-center justify-center" data-aos="fade-up">
                            {clients.map(client => (
                                <div key={client.cli_id} className='rounded-3xl shadow-xl container w-full sm:max-w-72 gap-4 shadow-zinc-300 p-4 bg-white flex flex-col items-center justify-center'>
                                    <div className='rounded-full bg-theme3 py-2 px-2'><UserIcon className="text-zinc-500 h-32 w-32" /></div>
                                    <div className='w-full flex-col flex gap-2 items-start'>
                                        <li className='list-none bg-theme3 rounded-xl p-2 text-sm w-full'>{client.cli_name} {client.cli_surname}</li>
                                        <li className='list-none bg-theme3 rounded-xl p-2 text-sm w-full'>{client.cli_email}</li>
                                        {client.vir_present ? (
                                            <li className='list-none bg-green-500 rounded-xl p-2 text-sm w-full text-white'>Virement encours</li>
                                        ) : (
                                            <li className='list-none bg-orange-500 rounded-xl p-2 text-sm w-full'>Pas de virement</li>
                                        )}
                                        <li className='list-none w-full mt-2 flex justify-center items-center'>
                                            <Link href={`/pages/admin/clientDetails/${client.cli_id}/`} className='rounded-md bg-blue-500 hover:bg-blue-800 p-1 transition-colors duration-300 text-white w-full flex items-center justify-center'>Détails</Link>
                                        </li>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ):
                    (
                        (
                            <div className="text-zinc-500 flex flex-col items-center">
                                <NotFoundIcon className="h-20 w-20" />
                                <span>Aucun client trouvé!</span>
                            </div>
                        )
                    )
                }
            </div>
        </section>
    );
};
