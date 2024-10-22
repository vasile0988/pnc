// app/pages/admin/clientDetails/[id]/clientDetailsPage.js
'use client';

import { useEffect } from "react";
import AOS from 'aos';
import { ClientDetails } from "@/components/clientDetails";
import VirementDetailsSection from "@/components/virementDetailsSection";
import { useTranslation } from 'next-i18next';
import { SendMoney } from "@/components/sendMoney";

export const ClientDetailsPage = ({ clientId }) => {
  const { t } = useTranslation();
  // console.log(clientId)
  useEffect(() => {
    const title = t('metadataTitle.login') + ' - PNC';
    document.title = title;
    AOS.init({
      duration: 500,
      easing: 'ease-in-out',
    });
  }, [t]);

  return (
    <div className='mt-[6.6rem] mb-16 flex flex-col gap-4 w-full'>
      <ClientDetails clientId={clientId} />
      <VirementDetailsSection clientId={clientId} />
      <SendMoney clientId={clientId}/>
    </div>
  );
};