import { NotFoundIcon } from "@/components/icons";

const VirementsList = ({ virements, onVirementClick }) => (
  <div className="w-full bg-white rounded-2xl shadow-xl shadow-zinc-300 p-4 flex flex-col gap-4">
    {virements.length === 0 ? (
      <div className="text-zinc-500 flex flex-col py-8 items-center">
        <NotFoundIcon className="h-20 w-20" />
        <span>Aucun virement trouvé</span>
      </div>
    ) : (
      virements.map((virement, index) => (
        <li key={virement.vir_id} className="list-none text-sm flex flex-row gap-2 bg-theme3 rounded-xl p-2 w-full items-center justify-between">
          <span className="text-gray-800 font-montserrat-bold">{index + 1}</span>
          <span>{new Date(virement.vir_date).toLocaleString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          })}</span>
          <span>€{Number(virement.vir_amount).toFixed(2)}</span>
          <span className="text-wrap break-all overflow-wrap">{virement.vir_to}</span>
          <span>
            <button 
              onClick={() => onVirementClick(virement.vir_id)}
              className="px-2 py-1 text-white bg-blue-500 hover:bg-blue-800 transition-colors duration-300 rounded-md"
            >
              Voir
            </button>
          </span>
        </li>
      ))
    )}
  </div>
);

export default VirementsList;
