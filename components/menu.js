'use client';
import Link from 'next/link';
import Image from 'next/image';
import { fetchNotifications, fetchMessages } from '../api/request'; 
import { ChevronDownIcon, MenuIcon, UserIcon, CloseIcon } from './icons';
import { useState, useEffect, useRef } from 'react';
import { flags, bankingLinks, borrowingLinks, menuStructure } from '../constantes/headerConstantes';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/navigation';

export const MenuDesktop = () => {
    const { t, i18n } = useTranslation();
    const [activeMenu, setActiveMenu] = useState(null);
    const [mounted, setMounted] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        setMounted(true);

        // Gestionnaire pour fermer le menu lors d'un clic en dehors
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fonction pour gérer l'ouverture/fermeture des menus de navigation
    const handleNavigationClick = (menu) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    // Fonction pour fermer le menu actif
    const closeActiveMenu = () => {
        setActiveMenu(null);
    };

    if (!mounted) {
        return null;
    }

    return (
        <nav className='lg:block hidden' ref={menuRef}>
            <ul className="flex items-center justify-between flex-row gap-4 text-black">
                <li className="relative">
                    <NavigationButton
                        buttonText={t('navigation.banking.title')}
                        onClick={() => handleNavigationClick('banking')}
                        isActive={activeMenu === 'banking'}
                    />
                    <div className={`
                        absolute left-1/2 transform -translate-x-1/2 
                        transition-all duration-300 
                        ${activeMenu === 'banking' ? 'opacity-100 visible z-50' : 'opacity-0 invisible z-0'}
                    `}>
                        <DropMenuNavigation className="w-72" tab={bankingLinks} onLinkClick={closeActiveMenu} />
                    </div>
                </li>
                
                {/* Répétez le même schéma pour les autres éléments du menu */}
                <li className="relative">
                    <NavigationButton
                        buttonText={t('navigation.borrowing.title')}
                        onClick={() => handleNavigationClick('borrowing')}
                        isActive={activeMenu === 'borrowing'}
                    />
                    <div className={`
                        absolute left-1/2 transform -translate-x-1/2
                        transition-all duration-300 
                        ${activeMenu === 'borrowing' ? 'opacity-100 visible z-50' : 'opacity-0 invisible z-0'}
                    `}>
                        <DropMenuNavigation className="w-72" tab={borrowingLinks} onLinkClick={closeActiveMenu} />
                    </div>
                </li>
                {/* Les liens "About Us" et "Contact Us" ferment également le menu actif */}
                <li>
                    <Link 
                        href="/pages/contact/" 
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
                        onClick={closeActiveMenu}
                    >
                        {t('navigation.contactUs')}
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

// Le composant DropMenuNavigation reste inchangé, mais il est inclus ici pour référence
const DropMenuNavigation = ({ tab, className, onLinkClick }) => {
    const { t } = useTranslation();
    return (
        <nav className={`${className} rounded-xl shadow-md shadow-slate-300 bg-white mt-2`}>
            <ul className="flex flex-col items-start gap-2 justify-center text-black py-2">
                {tab.map(({ link, linkText }) => (
                    <li className="w-full" key={linkText}>
                        <Link 
                            className="w-full flex px-4 py-2 hover:bg-gray-100 transition-colors duration-200" 
                            href={link}
                            onClick={onLinkClick} // Appel de la fonction pour fermer le menu
                        >
                            {t(linkText)}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

const NavigationButton = ({ buttonText, onClick, isActive }) => {
    return (
        <button 
            onClick={onClick} 
            className={`
                flex items-center gap-2 p-2 rounded-md transition-colors duration-200
                ${isActive ? 'bg-gray-100' : 'hover:bg-gray-100'}
            `}
        >
            <span>{buttonText}</span>
            <ChevronDownIcon className={`transition-all duration-300 text-black ${isActive ? "rotate-180" : ""}`} />
        </button>
    );
};

// menu sur mobile
export const MenuMobile = () => {
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeMainMenu, setActiveMainMenu] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const handleMainMenuClick = (menuKey) => {
        setActiveMainMenu(activeMainMenu === menuKey ? null : menuKey);
    };

    // Nouvelle fonction pour fermer le menu mobile
    const closeMenu = () => {
        setIsMenuOpen(false);
        setActiveMainMenu(null);
    };

    return (
        <div className="lg:hidden">
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center"
            >
                <MenuIcon />
            </button>

            <div className={`
                fixed inset-0 z-50 bg-white max-h-full overflow-auto transform transition-transform duration-300 ease-in-out
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">{t('navigation.menu')}</h2>
                    <button onClick={closeMenu} className="">
                        <CloseIcon />
                    </button>
                </div>

                <nav className="mt-4">
                    {Object.entries(menuStructure).map(([key, item]) => (
                        <div key={key} className="border-b">
                            {item.type === 'dropdown' ? (
                                <>
                                    <button
                                        onClick={() => handleMainMenuClick(key)}
                                        className="flex justify-between items-center w-full p-4"
                                    >
                                        {t(item.title)}
                                        <ChevronDownIcon 
                                            className={`transform transition-transform duration-300
                                            ${activeMainMenu === key ? 'rotate-0' : '-rotate-90'}`}
                                        />
                                    </button>
                                    
                                    <div className={`
                                        overflow-hidden transition-all duration-300
                                        ${activeMainMenu === key ? 'max-h-screen' : 'max-h-0'}
                                    `}>
                                        <div className="bg-gray-50 py-2">
                                            {item.subMenus.map(({ link, linkText }) => (
                                                <Link
                                                    key={linkText}
                                                    href={link}
                                                    className="block px-8 py-2 hover:bg-gray-100"
                                                    onClick={closeMenu} // Ajout de l'appel pour fermer le menu
                                                >
                                                    {t(linkText)}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <Link
                                    href={item.link}
                                    className="block w-full p-4 hover:bg-gray-100"
                                    onClick={closeMenu} // Ajout de l'appel pour fermer le menu
                                >
                                    {t(item.title)}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    );
};

// Menu pour la sélection de langue et pour le login
export const MenuLast = () => {
    const { t, i18n } = useTranslation();
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [activeLanguage, setActiveLanguage] = useState(null);

    useEffect(() => {
        const detectedLang = i18n.language || 
                            navigator.language?.split('-')[0] || 
                            'en';
        
        const supportedLang = flags.some(flag => flag.text.toLowerCase() === detectedLang.toLowerCase())
            ? detectedLang
            : 'en';
        
        setActiveLanguage(supportedLang);
        i18n.changeLanguage(supportedLang);
    }, [i18n]);

    const handleLanguageChange = async (lang) => {
        try {
          await i18n.changeLanguage(lang);
          setActiveLanguage(lang);
          setIsLangMenuOpen(false);
          
          // Optionnel: Ajoutez un log pour déboguer
        //   console.log('Language changed to:', lang);
        //   console.log('Current translations:', i18n.getDataByLanguage(lang));
        } catch (error) {
        //   console.error('Error changing language:', error);
        }
      };
    

    if (!activeLanguage) return null;

    const activeFlag = flags.find(flag => flag.text.toLowerCase() === activeLanguage.toLowerCase());

    return (
        <nav className='flex flex-row gap-8 items-center justify-between text-black'>
        <li className='lg:block hidden hover:bg-gray-100 p-2 rounded-md'>
            <Link href="/pages/login/"><UserIcon/></Link>
        </li>
            <div className="relative">
                <button 
                    className="flex gap-2 items-center hover:bg-gray-100 p-2 rounded-md"
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                >
                    <Image
                        src={activeFlag.src}
                        alt={activeFlag.alt}
                        height={25}
                        width={25}
                        className="rounded-sm"
                    />
                    <span>{activeFlag.text}</span>
                    <ChevronDownIcon 
                        height={18} 
                        width={18} 
                        className={`transition-all duration-300 ${isLangMenuOpen ? "rotate-180" : ""}`}
                    />
                </button>
                
                {isLangMenuOpen && (
                    <DropMenuLang 
                        activeLanguage={activeLanguage}
                        onLanguageChange={handleLanguageChange}
                    />
                )}
            </div>
        </nav>
    );
};

// sous-menu des langues
export const DropMenuLang = ({ activeLanguage, onLanguageChange }) => {
    const availableFlags = flags.filter(
        flag => flag.text.toLowerCase() !== activeLanguage.toLowerCase()
    );

    return (
        <nav className="absolute w-20 rounded-xl shadow-md shadow-slate-300 p-2 top-full right-0 mt-2 bg-white">
            <ul className="flex flex-col items-center gap-2 justify-center">
                {availableFlags.map((flag) => (
                    <li key={flag.text}>
                        <button 
                            onClick={() => onLanguageChange(flag.text.toLowerCase())}
                            className="flex w-full p-1 gap-2 items-center"
                        >
                            <Image
                                src={flag.src}
                                alt={flag.alt}
                                height={25}
                                width={25}
                            />
                            <span>{flag.text}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

// Composant pour les boutons de sélection de langue
// const FlagButton = ({ src, alt, text, onClick }) => {
//     return (
//         <button onClick={onClick} className="flex w-full p-1 gap-2 items-center">
//             <Image
//                 src={src} alt={alt} height={25} width={25}
//                 className=""
//             />
//             <span>{text}</span>
//         </button>
//     );
// };


export const OtherMenuDesktop = ({ navigationLinks }) => {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

    useEffect(() => {
        setMounted(true);

        const checkNotifications = async () => {
            const userId = localStorage.getItem('clientId'); // Récupérer l'ID utilisateur
            if (userId) {
                const data = await fetchNotifications(userId);
                if (data.success) {
                    const unreadCount = data.notifications.filter(notif => notif.read === "0").length;
                    setUnreadNotificationsCount(unreadCount);
                }
            }
        };

        const checkMessages = async () => {
            const data = await fetchMessages(); // Appel à fetchMessages sans clientId
            if (data.success) {
                const unreadCount = data.messages.filter(msg => msg.read === "0").length;
                setUnreadMessagesCount(unreadCount);
            }
        };

        // Vérification initiale
        checkNotifications();
        checkMessages();

        // Mise en place de l'intervalle de 10 secondes
        const intervalId = setInterval(() => {
            checkNotifications();
            checkMessages();
        }, 10000);

        // Nettoyage lors du démontage du composant
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <nav className="hidden lg:block">
            <ul className="flex items-center justify-between flex-row gap-4 text-black">
                {navigationLinks.map((navItem) => (
                    <li key={navItem.linkText}>
                        <Link
                            href={navItem.link}
                            className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
                        >
                            {t(navItem.linkText)}
                            {navItem.linkText === 'notifications.title' && unreadNotificationsCount > 0 && (
                                <span className="ml-1 text-xs rounded-2xl px-2 py-1 text-white bg-blue-500">
                                    {unreadNotificationsCount}
                                </span>
                            )}
                            {navItem.linkText === 'messages.title' && unreadMessagesCount > 0 && (
                                <span className="ml-1 text-xs rounded-2xl px-2 py-1 text-white bg-blue-500">
                                    {unreadMessagesCount}
                                </span>
                            )}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};


export const OtherMenuMobile = ({ navigationLinks }) => {
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

    useEffect(() => {
        setMounted(true);
        const checkNotifications = async () => {
            const userId = localStorage.getItem('clientId'); // Récupérer l'ID utilisateur
            if (userId) {
                const data = await fetchNotifications(userId);
                if (data.success) {
                    const unreadCount = data.notifications.filter(notif => notif.read === "0").length;
                    setUnreadNotificationsCount(unreadCount);
                }
            }
        };

        // Vérification initiale
        checkNotifications();

        // Mise en place de l'intervalle de 10 secondes
        const intervalId = setInterval(checkNotifications, 10000);

        // Nettoyage lors du démontage du composant
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    if (!mounted) {
        return null;
    }

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <div className="lg:hidden !text-black">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center p-2">
                <MenuIcon />
            </button>

            <div className={`
                fixed inset-0 z-50 bg-white max-h-full overflow-auto transform transition-transform duration-300 ease-in-out
                ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">{t('navigation.menu')}</h2>
                    <button onClick={closeMenu}>
                        <CloseIcon />
                    </button>
                </div>

                <nav className="mt-4">
                    <ul className="flex flex-col">
                        {navigationLinks.map((navItem) => (
                            <li key={navItem.linkText} className="border-b">
                                <Link
                                    href={navItem.link}
                                    className="block w-full p-4 hover:bg-gray-100"
                                    onClick={closeMenu}
                                >
                                    {t(navItem.linkText)}
                                    {navItem.linkText === 'notifications.title' && unreadNotificationsCount > 0 && (
                                        <span className="ml-1 text-xs rounded-2xl px-2 py-1 text-white bg-blue-500">
                                            {unreadNotificationsCount}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};
