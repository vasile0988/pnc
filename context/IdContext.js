import React, { createContext, useContext, useState, useEffect } from 'react';

const IdContext = createContext(null);

export const IdProvider = ({ children }) => {
    const [clientId, setClientId] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedClientId = localStorage.getItem('clientId');
            if (savedClientId) {
                setClientId(savedClientId);
                console.log('ID client récupéré:', savedClientId);
            }
        }
    }, []);

    const saveClientId = (newId) => {
        if (newId) {
            localStorage.setItem('clientId', newId);
            setClientId(newId);
            console.log('ID client sauvegardé:', newId);
        }
    };

    const clearClientId = () => {
        localStorage.removeItem('clientId');
        setClientId(null);
        console.log('ID client supprimé');
    };

    return (
        <IdContext.Provider value={{
            clientId,
            saveClientId,
            clearClientId,
            isAuthenticated: !!clientId
        }}>
            {children}
        </IdContext.Provider>
    );
};

export const useClientId = () => {
    const context = useContext(IdContext);
    if (!context) {
        throw new Error('useClientId doit être utilisé à l\'intérieur d\'un IdProvider');
    }
    return context;
};
