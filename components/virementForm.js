"use client";
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/navigation';
import { useClientId } from '@/context/IdContext';
import { fetchUserProfile, submitVirementForm } from '../api/request';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { getCountriesList } from './countriesList';

// Fonctions de validation
const validateField = (name, value, t) => {
  if (!value || value.trim() === '') {
    return t('virement.required');
  }

  switch (name) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return t('virement.invalidEmail');
      }
      break;

    case 'vir_amount':
      const amount = parseFloat(value);
      if (isNaN(amount) || amount <= 0) {
        return t('virement.invalidAmount');
      }
      break;

    case 'zip':
      const zipRegex = /^\d{5}$/;
      if (!zipRegex.test(value)) {
        return t('virement.invalidZip');
      }
      break;
  }

  return null;
};

// Fonction pour le rendu des champs de saisie
const renderInput = (name, label, type, formData, touched, formErrors, handleChange, handleFocus, handleBlur, additionalProps = {}) => {
  const value = formData[name] || '';
  const error = formErrors[name];
  const isTouched = touched[name];

  return (
    <div className="relative mb-4">
      <label 
        htmlFor={name}
        className={`absolute left-3 transition-all duration-200 ${
          value ? 'text-xs -top-2 bg-white px-2' : 'top-4'
        } cursor-text`}
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={(e) => handleChange(name, e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-full px-4 py-3 bg-theme3 border-2 border-zinc-300 rounded-xl focus:outline-none focus:border-theme-primary"
        {...additionalProps}
      />
      {error && isTouched && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export const VirementForm = ({ className }) => {
  // Hooks de traduction et contexte
  const { t, i18n } = useTranslation();
  const { clientId } = useClientId(); 
  const router = useRouter();

  // États du composant
  const [userBalance, setUserBalance] = useState(0);
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    address: '',
    zip: '',
    city: '',
    country: '',
    vir_amount: '',
    vir_motif: '',
    vir_to: '',
    clientId: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [countryOptions, setCountryOptions] = useState([]);

  // Gestionnaires d'événements
  const handleChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Validation du champ
    const error = validateField(name, value, t);
    setFormErrors(prevState => ({
      ...prevState,
      [name]: error
    }));

    // Marquer le champ comme touché
    setTouched(prevState => ({
      ...prevState,
      [name]: true
    }));
  };

  const handleFocus = (fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };

  const handleBlur = (fieldName, value) => {
    const error = validateField(fieldName, value, t);
    setFormErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  // Effet pour charger le profil utilisateur
  useEffect(() => {
    const getUserProfile = async () => {
      if (clientId) {
        try {
          const decodedId = atob(clientId);
          setFormData(prevState => ({ ...prevState, clientId: decodedId }));

          const data = await fetchUserProfile(clientId);
          if (data.success) {
            setUserBalance(parseFloat(data.data.solde) || 0);
            setFormData(prevState => ({
              ...prevState,
              lastName: data.data.surname || '',
              firstName: data.data.name || '',
              email: data.data.email || '',
              address: data.data.adress || '',
              zip: data.data.zip || '',
              city: data.data.city || '',
              country: data.data.country || '',
            }));
          } else {
            console.error(data.message);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du profil:", error);
          setFormErrors(prevState => ({
            ...prevState,
            general: t("virement.profileError")
          }));
        }
      }
    };

    getUserProfile();
  }, [clientId, t]);

  // Effet pour l'initialisation des pays
  useEffect(() => {
    AOS.init({ duration: 500, easing: 'ease-in-out' });

    const updateCountryOptions = () => {
      const currentLanguage = i18n.language.split('-')[0];
      const countries = getCountriesList(currentLanguage);
      setCountryOptions(countries);
    };

    updateCountryOptions();
    i18n.on('languageChanged', updateCountryOptions);

    return () => {
      i18n.off('languageChanged', updateCountryOptions);
    };
  }, [i18n]);

  // Fonction pour formater la date
  const formatDateForMySQL = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().slice(0, 19).replace('T', ' ');
  };

  // Gestionnaire de soumission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    // Validation du montant
    if (parseFloat(formData.vir_amount) > userBalance) {
      errors.vir_amount = t("virement.insufficientBalance");
    }

    // Validation de tous les champs
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key], t);
      if (error) errors[key] = error;
    });

    const currentDateTime = new Date();
    const formattedDate = formatDateForMySQL(currentDateTime);
    const submitData = {
      ...formData,
      vir_date: formattedDate
    };

    setFormErrors(errors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (Object.keys(errors).length === 0) {
      try {
        const response = await submitVirementForm(submitData);
        if (response.success) {
          setUserBalance(prev => prev - parseFloat(formData.vir_amount));
          setFormData(prevState => ({
            ...prevState,
            vir_amount: '',
            vir_motif: '',
            vir_to: ''
          }));
          router.push('/pages/account/dashboard');
        } else {
          setFormErrors({ general: response.message });
        }
      } catch (error) {
        console.error('Erreur lors du virement:', error);
        setFormErrors({ general: t("virement.generalError") });
      }
    }
  };

  // Rendu du composant
  return (
    <section className={`w-full ${className}`}>
      <form onSubmit={handleFormSubmit} className="lg:max-w-3xl max-w-[90%] p-4 mx-auto gap-4 flex flex-col rounded-2xl bg-white shadow-lg shadow-zinc-200">
        <input type="hidden" name="clientId" value={formData.clientId} />

        <div className="flex sm:flex-row flex-col w-full sm:items-start items-center gap-3">
          <div className="sm:flex-1 w-full">
            {renderInput('lastName', t("virement.lastNameLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('lastName'), () => handleBlur('lastName', formData.lastName))}
          </div>
          <div className="sm:flex-1 w-full">
            {renderInput('firstName', t("virement.firstNameLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('firstName'), () => handleBlur('firstName', formData.firstName))}
          </div>
        </div>

        {renderInput('email', t("virement.emailLabel"), 'email', formData, touched, formErrors, handleChange, () => handleFocus('email'), () => handleBlur('email', formData.email))}

        <div className="flex sm:flex-row flex-col w-full sm:items-start items-center gap-3">
          <div className="sm:flex-1 w-full">
            {renderInput('address', t("virement.addressLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('address'), () => handleBlur('address', formData.address))}
          </div>
          <div className="sm:flex-1 w-full">
            {renderInput('zip', t("virement.zipLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('zip'), () => handleBlur('zip', formData.zip))}
          </div>
        </div>

        {renderInput('city', t("virement.cityLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('city'), () => handleBlur('city', formData.city))}

        <div className="relative mb-4">
          <label htmlFor="country" className="absolute left-3 transition-all duration-200 cursor-text">
            {t("virement.countryLabel")}
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={e => handleChange('country', e.target.value)}
            onFocus={() => handleFocus('country')}
            onBlur={() => handleBlur('country', formData.country)}
            className="w-full px-4 py-4 bg-theme3 border-2 rounded-xl focus:outline-none focus:border-theme-primary"
          >
            <option value="">{t("virement.selectCountry")}</option>
            {countryOptions.map(({ code, name }) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
          {formErrors.country && touched.country && (
            <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>
          )}
        </div>

        <div className="flex sm:flex-row flex-col w-full sm:items-start items-center gap-3">
          <div className="sm:flex-1 w-full">
            {renderInput('vir_to', t("virement.recipientLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('vir_to'), () => handleBlur('vir_to', formData.vir_to))}
          </div>
          <div className="sm:flex-1 w-full">
            <div className="relative">
              {renderInput('vir_amount', t("virement.amountLabel"), 'number', formData, touched, formErrors, handleChange, () => handleFocus('vir_amount'), () => handleBlur('vir_amount', formData.vir_amount), {
                max: userBalance,
                min: 0,
                step: "0.01"
              })}
              <div className="text-sm text-gray-600 mt-1">
                {t("virement.availableBalance")}: {userBalance.toFixed(2)} €
              </div>
            </div>
          </div>
        </div>

        {renderInput('vir_motif', t("virement.motifLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('vir_motif'), () => handleBlur('vir_motif', formData.vir_motif))}

        <div className="">
          <button type="submit" className="rounded-xl b-2 p-2 text-white transition-all duration-200 bg-blue-500 hover:bg-blue-800 border-zinc-500 w-full">
            <span>{t("virement.submitButton")}</span>
          </button>
        </div>

        {formErrors.general && (
          <p className="text-red-500 text-xs mt-1">{formErrors.general}</p>
        )}
      </form>
    </section>
  );
};