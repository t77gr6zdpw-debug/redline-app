import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { leadForm } from '../content/copy';
import { submitLead, LeadConfigError, TELEGRAM_CONTACT_URL } from '../lib/submitLead';
import { EVENTS, trackEvent } from '../lib/analytics';
import { useReducedMotion } from './MotionProvider';
import './lead-modal.css';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const initialFields = { name: '', business: '', contact: '', hasWebsite: '', task: '' };

function validate(fields) {
  const errors = {};

  if (!fields.name.trim() || fields.name.trim().length < 2) {
    errors.name = leadForm.errors.required;
  }
  if (!fields.business.trim()) {
    errors.business = leadForm.errors.required;
  }

  const contact = fields.contact.trim();
  const isTelegramHandle = /^@[a-zA-Z0-9_]{4,}$/.test(contact);
  const digitsOnly = contact.replace(/\D/g, '');
  const isPhone = digitsOnly.length >= 9 && digitsOnly.length <= 15;
  if (!contact) {
    errors.contact = leadForm.errors.required;
  } else if (!isTelegramHandle && !isPhone) {
    errors.contact = leadForm.errors.contact;
  }

  if (!fields.hasWebsite) {
    errors.hasWebsite = leadForm.errors.required;
  }

  if (!fields.task.trim()) {
    errors.task = leadForm.errors.required;
  } else if (fields.task.trim().length < 10) {
    errors.task = leadForm.errors.tooShort;
  }

  return errors;
}

export default function LeadModal({ onClose }) {
  const reduced = useReducedMotion();
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);
  const headingId = useId();
  const descId = useId();

  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    trackEvent(EVENTS.FORM_OPEN);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const frame = requestAnimationFrame(() => {
      const first = dialogRef.current?.querySelector(FOCUSABLE_SELECTOR);
      first?.focus();
    });

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusables = dialogRef.current?.querySelectorAll(FOCUSABLE_SELECTOR);
      if (!focusables || focusables.length === 0) return;
      const list = Array.from(focusables);
      const firstEl = list[0];
      const lastEl = list[list.length - 1];
      if (event.shiftKey && document.activeElement === firstEl) {
        event.preventDefault();
        lastEl.focus();
      } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault();
        firstEl.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (previouslyFocused.current && typeof previouslyFocused.current.focus === 'function') {
        previouslyFocused.current.focus();
      }
    };
  }, [onClose]);

  function handleFieldChange(name, value) {
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === 'submitting' || status === 'success') return;

    const nextErrors = validate(fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus('submitting');
    try {
      await submitLead(fields);
      setStatus('success');
      trackEvent(EVENTS.FORM_SUBMIT_SUCCESS);
    } catch (error) {
      setStatus(error instanceof LeadConfigError ? 'config-error' : 'error');
    }
  }

  const isSubmitting = status === 'submitting';
  const isSuccess = status === 'success';
  const isConfigError = status === 'config-error';
  const isError = status === 'error';

  return createPortal(
    <div
      className="lead-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={dialogRef}
        className="lead-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={descId}
        initial={reduced ? undefined : { opacity: 0, y: 24 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        exit={reduced ? undefined : { opacity: 0, y: 24 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <button type="button" className="lead-modal__close" onClick={onClose} aria-label={leadForm.close}>
          <span aria-hidden="true">✕</span>
        </button>

        <h2 id={headingId} className="lead-modal__title">
          {leadForm.title}
        </h2>
        <p id={descId} className="lead-modal__description">
          {leadForm.description}
        </p>

        {isSuccess ? (
          <div className="lead-modal__success" role="status">
            <p>{leadForm.success}</p>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {leadForm.close}
            </button>
          </div>
        ) : (
          <form className="lead-modal__form" onSubmit={handleSubmit} noValidate>
            <Field
              id="lead-name"
              label={leadForm.fields.name.label}
              value={fields.name}
              onChange={(v) => handleFieldChange('name', v)}
              error={errors.name}
              autoComplete="name"
            />
            <Field
              id="lead-business"
              label={leadForm.fields.business.label}
              value={fields.business}
              onChange={(v) => handleFieldChange('business', v)}
              error={errors.business}
              autoComplete="organization"
            />
            <Field
              id="lead-contact"
              label={leadForm.fields.contact.label}
              value={fields.contact}
              onChange={(v) => handleFieldChange('contact', v)}
              error={errors.contact}
              autoComplete="tel"
            />

            <fieldset className="lead-modal__fieldset">
              <legend>{leadForm.fields.hasWebsite.label}</legend>
              <div className="lead-modal__radio-group">
                {leadForm.fields.hasWebsite.options.map((option) => (
                  <label key={option.value} className="lead-modal__radio">
                    <input
                      type="radio"
                      name="hasWebsite"
                      value={option.value}
                      checked={fields.hasWebsite === option.value}
                      onChange={(event) => handleFieldChange('hasWebsite', event.target.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.hasWebsite && <p className="lead-modal__error">{errors.hasWebsite}</p>}
            </fieldset>

            <TextareaField
              id="lead-task"
              label={leadForm.fields.task.label}
              value={fields.task}
              onChange={(v) => handleFieldChange('task', v)}
              error={errors.task}
            />

            {(isError || isConfigError) && (
              <p className="lead-modal__banner" role="alert">
                {isConfigError ? leadForm.errors.config : leadForm.errors.generic}
                {isConfigError && TELEGRAM_CONTACT_URL && (
                  <a
                    href={TELEGRAM_CONTACT_URL}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent(EVENTS.TELEGRAM_CLICK, { context: 'lead-modal-fallback' })}
                  >
                    {' '}
                    Написати в Telegram
                  </a>
                )}
              </p>
            )}

            <button type="submit" className="btn btn-primary lead-modal__submit" disabled={isSubmitting}>
              {isSubmitting ? leadForm.submitting : leadForm.submit}
            </button>
          </form>
        )}
      </motion.div>
    </div>,
    document.body,
  );
}

function Field({ id, label, value, onChange, error, autoComplete }) {
  const errorId = `${id}-error`;
  return (
    <div className="lead-modal__field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        value={value}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && (
        <p id={errorId} className="lead-modal__error">
          {error}
        </p>
      )}
    </div>
  );
}

function TextareaField({ id, label, value, onChange, error }) {
  const errorId = `${id}-error`;
  return (
    <div className="lead-modal__field">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        rows={3}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && (
        <p id={errorId} className="lead-modal__error">
          {error}
        </p>
      )}
    </div>
  );
}
