import { useState, useEffect } from 'react';
import { 
    fetchVirementDetails, 
    updateVirementProgress, 
    updateVirementInitPercent,
    updateVirementPercent
} from '@/api/request';

export const useVirementProgress = (virId) => {
    // États pour gérer la progression et l'affichage
    const [loading, setLoading] = useState(true);
    const [virementDetails, setVirementDetails] = useState(null);
    const [currentProgress, setCurrentProgress] = useState(0);
    const [targetProgress, setTargetProgress] = useState(0);
    const [showCodeForm, setShowCodeForm] = useState(false);
    const [error, setError] = useState(null);

    // Chargement initial des détails du virement
    useEffect(() => {
        const loadVirementDetails = async () => {
            if (!virId) return;

            try {
                const data = await fetchVirementDetails(virId);
                if (!data?.data) {
                    throw new Error('Données de virement non trouvées');
                }

                setVirementDetails(data.data);
                // Récupération des valeurs de progression
                const initialProgress = parseInt(data.data.vir_initPercent, 10) || 0;
                const targetProgress = parseInt(data.data.vir_percent, 10) || 0;

                setCurrentProgress(initialProgress);
                setTargetProgress(targetProgress);

                // Afficher le formulaire si on atteint la cible
                if (initialProgress >= targetProgress) {
                    setShowCodeForm(true);
                }
            } catch (err) {
                setError(err.message || 'Erreur lors du chargement des détails');
                console.error('Erreur de chargement:', err);
            } finally {
                setLoading(false);
            }
        };

        loadVirementDetails();
    }, [virId]);

    // Gestion de la progression animée
    useEffect(() => {
        if (!virementDetails || showCodeForm || currentProgress >= targetProgress) return;

        const progressInterval = setInterval(() => {
            setCurrentProgress(prev => {
                const next = prev + 1;
                if (next >= targetProgress) {
                    clearInterval(progressInterval);
                    setShowCodeForm(true);
                    return targetProgress;
                }
                return next;
            });
        }, 1000);

        return () => clearInterval(progressInterval);
    }, [virementDetails, targetProgress, showCodeForm, currentProgress]);

    // Mise à jour de vir_initPercent quand on atteint la cible
    useEffect(() => {
        const updateProgress = async () => {
            if (showCodeForm && currentProgress === targetProgress) {
                try {
                    // Mise à jour de vir_initPercent avec la valeur de vir_percent
                    await updateVirementInitPercent(virId, targetProgress);
                } catch (err) {
                    console.error('Erreur lors de la mise à jour:', err);
                    setError('Erreur lors de la mise à jour de la progression');
                }
            }
        };

        updateProgress();
    }, [showCodeForm, currentProgress, targetProgress, virId]);

    // Fonction de gestion de la vérification réussie du code
    const handleCodeSuccess = async () => {
        try {
            const newTargetProgress = Math.min(targetProgress + 10, 95);
            if (newTargetProgress > targetProgress) {
                // Mise à jour de vir_percent dans la base de données
                await updateVirementPercent(virId, newTargetProgress);
                setTargetProgress(newTargetProgress);
                setShowCodeForm(false); // Cacher le formulaire pour relancer la progression
            }
            return true;
        } catch (err) {
            console.error('Erreur lors de la mise à jour de la progression:', err);
            setError('Erreur lors de la mise à jour de la progression');
            return false;
        }
    };

    return {
        loading,
        virementDetails,
        currentProgress,
        targetProgress,
        showCodeForm,
        error,
        handleCodeSuccess
    };
};