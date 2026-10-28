import { useEffect, useRef, useState } from 'react'
import { SITE } from '../config/site'
import Reveal from './Reveal'
import { ArrowRight, Check, Info } from './Icons'
import './ConsultForm.css'

const DEMO_MODE = !SITE.leadEndpoint

const INITIAL = {
  name: '',
  email: '',
  phone: '',
  contactMethod: 'email',
  interest: '',
  timeframe: '',
  message: '',
  consent: false,
  company: '', // honeypot — real users never see or fill this
}

const INTERESTS = [
  { value: 'new', label: 'Financing a new vehicle' },
  { value: 'used', label: 'Financing a pre-owned vehicle' },
  { value: 'refinance', label: 'Refinancing a current auto loan' },
  { value: 'unsure', label: 'Not sure yet — I’d like guidance' },
]

const TIMEFRAMES = ['As soon as possible', 'Within 30 days', '1–3 months', 'Just researching']

const LABELS = {
  name: 'Full name',
  email: 'Email',
  phone: 'Phone',
  interest: 'What are you interested in?',
  message: 'Anything else we should know?',
  consent: 'Contact consent',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(v) {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your full name.'
  if (!v.email.trim()) e.email = 'Please enter your email address.'
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'Enter an email like name@example.com.'
  const digits = v.phone.replace(/\D/g, '')
  if (v.contactMethod !== 'email' && !digits) e.phone = 'Add a phone number so we can call or text you.'
  else if (digits && (digits.length < 10 || digits.length > 15)) e.phone = 'Enter a phone number with at least 10 digits.'
  if (!v.interest) e.interest = 'Choose the option that best fits.'
  if (v.message.length > 1000) e.message = 'Please keep your message under 1,000 characters.'
  if (!v.consent) e.consent = 'Please confirm you’d like to be contacted.'
  return e
}

async function submitLead(values) {
  if (DEMO_MODE) {
    // DEMO ONLY: no backend is configured, so nothing is transmitted or stored.
    await new Promise((r) => setTimeout(r, 900))
    return
  }
  const payload = { ...values, source: 'website-consultation' }
  delete payload.company
  const res = await fetch(SITE.leadEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Request failed with ${res.status}`)
}

export default function ConsultForm() {
  const [values, setValues] = useState(INITIAL)
  const [touched, setTouched] = useState({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [failedSubmits, setFailedSubmits] = useState(0)
  const summaryRef = useRef(null)
  const successRef = useRef(null)

  // Move focus to the error summary after a failed submit, or to the confirmation on success.
  useEffect(() => {
    if (failedSubmits) summaryRef.current?.focus()
  }, [failedSubmits])
  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
  }, [status])

  const errors = validate(values)
  const show = (k) => (touched[k] || submitAttempted) && errors[k]

  const update = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setValues((s) => ({ ...s, [k]: val }))
  }
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitAttempted(true)
    if (Object.keys(errors).length) {
      setFailedSubmits((n) => n + 1)
      return
    }
    if (values.company) return // likely a bot
    setStatus('submitting')
    try {
      await submitLead(values)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const reset = () => {
    setValues(INITIAL)
    setTouched({})
    setSubmitAttempted(false)
    setFailedSubmits(0)
    setStatus('idle')
  }

  const errorKeys = Object.keys(errors)
  const describe = (k, hint) => [hint, show(k) && `${k}-err`].filter(Boolean).join(' ') || undefined

  return (
    <section id="consult" className="section consult" aria-labelledby="consult-title">
      <div className="container consult-layout">
        <Reveal className="consult-intro">
          <p className="eyebrow">Get started</p>
          <h2 id="consult-title" className="section-title">
            Request a consultation.
          </h2>
          <p className="section-lead">
            Share a few details and RG PRIME AUTO FINANCE will follow up to schedule a conversation about your goals.
          </p>

          <ol className="next-steps">
            <li>
              <span>1</span>
              <div>
                <strong>Send your request</strong>
                <p>Just the basics — no documents or Social Security number needed here.</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>We reach out</strong>
                <p>Using the contact method you prefer.</p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>Talk it through</strong>
                <p>Review your goals and next steps together.</p>
              </div>
            </li>
          </ol>

          <p className="consult-note">
            <Info width={16} height={16} />
            <span>
              This form is not a credit application, and submitting it does not mean you are approved for financing.
            </span>
          </p>
        </Reveal>

        <Reveal className="consult-card card" delay={100}>
          {status === 'success' ? (
            <div className="form-success" role="status">
              <span className="success-badge">
                <Check width={28} height={28} />
              </span>
              <h3 ref={successRef} tabIndex={-1}>
                {DEMO_MODE ? 'Demo request complete' : 'Thanks — your request was sent'}
              </h3>
              {DEMO_MODE ? (
                <p>
                  Your details passed validation, but <strong>this form isn’t connected to a backend yet</strong>, so
                  nothing was sent to RG PRIME AUTO FINANCE. Once a submission endpoint is configured, requests will be
                  delivered for follow-up.
                </p>
              ) : (
                <p>
                  Thank you, {values.name.trim().split(' ')[0]}. RG PRIME AUTO FINANCE has received your request and
                  will follow up by {values.contactMethod === 'email' ? 'email' : values.contactMethod}.
                </p>
              )}
              <button type="button" className="btn btn-ghost" onClick={reset}>
                Start a new request
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="consult-form" aria-describedby={DEMO_MODE ? 'demo-banner' : undefined}>
              {DEMO_MODE && (
                <p id="demo-banner" className="demo-banner">
                  <strong>Demo mode:</strong> this form isn’t connected to a backend yet. Submissions are validated but
                  not sent anywhere.
                </p>
              )}

              {submitAttempted && errorKeys.length > 0 && (
                <div ref={summaryRef} tabIndex={-1} className="error-summary" role="alert" aria-labelledby="err-sum-title">
                  <p id="err-sum-title">
                    Please fix {errorKeys.length} {errorKeys.length === 1 ? 'field' : 'fields'}:
                  </p>
                  <ul>
                    {errorKeys.map((k) => (
                      <li key={k}>
                        <a href={`#f-${k}`}>{LABELS[k]}: {errors[k]}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="form-grid">
                <div className={`field ${show('name') ? 'has-error' : ''}`}>
                  <label htmlFor="f-name">
                    Full name <span className="req" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="f-name"
                    className="control"
                    autoComplete="name"
                    value={values.name}
                    onChange={update('name')}
                    onBlur={blur('name')}
                    aria-required="true"
                    aria-invalid={show('name') ? 'true' : undefined}
                    aria-describedby={describe('name')}
                  />
                  {show('name') && <p id="name-err" className="field-error">{errors.name}</p>}
                </div>

                <div className={`field ${show('email') ? 'has-error' : ''}`}>
                  <label htmlFor="f-email">
                    Email <span className="req" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="f-email"
                    className="control"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={update('email')}
                    onBlur={blur('email')}
                    aria-required="true"
                    aria-invalid={show('email') ? 'true' : undefined}
                    aria-describedby={describe('email')}
                  />
                  {show('email') && <p id="email-err" className="field-error">{errors.email}</p>}
                </div>

                <fieldset className="field span-2">
                  <legend>Preferred contact method</legend>
                  <div className="chip-group">
                    {['email', 'phone', 'text'].map((m) => (
                      <label key={m} className={`chip ${values.contactMethod === m ? 'is-checked' : ''}`}>
                        <input
                          type="radio"
                          name="contactMethod"
                          value={m}
                          checked={values.contactMethod === m}
                          onChange={update('contactMethod')}
                        />
                        {m === 'email' ? 'Email' : m === 'phone' ? 'Phone call' : 'Text message'}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className={`field ${show('phone') ? 'has-error' : ''}`}>
                  <label htmlFor="f-phone">
                    Phone{' '}
                    {values.contactMethod === 'email' ? (
                      <span className="optional">(optional)</span>
                    ) : (
                      <span className="req" aria-hidden="true">*</span>
                    )}
                  </label>
                  <input
                    id="f-phone"
                    className="control"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    value={values.phone}
                    onChange={update('phone')}
                    onBlur={blur('phone')}
                    aria-required={values.contactMethod !== 'email' ? 'true' : undefined}
                    aria-invalid={show('phone') ? 'true' : undefined}
                    aria-describedby={describe('phone')}
                  />
                  {show('phone') && <p id="phone-err" className="field-error">{errors.phone}</p>}
                </div>

                <div className="field">
                  <label htmlFor="f-timeframe">
                    Timeframe <span className="optional">(optional)</span>
                  </label>
                  <select id="f-timeframe" className="control" value={values.timeframe} onChange={update('timeframe')}>
                    <option value="">Select…</option>
                    {TIMEFRAMES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className={`field span-2 ${show('interest') ? 'has-error' : ''}`}>
                  <label htmlFor="f-interest">
                    What are you interested in? <span className="req" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="f-interest"
                    className="control"
                    value={values.interest}
                    onChange={update('interest')}
                    onBlur={blur('interest')}
                    aria-required="true"
                    aria-invalid={show('interest') ? 'true' : undefined}
                    aria-describedby={describe('interest')}
                  >
                    <option value="">Choose one…</option>
                    {INTERESTS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  {show('interest') && <p id="interest-err" className="field-error">{errors.interest}</p>}
                </div>

                <div className={`field span-2 ${show('message') ? 'has-error' : ''}`}>
                  <label htmlFor="f-message">
                    Anything else we should know? <span className="optional">(optional)</span>
                  </label>
                  <textarea
                    id="f-message"
                    className="control"
                    rows={4}
                    value={values.message}
                    onChange={update('message')}
                    onBlur={blur('message')}
                    aria-invalid={show('message') ? 'true' : undefined}
                    aria-describedby={describe('message', 'message-hint')}
                  />
                  <p id="message-hint" className="field-hint">
                    Please don’t include sensitive details like account or Social Security numbers. {values.message.length}/1000
                  </p>
                  {show('message') && <p id="message-err" className="field-error">{errors.message}</p>}
                </div>

                <div className="hp" aria-hidden="true">
                  <label htmlFor="f-company">Company</label>
                  <input id="f-company" tabIndex={-1} autoComplete="off" value={values.company} onChange={update('company')} />
                </div>

                <div className={`field span-2 consent ${show('consent') ? 'has-error' : ''}`}>
                  <label className="checkbox" htmlFor="f-consent">
                    <input
                      id="f-consent"
                      type="checkbox"
                      checked={values.consent}
                      onChange={update('consent')}
                      onBlur={blur('consent')}
                      aria-required="true"
                      aria-invalid={show('consent') ? 'true' : undefined}
                      aria-describedby={describe('consent')}
                    />
                    <span className="checkbox-box" aria-hidden="true">
                      <Check width={14} height={14} />
                    </span>
                    <span>
                      I agree to be contacted by RG PRIME AUTO FINANCE about this inquiry. I understand this is not a
                      credit application. <span className="req" aria-hidden="true">*</span>
                    </span>
                  </label>
                  {show('consent') && <p id="consent-err" className="field-error">{errors.consent}</p>}
                </div>
              </div>

              {status === 'error' && (
                <p className="form-error" role="alert">
                  Something went wrong sending your request. Please try again in a moment.
                </p>
              )}

              <button type="submit" className="btn btn-primary submit-btn" disabled={status === 'submitting'}>
                {status === 'submitting' ? (
                  <>
                    <span className="spinner" aria-hidden="true" /> Sending…
                  </>
                ) : (
                  <>
                    Request consultation <ArrowRight width={18} height={18} />
                  </>
                )}
              </button>
              <p className="form-foot">
                <span aria-hidden="true">*</span> Required field
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
