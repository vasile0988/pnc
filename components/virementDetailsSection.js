// components/virementDetailsSection.js

import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import Error from "@/components/error";
import VirementsList from "@/components/virementsList";
import VirementDetailsModal from "@/components/virementDetailsModal";
import { fetchDashboardData, fetchVirementDetails } from '@/api/request';

const VirementDetailsSection = ({ clientId }) => {
  const [loading, setLoading] = useState(true);
  const [virements, setVirements] = useState([]);
  const [error, setError] = useState(null);
  const [selectedVirement, setSelectedVirement] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadVirements = async () => {
      if (!clientId) return;

      setLoading(true);
      try {
        const encodedId = btoa(clientId.toString());
        const result = await fetchDashboardData(encodedId);
        if (result.success) {
          setVirements(result.virements);
        } else {
          setError(result.message);
        }
      } catch (error) {
        setError("Erreur lors du chargement des virements");
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    loadVirements();
  }, [clientId]);

  const handleVirementClick = async (virId) => {
    try {
      const data = await fetchVirementDetails(virId);
      if (data.success) {
        setSelectedVirement(data.data);
        setModalVisible(true);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Erreur lors de la récupération des détails du virement");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedVirement(null);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="max-w-4xl mx-auto p-4 container">
      <h1 className="text-3xl text-gray-800 font-montserrat-bold -mt-4 text-center mb-4">
        Virements
      </h1>
      <VirementsList virements={virements} onVirementClick={handleVirementClick} />
      {modalVisible && (
        <VirementDetailsModal virement={selectedVirement} onClose={closeModal} />
      )}
    </div>
  );
};

export default VirementDetailsSection;
