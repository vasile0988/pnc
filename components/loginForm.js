import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useTranslation } from 'next-i18next';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useClientId } from '@/context/IdContext'; // Importation correcte
import { useAdminId } from '@/context/AdminContext'; // Importation correcte
import { AlertMessage } from './alertMessage';
import {
    validateField,
    handleInputChange,
    renderInput,
} from './formUtils';
import { submitLoginForm, submitLoginFormAdmin } from '../api/request';

export const LoginForm = ({ className, api = "client" }) => {
    const { saveClientId, clearClientId } = useClientId(); // Utiliser le hook pour le client
    const { saveAdminId, clearAdminId } = useAdminId(); // Utiliser le hook pour l'admin
    const { t } = useTranslation();
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');

    useEffect(() => {
        AOS.init({
            duration: 500,
            easing: 'ease-in-out',
        });
    }, []);

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

    const handleLoginSuccess = async (response) => {
        if (response.success && response.id) {
            try {
                if (api === "client") {
                    await saveClientId(response.id);
                    setAlertMessage(t("login.successMessage"));
                    setAlertType('success');
                    router.push('/pages/account/dashboard');
                } else if (api === "admin") {
                    await saveAdminId(response.id);
                    setAlertMessage(t("login.successMessage"));
                    setAlertType('success');
                    router.push('/pages/admin/clients/');
                }
            } catch (error) {
                console.error("Erreur lors de la connexion:", error);
                setAlertMessage(t("login.generalError"));
                setAlertType('error');
                api === "client" ? clearClientId() : clearAdminId(); // Appel approprié
            }
        } else {
            setAlertMessage(t(response.message) || t("login.generalError"));
            setAlertType('error');
            api === "client" ? clearClientId() : clearAdminId(); // Appel approprié
        }
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
                if (isForgotPassword) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    setAlertMessage(t("login.recoveryCodeSent"));
                    setAlertType('success');
                } else {
                    const response = api === "client" 
                        ? await submitLoginForm(formData) 
                        : await submitLoginFormAdmin(formData);
                    await handleLoginSuccess(response);
                }
            } catch (error) {
                console.error("Erreur lors de la soumission:", error);
                setAlertMessage(error.message || t("login.generalError"));
                setAlertType('error');
                api === "client" ? clearClientId() : clearAdminId(); // Appel approprié
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <section className={`w-full ${className}`}>
            <form onSubmit={handleSubmit} className="lg:max-w-3xl max-w-[90%] p-4 mx-auto gap-4 flex flex-col rounded-2xl bg-white shadow-lg shadow-zinc-200">
                {renderInput('email', 
                    t("login.emailFieldLabel"), 
                    'email', 
                    formData, 
                    touched, 
                    formErrors,
                    handleChange,
                    handleFocus,
                    handleBlur
                )}
                {!isForgotPassword && renderInput('password', 
                    t("login.passwordFieldLabel"), 
                    'password', 
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
                                <span>
                                    {isForgotPassword ? t("login.sendCode") : t("login.loggingIn")}
                                </span>
                            </span>
                        ) : (
                            <span>
                                {isForgotPassword ? t("login.sendCode") : t("login.loginButton")}
                            </span>
                        )}
                    </button>

                    <button
                        type="button"
                        className="text-blue-500 hover:underline"
                        onClick={() => setIsForgotPassword(prev => !prev)}
                    >
                        {isForgotPassword ? t("login.backToLogin") : t("login.forgotPassword")}
                    </button>

                    {api === "client" && (
                        <Link 
                            href="/pages/signup/" 
                            className="text-blue-500 hover:underline mb-4"
                        >
                            {t("login.createAccount")}
                        </Link>
                    )}
                </div>
            </form>

            <AlertMessage 
                message={alertMessage}
                type={alertType}
                onClose={handleCloseAlert}
            />
        </section>
    );
};