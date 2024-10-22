// app/pages/admin/clientDetails/[id]/page.js
import { ClientDetailsPage } from './clientDetailsPage';
import { fetchClients } from '@/api/request';

export async function generateStaticParams() {
  // console.log("Lancé");
  const response = await fetchClients();

  // Vérifie si l'objet réponse contient bien une propriété `data` qui est un tableau
  if (!response || !response.data || !Array.isArray(response.data)) {
    console.error("La réponse de fetchClients n'est pas valide :", response);
    throw new Error("La réponse de fetchClients n'est pas valide");
  }

  const clients = response.data;
  // console.log(clients)
  return clients.map((client) => ({
    id: client.cli_id.toString(),
  }));
}

export default async function Page({ params }) {

  return <ClientDetailsPage clientId={params.id} />;
}