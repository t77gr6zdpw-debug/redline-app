// Інтерфейс відправки заявки. Реальний бекенд не хардкодиться в клієнтському коді —
// URL ендпоінта та контакти беруться зі змінних оточення (див. .env.example).
//
// Рекомендований бекенд: власна serverless-функція (Vercel / Netlify / Cloudflare
// Worker), яка приймає JSON і сама пересилає його в Telegram Bot API або email-сервіс,
// зберігаючи приватні токени лише на сервері.

export class LeadConfigError extends Error {}

const ENDPOINT = import.meta.env?.VITE_LEAD_ENDPOINT;
export const TELEGRAM_CONTACT_URL = import.meta.env?.VITE_TELEGRAM_CONTACT_URL || '';

export async function submitLead(payload) {
  if (!ENDPOINT) {
    throw new LeadConfigError('VITE_LEAD_ENDPOINT is not configured');
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      source: 'redline-x-probiznes',
      submittedAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Lead endpoint responded with ${response.status}`);
  }

  return response.json().catch(() => ({}));
}
