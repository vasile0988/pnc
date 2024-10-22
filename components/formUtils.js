// components/formUtils.js

export const validateField = (name, value, t, isRequired = false) => {
    let error = '';

    // Vérification si le champ est requis
    if (isRequired && !value.trim()) {
        error = t("contact.requiredField");
        return error; // Retourne immédiatement si requis
    }

    // Échapper les valeurs pour éviter XSS
    const sanitizedValue = value.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    switch (name) {
        case 'email':
            if (!sanitizedValue.trim()) {
                error = t("contact.requiredField");
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedValue)) {
                error = t("contact.emailFieldInvalid");
            }
            break;
        default:
            // Ne pas afficher d'erreur si le champ est optionnel et que l'utilisateur est en train de saisir
            if (isRequired && !sanitizedValue.trim()) {
                error = t("contact.requiredField");
            }
            break;
    }
    return error;
};

export const handleInputChange = (nameOrEvent, valueOrNothing, setFormData, setTouched, setFormErrors, validateField, t) => {
    let name, value;

    if (typeof nameOrEvent === 'object' && nameOrEvent.target) {
        name = nameOrEvent.target.name;
        value = nameOrEvent.target.value;
    } else {
        name = nameOrEvent;
        value = valueOrNothing;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));

    // Ne pas valider pour les champs optionnels lors de la saisie
    const isRequired = ['lastName', 'email', 'message'].includes(name);
    const error = isRequired ? validateField(name, value, t, true) : '';
    setFormErrors(prev => ({ ...prev, [name]: error }));
};

export const handleBlur = (name, value, setFormErrors, validateField, t) => {
    const isRequired = ['lastName', 'email', 'message'].includes(name);
    const error = validateField(name, value, t, isRequired); // Indiquer si le champ est requis
    setFormErrors(prev => ({ ...prev, [name]: error }));
};

// handleSubmit et autres fonctions restent inchangées


export const handleSubmit = (e, formData, setFormErrors, setTouched, validateField, t) => {
    e.preventDefault();
    const errors = {};
    Object.keys(formData).forEach(key => {
        const isRequired = ['lastName', 'email', 'message'].includes(key); // Indiquez ici les champs requis
        const error = validateField(key, formData[key], t, isRequired);
        if (error) {
            errors[key] = error;
        }
    });
    setFormErrors(errors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (Object.keys(errors).length === 0) {
        console.log("Formulaire soumis avec succès", formData);
    } else {
        console.log("Formulaire invalide", errors);
    }
};

export const renderInput = (name, label, type, formData, touched, formErrors, handleChange, handleFocus, handleBlur) => (
    <div className="relative mb-4">
      <label
        htmlFor={name}
        className={`absolute left-3 transition-all duration-200 cursor-text
          ${formData[name] ? 'text-xs -top-2.5 bg-white px-1' : 'top-3'}
          ${touched[name] ? (formErrors[name] ? 'text-red-500' : 'text-green-500') : 'text-gray-600'}
        `}
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className={getFieldClassName(name, touched, formErrors)}
        value={formData[name]}
        onChange={e => handleChange(e.target.name, e.target.value)}
        onFocus={() => handleFocus(name)}
        onBlur={() => handleBlur(name, formData[name])}
      />
      {formErrors[name] && touched[name] && (
        <p className="text-red-500 text-xs mt-1">{formErrors[name]}</p>
      )}
    </div>
);

export const handleFocus = (name, setTouched) => {
    setTouched(prev => ({ ...prev, [name]: true }));
};

export const getFieldClassName = (name, touched, formErrors) => {
    const baseClasses = "w-full px-4 py-3 bg-theme3 border-2 rounded-xl focus:outline-none focus:border-blue-500 ";
    if (touched[name] && !formErrors[name]) {
        return baseClasses + "border-green-500";
    } else if (touched[name] && formErrors[name]) {
        return baseClasses + "border-red-500";
    } else {
        return baseClasses + "border-gray-300";
    }
};
