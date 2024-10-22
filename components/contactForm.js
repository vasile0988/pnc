import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
    validateField,
    getFieldClassName,
    handleInputChange,
    renderInput,
} from './formUtils';
import { submitContactForm } from '../api/request';
import { AlertMessage } from './alertMessage'; // Import du composant AlertMessage

export const ContactForm = ({ className }) => {
    const { t } = useTranslation();
    const textareaRef = useRef(null);

    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        email: '',
        phone: '',
        message: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [alertMessage, setAlertMessage] = useState(''); // Pour les messages
    const [alertType, setAlertType] = useState('success'); // Type de message
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 500, easing: 'ease-in-out' });
    }, []);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [formData.message]);

    const handleSubmitForm = async (e) => {
        e.preventDefault();
    
        const errors = {};
        Object.keys(formData).forEach((key) => {
            const isRequired = ['lastName', 'email', 'message'].includes(key);
            const error = validateField(key, formData[key], t, isRequired);
            if (error) errors[key] = error;
        });
    
        setFormErrors(errors);
        setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
        if (Object.keys(errors).length === 0) {
            setLoading(true);
            try {
                const response = await submitContactForm(formData);
                console.log('Réponse du serveur:', response);
    
                if (response.success) {
                    setFormData({ lastName: '', firstName: '', email: '', phone: '', message: '' });
                    setAlertMessage(t("contact.successMessage"));
                    setAlertType('success');
                } else {
                    setFormErrors(response.errors || {});
                    setAlertMessage(response.errors ? response.errors.join(', ') : t("contact.generalError"));
                    setAlertType('error');
                }
            } catch (error) {
                console.error('Une erreur est survenue lors de la soumission du formulaire:', error);
                setAlertMessage(t("contact.generalError"));
                setAlertType('error');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleChange = (name, value) => {
        handleInputChange(name, value, setFormData, setTouched, setFormErrors, validateField, t);
    };

    const handleFocus = (name) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        setFormErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleBlur = (name, value) => {
        const isRequired = ['lastName', 'email', 'message'].includes(name);
        const error = validateField(name, value, t, isRequired);
        setFormErrors(prev => ({ ...prev, [name]: error }));
    };

    return (
        <section className={`w-full ${className}`}>
            <form onSubmit={handleSubmitForm} className="lg:max-w-3xl max-w-[90%] p-4 mx-auto gap-4 flex flex-col rounded-2xl bg-white shadow-lg shadow-zinc-200">
                <div className="flex sm:flex-row flex-col w-full sm:items-start items-center gap-3">
                    <div className="sm:flex-1 w-full">
                        {renderInput('lastName', t("contact.nameFieldLabel"), 'text', formData, touched, formErrors, handleChange, handleFocus, handleBlur)}
                    </div>
                    <div className="sm:flex-1 w-full">
                        {renderInput('firstName', t("contact.surnameFieldLabel"), 'text', formData, touched, formErrors, handleChange, handleFocus, handleBlur)}
                    </div>
                </div>
                {renderInput('email', t("contact.emailFieldLabel"), 'email', formData, touched, formErrors, handleChange, handleFocus, handleBlur)}
                {renderInput('phone', t("contact.telephoneFieldLabel"), 'tel', formData, touched, formErrors, handleChange, handleFocus, handleBlur)}
                <div className="relative mb-4">
                    <label htmlFor="message" className={`absolute left-3 transition-all duration-200 cursor-text ${formData.message ? 'text-xs -top-2.5 bg-white px-1' : 'top-3'} ${touched.message ? (formErrors.message ? 'text-red-500' : 'text-green-500') : 'text-gray-600'}`}>
                        {t("contact.messageFieldLabel")}
                    </label>
                    <textarea
                        ref={textareaRef}
                        id="message"
                        name="message"
                        className={`resize-none overflow-hidden min-h-28 max-h-56 ${getFieldClassName('message', touched, formErrors)}`}
                        value={formData.message}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        onFocus={() => handleFocus('message')}
                        onBlur={() => handleBlur('message', formData.message)}
                        rows={1}
                    />
                    {formErrors.message && touched.message && <p className="text-red-500 text-xs mt-1">{formErrors.message}</p>}
                </div>
                
                <button type="submit" className="rounded-xl p-3 text-white transition-all duration-200 bg-blue-500 hover:bg-blue-800 border-zinc-500 w-full" disabled={loading}>
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>{t("contact.sending")}</span>
                        </span>
                    ) : (
                        <span>{t("contact.sendButton")}</span>
                    )}
                </button>

                {/* Intégration du composant AlertMessage pour les notifications */}
                <AlertMessage 
                    message={alertMessage}
                    type={alertType}
                    onClose={() => setAlertMessage('')}
                />
            </form>
        </section>
    );
};
