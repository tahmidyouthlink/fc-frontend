import bkashLogo from "/public/payment-methods/bkash.webp";
import nagadLogo from "/public/payment-methods/nagad.webp";
import rocketLogo from "/public/payment-methods/rocket.webp";
import upayLogo from "/public/payment-methods/upay.webp";
import visaLogo from "/public/payment-methods/visa.webp";
import masterCardLogo from "/public/payment-methods/master-card.webp";
import americanExpressLogo from "/public/payment-methods/american-express.webp";

export const paymentMethods = [
  {
    name: "bKash",
    imgSrc: bkashLogo,
    websiteLink: "https://www.bkash.com/",
    bgColor: "transparent",
  },
  {
    name: "Nagad",
    imgSrc: nagadLogo,
    websiteLink: "https://nagad.com.bd/",
    bgColor: "transparent",
  },
  {
    name: "Rocket",
    imgSrc: rocketLogo,
    websiteLink: "https://www.dutchbanglabank.com/rocket/rocket.html",
    bgColor: "#780180",
  },
  {
    name: "Upay",
    imgSrc: upayLogo,
    websiteLink: "https://www.upaybd.com/",
    bgColor: "transparent",
  },
  {
    name: "Visa",
    imgSrc: visaLogo,
    websiteLink: "https://bd.visa.com/",
    bgColor: "transparent",
  },
  {
    name: "Master Card",
    imgSrc: masterCardLogo,
    websiteLink: "https://www.mastercard.us/en-us.html",
    bgColor: "transparent",
  },
  {
    name: "American Express",
    imgSrc: americanExpressLogo,
    websiteLink: "https://www.americanexpress.com/",
    bgColor: "#0070D1",
  },
];
