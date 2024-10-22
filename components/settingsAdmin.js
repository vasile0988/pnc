// components/settingsAdmin.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useId } from '@/context/IdContext';
import { useAdminId } from '@/context/AdminContext'; // Import du contexte ID
import AOS from 'aos';
import 'aos/dist/aos.css';
import { AlertMessage } from './alertMessage';
import { updateAdminSettings, getAdminProfile } from '../api/request';
import {
    validateField,
    handleInputChange,
    renderInput,
} from './formUtils';

export const Settings = ({ className }) => {
    const { t } = useTranslation();
    const { adminId } = useAdminId();
    // États pour le composant
    const [formData, setFormData] = useState({
        email: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [adminData, setAdminData] = useState(null);
    const [error, setError] = useState('');

    // Initialisation des animations AOS
        useEffect(() => {
        AOS.init({
            duration: 500,
            once: true,
            easing: 'ease-in-out',
        });
        setMounted(true);
    }, []);

    // Récupération des données utilisateur
    useEffect(() => {

        const fetchAdminProfile = async () => {
            if (adminId) {
                setLoading(true);
                try {
                    const response = await getAdminProfile(adminId);
                    if (response.success) {
                        setAdminData(response.data);
                        setFormData(prev => ({
                            ...prev,
                            email: response.data.email
                        }));
                    } else {
                        console.error(response.message);
                        setError(response.message);
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération du profil:", error);
                    setError(t("settings.fetchError"));
                } finally {
                    setLoading(false);
                }
            } else {
                setError('Accès non autorisé.');
            }
        };

        fetchAdminProfile();
    }, [adminId, t]);

    // Gestion de la fermeture de l'alerte
    const handleCloseAlert = () => {
        setAlertMessage('');
        setAlertType('success');
    };

    // Gestion du focus des champs
    const handleFocus = (name) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        setFormErrors(prev => ({ ...prev, [name]: undefined }));
    };

    // Gestion de la perte de focus
    const handleBlur = (name, value) => {
        const error = validateField(name, value, t, true);
        setFormErrors(prev => ({ ...prev, [name]: error }));
    };

    // Gestion du changement des champs
    const handleChange = (name, value) => {
        handleInputChange(name, value, setFormData, setTouched, setFormErrors, validateField, t);
    };

    // Validation des champs de mot de passe
    const validatePasswordFields = () => {
        const errors = {};
        const { oldPassword, newPassword, confirmPassword } = formData;

        if (!oldPassword) errors.oldPassword = t("settings.oldPasswordRequired");
        if (!newPassword) errors.newPassword = t("settings.newPasswordRequired");
        if (!confirmPassword) errors.confirmPassword = t("settings.confirmPasswordRequired");
        if (newPassword !== confirmPassword) {
            errors.confirmPassword = t("settings.passwordsDoNotMatch");
        }
        if (oldPassword === newPassword) {
            errors.newPassword = t("settings.passwordsMustBeDifferent");
        }

        return errors;
    };
// Soumission du formulaire email
const handleSubmitEmail = async (e) => {
    e.preventDefault();
    const errors = {};
    const emailError = validateField('email', formData.email, t, true);
    if (emailError) errors.email = emailError;

    setFormErrors(errors);
    setTouched({ email: true });

    if (Object.keys(errors).length === 0) {
        setLoading(true);
        try {
            const response = await updateAdminSettings({
                type: 'email',
                email: formData.email
            }, adminId); // Passer adminId ici
            setAlertMessage(t("settings.emailUpdated"));
            setAlertType('success');
            setIsEditingEmail(false);
        } catch (error) {
            console.error('Erreur de mise à jour email:', error);
            setAlertMessage(error.message || t("settings.updateError"));
            setAlertType('error');
        } finally {
            setLoading(false);
        }
    }
};

// Soumission du formulaire mot de passe
const handleSubmitPassword = async (e) => {
    e.preventDefault();
    const errors = validatePasswordFields();
    setFormErrors(errors);
    setTouched({
        oldPassword: true,
        newPassword: true,
        confirmPassword: true
    });

    if (Object.keys(errors).length === 0) {
        setLoading(true);
        try {
            const response = await updateAdminSettings({
                type: 'password',
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
            }, adminId); // Passer adminId ici
            setFormData(prev => ({
                ...prev,
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            }));
            setAlertMessage(t("settings.passwordChanged"));
            setAlertType('success');
            setIsEditingPassword(false);
        } catch (error) {
            console.error('Erreur de mise à jour du mot de passe:', error);
            setAlertMessage(error.message || t("settings.updateError"));
            setAlertType('error');
        } finally {
            setLoading(false);
        }
    }
};


    // Protection contre le rendu côté serveur
    if (!mounted) {
        return null;
    }

    return (
        <section className={`w-full  ${className}`}>
            <div className="container mx-auto py-8 px-4" data-aos="fade-up">
                <h1 className="text-2xl font-montserrat-bold mb-8 text-gray-800">
                    {t("settings.title", "Paramètres")}
                </h1>

                <div className="flex md:flex-row flex-col md:items-start md:justify-start gap-8 items-center justify-center">
                    {/* Section Email */}
                    <div className="bg-white rounded-2xl shadow-lg p-4 w-full">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {t("settings.emailSection")}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsEditingEmail(!isEditingEmail)}
                                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                                    isEditingEmail 
                                        ? 'bg-red-500 hover:bg-red-600' 
                                        : 'bg-blue-500 hover:bg-blue-600'
                                } text-white`}
                            >
                                {isEditingEmail ? t("settings.cancel") : t("settings.edit")}
                            </button>
                        </div>

                        {isEditingEmail ? (
                            <form onSubmit={handleSubmitEmail} className="space-y-4">
                                {/* Champ caché pour l'ID utilisateur */}
                                <input type="hidden" name="adminId" value={adminId} />
                                
                                {renderInput('email',
                                    t("settings.emailFieldLabel"),
                                    'email',
                                    formData,
                                    touched,
                                    formErrors,
                                    handleChange,
                                    handleFocus,
                                    handleBlur
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-xl p-3 text-white transition-all duration-200 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400"
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
                                            {t("settings.saving")}
                                        </span>
                                    ) : (
                                        t("settings.save")
                                    )}
                                </button>
                            </form>
                        ) : (
                            <p className="text-gray-600">{formData.email}</p>
                        )}
                    </div>

                    {/* Section Mot de passe */}
                    <div className="bg-white rounded-2xl shadow-lg p-4 w-full">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {t("settings.passwordSection")}
                            </h2>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditingPassword(!isEditingPassword);
                                    if (!isEditingPassword) {
                                        setFormData(prev => ({
                                            ...prev,
                                            oldPassword: '',
                                            newPassword: '',
                                            confirmPassword: ''
                                        }));
                                        setFormErrors({});
                                    }
                                }}
                                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                                    isEditingPassword 
                                        ? 'bg-red-500 hover:bg-red-600' 
                                        : 'bg-blue-500 hover:bg-blue-600'
                                } text-white`}
                            >
                                {isEditingPassword ? t("settings.cancel") : t("settings.edit")}
                            </button>
                        </div>

                        {isEditingPassword ? (
                            <form onSubmit={handleSubmitPassword} className="space-y-4">
                                {/* Champ caché pour l'ID utilisateur */}
                                <input type="hidden" name="adminId" value={adminId} />

                                {renderInput('oldPassword',
                                    t("settings.oldPasswordFieldLabel"),
                                    'password',
                                    formData,
                                    touched,
                                    formErrors,
                                    handleChange,
                                    handleFocus,
                                    handleBlur
                                )}

                                {renderInput('newPassword',
                                    t("settings.newPasswordFieldLabel"),
                                    'password',
                                    formData,
                                    touched,
                                    formErrors,
                                    handleChange,
                                    handleFocus,
                                    handleBlur
                                )}

                                {renderInput('confirmPassword',
                                    t("settings.confirmPasswordFieldLabel"),
                                    'password',
                                    formData,
                                    touched,
                                    formErrors,
                                    handleChange,
                                    handleFocus,
                                    handleBlur
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-xl p-3 text-white transition-all duration-200 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400"
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
                                            {t("settings.saving")}
                                        </span>
                                    ) : (
                                        t("settings.save")
                                    )}
                                </button>
                            </form>
                        ) : (
                            <p className="text-gray-600">{t("settings.passwordNotDisplayed")}</p>
                        )}
                    </div>
                </div>
            </div>

            {alertMessage && (
                <AlertMessage
                    message={alertMessage}
                    type={alertType}
                    onClose={handleCloseAlert}
                />
            )}
        </section>
    );
};