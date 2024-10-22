
import countries from 'i18n-iso-countries';
import {NotFoundIcon} from "@/components/icons";
import 'i18n-iso-countries/langs/fr.json';

// Fonction utilitaire pour le nom du pays
const getCountryName = (countryCode, language) => {
  try {
    countries.registerLocale(require(`i18n-iso-countries/langs/${language}.json`));
    return countries.getName(countryCode, language, { select: 'official' });
  } catch (error) {
    console.error("Erreur de traduction du pays:", error);
    return countryCode;
  }
};


// const countryName = selectedVirement ? getCountryName(selectedVirement.vir_country, 'fr') : '';

const VirementDetailsModal = ({ virement, onClose }) => {
    const countryName = virement ? getCountryName(virement.vir_country, 'fr') : '';
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl relative text-sm p-4 w-11/12 md:w-1/3 transition duration-300">
          <button onClick={onClose} className="absolute top-2 right-2 text-white duration-300 transition-colors rounded-xl p-2 bg-blue-500 hover:bg-blue-800">
            Fermer
          </button>
          <h2 className="text-xl font-bold mb-4">Détails du virement</h2>
          <ul className="space-y-2">
            <li className="flex justify-between items-center p-2 rounded-xl bg-theme3">
              <span className="font-montserrat-bold">Montant</span>
              <span className="text-zinc-500">€{virement.vir_amount}</span>
            </li>
            <li className="flex justify-between items-center p-2 rounded-xl bg-theme3">
              <span className="font-montserrat-bold">Motif</span>
              <span className="text-zinc-500">{virement.vir_motif}</span>
            </li>
            <li className="flex justify-between items-center p-2 rounded-xl bg-theme3">
              <span className="font-montserrat-bold">Destinataire</span>
              <span className="text-zinc-500">{virement.vir_to}</span>
            </li>
            <li className="flex justify-between items-center p-2 rounded-xl bg-theme3">
              <span className="font-montserrat-bold">Nom</span>
              <span className="text-zinc-500">{virement.vir_name} {virement.vir_surname}</span>
            </li>
            <li className="flex justify-between items-center p-2 rounded-xl bg-theme3">
              <span className="font-montserrat-bold">Email</span>
              <span className="text-zinc-500">{virement.vir_email}</span>
            </li>
            <li className="flex justify-between items-center p-2 rounded-xl bg-theme3">
              <span className="font-montserrat-bold">Adresse</span>
              <span className="text-zinc-500">{virement.vir_address}, {virement.vir_zip} {virement.vir_city}, {countryName}</span>
            </li>
            <li className="flex justify-between items-center p-2 rounded-xl bg-theme3">
              <span className="font-montserrat-bold">Code</span>
              <span className="text-zinc-500">{virement.vir_code}</span>
            </li>
            <li className="flex justify-between items-center p-2 rounded-xl bg-theme3">
              <span className="font-montserrat-bold">Pourcentage</span>
              <span className="text-zinc-500">{Math.floor(virement.vir_percent)}%</span>
            </li>
          </ul>
        </div>
      </div>
    );
  };
  
  export default VirementDetailsModal;
  