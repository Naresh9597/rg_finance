import { useRef, useState } from 'react'
import Reveal from './Reveal'
import { ArrowRight, Chat, Compass, Doc, Shield } from './Icons'
import './Journey.css'

const STEPS = [
  {
    icon: Chat,
    title: 'Reach out',
    short: 'Share your goals',
    body: 'Tell us a little about the vehicle you have in mind, your timeline, and how you prefer to be contacted. It only takes a couple of minutes.',
    points: ['No commitment to start', 'Choose phone, email, or text', 'Ask anything — no question is too basic'],
  },
  {
    icon: Compass,
    title: 'Consultation',
    short: 'Talk it through',
    body: 'We review your goals together — budget, down payment, trade-in, and the payment range you’re comfortable with — so the next steps make sense for you.',
    points: ['Clarify your monthly budget', 'Discuss trade-in or payoff questions', 'Identify what information may be needed'],
  },
  {
    icon: Doc,
    title: 'Review options',
    short: 'Compare clearly',
    body: 'If financing options are available, we walk through them in plain language: the rate, the term, the total cost, and any conditions — before you decide anything.',
    points: ['APR, term, and total cost side by side', 'Questions answered before you sign', 'Take the time you need'],
  },
  {
    icon: Shield,
    title: 'Decide with confidence',
    short: 'Move forward',
    body: 'You make the call. If you choose to proceed, we help you understand the paperwork so you know exactly what you’re agreeing to.',
    points: ['Your decision, your pace', 'Know what you’re signing', 'Support with follow-up questions'],
  },
]

export default function Journey() {
  const [active, setActive] = useState(0)
  const tabs = useRef([])

  const focusTab = (i) => {
    const next = (i + STEPS.length) % STEPS.length
    setActive(next)
    tabs.current[next]?.focus()
  }

  const onKeyDown = (e) => {
    const keys = { ArrowRight: active + 1, ArrowDown: active + 1, ArrowLeft: active - 1, ArrowUp: active - 1, Home: 0, End: STEPS.length - 1 }
    if (e.key in keys) {
      e.preventDefault()
      focusTab(keys[e.key])
    }
  }

  const step = STEPS[active]
  const Icon = step.icon

  return (
    <section id="journey" className="section journey" aria-labelledby="journey-title">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">How it works</p>
          <h2 id="journey-title" className="section-title">
            A clear path, one step at a time.
          </h2>
          <p className="section-lead">
            No guesswork and no rush. Here’s what working with RG PRIME AUTO FINANCE generally looks like.
          </p>
        </Reveal>

        <Reveal className="journey-layout" delay={80}>
          <div
            className="journey-tabs"
            role="tablist"
            aria-label="Financing journey steps"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            style={{ '--progress': active / (STEPS.length - 1) }}
          >
            <span className="journey-track" aria-hidden="true">
              <span className="journey-fill" />
            </span>
            {STEPS.map((s, i) => (
              <button
                key={s.title}
                ref={(el) => (tabs.current[i] = el)}
                type="button"
                role="tab"
                id={`journey-tab-${i}`}
                aria-selected={active === i}
                aria-controls="journey-panel"
                tabIndex={active === i ? 0 : -1}
                className={`journey-tab ${i <= active ? 'is-done' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="journey-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="journey-tab-text">
                  <span className="journey-tab-title">{s.title}</span>
                  <span className="journey-tab-short">{s.short}</span>
                </span>
              </button>
            ))}
          </div>

          <div
            id="journey-panel"
            role="tabpanel"
            aria-labelledby={`journey-tab-${active}`}
            className="journey-panel card"
            tabIndex={0}
          >
            <div key={active} className="journey-panel-inner">
              <span className="journey-panel-icon">
                <Icon width={28} height={28} />
              </span>
              <p className="journey-step-label">
                Step {active + 1} of {STEPS.length}
              </p>
              <h3>{step.title}</h3>
              <p className="journey-body">{step.body}</p>
              <ul>
                {step.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <div className="journey-actions">
                {active < STEPS.length - 1 ? (
                  <button type="button" className="btn btn-ghost" onClick={() => focusTab(active + 1)}>
                    Next step <ArrowRight width={18} height={18} />
                  </button>
                ) : (
                  <a href="#consult" className="btn btn-primary">
                    Start step one <ArrowRight width={18} height={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
