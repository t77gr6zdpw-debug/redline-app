# RedLine Studio × «Про Бізнес» — колаборація

Мобільно-орієнтований мікросайт-пропозиція для підписників Telegram-каналу
«Про Бізнес»: React 18 + Vite + Framer Motion, оптимізовано під Telegram
in-app browser.

## Розробка

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # продакшн-збірка у dist/
npm run preview  # локальний перегляд збірки
```

## Змінні оточення

Скопіюйте `.env.example` у `.env` і заповніть за потреби:

| Змінна | Призначення |
| --- | --- |
| `VITE_LEAD_ENDPOINT` | URL власної serverless-функції, яка приймає заявку (JSON) і пересилає її в Telegram Bot API / email / CRM. Токени бота зберігаються лише на сервері, не в клієнтському коді. Якщо не задано — форма показує чесне повідомлення та посилання на прямий контакт. |
| `VITE_TELEGRAM_CONTACT_URL` | Пряме посилання `https://t.me/...`, яке показується як запасний варіант, якщо відправка через `VITE_LEAD_ENDPOINT` недоступна або не налаштована. |
| `VITE_PROBIZNES_TELEGRAM_URL` | Посилання на канал «Про Бізнес», показується у футері. |

## Логотипи

`src/components/Wordmark.jsx` наразі містить типографічні заглушки (не
логотипи) для RedLine Studio та «Про Бізнес» — оригінальних файлів
логотипів у репозиторії немає. Коли зʼявляться офіційні SVG/PNG активи,
потрібно замінити рендер у `Wordmark.jsx` (і, за потреби, у `LogoStage.jsx`
та `BusinessPass.jsx`, де компоненти використовуються) на `<img>`/`<svg>`
з оригінальними файлами, зберігаючи пропорції та без обрізки.

## Аналітика

`src/lib/analytics.js` відправляє події в `window.gtag` або
`window.dataLayer` (GTM), якщо вони підключені на сторінці. Події:
`hero_cta_click`, `business_pass_flip`, `business_pass_activate`,
`comparison_interaction`, `form_open`, `form_submit_success`,
`telegram_click`.

## Валідація в цій сесії

У поточному середовищі доступ до `registry.npmjs.org` заблокований
мережевою політикою (egress allowlist), тож `npm install` і, відповідно,
`npm run build`/lint/typecheck не вдалося виконати тут. Весь код пройшов
статичну перевірку синтаксису (TypeScript-парсер у режимі `--checkJs
false --jsx react-jsx` по всіх `.jsx`-файлах) та перевірку на
неоголошені/невикористані змінні (ESLint, тимчасовий flat-конфіг) —
0 помилок. Перед деплоєм виконайте локально:

```bash
npm install
npm run build
```

і переконайтеся, що збірка проходить без помилок у вашому середовищі з
доступом до npm-реєстру.
