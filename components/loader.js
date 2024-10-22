'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// export const LoadingIndicator = ({ loading }) => {
//     const { t } = useTranslation();

//     if (!loading) return null; // Ne rien afficher si pas en chargement

// return(
//     <div className="loading-indicator fixed w-full h-full left-0 right-0 bottom-0 top-0 bg-zinc-300 flex items-center justify-center">
//         <div className="">sdfjgfsdsdfvg</div>
//     </div>
// );
// };

// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';

export const ProgressLoadingIndicator = ({ loading }) => {
    const { t } = useTranslation();
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let interval;
        if (loading) {
            setVisible(true);
            setProgress(0);
            interval = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress < 90) {
                        const diff = 90 - oldProgress;
                        return Math.min(oldProgress + Math.random() * diff * 0.1, 90);
                    }
                    return oldProgress;
                });
            }, 100);
        } else {
            setProgress(100);
            const timeout = setTimeout(() => {
                setVisible(false);
            }, 500); // Attendre 500ms avant de cacher complètement l'indicateur
            return () => clearTimeout(timeout);
        }

        return () => clearInterval(interval);
    }, [loading]);

    if (!visible) return null;

    return (
        <div className="fixed top-[6.6rem] left-0 right-0 h-1 bg-gray-200 z-50">
            <div
                className="h-full bg-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
            />
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-sm text-gray-600">
                {t('navigation.loadingText')} {Math.round(progress)}%
            </div>
        </div>
    );
};