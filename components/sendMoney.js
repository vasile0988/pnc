"use client";
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { AlertMessage } from './alertMessage';
import { validateField, handleInputChange, renderInput } from './formUtils';
import {sendMoneyFetch} from "@/api/request"

export const SendMoney = ({ clientId }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        amount: '',
        clientId: clientId, // Ajout du clientId
        dateTime: new Date().toISOString(), // Date-heure actuelle
    });
    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');

    const handleCloseAlert = () => {
        setAlertMessage('');
        setAlertType('success');
    };

    const handleFocus = (name) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        setFormErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleBlur = (name, value) => {
        const error = validateField(name, value, t, true);
        setFormErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleChange = (name, value) => {
        handleInputChange(name, value, setFormData, setTouched, setFormErrors, validateField, t);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const errors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key], t, true);
            if (error) errors[key] = error;
        });
    
        setFormErrors(errors);
        setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
        if (Object.keys(errors).length === 0) {
            setLoading(true);
            try {
                // Appel de la fonction sendMoney
                const result = await sendMoneyFetch(formData);
    
                if (result.success) {
                    setAlertMessage("Transfert effectué");
                    setAlertType('success');
                } else {
                    setAlertMessage(result.message || "Erreur");
                    setAlertType('error');
                }
            } catch (error) {
                setAlertMessage("Erreur");
                setAlertType('error');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 container">
            <h1 className="text-3xl text-gray-800 font-montserrat-bold text-center mb-4">
                Faire un transfert
            </h1>
            <section className={`w-full`}>
                <form onSubmit={handleSubmit} className="lg:max-w-3xl max-w-[90%] p-4 mx-auto gap-4 flex flex-col rounded-2xl bg-white shadow-lg shadow-zinc-200">
                    {renderInput('amount', 
                        "Montant", 
                        'number', 
                        formData, 
                        touched, 
                        formErrors,
                        handleChange,
                        handleFocus,
                        handleBlur
                    )}

                    <input type="hidden" name="clientId" value={formData.clientId} />
                    <input type="hidden" name="dateTime" value={formData.dateTime} />

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
                                    <span>Transfert encours</span>
                                </span>
                            ) : (
                                <span>Transférer</span>
                            )}
                        </button>
                    </div>
                </form>

                <AlertMessage 
                    message={alertMessage}
                    type={alertType}
                    onClose={handleCloseAlert}
                />
            </section>
        </div>
    );
};
