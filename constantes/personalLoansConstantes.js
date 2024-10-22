// constantes/personalLoansConstantes.js
import { CheckLinstIcon, HomeIcon, EmergencyIcon, LoanIcon } from '../components/icons';

export const tabCollapse1 = {
    text1: "borrowing.sectionCollapse.personalLoans.collapse1.text1",
    srcDiv2: "/assets/images/feature-borrowing-personal-loans-consolidation.avif",
    altDiv2: "Description de l'image",
    widthDiv2: 300,
    heightDiv2:300,
}

export const tabFeature1 = {
    src: "/assets/images/icon-personal-installment-loan-slate.svg",
    alt: "borrowing.virtualWallet.infos.feature1.alt",
    width: 80,
    height: 80,
    title: "borrowing.personalLoans.infos.feature1.title",
    text: "borrowing.personalLoans.infos.feature1.text",
};

export const tabFeature2 = {
    src: "/assets/images/icon-line-of-credit-slate.svg",
    alt: "borrowing.virtualWallet.infos.feature1.alt",
    width: 80,
    height: 80,
    title: "borrowing.personalLoans.infos.feature2.title",
    text: "borrowing.personalLoans.infos.feature2.text",
};

export const dataItems =[
    {
        icon: HomeIcon,
        title: "sectionImgItems.banking.checking",
        text: null,
        type: "icon",
    },
    {
        icon: CheckLinstIcon,
        title: "sectionImgItems.banking.creditCards",
        text: null,
        type: "icon",
    },
    {
        icon: EmergencyIcon,
        title: "sectionImgItems.banking.saving",
        text: null,
        type: "icon",
    },
    {
        icon: LoanIcon,
        title: "sectionImgItems.banking.homeLoans",
        text: null,
        type: "icon",
    }
]
