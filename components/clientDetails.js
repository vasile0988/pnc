// components/clientDetails.js

"use client";
import React, { useState, useEffect } from 'react';
import { fetchUserProfile } from '@/api/request';
import { UserIcon } from "./icons";
import { useTranslation } from 'next-i18next';
import AOS from 'aos';
import 'aos/dist/aos.css';
import countries from 'i18n-iso-countries';
import 'i18n-iso-countries/langs/fr.json';
import 'i18n-iso-countries/langs/en.json';

const getCountryName = (countryCode, language) => {
    try {
        countries.registerLocale(require(`i18n-iso-countries/langs/${language}.json`));
        return countries.getName(countryCode, language, { select: 'official' });
    } catch (error) {
        console.error("Error translating country:", error);
        return countryCode;
    }
};

// Fonction pour encoder l'ID en base64
const encodeClientId = (id) => {
    const idString = id.toString();
    return typeof window !== 'undefined' ? btoa(idString) : Buffer.from(idString).toString('base64');
};

export const ClientDetails = ({ className, clientId }) => {
    const { t, i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [clientData, setClientData] = useState(null);

    useEffect(() => {
        AOS.init({ duration: 500, once: true, easing: 'ease-in-out' });
        setMounted(true);
    }, []);

    useEffect(() => {
        if (clientId && mounted) {
            const getClientDetails = async () => {
                try {
                    const encodedId = encodeClientId(clientId);
                    const data = await fetchUserProfile(encodedId);
                    if (data.success) {
                        setClientData(data.data);
                    } else {
                        console.error(data.message);
                    }
                } catch (error) {
                    console.error("Error fetching client details:", error);
                }
            };
            getClientDetails();
        }
    }, [clientId, mounted]);

    if (!mounted) return null;

    // Vérifiez si clientData est défini avant d'accéder à ses propriétés
    const fullName = clientData ? `${clientData.name} ${clientData.surname}` : 'Loading...';

    const countryName = clientData?.country ?
        getCountryName(clientData.country, i18n.language) || clientData.country
        : '';

    return (
        <section className={`${className}`}>
            <div className="container mx-auto p-4 text-sm text-black flex flex-col gap-8 py-8 justify-center">
                <h1 className="text-2xl font-montserrat-bold text-gray-800" data-aos="fade-up">
                    {fullName}
                </h1>
                <div className='flex flex-col max-w-4xl container gap-8 mx-auto justify-center' data-aos="fade-up">
                    <div className="w-full flex p-4 items-center justify-center">
                        <div className="h-44 w-44 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <UserIcon className="text-zinc-500 h-32 w-32" />
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white shadow-md transition-transform transform hover:scale-105" data-aos="fade-up">
                        {clientData ? (
                            <ul className="w-full space-y-2">
                                {Object.entries({
                                    [t("signup.lastNameLabel")]: clientData.surname,
                                    [t("signup.firstNameLabel")]: clientData.name,
                                    [t("signup.genderLabel")]: clientData.sexe === "M" ? t("signup.genderMale") : t("signup.genderFemale"),
                                    [t("signup.countryLabel")]: countryName,
                                    [t("signup.cityLabel")]: clientData.city,
                                    [t("signup.addressLabel")]: clientData.adress,
                                    [t("signup.zipLabel")]: clientData.zip,
                                    [t("signup.emailLabel")]: clientData.email,
                                    [t("signup.phoneLabel")]: clientData.tel,
                                    [t("signup.professionLabel")]: clientData.job,
                                    [t("signup.monthlyIncomeLabel")]: clientData.salary,
                                    [t("signup.maritalStatusLabel")]: clientData.situation,
                                    [t("signup.childrenCountLabel")]: clientData.children,
                                }).map(([label, value]) => (
                                    <li key={label} className="flex justify-between p-2 rounded-xl bg-theme3 hover:bg-theme4 transition-colors">
                                        <span className="font-montserrat-bold">{label}</span>
                                        <span className="text-zinc-500">{value}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="animate-pulse flex flex-col items-center">
                                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
