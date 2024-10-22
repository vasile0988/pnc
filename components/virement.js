// // components/Virement.js

// import React, { useState, useEffect } from 'react';
// import { useTranslation } from 'next-i18next';
// import { useClientId } from '@/context/IdContext'; // Import du contexte ID
// import AOS from 'aos';
// import 'aos/dist/aos.css';
// import { AlertMessage } from './alertMessage';
// import { updateUserSettings, fetchUserProfile } from '../api/request';
// import {
//     validateField,
//     handleInputChange,
//     renderInput,
// } from './formUtils';

// export const Virement = ({ className }) => {
//     return(
//         <section className={className}>
//             <div className="container ">

//             </div>
//         </section>
//     );
// }
// components/Virement.js

"use client"
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { VirementForm } from './virementForm';

export const Virement = ({ className }) => {
    const { t, i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    return (
        <section className={className}>
            <div className="container mx-auto py-8 flex flex-col gap-8">
                <h2 className="text-2xl font-montserrat-bold text-gray-800 font-bold">{t("virement.title")}</h2>
                <VirementForm className="mx-auto container" />
            </div>
        </section>
    );
};
