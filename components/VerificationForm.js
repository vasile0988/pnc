import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { validateField, handleInputChange, renderInput } from './formUtils';
import { AlertMessage } from './alertMessage';
import { verifyVirementCode } from '@/api/request';

export const VerificationForm = ({ virId, onSuccess }) => {
    console.log("Le code que je reçoit est: "+virId)
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ verificationCode: '' });
    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');

    const handleCloseAlert = () => {
        setAlertMessage('');
        setAlertType('success');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const response = await verifyVirementCode(virId, formData.verificationCode);
            console.log("Response from API:", response); // Ajoutez ce log
    
            if (response.success) {
                setAlertMessage(t('virement.successMessage'));
                setAlertType('success');
                onSuccess?.(response.new_percent);
                setFormData({ verificationCode: '' });
            } else {
                setAlertMessage(t('virement.invalidCode'));
                setAlertType('error');
            }
        } catch (err) {
            setAlertMessage(t('virement.verificationError'));
            setAlertType('error');
        } finally {
            setLoading(false);
        }
    };
    
    // Ajoutez ce log pour voir si l'alerte est mise à jour
    useEffect(() => {
        console.log("Alert message:", alertMessage);
    }, [alertMessage]);
    

    // Gestion du focus sur les champs
    const handleFocus = (name) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        setFormErrors(prev => ({ ...prev, [name]: undefined }));
    };

    // Gestion de la perte de focus (blur) pour valider les champs
    const handleBlur = (name, value) => {
        const error = validateField(name, value, t, true);
        setFormErrors(prev => ({ ...prev, [name]: error }));
    };

    // Gestion des changements de valeur dans les champs
    const handleChange = (name, value) => {
        handleInputChange(name, value, setFormData, setTouched, setFormErrors, validateField, t);
    };

    // Fonction de soumission du formulaire
    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     // Validation des champs avant soumission
    //     const errors = {};
    //     Object.keys(formData).forEach(key => {
    //         const error = validateField(key, formData[key], t, true);
    //         if (error) errors[key] = error;
    //     });

    //     // Mettre à jour l'état avec les erreurs
    //     setFormErrors(errors);
    //     setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    //     // Si pas d'erreurs, procéder à la vérification du code
    //     if (Object.keys(errors).length === 0) {
    //         setLoading(true);
    //         try {
    //             const response = await verifyVirementCode(virId, formData.verificationCode);
                
    //             // Si la vérification est réussie, procéder à la mise à jour du pourcentage
    //             if (response.success) {
    //                 await updateVirementPercent(virId);
    //                 setAlertMessage(t('virement.successMessage'));
    //                 setAlertType('success');
    //                 onSuccess?.();
    //             } else {
    //                 // Si le code est invalide, afficher un message d'erreur
    //                 const errorMessage = t('virement.invalidCode');
    //                 setAlertMessage(errorMessage);
    //                 setAlertType('error');
    //                 setFormErrors(prev => ({ ...prev, verificationCode: errorMessage }));
    //             }
    //         } catch (err) {
    //             // En cas d'erreur, afficher un message d'erreur générique
    //             const errorMessage = t('virement.verificationError');
    //             setAlertMessage(errorMessage);
    //             setAlertType('error');
    //             setFormErrors(prev => ({ ...prev, verificationCode: errorMessage }));
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    // };


    return (
        <>
            <section className="w-full">
                <form onSubmit={handleSubmit} className="p-4 mx-auto gap-4 flex flex-col rounded-2xl bg-white shadow-lg shadow-zinc-200">
                    {renderInput(
                        'verificationCode',
                        t("virement.codeVerification"),
                        'text',
                        formData,
                        touched,
                        formErrors,
                        handleChange,
                        handleFocus,
                        handleBlur
                    )}

                    <div className="flex flex-col gap-4 items-center justify-center w-full">
                        <button 
                            type="submit" 
                            className="rounded-xl p-3 text-white transition-all duration-200 bg-blue-500 hover:bg-blue-800 border-zinc-500 w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle 
                                            className="opacity-25" 
                                            cx="12" 
                                            cy="12" 
                                            r="10" 
                                            stroke="currentColor" 
                                            strokeWidth="4"
                                        />
                                        <path 
                                            className="opacity-75" 
                                            fill="currentColor" 
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    {t("virement.verifying")}
                                </span>
                            ) : (
                                t("virement.submitButton")
                            )}
                        </button>
                    </div>
                </form>
            </section>
            <AlertMessage 
                message={alertMessage}
                type={alertType}
                onClose={handleCloseAlert}
            />
        </>
    );
}; 
