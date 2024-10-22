// app/components/banking.home.heroBanner.js

"use client";
import Image from 'next/image';
import Link from 'next/link';
import '../app/globals.css';
import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

// Composant HeroBanner
export const HeroBanner = ({ onHeightChange, title, text, link, linkText, imgDesktop, imgMobile, srcDiv, altDiv, widthDiv, heightDiv }) => {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, [onHeightChange]);

    // Si le composant n'est pas monté, retourner null
    if (!mounted) {
        return null; // ou un espace réservé de chargement
    }

    return (
        <section className='relative w-full max-h-[90vh] bg-white'>
            {/* Afficher l'image de bureau ou mobile selon les props */}
            <Image
                src={imgDesktop} yy
                alt="Hero banner"
                width={1920}
                height={2720}
                className='lg:block hidden max-h-[90vh]'
            />
            <Image
                src={imgMobile ? imgMobile : imgDesktop} 
                alt="Hero banner"
                width={1200}
                height={2600}
                className='block lg:hidden'
            />
            <div className='absolute container sm:max-w-[35em] max-w-[90%] top-2/4 -translate-y-2/4 p-4 lg:left-[5rem] lg:translate-x-0 left-2/4 -translate-x-2/4'>
                <div className='rounded-2xl flex gap-4 flex-col justify-center items-center p-4 bg-zinc-50 shadow-2xl shadow-zinc-500'>
                    {srcDiv && (
                        <Image src={srcDiv} alt={altDiv} width={widthDiv} height={heightDiv} />
                    )}
                    {title && (
                        <h1 className='text-3xl font-bold text-center font-montserrat-bold'>
                            {t(title)}
                        </h1>
                    )}
                    {text && (
                        <p className='text-md text-center text-gray-500'>
                            {t(text)}
                        </p>
                    )}
                    {link && (
                        <Link href={link} className="rounded-xl p-2 text-white bg-blue-600 hover:bg-blue-800 transition-all duration-200">
                            {t(linkText)}
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}
