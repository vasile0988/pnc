// app/components/footer.js

'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { bankingLinks, borrowingLinks, } from '../constantes/headerConstantes';
import { useTranslation } from 'next-i18next';


export const Footer = ({className, classNameTitle, classNameLink}) =>{

    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // or a loading placeholder
    }

    return(
        <footer className={`${className}`}>
            <div className="container flex mx-auto items-start sm:justify-around justify-start flex-wrap p-4 gap-x-4 gap-y-8">
                {footerMenus.map((menu, index) => (
                    <div key={index} className="max-w-80">
                        <h3 className={`mb-4 ${classNameTitle}`}>{t(menu.title)}</h3>
                        <ul className="space-y-2">
                            {menu.links.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                    <Link 
                                        href={item.link}
                                        className={`transition-colors duration-200 ${classNameLink}`}
                                    >
                                        {t(item.linkText)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
                
                {/* Additional footer links */}
                <div className="">
                    <h3 className={`${classNameTitle}`}>{t('navigation.more')}</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link 
                                href="../pages/contact/" 
                                className={` ${classNameLink}`}
                            >
                                {t('navigation.contactUs')}
                            </Link>
                        </li>
                    </ul>
                </div>
            </div> 
        </footer>
    );
}

const footerMenus = [
    { title: 'navigation.banking.title', links: bankingLinks },
    { title: 'navigation.borrowing.title', links: borrowingLinks },
];