// Тонкий шар аналітики. Якщо на сторінці є window.gtag або window.dataLayer (GTM),
// подія піде туди. Інакше подія просто логується в dev-режимі — інтеграцію
// можна підʼєднати пізніше без зміни компонентів.

export const EVENTS = {
  HERO_CTA_CLICK: 'hero_cta_click',
  BUSINESS_PASS_FLIP: 'business_pass_flip',
  BUSINESS_PASS_ACTIVATE: 'business_pass_activate',
  COMPARISON_INTERACTION: 'comparison_interaction',
  FORM_OPEN: 'form_open',
  FORM_SUBMIT_SUCCESS: 'form_submit_success',
  TELEGRAM_CLICK: 'telegram_click',
};

export function trackEvent(name, payload = {}) {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, payload);
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: name, ...payload });
  }

  if (import.meta.env?.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', name, payload);
  }
}
