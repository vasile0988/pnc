import React, { useState, useEffect, useCallback } from 'react'; 
import { useRouter } from 'next/navigation'; 
import { useTranslation } from 'next-i18next'; 
import { fetchVirementDetails, updateVirementInitPercent } from '@/api/request'; 
import { VerificationForm } from './VerificationForm'; 
import { ProgressBar } from './ProgressBar'; 
import countries from 'i18n-iso-countries';
import 'i18n-iso-countries/langs/fr.json'; // Assurez-vous d'importer la langue nécessaire
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

export const VirementInProgress = ({ className, virId }) => {     
    const { t, i18n } = useTranslation();     
    const router = useRouter();     
    const [virementDetails, setVirementDetails] = useState(null);     
    const [currentProgress, setCurrentProgress] = useState(0);     
    const [targetProgress, setTargetProgress] = useState(0);     
    const [showVerificationForm, setShowVerificationForm] = useState(false);     
    console.log(virId)
    const fetchDetails = useCallback(async () => {         
        try {             
            const details = await fetchVirementDetails(virId);             
            setVirementDetails(details.data);             
            console.log(details.data)
            setCurrentProgress(Math.floor(details.data.vir_initPercent));             
            setTargetProgress(Math.floor(details.data.vir_percent)); 
            if (details.data.vir_initPercent === details.data.vir_percent) {
                setShowVerificationForm(true);
            }        
        } catch (error) {             
            console.error("Erreur lors de la récupération des détails du virement:", error);         
        }     
    }, [virId]);      

    useEffect(() => {         
        fetchDetails();     
    }, [fetchDetails]);      

    useEffect(() => {         
        if (currentProgress < targetProgress) {             
            const timer = setTimeout(() => {                 
                setCurrentProgress(prev => {                     
                    const next = prev + 1;                     
                    if (next >= targetProgress) {                         
                        updateVirementInitPercent(virementDetails.vir_id, targetProgress);                         
                        setShowVerificationForm(true);                         
                        return targetProgress;                     
                    }                     
                    return next;                 
                });             
            }, 1000); // Progression de 1% par seconde              

            return () => clearTimeout(timer);         
        }     
    }, [currentProgress, targetProgress, virementDetails]);      

    const handleVerificationSuccess = async (newPercent) => {
        setShowVerificationForm(false);
        setTargetProgress(newPercent);
        if (newPercent >= 95) {
            router.push("/pages/account/dashboard/");
        }
    };

    const countryName = virementDetails?.vir_country ? 
        getCountryName(virementDetails.vir_country, i18n.language) || virementDetails.vir_country 
        : '';

    // Rendu du composant
    return (
        <section className={`${className}`}>
            <div className="container mx-auto p-4 text-sm text-black flex flex-col gap-8 py-8 justify-center">
                <h1 className="text-2xl font-montserrat-bold text-gray-800" data-aos="fade-up">
                    {t("virement.title")}
                </h1>
                <div className='flex flex-col max-w-4xl container gap-8 mx-auto justify-center'>
                    {virementDetails && (
                        <div className='max-w-4xl mx-auto container flex flex-col gap-8 p-4'>
                            <div className='rounded-2xl text-sm p-4 flex flex-col gap-2 bg-white shadow-md shadow-zinc-300'>
                                <li className='flex flex-row gap-2 p-2 rounded-xl bg-theme3 text-sm items-center justify-between'>
                                    <span className='font-montserrat-bold'>{t("virement.beneficiare")}</span>
                                    <span className=''>{virementDetails.vir_name} {virementDetails.vir_surname}</span>
                                </li>
                                <li className='flex flex-row gap-2 p-2 rounded-xl bg-theme3 text-sm items-center justify-between'>
                                    <span className='font-montserrat-bold'>{t("virement.emailLabel")}</span>
                                    <span className=''>{virementDetails.vir_email}</span>
                                </li>
                                <li className='flex flex-row gap-2 p-2 rounded-xl bg-theme3 text-sm items-center justify-between'>
                                    <span className='font-montserrat-bold'>{t("virement.amountLabel")}</span>
                                    <span className=''>€{virementDetails.vir_amount}</span>
                                </li>
                                <li className='flex flex-row gap-2 p-2 rounded-xl bg-theme3 text-sm items-center justify-between'>
                                    <span className='font-montserrat-bold'>{t("virement.recipientLabel")}</span>
                                    <span className=''>€{virementDetails.vir_to}</span>
                                </li>
                                <li className='flex flex-row gap-2 p-2 rounded-xl bg-theme3 text-sm items-center justify-between'>
                                    <span className='font-montserrat-bold'>{t("virement.motifLabel")}</span>
                                    <span className=''>{virementDetails.vir_motif}</span>
                                </li>
                                <li className='flex flex-row gap-2 p-2 rounded-xl bg-theme3 text-sm items-center justify-between'>
                                    <span className='font-montserrat-bold'>{t("virement.addressLabel")}</span>
                                    <span className=''>{virementDetails.vir_zip}, {virementDetails.vir_address}, {virementDetails.vir_city}, {countryName}</span>
                                </li>
                                <li className='flex flex-row gap-2 p-2 rounded-xl bg-theme3 text-sm items-center justify-between'>
                                    <span className='font-montserrat-bold'>{t("virement.dateLabel")}</span>
                                    <span className=''>{virementDetails.vir_date}</span>
                                </li>
                                {/* Ajoutez d'autres détails du virement ici */}
                            </div>
                            <ProgressBar progress={currentProgress} isVisible={true} />
                            {showVerificationForm && (
                                <VerificationForm 
                                    virId={virId} 
                                    onSuccess={handleVerificationSuccess}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
