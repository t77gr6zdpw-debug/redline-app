// Оригінальні лого-активи. Растрові файли мають чорне тло — воно "зникає"
// на нашому темному фоні через mix-blend-mode: screen (чорний піксель джерела
// нічого не додає до результату), тож видимого прямокутника не лишається.
import './wordmark.css';
import { brand } from '../content/copy';
import redlineWolf from '../assets/logos/redline-wolf.png';
import probiznesMark from '../assets/logos/probiznes-mark.jpeg';

export function RedLineWordmark({ size = 'md', className = '', priority = false, imageOnly = false }) {
  return (
    <div className={`wordmark wordmark--redline wordmark--${size} ${className}`}>
      <img
        src={redlineWolf}
        alt={brand.redline}
        className="wordmark__logo-img wordmark__logo-img--wolf"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
      {!imageOnly && (
        <span className="wordmark__text">
          <span className="wordmark__weight-strong">Red</span>
          <span className="wordmark__weight-strong wordmark__accent">Line</span>
          <span className="wordmark__studio"> Studio</span>
        </span>
      )}
    </div>
  );
}

export function ProBiznesWordmark({ size = 'md', className = '', priority = false, imageOnly = false }) {
  return (
    <div className={`wordmark wordmark--probiznes wordmark--${size} ${className}`}>
      <img
        src={probiznesMark}
        alt={brand.probiznes}
        className="wordmark__logo-img wordmark__logo-img--mark"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
      {!imageOnly && <span className="wordmark__text">{brand.probiznes}</span>}
    </div>
  );
}
