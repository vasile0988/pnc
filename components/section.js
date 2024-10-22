// components/sectionImgItems.banking.js

"use client";
import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import '../app/globals.css';
import { CheckIcicon, ChevronDownIcon } from './icons';


export const SectionImgItems = ({
    title, 
    text, 
    dataItems, 
    className,
    classNameDiv,
    classNameChidren,
    classNameIcon,
    widthIcon,
    heightIcon,
    classNameTitle,
    classNameText,
    classNameLink,
    animation
    
}) =>{
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // or a loading placeholder
    }

    return(
        <section {...animation} className={`w-full bg-white ${className}`}>
            <div className="container p-4 gap-4 mx-auto justify-center items-center flex flex-col">
                <div className='text-center mx-auto flex flex-col gap-4'>
                    <h1 className="text-3xl font-montserrat-bold">{t(title)}</h1>
                    <p className="text-base text-zinc-500 max-w-[50rem]">{t(text)}</p>
                </div>
                <ItemsAligned 
                dataItems={dataItems} 
                classNameDiv={classNameDiv} 
                classNameChidren={classNameChidren} 
                classNameIcon={classNameIcon} 
                widthIcon={widthIcon} 
                heightIcon={heightIcon} 
                classNameTitle={classNameTitle} 
                classNameText={classNameText} 
                classNameLink={classNameLink} />
            </div>
        </section>
    );
}

// Composant ItemsAligned
export const ItemsAligned = ({
    classNameDiv, 
    dataItems, 
    classNameChidren, 
    heightIcon, 
    widthIcon, 
    classNameIcon, 
    classNameTitle, 
    classNameText, 
    classNameLink,
    animation
}) => {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // or a loading placeholder
    }


    return (
        <div {...animation} className={`flex flex-row flex-wrap mx-auto items-end justify-around w-full ${classNameDiv}`}>
            {dataItems.map((item, index) => (
                <div key={index} className={classNameChidren}>
                    {/* Vérification du type pour afficher soit un icon, soit une image */}
                    {item.type === "icon" && (
                        <item.icon w={widthIcon} h={heightIcon} className={classNameIcon} />
                    )}
                    {item.type === "img" && (
                        <Image src={item.src} alt={item.alt} className={classNameIcon} />
                    )}
                    
                    {/* Titre et texte */}
                    <h3 className={classNameTitle}>{t(item.title)}</h3>
                    {item.text && <p className={classNameText}>{t(item.text)}</p>}

                    {/* Lien */}
                    {item.link && (
                        <Link href={item.link} className={classNameLink}>{t(item.linkText)}</Link>
                    )}
                </div>
            ))}
        </div>
    );
};

export const SectionHero = ({className, 
    classNameChild, 
    title, 
    text, 
    link, 
    linkText, 
    classNameTitle, 
    classNameText, 
    classNameLink,
    animation
}) =>{
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // or a loading placeholder
    }


    return(
        <section {...animation} className={`${className}`}>
            <div className={classNameChild}>
                <h1 className={classNameTitle}>{t(title)}</h1>
                {text && (<p className={classNameText}>{t(text)}</p>)}
                {link &&(<p className='text-center mt-8'><Link href={link} className={classNameLink}>{t(linkText)}</Link></p>)}
            </div>
        </section>
    );
}

// section
export const SectionTitleParagraph = ({ 
    className, 
    title, 
    dataItemsTab, 
    link, 
    linkText,
    animation
}) => {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // ou un espace réservé de chargement
    }

    return (
        <section {...animation} className={`${className}`}>
            <div className='container flex-col mx-auto text-white text-sm flex gap-6 px-4 py-10'>
                <h1 className='text-center text-3xl font-montserrat-bold'>{t(title)}</h1>
                {dataItemsTab.map((paragraph, index) => (
                    <div key={index} className='text-justify'>{t(paragraph)}</div>
                ))}
                {link && (
                    <div className='text-center mt-4'>
                        <a href={link} className='text-blue-500'>{t(linkText)}</a>
                    </div>
                )}
            </div>
        </section>
    );
}

// 
export const OffersEnv = ({ 
    text, 
    title, 
    TabVal, 
    className, classNameOffer, 
    classNameImg,
    animation
}) => {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // ou un espace réservé de chargement
    }


    return (
        <section {...animation} className={className}>
            <div className='container p-4 mx-auto mb-16 md:max-w-4xl max-w-[80%] flex flex-col gap-6 align-center'>
                {title && <h1 className='text-3xl font-montserrat-bold text-center'>{t(title)}</h1>}
                {text && <p className='text-zinc-500 text-sm text-center'>{t(text)}</p>}
            </div>
            <div className='container mx-auto flex flex-row p-4 gap-x-4 gap-y-8 flex-wrap justify-evenly items-stretch'>
                {TabVal.map((tab, index) => (
                    <Offers
                        key={index}
                        title={title} // ou tu peux passer un title spécifique si nécessaire
                        text={text}   // ou passer un text spécifique si nécessaire
                        tab={tab} 
                        classNameOffer={classNameOffer} 
                        classNameImg={classNameImg}
                    />
                ))}
            </div>
        </section>
    );
}


export const Offers = ({ 
    link, 
    linkText, 
    classNameOffer, 
    classNameImg, 
    tab, 
    animation
}) => {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // ou un espace réservé de chargement
    }

    return (
        <div {...animation} className={`p-4 rounded-3xl shadow-2xl shadow-zinc-300 flex flex-col gap-x-4 gap-y-8 container bg-white items-center justify-start ${classNameOffer}`}>
            {tab.src && <Image src={tab.src} alt={t(tab.alt)} width={tab.width} height={tab.height} className={`${classNameImg}`}/>}
            {tab.title && <h1 className='text-2xl font-montserrat-bold text-center'>{t(tab.title)}</h1>}
            {tab.text && <p className='text-zinc-500 text-sm text-center'>{t(tab.text)}</p>}
            {tab.earn && <p className='p-2 bg-blue-500 text-white w-3/4 rounded-2xl text-sm text-center font-montserrat-bold'>{t(tab.earn)}</p>}
            {tab.items && (
                <nav className='w-full'>
                    <ul className=''>
                        {tab.items.map((item, index) => (
                            <li key={index} className='w-full flex flex-row gap-3'>
                                <CheckIcicon height={32} width={32} className="text-blue-500" />
                                <span className='max-w-[calc(100%_-_3rem)]'>{t(item.text)}</span>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
            {link && (
                <p>
                    <Link href={link} className=''>{linkText}</Link>
                </p>
            )}
        </div>
    );
}


export const SectionCollapse = ({ 
    className, 
    tabCollapse, 
    reverse,
    animation
}) => {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // ou un espace réservé de chargement
    }

    return (
        <section className={`${className}`} {...animation}>
            <div className={`container mx-auto flex ${reverse ? "flex-col-reverse lg:flex-row-reverse" : "lg:flex-row flex-col-reverse"} justify-center gap-x-4 gap-y-12 lg:justify-around items-center lg:items-start p-4`}>
                {/* Premier bloc */}
                <div className='max-w-xl flex flex-col gap-8 justify-center items-start'>
                    <div className='flex flex-col gap-4 max-w-[90%] justify-center mx-auto items-center'>
                        {tabCollapse.srcDiv1 && <Image src={tabCollapse.srcDiv1} alt={tabCollapse.altDiv1} width={tabCollapse.widthDiv1} height={tabCollapse.heightDiv1} />}
                        {tabCollapse.title1 && <h1 className='font-montserrat-bold text-3xl text-center'>{t(tabCollapse.title1)}</h1>}
                        {tabCollapse.text1 && <p className='text-zinc-500 text-base text-center'>{t(tabCollapse.text1)}</p>}
                    </div>
                    {tabCollapse.tab1 && (
                        <ul className='flex flex-col gap-2 justify-start items-start'>
                            {tabCollapse.tab1.map((item, index) => (
                                <li key={index} className=''>{t(item.text)}</li>
                            ))}
                        </ul>
                    )}
                    {tabCollapse.link1 && (
                        <div className='mx-auto flex items-center justify-center'>
                            <Link href={tabCollapse.link1} className='text-white p-2 text-base text-center bg-blue-500 hover:bg-blue-800 transition-colors rounded-xl'>{t(tabCollapse.linkText1)}</Link>
                        </div>
                    )}
                </div>

                {/* Deuxième bloc */}
                <div className='max-w-xl flex flex-col gap-8 justify-center items-center'>
                    <div className='flex flex-col gap-4 max-w-[90%] items-center'>
                        {tabCollapse.srcDiv2 && <Image className='rounded-3xl' src={tabCollapse.srcDiv2} alt={tabCollapse.altDiv2} width={tabCollapse.widthDiv2} height={tabCollapse.heightDiv2} />}
                        {tabCollapse.title2 && <h1 className='font-montserrat-bold text-3xl text-center'>{t(tabCollapse.title2)}</h1>}
                        {tabCollapse.text2 && <p className='text-zinc-500 text-base text-center'>{t(tabCollapse.text2)}</p>}
                    </div>
                    {tabCollapse.tab2 && (
                        <ul className='flex flex-col gap-2 justify-start items-start'>
                            {tabCollapse.tab2.map((item, index) => (
                                <li key={index} className=''>{t(item.text)}</li>
                            ))}
                        </ul>
                    )}
                    {tabCollapse.link2 && (
                        <div className='mx-auto flex items-center justify-center'>
                            <Link href={tabCollapse.link2} className='text-white p-2 text-base text-center bg-blue-500 hover:bg-blue-800 transition-colors rounded-xl'>{t(tabCollapse.linkText2)}</Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}


export const SectionFAQ = ({ title, tabFAQ, animation }) => {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [openQuestion, setOpenQuestion] = useState(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }


    const toggleQuestion = (index) => {
        setOpenQuestion(openQuestion === index ? null : index);
    };

    return (
        <section {...animation} className="py-8 bg-white px-4">
            <div className="container mx-auto flex flex-col gap-8 justify-center items-center">
                <div className='flex flex-col items-center justify-center gap-4'>
                    <h1 className='text-3xl font-bold font-montserrat-bold'>{t(title)}</h1>
                </div>
                <ul className='flex flex-col gap-4 w-full max-w-5xl mx-auto'>
                    {tabFAQ.map((item, index) => (
                        <li key={index} className='overflow-hidden rounded-2xl shadow-md'>
                            <div 
                                className='bg-blue-500 p-4 flex justify-between items-center cursor-pointer'
                                onClick={() => toggleQuestion(index)}
                            >
                                <h2 className='font-semibold text-white'>{t(item.question)}</h2>
                                <ChevronDownIcon 
                                    className={`text-white transition-transform duration-300 ${openQuestion === index ? 'rotate-180' : ''}`}
                                />
                            </div>
                            <div 
                                className={`bg-blue-100 overflow-hidden transition-all duration-300 ${openQuestion === index ? 'max-h-96 p-4' : 'max-h-0'}`}
                            >
                                <p className='text-gray-700'>{t(item.answer)}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};