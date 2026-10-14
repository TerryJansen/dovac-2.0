import { uiTranslations } from "./ui-translations";
import { products, faqs } from "./site-data";
import { applicationPages, industries } from "./source-content";
import { knowledgeContent } from "./knowledge-content";
import {
  productsEn,
  faqsEn,
  applicationPagesEn,
  industriesEn,
  knowledgeContentEn,
} from "./content-en";
import {
  productsDe,
  faqsDe,
  applicationPagesDe,
  industriesDe,
  knowledgeContentDe,
} from "./content-de";

export const locales = ["nl", "en", "de"];

export function currentLocale() {
  if (typeof location === "undefined") return "nl";
  const match = location.pathname.match(/\/(nl|en|de)(?:\/|$)/);
  return match?.[1] || "nl";
}

export function uiFor(locale = currentLocale()) {
  return uiTranslations[locales.includes(locale) ? locale : "nl"];
}

export function contentFor(locale = currentLocale()) {
  if (locale === "en") {
    return {
      products: productsEn,
      faqs: faqsEn,
      applicationPages: applicationPagesEn,
      industries: industriesEn,
      knowledgeContent: knowledgeContentEn,
    };
  }
  if (locale === "de") {
    return {
      products: productsDe,
      faqs: faqsDe,
      applicationPages: applicationPagesDe,
      industries: industriesDe,
      knowledgeContent: knowledgeContentDe,
    };
  }
  return { products, faqs, applicationPages, industries, knowledgeContent };
}

export function localize(template, values) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template,
  );
}
