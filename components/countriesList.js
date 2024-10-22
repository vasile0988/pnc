// countriesList.js
import countries from 'i18n-iso-countries';
import 'i18n-iso-countries/langs/en.json';
import 'i18n-iso-countries/langs/fr.json';
import 'i18n-iso-countries/langs/es.json';
import 'i18n-iso-countries/langs/de.json';
import 'i18n-iso-countries/langs/pt.json';

const supportedLanguages = ['en', 'fr', 'es', 'de', 'pt'];

// Fonction pour récupérer la liste des pays
export const getCountriesList = (language) => {
  if (!supportedLanguages.includes(language)) {
    throw new Error(`Unsupported language: ${language}`);
  }

  countries.registerLocale(require(`i18n-iso-countries/langs/${language}.json`));

  return Object.entries(countries.getNames(language, { select: 'official' })).map(([code, name]) => ({
    code,
    name,
  }));
};
