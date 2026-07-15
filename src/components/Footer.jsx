import { footer } from '../content/copy';
import { EVENTS, trackEvent } from '../lib/analytics';
import './footer.css';

const PROBIZNES_TELEGRAM_URL = import.meta.env?.VITE_PROBIZNES_TELEGRAM_URL || '';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p className="site-footer__note">{footer.note}</p>
        {PROBIZNES_TELEGRAM_URL && (
          <a
            href={PROBIZNES_TELEGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="site-footer__link"
            onClick={() => trackEvent(EVENTS.TELEGRAM_CLICK, { context: 'footer' })}
          >
            {footer.telegramLabel}
          </a>
        )}
      </div>
    </footer>
  );
}
