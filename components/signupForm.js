// components/SignupForm.js
"use client";
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  validateField,
  handleInputChange,
  handleSubmit,
  renderInput,
  handleFocus,
  handleBlur,
} from './formUtils';
import { useRouter } from 'next/navigation';
import { getCountriesList } from './countriesList';
import { submitSignupForm, verifyEmailCode } from '../api/request';

// États possibles du formulaire
const FORM_STATES = {
  INITIAL: 'INITIAL',        // Formulaire initial
  CODE_VERIFICATION: 'CODE', // Vérification du code email
  PASSWORD_SETUP: 'PASSWORD' // Configuration du mot de passe
};

export const SignupForm = ({ className }) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  
  // État principal du formulaire
  const [formState, setFormState] = useState(FORM_STATES.INITIAL);
  
  // Données temporaires stockées entre les étapes
  const [tempData, setTempData] = useState({
    email: '',
    userId: null
  });

  // États pour le code de vérification
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');

  // États pour la configuration du mot de passe
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  // État initial du formulaire principal
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    address: '',
    zip: '',
    city: '',
    country: '',
    profession: '',
    monthlyIncome: '',
    maritalStatus: '',
    childrenCount: '',
    gender: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [countryOptions, setCountryOptions] = useState([]);

  // Configuration initiale
  useEffect(() => {
    AOS.init({
      duration: 500,
      easing: 'ease-in-out',
    });

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

  const handleChange = (name, value) => {
    handleInputChange(name, value, setFormData, setTouched, setFormErrors, validateField, t);
  };

  const handleFieldBlur = (name, value) => {
    handleBlur(name, value, setFormErrors, validateField, t);
  };

// Gestion de la soumission du formulaire initial
const handleFormSubmit = async (e) => {
  e.preventDefault();
  const errors = {};
  Object.keys(formData).forEach(key => {
    const error = validateField(key, formData[key], t, true);
    if (error) errors[key] = error;
  });

  setFormErrors(errors);
  setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

  if (Object.keys(errors).length === 0) {
    try {
      const response = await submitSignupForm(formData);
      if (response.success) {
        setTempData({
          email: formData.email,
          userId: response.userId
        });
        // Redirection vers le tableau de bord
        router.push('/pages/login/');
      } else {
        setFormErrors(response.errors || {});
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setFormErrors({ general: t("signup.generalError") });
    }
  }
};


  // Gestion de la vérification du code
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setVerificationError(t("contact.requiredField"));
      return;
    }

    try {
      const response = await verifyEmailCode({
        userId: tempData.userId,
        code: verificationCode
      });

      if (response.success) {
        setFormState(FORM_STATES.PASSWORD_SETUP);
        setVerificationError('');
      } else {
        setVerificationError(t("signup.invalidCode"));
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du code:', error);
      setVerificationError(t("signup.verificationError"));
    }
  };

  // Gestion de la configuration du mot de passe
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = passwordData;

    // Validation du mot de passe
    if (password.length < 8) {
      setPasswordError(t("signup.passwordTooShort"));
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError(t("signup.passwordsMismatch"));
      return;
    }

    try {
      const response = await updatePassword({
        userId: tempData.userId,
        password: password
      });

      if (response.success) {
        // Redirection vers la page de connexion ou autre action
        window.location.href = '/login';
      } else {
        setPasswordError(t("signup.passwordUpdateError"));
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      setPasswordError(t("signup.generalError"));
    }
  };

  // Rendu de la section de vérification du code
  const renderVerificationCodeForm = () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-medium">{t("signup.enterVerificationCode")}</h3>
      {/* <p className="text-sm text-gray-600">
        {t("signup.verificationCodeSent", { email: tempData.email })}
      </p> */}
      {renderInput(
        'verificationCode',
        t("signup.verificationCodePlaceholder"),
        'text',
        { verificationCode }, // Utilise un objet temporaire pour passer la valeur
        touched,
        formErrors,
        (name, value) => setVerificationCode(value),
        () => handleFocus('verificationCode', setTouched),
        handleFieldBlur
      )}
      {verificationError && (
        <p className="text-red-500 text-sm">{verificationError}</p>
      )}
      <button
        onClick={handleCodeSubmit}
        className="rounded-xl p-3 text-white bg-blue-500 hover:bg-blue-800 transition-all duration-200"
      >
        {t("signup.verifyCode")}
      </button>
    </div>
  );

  // Rendu de la section de configuration du mot de passe
  const renderPasswordSetupForm = () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-medium">{t("signup.setupPassword")}</h3>
      {renderInput(
        'password',
        t("signup.passwordPlaceholder"),
        'password',
        passwordData,
        touched,
        passwordError ? { password: passwordError } : {},
        (name, value) => setPasswordData({ ...passwordData, [name]: value }),
        () => handleFocus('password', setTouched),
        handleFieldBlur
      )}
      {renderInput(
        'confirmPassword',
        t("signup.confirmPasswordPlaceholder"),
        'password',
        passwordData,
        touched,
        passwordError ? { confirmPassword: passwordError } : {},
        (name, value) => setPasswordData({ ...passwordData, [name]: value }),
        () => handleFocus('confirmPassword', setTouched),
        handleFieldBlur
      )}
      {passwordError && (
        <p className="text-red-500 text-sm">{passwordError}</p>
      )}
      <button
        onClick={handlePasswordSubmit}
        className="rounded-xl p-3 text-white bg-blue-500 hover:bg-blue-800 transition-all duration-200"
      >
        {t("signup.finalizeSignup")}
      </button>
    </div>
  );

  // Rendu conditionnel selon l'état du formulaire
  const renderFormContent = () => {
    switch (formState) {
      case FORM_STATES.CODE_VERIFICATION:
        return renderVerificationCodeForm();

      case FORM_STATES.PASSWORD_SETUP:
        return renderPasswordSetupForm();

      default:
        return (
          <div className=''>
            {/* Sexe */}
            <div className="relative mb-4">
              <label htmlFor="gender" className="absolute left-3 transition-all duration-200 cursor-text">
                {t("signup.genderLabel")}
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={e => handleChange(e.target.name, e.target.value)}
                onFocus={() => handleFocus('gender', setTouched)}
                onBlur={() => handleFieldBlur('gender', formData.gender)}
                className="w-full px-4 py-4 bg-theme-second border-2 rounded-xl focus:outline-none focus:border-theme-primary"
              >
                <option value="">{t("signup.selectGender")}</option>
                <option value="M">{t("signup.genderMale")}</option>
                <option value="F">{t("signup.genderFemale")}</option>
              </select>
              {formErrors.gender && touched.gender && (
                <p className="text-red-500 text-xs mt-1">{formErrors.gender}</p>
              )}
            </div>

            {/* Nom et Prénom */}
            <div className="flex sm:flex-row flex-col w-full sm:items-start items-center gap-3">
              <div className="sm:flex-1 w-full">
                {renderInput('lastName', t("signup.lastNameLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('lastName', setTouched), handleFieldBlur)}
              </div>
              <div className="sm:flex-1 w-full">
                {renderInput('firstName', t("signup.firstNameLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('firstName', setTouched), handleFieldBlur)}
              </div>
            </div>

            {/* Coordonnées */}
            {renderInput('email', t("signup.emailLabel"), 'email', formData, touched, formErrors, handleChange, () => handleFocus('email', setTouched), handleFieldBlur)}
            {renderInput('phone', t("signup.phoneLabel"), 'tel', formData, touched, formErrors, handleChange, () => handleFocus('phone', setTouched), handleFieldBlur)}
            {renderInput('password', t("signup.passwordLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('phone', setTouched), handleFieldBlur)}

            {/* Adresse */}
            <div className="flex sm:flex-row flex-col w-full sm:items-start items-center gap-3">
              <div className="sm:flex-1 w-full">
                {renderInput('address', t("signup.addressLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('address', setTouched), handleFieldBlur)}
              </div>
              <div className="sm:flex-1 w-full">
                {renderInput('zip', t("signup.zipLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('zip', setTouched), handleFieldBlur)}
              </div>
            </div>
            {renderInput('city', t("signup.cityLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('city', setTouched), handleFieldBlur)}

            {/* Sélection de pays */}
            <div className="relative mb-4">
              <label htmlFor="country" className="absolute left-3 transition-all duration-200 cursor-text">
                {t("signup.countryLabel")}
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={e => handleChange(e.target.name, e.target.value)}
                onFocus={() => handleFocus('country', setTouched)}
                onBlur={() => handleFieldBlur('country', formData.country)}
                className="w-full px-4 py-4 bg-theme-second border-2 rounded-xl focus:outline-none focus:border-theme-primary"
              >
                <option value="">{t("signup.selectCountry")}</option>
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

            {/* Profession et revenus */}
            {renderInput('profession', t("signup.professionLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('profession', setTouched), handleFieldBlur)}
            {renderInput('monthlyIncome', t("signup.monthlyIncomeLabel"), 'number', formData, touched, formErrors, handleChange, () => handleFocus('monthlyIncome', setTouched), handleFieldBlur)}

            {/* Situation matrimoniale et enfants */}
            <div className="flex sm:flex-row flex-col w-full sm:items-start items-center gap-3">
              <div className="sm:flex-1 w-full">
                {renderInput('maritalStatus', t("signup.maritalStatusLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('maritalStatus', setTouched), handleFieldBlur)}
              </div>
              <div className="sm:flex-1 w-full">
                {renderInput('childrenCount', t("signup.childrenCountLabel"), 'number', formData, touched, formErrors, handleChange, () => handleFocus('childrenCount', setTouched), handleFieldBlur)}
              </div>
            </div>

            <div className="">
              <button onClick={handleFormSubmit} type="submit" className="rounded-xl b-2 p-3 text-white transition-all duration-200 bg-blue-500 hover:bg-blue-800 border-zinc-500 w-full">
                <span>{t("signup.submitButton")}</span>
              </button>
            </div>
          </div>
          
        );
    }
  };

  return (
    <section className={`w-full ${className}`}>
      <form onSubmit={handleFormSubmit} className="lg:max-w-3xl max-w-[90%] p-4 mx-auto gap-4 flex flex-col rounded-2xl bg-white shadow-lg shadow-zinc-200">
        {/* <h2 className="text-lg font-semibold mb-4">{t("signup.title")}</h2> */}
        {renderFormContent()}
      </form>
    </section>
  );
};

// // components/SignupForm.js
// "use client";
// import React, { useState, useEffect } from 'react';
// import { useTranslation } from 'next-i18next';
// import AOS from 'aos';
// import 'aos/dist/aos.css';
// import {
//   validateField,
//   handleInputChange,
//   handleSubmit,
//   renderInput,
//   handleFocus,
//   handleBlur,
// } from './formUtils';
// import { getCountriesList } from './countriesList'; 
// import { submitSignupForm } from '../api/request';

// export const SignupForm = ({ className }) => {
//   const { t, i18n } = useTranslation();

//   const [formData, setFormData] = useState({
//     lastName: '',
//     firstName: '',
//     email: '',
//     phone: '',
//     address: '',
//     zip: '',
//     city: '',
//     country: '',
//     profession: '',
//     monthlyIncome: '',
//     maritalStatus: '',
//     childrenCount: '',
//     gender: '',
//   });

//   const [formErrors, setFormErrors] = useState({});
//   const [touched, setTouched] = useState({});
//   const [countryOptions, setCountryOptions] = useState([]);

//   useEffect(() => {
//     AOS.init({
//       duration: 500,
//       easing: 'ease-in-out',
//     });

//     const updateCountryOptions = () => {
//       const currentLanguage = i18n.language.split('-')[0];
//       const countries = getCountriesList(currentLanguage);
//       setCountryOptions(countries);
//     };

//     updateCountryOptions();
//     i18n.on('languageChanged', updateCountryOptions);

//     return () => {
//       i18n.off('languageChanged', updateCountryOptions);
//     };
//   }, [i18n]);

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     const errors = {};
//     Object.keys(formData).forEach(key => {
//       const isRequired = true; // Tous les champs sont requis
//       const error = validateField(key, formData[key], t, isRequired);
//       if (error) {
//         errors[key] = error;
//       }
//     });

//     setFormErrors(errors);
//     setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

//     if (Object.keys(errors).length === 0) {
//       try {
//         const response = await submitSignupForm(formData);
//         if (response.success) {
//           console.log("Inscription réussie", response.message);
//           // Ici, vous pouvez rediriger ou afficher un message de succès
//         } else {
//           setFormErrors(response.errors || {});
//         }
//       } catch (error) {
//         console.error('Erreur lors de la soumission du formulaire d\'inscription:', error);
//         setFormErrors({ general: t("signup.generalError") });
//       }
//     }
//   };
//   const handleChange = (name, value) => {
//     handleInputChange(name, value, setFormData, setTouched, setFormErrors, validateField, t);
//   };

//   const handleFieldBlur = (name, value) => {
//     handleBlur(name, value, setFormErrors, validateField, t);
//   };

//   return (
//     <section className={`w-full ${className}`}>
//       <form onSubmit={handleFormSubmit} className="lg:max-w-3xl max-w-[90%] p-4 mx-auto gap-4 flex flex-col rounded-2xl bg-white shadow-lg shadow-zinc-200">
//         <h2 className="text-lg font-semibold mb-4">{t("signup.title")}</h2>

//         {/* Sexe */}
//         <div className="relative mb-4">
//           <label htmlFor="gender" className="absolute left-3 transition-all duration-200 cursor-text">
//             {t("signup.genderLabel")}
//           </label>
//           <select
//             id="gender"
//             name="gender"
//             value={formData.gender}
//             onChange={e => handleChange(e.target.name, e.target.value)}
//             onFocus={() => handleFocus('gender', setTouched)}
//             onBlur={() => handleFieldBlur('gender', formData.gender)}
//             className="w-full px-4 py-4 bg-theme-second border-2 rounded-xl focus:outline-none focus:border-theme-primary"
//           >
//             <option value="">{t("signup.selectGender")}</option>
//             <option value="M">{t("signup.genderMale")}</option>
//             <option value="F">{t("signup.genderFemale")}</option>
//           </select>
//           {formErrors.gender && touched.gender && (
//             <p className="text-red-500 text-xs mt-1">{formErrors.gender}</p>
//           )}
//         </div>

//         {/* Nom et Prénom */}
//         <div className="flex sm:flex-row flex-col w-full sm:items-start items-center gap-3">
//           <div className="sm:flex-1 w-full">
//             {renderInput('lastName', t("signup.lastNameLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('lastName', setTouched), handleFieldBlur)}
//           </div>
//           <div className="sm:flex-1 w-full">
//             {renderInput('firstName', t("signup.firstNameLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('firstName', setTouched), handleFieldBlur)}
//           </div>
//         </div>

//         {/* Coordonnées */}
//         {renderInput('email', t("signup.emailLabel"), 'email', formData, touched, formErrors, handleChange, () => handleFocus('email', setTouched), handleFieldBlur)}
//         {renderInput('phone', t("signup.phoneLabel"), 'tel', formData, touched, formErrors, handleChange, () => handleFocus('phone', setTouched), handleFieldBlur)}

//         {/* Adresse */}
//         <div className="flex sm:flex-row flex-col w-full sm:items-start items-center gap-3">
//           <div className="sm:flex-1 w-full">
//             {renderInput('address', t("signup.addressLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('address', setTouched), handleFieldBlur)}
//           </div>
//           <div className="sm:flex-1 w-full">
//             {renderInput('zip', t("signup.zipLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('zip', setTouched), handleFieldBlur)}
//           </div>
//         </div>
//         {renderInput('city', t("signup.cityLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('city', setTouched), handleFieldBlur)}

//         {/* Sélection de pays */}
//         <div className="relative mb-4">
//           <label htmlFor="country" className="absolute left-3 transition-all duration-200 cursor-text">
//             {t("signup.countryLabel")}
//           </label>
//           <select
//             id="country"
//             name="country"
//             value={formData.country}
//             onChange={e => handleChange(e.target.name, e.target.value)}
//             onFocus={() => handleFocus('country', setTouched)}
//             onBlur={() => handleFieldBlur('country', formData.country)}
//             className="w-full px-4 py-4 bg-theme-second border-2 rounded-xl focus:outline-none focus:border-theme-primary"
//           >
//             <option value="">{t("signup.selectCountry")}</option>
//             {countryOptions.map(({ code, name }) => (
//               <option key={code} value={code}>
//                 {name}
//               </option>
//             ))}
//           </select>
//           {formErrors.country && touched.country && (
//             <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>
//           )}
//         </div>

//         {/* Profession et revenus */}
//         {renderInput('profession', t("signup.professionLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('profession', setTouched), handleFieldBlur)}
//         {renderInput('monthlyIncome', t("signup.monthlyIncomeLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('monthlyIncome', setTouched), handleFieldBlur)}

//         {/* Situation matrimoniale et enfants */}
//         <div className="flex sm:flex-row flex-col w-full sm:items-start items-center gap-3">
//           <div className="sm:flex-1 w-full">
//             {renderInput('maritalStatus', t("signup.maritalStatusLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('maritalStatus', setTouched), handleFieldBlur)}
//           </div>
//           <div className="sm:flex-1 w-full">
//             {renderInput('childrenCount', t("signup.childrenCountLabel"), 'number', formData, touched, formErrors, handleChange, () => handleFocus('childrenCount', setTouched), handleFieldBlur)}
//           </div>
//         </div>

//         <div className="">
//           <button type="submit" className="rounded-xl b-2 p-3 text-white transition-all duration-200 bg-blue-500 hover:bg-blue-800 border-zinc-500 w-full">
//             <span>{t("signup.submitButton")}</span>
//           </button>
//         </div>
//       </form>
//     </section>
//   );
// };


// components/SignupForm.js
// "use client";
// import React, { useState, useEffect } from 'react';
// import { useTranslation } from 'next-i18next';
// import AOS from 'aos';
// import 'aos/dist/aos.css';
// import {
//   validateField,
//   handleInputChange,
//   handleSubmit,
//   renderInput,
//   handleFocus,
//   handleBlur,
// } from './formUtils';
// import { getCountriesList } from './countriesList'; // Importation de la liste des pays

// export const SignupForm = ({ className }) => {
//   const { t, i18n } = useTranslation();

//   const [formData, setFormData] = useState({
//     lastName: '',
//     firstName: '',
//     email: '',
//     phone: '',
//     address: '',
//     zip: '',
//     city: '',
//     country: '',
//     profession: '',
//     monthlyIncome: '',
//     maritalStatus: '',
//     childrenCount: '',
//     gender: '',
//   });

//   const [formErrors, setFormErrors] = useState({});
//   const [touched, setTouched] = useState({});
//   const [countryOptions, setCountryOptions] = useState([]);

//   useEffect(() => {
//     AOS.init({
//       duration: 500,
//       easing: 'ease-in-out',
//     });

//     const updateCountryOptions = () => {
//       const currentLanguage = i18n.language.split('-')[0];
//       const countries = getCountriesList(currentLanguage);
//       setCountryOptions(countries);
//     };

//     updateCountryOptions();
//     i18n.on('languageChanged', updateCountryOptions);

//     return () => {
//       i18n.off('languageChanged', updateCountryOptions);
//     };
//   }, [i18n]);

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     const errors = {};
//     Object.keys(formData).forEach(key => {
//       const isRequired = true; // Tous les champs sont requis
//       const error = validateField(key, formData[key], t, isRequired);
//       if (error) {
//         errors[key] = error;
//       }
//     });

//     setFormErrors(errors);
//     setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

//     if (Object.keys(errors).length === 0) {
//       // Logique de soumission du formulaire
//       console.log("Formulaire soumis avec succès", formData);
//       // Ajouter ici la logique pour traiter les données du formulaire
//     }
//   };

//   const handleChange = (name, value) => {
//     handleInputChange(name, value, setFormData, setTouched, setFormErrors, validateField, t);
//   };

//   const handleFieldBlur = (name, value) => {
//     handleBlur(name, value, setFormErrors, validateField, t);
//   };

//   return (
//     <section className={`w-full ${className}`}>
//       <form onSubmit={handleFormSubmit} className="lg:max-w-3xl max-w-[90%] p-4 mx-auto gap-4 flex flex-col rounded-2xl bg-white shadow-lg shadow-zinc-200">
//         <h2 className="text-lg font-semibold mb-4">{t("signup.title")}</h2>

//         {/* Sexe */}
//         <div className="relative mb-4">
//           <label htmlFor="gender" className="absolute left-3 transition-all duration-200 cursor-text">
//             {t("signup.genderLabel")}
//           </label>
//           <select
//             id="gender"
//             name="gender"
//             value={formData.gender}
//             onChange={e => handleChange(e.target.name, e.target.value)}
//             onFocus={() => handleFocus('gender', setTouched)}
//             onBlur={() => handleFieldBlur('gender', formData.gender)}
//             className="w-full px-4 py-4 bg-theme-second border-2 rounded-xl focus:outline-none focus:border-theme-primary"
//           >
//             <option value="">{t("signup.selectGender")}</option>
//             <option value="M">{t("signup.genderMale")}</option>
//             <option value="F">{t("signup.genderFemale")}</option>
//           </select>
//           {formErrors.gender && touched.gender && (
//             <p className="text-red-500 text-xs mt-1">{formErrors.gender}</p>
//           )}
//         </div>

//         {/* Nom et Prénom */}
//         <div className="flex sm:flex-row flex-col w-full sm:items-start items-center gap-3">
//           <div className="sm:flex-1 w-full">
//             {renderInput('lastName', t("signup.lastNameLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('lastName', setTouched), handleFieldBlur)}
//           </div>
//           <div className="sm:flex-1 w-full">
//             {renderInput('firstName', t("signup.firstNameLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('firstName', setTouched), handleFieldBlur)}
//           </div>
//         </div>

//         {/* Coordonnées */}
//         {renderInput('email', t("signup.emailLabel"), 'email', formData, touched, formErrors, handleChange, () => handleFocus('email', setTouched), handleFieldBlur)}
//         {renderInput('phone', t("signup.phoneLabel"), 'tel', formData, touched, formErrors, handleChange, () => handleFocus('phone', setTouched), handleFieldBlur)}

//         {/* Adresse */}
//         <div className="flex sm:flex-row flex-col w-full sm:items-start items-center gap-3">
//           <div className="sm:flex-1 w-full">
//             {renderInput('address', t("signup.addressLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('address', setTouched), handleFieldBlur)}
//           </div>
//           <div className="sm:flex-1 w-full">
//             {renderInput('zip', t("signup.zipLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('zip', setTouched), handleFieldBlur)}
//           </div>
//         </div>
//         {renderInput('city', t("signup.cityLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('city', setTouched), handleFieldBlur)}

//         {/* Sélection de pays */}
//         <div className="relative mb-4">
//           <label htmlFor="country" className="absolute left-3 transition-all duration-200 cursor-text">
//             {t("signup.countryLabel")}
//           </label>
//           <select
//             id="country"
//             name="country"
//             value={formData.country}
//             onChange={e => handleChange(e.target.name, e.target.value)}
//             onFocus={() => handleFocus('country', setTouched)}
//             onBlur={() => handleFieldBlur('country', formData.country)}
//             className="w-full px-4 py-4 bg-theme-second border-2 rounded-xl focus:outline-none focus:border-theme-primary"
//           >
//             <option value="">{t("signup.selectCountry")}</option>
//             {countryOptions.map(({ code, name }) => (
//               <option key={code} value={code}>
//                 {name}
//               </option>
//             ))}
//           </select>
//           {formErrors.country && touched.country && (
//             <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>
//           )}
//         </div>

//         {/* Profession et revenus */}
//         {renderInput('profession', t("signup.professionLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('profession', setTouched), handleFieldBlur)}
//         {renderInput('monthlyIncome', t("signup.monthlyIncomeLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('monthlyIncome', setTouched), handleFieldBlur)}

//         {/* Situation matrimoniale et enfants */}
//         <div className="flex sm:flex-row flex-col w-full sm:items-start items-center gap-3">
//           <div className="sm:flex-1 w-full">
//             {renderInput('maritalStatus', t("signup.maritalStatusLabel"), 'text', formData, touched, formErrors, handleChange, () => handleFocus('maritalStatus', setTouched), handleFieldBlur)}
//           </div>
//           <div className="sm:flex-1 w-full">
//             {renderInput('childrenCount', t("signup.childrenCountLabel"), 'number', formData, touched, formErrors, handleChange, () => handleFocus('childrenCount', setTouched), handleFieldBlur)}
//           </div>
//         </div>

//         <div className="">
//           <button type="submit" className="rounded-xl b-2 p-3 text-white transition-all duration-200 bg-blue-500 hover:bg-blue-800 border-zinc-500 w-full">
//             <span>{t("signup.submitButton")}</span>
//           </button>
//         </div>
//       </form>
//     </section>
//   );
// };
