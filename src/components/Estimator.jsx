import { useEffect, useId, useMemo, useState } from 'react'
import { estimateLoan, formatINR, formatINRPaise } from '../lib/loan'
import Reveal from './Reveal'
import { ArrowRight, Info } from './Icons'
import './Estimator.css'

const TERMS = [36, 48, 60, 72, 84]

// Starting values are arbitrary examples for illustration — not quoted or offered terms.
const DEFAULTS = { price: '800000', down: '150000', tradeIn: '0', fees: '0', apr: '7.0', term: 60 }

const LIMITS = {
  price: { min: 50000, max: 50000000 },
  apr: { min: 0, max: 36 },
}

const parse = (v) => (v === '' || v == null ? NaN : Number(String(v).replace(/[,₹\s]/g, '')))

function validate(values) {
  const n = {
    price: parse(values.price),
    down: parse(values.down),
    tradeIn: parse(values.tradeIn),
    fees: parse(values.fees),
    apr: parse(values.apr),
  }
  const errors = {}
  if (!Number.isFinite(n.price)) errors.price = 'Enter a vehicle price.'
  else if (n.price < LIMITS.price.min || n.price > LIMITS.price.max)
    errors.price = `Enter a price between ${formatINR(LIMITS.price.min)} and ${formatINR(LIMITS.price.max)}.`

  for (const key of ['down', 'tradeIn', 'fees']) {
    if (!Number.isFinite(n[key])) errors[key] = 'Enter an amount, or 0.'
    else if (n[key] < 0) errors[key] = 'Amount can’t be negative.'
  }

  if (!Number.isFinite(n.apr)) errors.apr = 'Enter an example APR, or 0.'
  else if (n.apr < LIMITS.apr.min || n.apr > LIMITS.apr.max)
    errors.apr = `Enter an APR between ${LIMITS.apr.min}% and ${LIMITS.apr.max}%.`

  if (!errors.price && !errors.down && !errors.tradeIn && !errors.fees) {
    if (n.down + n.tradeIn >= n.price + n.fees)
      errors.down = 'Down payment plus trade-in covers the full cost — there’s nothing left to finance.'
  }
  return { n, errors }
}

function MoneyField({ id, label, value, onChange, error, hint, slider }) {
  const hintId = `${id}-hint`
  const errId = `${id}-err`
  const describedBy = [hint && hintId, error && errId].filter(Boolean).join(' ') || undefined
  const numeric = parse(value)
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <div className="input-affix">
        <span aria-hidden="true">₹</span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
        />
      </div>
      {slider && (
        <input
          type="range"
          className="range"
          min={slider.min}
          max={slider.max}
          step={slider.step}
          value={Number.isFinite(numeric) ? Math.min(Math.max(numeric, slider.min), slider.max) : slider.min}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${label} slider`}
          aria-valuetext={formatINR(Number.isFinite(numeric) ? numeric : 0)}
          style={{ '--fill': `${((Math.min(Math.max(numeric || 0, slider.min), slider.max) - slider.min) / (slider.max - slider.min)) * 100}%` }}
        />
      )}
      {hint && (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errId} className="field-error">
          {error}
        </p>
      )}
    </div>
  )
}

export default function Estimator() {
  const [values, setValues] = useState(DEFAULTS)
  const set = (key) => (v) => setValues((s) => ({ ...s, [key]: v }))
  const { n, errors } = useMemo(() => validate(values), [values])
  const valid = Object.keys(errors).length === 0
  const result = useMemo(
    () => (valid ? estimateLoan({ ...n, term: values.term }) : null),
    [valid, n, values.term],
  )
  const termName = useId()

  // Debounced screen-reader announcement so dragging a slider isn't noisy.
  const [announcement, setAnnouncement] = useState('')
  useEffect(() => {
    const t = setTimeout(() => {
      setAnnouncement(
        result
          ? `Illustrative estimate: ${formatINRPaise(result.payment)} per month for ${values.term} months.`
          : 'Estimate unavailable. Please correct the highlighted fields.',
      )
    }, 700)
    return () => clearTimeout(t)
  }, [result, values.term])

  const priceMax = Math.max(5000000, Number.isFinite(n.price) ? n.price : 0)
  const interestShare = result && result.totalPaid > 0 ? (result.totalInterest / result.totalPaid) * 100 : 0

  return (
    <section id="estimate" className="section estimator" aria-labelledby="estimate-title">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">Payment estimator</p>
          <h2 id="estimate-title" className="section-title">
            See how the numbers move.
          </h2>
          <p className="section-lead">
            Adjust price, down payment, term, and an example rate to explore how each one changes a monthly payment.
            It’s a planning tool to help you prepare questions — not a quote.
          </p>
        </Reveal>

        <Reveal className="estimator-shell card" delay={80}>
          <form className="estimator-form" onSubmit={(e) => e.preventDefault()} noValidate aria-describedby="estimate-disclaimer">
            <MoneyField
              id="est-price"
              label="Vehicle price"
              value={values.price}
              onChange={set('price')}
              error={errors.price}
              slider={{ min: 100000, max: priceMax, step: 10000 }}
            />
            <MoneyField
              id="est-down"
              label="Down payment"
              value={values.down}
              onChange={set('down')}
              error={errors.down}
              slider={{ min: 0, max: Math.max(10000, Number.isFinite(n.price) ? n.price : 0), step: 5000 }}
            />
            <div className="field-row">
              <MoneyField id="est-trade" label="Trade-in value" value={values.tradeIn} onChange={set('tradeIn')} error={errors.tradeIn} />
              <MoneyField
                id="est-fees"
                label="Taxes & fees"
                value={values.fees}
                onChange={set('fees')}
                error={errors.fees}
                hint="Optional — varies by location."
              />
            </div>

            <fieldset className="field term-field">
              <legend>Loan term</legend>
              <div className="segmented">
                {TERMS.map((t) => (
                  <label key={t} className={values.term === t ? 'is-checked' : ''}>
                    <input
                      type="radio"
                      name={termName}
                      value={t}
                      checked={values.term === t}
                      onChange={() => setValues((s) => ({ ...s, term: t }))}
                    />
                    <span>
                      {t}
                      <small> mo</small>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className={`field ${errors.apr ? 'has-error' : ''}`}>
              <label htmlFor="est-apr">Example APR</label>
              <div className="input-affix suffix">
                <input
                  id="est-apr"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={values.apr}
                  onChange={(e) => set('apr')(e.target.value)}
                  aria-invalid={errors.apr ? 'true' : undefined}
                  aria-describedby={`est-apr-hint${errors.apr ? ' est-apr-err' : ''}`}
                />
                <span aria-hidden="true">%</span>
              </div>
              <input
                type="range"
                className="range"
                min="0"
                max="25"
                step="0.1"
                value={Number.isFinite(n.apr) ? Math.min(Math.max(n.apr, 0), 25) : 0}
                onChange={(e) => set('apr')(e.target.value)}
                aria-label="Example APR slider"
                aria-valuetext={`${Number.isFinite(n.apr) ? n.apr : 0} percent`}
                style={{ '--fill': `${(Math.min(Math.max(n.apr || 0, 0), 25) / 25) * 100}%` }}
              />
              <p id="est-apr-hint" className="field-hint">
                A hypothetical rate you choose. Actual rates, if offered, depend on credit, vehicle, term, and other
                factors.
              </p>
              {errors.apr && (
                <p id="est-apr-err" className="field-error">
                  {errors.apr}
                </p>
              )}
            </div>
          </form>

          <div className="estimator-result" aria-labelledby="result-title">
            <p id="result-title" className="result-label">
              Illustrative monthly payment
            </p>
            {result ? (
              <>
                <p className="result-payment">
                  {formatINRPaise(result.payment)}
                  <span>/mo</span>
                </p>
                <p className="result-term">
                  for {values.term} months at an example {n.apr}% APR
                </p>

                <div className="result-bar" aria-hidden="true">
                  <span style={{ width: `${100 - interestShare}%` }} />
                </div>
                <div className="result-legend" aria-hidden="true">
                  <span>
                    <i className="dot principal" /> Amount financed
                  </span>
                  <span>
                    <i className="dot interest" /> Interest
                  </span>
                </div>

                <dl className="result-list">
                  <div>
                    <dt>Amount financed</dt>
                    <dd>{formatINR(result.financed)}</dd>
                  </div>
                  <div>
                    <dt>Estimated total interest</dt>
                    <dd>{formatINR(result.totalInterest)}</dd>
                  </div>
                  <div>
                    <dt>Estimated total of payments</dt>
                    <dd>{formatINR(result.totalPaid)}</dd>
                  </div>
                </dl>
              </>
            ) : (
              <p className="result-empty" role="status">
                Adjust the highlighted fields to see an illustrative estimate.
              </p>
            )}

            <a href="#consult" className="btn btn-primary result-cta">
              Discuss real options <ArrowRight width={18} height={18} />
            </a>

            <p id="estimate-disclaimer" className="result-disclaimer">
              <Info width={16} height={16} />
              <span>
                For illustration only. This estimate is not an offer, pre-qualification, or guarantee of credit, and
                does not reflect any actual rate or terms from RG PRIME AUTO FINANCE. It excludes items such as
                registration, add-on products, and lender-specific fees. Any financing is subject to credit review and
                approval.
              </span>
            </p>
          </div>

          <p className="visually-hidden" aria-live="polite" aria-atomic="true">
            {announcement}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
