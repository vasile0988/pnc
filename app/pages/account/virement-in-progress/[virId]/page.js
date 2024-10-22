// app/pages/account/virement-in-progress/[virId]/page.js
import { VirementInProgressPage } from './virementInProgressPage';
import { fetchVirements } from '@/api/request';

export async function generateStaticParams() {
  try {
    console.log("Génération des paramètres statiques pour les virements lancée");
    const response = await fetchVirements();
    // console.log("La réponse est: " + response.data)
    // Vérifie si la réponse contient la propriété data et si c'est un tableau
    if (!response || !response.data || !Array.isArray(response.data)) {
      // console.error("La réponse de fetchVirements n'est pas valide :", response);
      return [];
    }

    const virements = response.data;
    console.log("Nombre de virements récupérés :", virements.length);

    // Génère les paramètres pour chaque virement
    return virements.map((virement) => ({
      virId: virement.vir_id.toString(),
    }));
  } catch (error) {
    console.error("Erreur lors de la génération des paramètres statiques pour les virements :", error);
    return [];
  }
}

export default function Page({ params }) {
  return <VirementInProgressPage virId={params.virId} />;
}
