'use client';
import { I18nextProvider } from 'react-i18next';
import i18n from '../src/i18';
import { EmptyHeader } from "../components/emptyHeader";
import { AdminHeader } from "../components/adminHeader";
import { OtherHeader } from "../components/otherHeader";
import { HeaderDesktop } from "../components/header";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { IdProvider } from '../context/IdContext';
import { AdminProvider } from '../context/AdminContext'; // Changed from AdminIdProvider to AdminProvider

export default function BefLayout({ children }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  let HeaderComponent;
  if (pathname.includes('admin')) {
    const isEmptyAdminPath = pathname === '/pages/admin';
    HeaderComponent = isEmptyAdminPath ? EmptyHeader : AdminHeader;
  } else if (pathname.includes('account') && !pathname.includes('checking-account')) {
    HeaderComponent = OtherHeader;
  } else {
    HeaderComponent = HeaderDesktop;
  }

  return (
    <IdProvider>
      <AdminProvider>
        <I18nextProvider i18n={i18n}>
          <HeaderComponent />
          <main>
            {children}
          </main>
        </I18nextProvider>
      </AdminProvider>
    </IdProvider>
  );
}