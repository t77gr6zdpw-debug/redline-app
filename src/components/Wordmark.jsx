// Типографічні "wordmark"-заглушки для обох брендів. Це навмисно НЕ логотипи —
// жодних вигаданих іконок чи символів, лише коректна типографіка бренд-назв,
// доки в проєкт не буде додано оригінальні файли логотипів RedLine Studio та
// «Про Бізнес» (замінити тут, коли активи зʼявляться).
import './wordmark.css';
import { brand } from '../content/copy';

export function RedLineWordmark({ size = 'md', className = '' }) {
  return (
    <div className={`wordmark wordmark--redline wordmark--${size} ${className}`} role="img" aria-label={brand.redline}>
      <span className="wordmark__line" aria-hidden="true" />
      <span className="wordmark__text">
        <span className="wordmark__weight-strong">Red</span>
        <span className="wordmark__weight-strong wordmark__accent">Line</span>
        <span className="wordmark__studio"> Studio</span>
      </span>
    </div>
  );
}

export function ProBiznesWordmark({ size = 'md', className = '' }) {
  return (
    <div className={`wordmark wordmark--probiznes wordmark--${size} ${className}`} role="img" aria-label={brand.probiznes}>
      <span className="wordmark__mark" aria-hidden="true" />
      <span className="wordmark__text">{brand.probiznes}</span>
    </div>
  );
}
