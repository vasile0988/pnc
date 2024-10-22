// components/adminHeader.js


import Link from 'next/link';
import Image from 'next/image';
import {OtherMenuDesktop, OtherMenuMobile} from './menu';

const navigationLinks = [
  { link: '/pages/admin/clients/', linkText: 'Clients' },
  { link: '/pages/admin/messages/', linkText: 'Messages' },
//   { link: '/pages/admin/notifications/', linkText: 'notifications.title' },
//   { link: '/pages/admin/operations/', linkText: 'Mes opérations' },
  { link: '/pages/admin/settings/', linkText: 'Paramètres' },
  { link: '/pages/admin/logout/', linkText: 'Déconnexion' },
  // Ajoutez d'autres liens de navigation selon vos besoins
];

export const AdminHeader = () =>{
    return (
        <header className="shadow-md fixed !z-[10] top-0 bg-white right-0 left-0 shadow-slate-200 w-full">
            <div className="w-full p-2 flex text-white items-center justify-center bg-theme2">
                <div className={`flex container justify-end flex-row gap-8 p-1`}>
                    <a href='maito:contact@bncpnc.es' className="text-sm">contact@bncpnc.es</a>
                    <a href='tel:+34604108253' className="text-sm">+34 6 04 10 82 53</a>
                </div>
            </div>
            <div className="mx-auto container py-2 sm:px-8 px-6 flex items-center justify-between">
                <Link href="/pages/admin/clients/" className="">
                    <Image height={60} width={80} src="/assets/images/logo.png" alt="PNC"></Image>
                </Link>
                <OtherMenuMobile navigationLinks={navigationLinks}/>
                <OtherMenuDesktop navigationLinks={navigationLinks} className=""/>
            </div>
        </header>
    )
}