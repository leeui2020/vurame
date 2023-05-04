import { createI18n } from 'vue-i18n';
import loadI18nMessages from '@/auto/locales';
import { storageKey, EN_US, ZH_CN } from '@/config/locales';

const i18n = createI18n({
  legacy: false,
  messages: loadI18nMessages(),
  missingWarn: false,
  fallbackWarn: false,
});

export const $t = (...args) => i18n.global.t(...args);
export const $tc = (...args) => i18n.global.tc(...args);

export const isEnsite = () => i18n.global.locale.value === EN_US;
export const isCnsite = () => i18n.global.locale.value === ZH_CN;

export function setLocale(locale) {
  i18n.global.locale.value = locale;
  localStorage.setItem(storageKey, locale);
  document.documentElement.setAttribute('lang', locale);
  document.documentElement.setAttribute('class', locale);
}

export function installI18n(app) {
  setLocale(import.meta.env.VITE_LOCALE);
  app.use(i18n);
}
