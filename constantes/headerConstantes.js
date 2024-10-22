// constantes/headerConstantes.js

// Données pour les différents menus
export const flags = [
    { src: "/assets/images/es.webp", alt: "drapeau espagnol", text: "ES" },
    { src: "/assets/images/fr.webp", alt: "drapeau français", text: "FR" },
    { src: "/assets/images/uk.png", alt: "drapeau britannique", text: "EN" },
    { src: "/assets/images/de.png", alt: "drapeau allemand", text: "DE" },
    { src: "/assets/images/pt.png", alt: "drapeau portugais", text: "PT" },
];

// Liens pour la section Banking
export const bankingLinks = [
    { link: "/pages/banking/virtual-wallet/", linkText: "navigation.banking.virtualWallet" },
    { link: "/pages/banking/checking-account/", linkText: "navigation.banking.checking" },
    { link: "/pages/banking/savings/", linkText: "navigation.banking.saving" },
    { link: "/pages/banking/credit-cards/", linkText: "navigation.banking.creditCards" },
    { link: "/pages/banking/student-banking/", linkText: "navigation.banking.studentBanking" },
];

// Liens pour la section Borrowing
export const borrowingLinks = [
    { link: "/pages/borrowing/home-equity-lines-of-credit/", linkText: "navigation.borrowing.homeEquity" },
    { link: "/pages/borrowing/construction-and-lot-loans/", linkText: "navigation.borrowing.constructionLoans" },
    { link: "/pages/borrowing/auto-loans/", linkText: "navigation.borrowing.autoLoans" },
    { link: "/pages/borrowing/personal-Loans-&-Lines-of-Credit/", linkText: "navigation.borrowing.personalLoans" },
];

// Structure des menus
export const menuStructure = {
    banking: {
        title: "navigation.banking.title",
        type: "dropdown",
        subMenus: bankingLinks
    },
    borrowing: {
        title: "navigation.borrowing.title",
        type: "dropdown",
        subMenus: borrowingLinks
    },
    contact: {
        title: "navigation.contactUs",
        type: "link",
        link: "/pages/contact/"
    },
    login: {
        title: "navigation.login",
        type: "link",
        link: "/pages/login/"
    },
    signup: {
        title: "navigation.signup",
        type: "link",
        link: "/pages/signup/"
    }
};