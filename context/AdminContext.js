// context/AdminContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
    const [adminId, setAdminId] = useState(null);

    useEffect(() => {
        // Récupération de l'ID admin au chargement initial
        if (typeof window !== 'undefined') {
            const savedAdminId = localStorage.getItem('adminId');
            if (savedAdminId) {
                setAdminId(savedAdminId);
                console.log('ID admin récupéré:', savedAdminId);
            }
        }
    }, []);

    const saveAdminId = (newId) => {
        if (newId) {
            localStorage.setItem('adminId', newId);
            setAdminId(newId);
            console.log('ID admin sauvegardé:', newId);
        }
    };

    const clearAdminId = () => {
        localStorage.removeItem('adminId');
        setAdminId(null);
        console.log('ID admin supprimé');
    };

    return (
        <AdminContext.Provider value={{
            adminId,
            saveAdminId,
            clearAdminId,
            isAdminAuthenticated: !!adminId
        }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdminId = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdminId doit être utilisé à l\'intérieur d\'un AdminProvider');
    }
    return context;
};
