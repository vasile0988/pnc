// components/profil.js

"use client"
import React, { useState, useEffect } from 'react';
import { useClientId } from '@/context/IdContext'; 
import { fetchUserProfile } from '../api/request';
import { UserIcon } from "./icons";
import { useTranslation } from 'next-i18next';
import countries from 'i18n-iso-countries';
import 'i18n-iso-countries/langs/fr.json';
import 'i18n-iso-countries/langs/en.json';
import 'i18n-iso-countries/langs/de.json';
import 'i18n-iso-countries/langs/es.json';
import 'i18n-iso-countries/langs/pt.json';
import AOS from 'aos';
import 'aos/dist/aos.css';

const getCountryName = (countryCode, language) => {
    try {
        countries.registerLocale(require(`i18n-iso-countries/langs/${language}.json`));
        return countries.getName(countryCode, language, { select: 'official' });
    } catch (error) {
        console.error("Error translating country:", error);
        return countryCode;
    }
};

export const Profil = ({ className }) => {
    const { t, i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [profileData, setProfileData] = useState(null);
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
        if (clientId && mounted) {
            const getUserProfile = async () => {
                try {
                    const data = await fetchUserProfile(clientId);
                    if (data.success) {
                        setProfileData(data.data);
                    } else {
                        console.error(data.message);
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                }
            };

            getUserProfile();
        }
    }, [clientId, mounted]);

    if (!mounted) {
        return null;
    }

    const countryName = profileData?.country ? 
        getCountryName(profileData.country, i18n.language) || profileData.country 
        : '';

    return (
        <section className={`${className}`}>
            <div className="container mx-auto p-4 text-sm text-black flex flex-col gap-8 py-8 justify-center">
                <h1 className="text-2xl font-montserrat-bold text-gray-800" data-aos="fade-up">
                    {t("profile.title")}
                </h1>
                <div className='flex flex-col max-w-4xl container gap-8 mx-auto justify-center' data-aos="fade-up">
                    <div className="w-full flex p-4 items-center justify-center">
                        <div className="h-44 w-44 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <UserIcon className="text-zinc-500 h-32 w-32" />
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white shadow-md transition-transform transform hover:scale-105" data-aos="fade-up">
                        {profileData ? (
                            <ul className="w-full space-y-2">
                                {Object.entries({
                                    [t("signup.lastNameLabel")]: profileData.surname,
                                    [t("signup.firstNameLabel")]: profileData.name,
                                    [t("signup.genderLabel")]: profileData.sexe === "M" ? t("signup.genderMale") : t("signup.genderFemale"),
                                    [t("signup.countryLabel")]: countryName,
                                    [t("signup.cityLabel")]: profileData.city,
                                    [t("signup.addressLabel")]: profileData.adress,
                                    [t("signup.zipLabel")]: profileData.zip,
                                    [t("signup.emailLabel")]: profileData.email,
                                    [t("signup.phoneLabel")]: profileData.tel,
                                    [t("signup.professionLabel")]: profileData.job,
                                    [t("signup.monthlyIncomeLabel")]: profileData.salary,
                                    [t("signup.maritalStatusLabel")]: profileData.situation,
                                    [t("signup.childrenCountLabel")]: profileData.children,
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
