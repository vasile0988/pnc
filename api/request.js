// api/request.js

// soumission du formulaire de contact
export const submitContactForm = async (formData) => {
    try {
        // console.log('Envoi des données au serveur:', formData);
        
        const response = await fetch('http://localhost/pnc/php/contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const text = await response.text(); // Obtenir la réponse sous forme de texte
        console.log('Réponse brute du serveur:', text);

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = JSON.parse(text); // Puis parser en JSON
        // console.log('Réponse du serveur:', data);

        return data;
    } catch (error) {
        // console.error('Erreur lors de la soumission du formulaire:', error);
        throw error;
    }
};

// Soumission du formulaire de connexion

export const submitLoginForm = async (formData) => {
    try {
        // console.log('Envoi des données de connexion:', formData);
        
        const response = await fetch('http://localhost/pnc/php/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Erreur réseau');
        }

        const data = await response.json();
        // console.log('Réponse du serveur:', data);
        
        return data;
    } catch (error) {
        // console.error('Erreur lors de la requête:', error);
        throw error;
    }
};

// Soumission du formulaire de connexion

export const submitLoginFormAdmin = async (formData) => {
    try {
        // console.log('Envoi des données de connexion:', formData);
        
        const response = await fetch('http://localhost/pnc/php/login_admin.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Erreur réseau');
        }


        // const text = await response.text(); // Obtenir la réponse sous forme de texte
        // console.log('Réponse brute du serveur:', text);
        const data = await response.json();
        // console.log('Réponse du serveur:', data);
        
        return data;
    } catch (error) {
        // console.error('Erreur lors de la requête:', error);
        throw error;
    }
};

// Soumission du formulaire d'inscription
export const submitSignupForm = async (signupData) => {
    try {
        // console.log('Envoi des données d\'inscription au serveur:', signupData);
        
        const response = await fetch('http://localhost/pnc/php/signup.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signupData),
        });

        const text = await response.text(); // Obtenir la réponse sous forme de texte
        console.log('Réponse brute du serveur:', text);

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = JSON.parse(text); // Puis parser en JSON
        // console.log('Réponse du serveur:', data);

        return data;
    } catch (error) {
        // console.error('Erreur lors de la soumission du formulaire d\'inscription:', error);
        throw error;
    }
};

// Fonction pour récupérer les informations du profil
export const fetchUserProfile = async (userId) => {
    try {
        const response = await fetch(`http://localhost/pnc/php/profil.php?id=${userId}`, {
            method: 'GET', // Méthode HTTP pour récupérer les données
            headers: {
                'Content-Type': 'application/json', // Définir le type de contenu
            },
        });

        const text = await response.text(); // Obtenir la réponse sous forme de texte

        // Afficher le texte brut dans la console avant de parser
        // console.log('Réponse du serveur:', text); // Ajout du log

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`); // Gérer les erreurs de réponse
        }

        const data = JSON.parse(text); // Parser la réponse en JSON

        return data; // Retourner les données du profil
    } catch (error) {
        // console.error('Erreur lors de la récupération du profil:', error);
        throw error; // Lancer une erreur en cas de problème
    }
};

// Fonction pour récupérer les données du dashboard
export const fetchDashboardData = async (userId) => {
    try {
        const response = await fetch(`http://localhost/pnc/php/dashboard.php?id=${userId}`);
        
        // Obtenir la réponse sous forme de texte
        const text = await response.text();
        
        // Afficher le texte brut dans la console avant de parser
        // console.log('Réponse du serveur:', text);

        // Tenter de parser le texte en JSON
        const data = JSON.parse(text);

        if (!data.success) {
            throw new Error(data.message);
        }
        
        return data;
    } catch (error) {
        // console.error("Erreur lors de la récupération des données:", error);
        return { success: false, message: error.message };
    }
};

// Fonction pour mettre à jour les paramètres utilisateur
export const updateUserSettings = async (data) => {
    try {
        // Récupérer l'ID utilisateur depuis le localStorage ou le state de l'application
        const userId = localStorage.getItem('userId');
        if (!userId) {
            throw new Error('Utilisateur non connecté');
        }

        // Préparer les données à envoyer
        const requestData = {
            ...data,
            userId: atob(userId) // Décoder l'ID utilisateur
        };

        const response = await fetch('http://localhost/pnc/php/update-settings.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        const responseText = await response.text();
        // console.log('Réponse du serveur:', responseText);

        const responseData = JSON.parse(responseText);

        if (!responseData.success) {
            throw new Error(responseData.message || 'Erreur lors de la mise à jour');
        }

        return responseData;
    } catch (error) {
        // console.error('Erreur lors de la mise à jour des paramètres:', error);
        throw error;
    }
};


// Ajout de la fonction fetchNotifications aux fonctions existantes
export const fetchNotifications = async (userId) => {
    try {
        // Appel à l'API de notifications
        const response = await fetch(`http://localhost/pnc/php/notifications.php?id=${userId}`);
        
        // Récupérer le texte brut de la réponse
        const responseText = await response.text();
        // console.log('Réponse du serveur:', responseText); // Afficher le texte brut

        // Vérifier si la réponse est correcte
        if (!response.ok) {
            throw new Error(responseText || 'Erreur lors de la récupération des notifications');
        }

        // Parser la réponse JSON après l'affichage
        const data = JSON.parse(responseText);

        return data;
    } catch (error) {
        // console.error('Erreur lors de la récupération des notifications:', error);
        return {
            success: false,
            message: error.message
        };
    }
};


// Fonction pour marquer une notification comme lue
export const markNotificationAsRead = async (notificationId, userId) => {
    try {
        const response = await fetch(`http://localhost/pnc/php/mark_notification_read.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                notificationId,
                userId: userId
            })
        });

        // Lire la réponse comme texte brut
        const responseText = await response.text();
        // console.log('Réponse du serveur (texte brut):', responseText);

        // Vérifier si la réponse est correcte
        if (!response.ok) {
            throw new Error(responseText || 'Erreur lors du marquage de la notification');
        }

        // Parser la réponse JSON après l'avoir affichée
        const data = JSON.parse(responseText);
        return data;
    } catch (error) {
        // console.error('Erreur lors du marquage de la notification:', error);
        return {
            success: false,
            message: error.message
        };
    }
};


// Fonction pour marquer toutes les notifications comme lues
export const markAllNotificationsAsRead = async (userId) => {
    try {
        // console.log(userId)
        const response = await fetch(`http://localhost/pnc/php/mark_notification_read.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId })
        });

        const responseText = await response.text();
        // console.log("Raw response from virement PHP:", responseText);
        if (!response.ok) throw new Error(responseText || 'Erreur lors du marquage des notifications');

        return JSON.parse(responseText);
    } catch (error) {
        // console.error('Erreur lors du marquage de toutes les notifications:', error);
        return { success: false, message: error.message };
    }
};


// Ajout de la fonction pour soumettre le formulaire de virement
export const submitVirementForm = async (formData) => {
    try {
    //   console.log("Submitting virement data to API:", formData);
      const response = await fetch('http://localhost/pnc/php/virement.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      // Affiche le texte brut de la réponse
      const textResponse = await response.text();
      console.log("Raw response from virement PHP:", textResponse);
  
      // Parse le texte brut en JSON
      const data = JSON.parse(textResponse);
    //   console.log("Parsed response from virement PHP:", data);
  
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors du virement');
      }
  
      return data;
    } catch (error) {
    //   console.error('Error during virement submission:', error);
      throw error;
    }
  };


// Fonction pour récupérer les détails d'un virement par ID
export const fetchVirementDetails = async (virId) => {
    try {
        // console.log("Le virement ID est: " +  virId)
        const response = await fetch(`http://localhost/pnc/php/virementDetails.php?id=${virId}`); // Remplacez par votre API

        // Afficher le texte brut de la réponse
        const textResponse = await response.text();
        // console.log('Réponse brute du serveur:', textResponse); // Log du texte brut

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des détails du virement');
        }

        const data = JSON.parse(textResponse); // Parser le texte en JSON
        // console.log('Détails du virement récupérés:', data); // Log des détails du virement

        return data; // Assurez-vous que la réponse contient les détails du virement
    } catch (error) {
        // console.error('Erreur:', error);
        throw error; // Relancez l'erreur pour le gestionnaire d'erreur dans le composant
    }
};

// 
export const fetchVirements = async () => {
    try {
        const response = await fetch('http://localhost/pnc/php/get_virements.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des virements');
        }

        const data = await response.json();
        if (!data.success || !Array.isArray(data.data)) {
            throw new Error('La réponse du serveur n\'est pas valide');
        }

        return data; // Retourne le tableau de virements
    } catch (error) {
        console.error('Erreur lors de la récupération des virements:', error);
        throw error;
    }
};

// fonction pour faire la déconnexion
export const logout = (type) => {
    // Supprime l'ID utilisateur du localStorage
    const delt = type === "admin" ? "adminId" : "clientId";
    localStorage.removeItem(delt);
};

// 
// export const updateVirementProgress = async (virId) => {
//     try {
//         const response = await fetch('http://localhost/pnc/php/update_virement_progress.php', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ virId })
//         });

//         if (!response.ok) {
//             throw new Error('Erreur réseau');
//         }

//         const data = await response.json();
//         if (!data.success) {
//             throw new Error(data.message);
//         }

//         return data;
//     } catch (error) {
//         console.error('Erreur lors de la mise à jour de la progression:', error);
//         throw error;
//     }
// };

// 
// export const verifyVirementCode = async (virId, code) => {
//     try {
//         const response = await fetch('http://localhost/pnc/php/verify_virement_code.php', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ virId, code })
//         });

//         if (!response.ok) {
//             throw new Error('Erreur réseau');
//         }

//         const data = await response.json();
//         if (!data.success) {
//             throw new Error(data.message);
//         }

//         return data;
//     } catch (error) {
//         console.error('Erreur lors de la vérification du code:', error);
//         throw error;
//     }
// };

export const updateVirementProgress = async (virId) => {
    try {
        const response = await fetch('http://localhost/pnc/php/update_virement_progress.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ virId })
        });

        if (!response.ok) {
            throw new Error('Erreur réseau');
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la progression:', error);
        throw error;
    }
};

export const updateVirementInitPercent = async (virId, currentProgress) => {
    try {
        console.log(virId)
        const response = await fetch('http://localhost/pnc/php/update_virement_init_percent.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ virId, vir_initPercent: currentProgress })
        });

        if (!response.ok) {
            throw new Error('Erreur réseau');
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de vir_initPercent:', error);
        throw error;
    }
};

// 
export const updateVirementPercent = async (virId, newPercent) => {
    try {
        const response = await fetch('http://localhost/pnc/php/update_virement_percent.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ virId, vir_percent: newPercent })
        });

        if (!response.ok) {
            throw new Error('Erreur réseau');
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la progression:', error);
        throw error;
    }
};
// Fonction pour vérifier le code de virement
export const verifyVirementCode = async (virId, code) => {
    try {
        // console.log("Le code que je reçoit est: "+virId)
        const response = await fetch('http://localhost/pnc/php/verify_virement_code.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ virId, code })
        });

        // Vérification de la réponse réseau
        if (!response.ok) {
            throw new Error('Erreur réseau');
        }

        // Analyse de la réponse JSON
        const data = await response.json();
        
        // Vérification du succès de la réponse
        if (!data.success) {
            throw new Error(data.message);
        }

        return data; // Retourne les données en cas de succès
    } catch (error) {
        console.error('Erreur lors de la vérification du code:', error);
        throw error; // Relance l'erreur pour être gérée ailleurs
    }
};


// Fonction pour récupérer la liste de tous les clients
export const fetchClients = async () => {
    try {
      // Envoie une requête HTTP GET au serveur pour récupérer les clients.
      const response = await fetch('http://localhost/pnc/php/get_clients.php', {
        method: 'GET', // Méthode HTTP utilisée, ici GET pour récupérer les données.
        headers: {
          'Content-Type': 'application/json', // Indique que le type de contenu attendu est du JSON.
        },
      });
  
      // Lit la réponse en tant que texte brut.
      const text = await response.text();
    //   console.log('Réponse brute du serveur:', text); // Affiche la réponse brute pour le débogage.
  
      // Vérifie si la réponse HTTP n'est pas correcte (statut 200-299).
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`); // Lance une erreur si le statut n'est pas OK.
      }
  
      // Tente de convertir le texte en JSON seulement si le contenu semble être du JSON.
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        // Si le parsing échoue, on considère que le texte n'est pas du JSON valide.
        console.warn('La réponse n\'est pas un JSON valide, utilisation du texte brut.');
        data = text; // Assigne le texte brut comme valeur de retour.
      }
  
      // Retourne les données JSON ou le texte brut.
      return data;
    } catch (error) {
      // Capture les erreurs survenues durant la requête ou le parsing.
      console.error('Erreur lors de la récupération des clients:', error); // Affiche l'erreur pour le débogage.
      throw error; // Relance l'erreur pour la gérer ailleurs dans le code.
    }
  };
  

// Fonction pour récupérer les informations du profil
export const getAdminProfile = async (userId) => {
    try {
        console.log(`http://localhost/pnc/php/getAdmin.php?id=${userId}`)
        const response = await fetch(`http://localhost/pnc/php/getAdmin.php?id=${userId}`, {
            method: 'GET', // Méthode HTTP pour récupérer les données
            headers: {
                'Content-Type': 'application/json', // Définir le type de contenu
            },
        });

        const text = await response.text(); // Obtenir la réponse sous forme de texte

        // Afficher le texte brut dans la console avant de parser
        console.log('Réponse du serveur:', text); // Ajout du log

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`); // Gérer les erreurs de réponse
        }

        const data = JSON.parse(text); // Parser la réponse en JSON

        return data; // Retourner les données du profil
    } catch (error) {
        // console.error('Erreur lors de la récupération du profil:', error);
        throw error; // Lancer une erreur en cas de problème
    }
};


// Fonction pour mettre à jour les paramètres utilisateur
export const updateAdminSettings = async (data, adminId) => {
    try {
        if (!adminId) {
            throw new Error('ID administrateur requis');
        }

        // Préparer les données à envoyer
        const requestData = {
            ...data,
            adminId: adminId // Utiliser l'adminId directement
        };

        const response = await fetch('http://localhost/pnc/php/update-admin-settings.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        const responseText = await response.text();
        console.log(responseText)
        const responseData = JSON.parse(responseText);

        if (!responseData.success) {
            throw new Error(responseData.message || 'Erreur lors de la mise à jour');
        }

        return responseData;
    } catch (error) {
        throw error;
    }
};



// Fonction pour mettre à jour les paramètres utilisateur
// export const updateUserSettingsAdmin = async ({ userId, ...data }) => {
//     try {
//         // S'assurer que userId est décodé correctement
//         const decodedId = typeof userId === 'string' ? parseInt(atob(userId)) : userId;

//         // Préparer les données à envoyer
//         const requestData = {
//             userId: decodedId,
//             type,
//             ...data
//         };

//         const response = await fetch('http://localhost/pnc/php/update-admin-settings.php', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             credentials: 'include', // Ajouter pour gérer les sessions
//             body: JSON.stringify(requestData)
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         // Afficher le texte brut de la réponse
//         const textResponse = await response.text();
//         console.log('Réponse brute du serveur (update):', textResponse);

//         const responseData = JSON.parse(textResponse); // Parse le texte après l'affichage

//         if (!responseData.success) {
//             throw new Error(responseData.message || 'Erreur lors de la mise à jour');
//         }

//         return responseData;
//     } catch (error) {
//         console.error('Erreur updateUserSettingsAdmin:', error);
//         throw error;
//     }
// };

// Fonction pour récupérer les informations du profil
// export const fetchUserProfileAdmin = async (userId) => {
//     try {
//         // S'assurer que userId est décodé correctement
//         // const decodedId = typeof userId === 'string' ? parseInt(atob(userId)) : userId;
//         console.log(userId)
//         const response = await fetch(`http://localhost/pnc/php/profil.php?id=${userId}`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             credentials: 'include', // Ajouter pour gérer les sessions
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         // Afficher le texte brut de la réponse
//         const textResponse = await response.text();
//         console.log('Réponse brute du serveur (profile):', textResponse);

//         const data = JSON.parse(textResponse); // Parse le texte après l'affichage

//         if (!data.success) {
//             throw new Error(data.message || 'Erreur lors de la récupération du profil');
//         }

//         return data;
//     } catch (error) {
//         console.error('Erreur fetchUserProfileAdmin:', error);
//         throw error;
//     }
// };


export const sendMoneyFetch = async (formData) => {
    try {
        const response = await fetch('http://localhost/pnc/php/transfert-admin.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        return result; // Retourne le résultat pour une gestion ultérieure
    } catch (error) {
        console.error("Erreur lors du transfert:", error);
        throw new Error('Erreur lors de la soumission');
    }
};


export const fetchMessages = async () => {
    try {
        const response = await fetch('http://localhost/pnc/php/get-messages.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return data; // doit contenir { success: true, messages: [...] }
    } catch (error) {
        console.error("Erreur lors de la récupération des messages:", error);
        return { success: false, message: error.message };
    }
};
