// app/pages/account/virement-in-progress/[id]/getStaticPaths.js

import { fetchVirements } from '@/api/request';

export async function getStaticPaths() {
  // Récupérez tous les virements possibles
  const virements = await fetchVirements();

  // Générez les chemins pour chaque virement
  const paths = virements.map((virement) => ({
    params: { vir_id: virement.vir_id.toString() },
  }));

  return { paths, fallback: false };
}