import Reveal from './Reveal'
import { Check, Clock, Doc, Shield } from './Icons'
import './Commitments.css'

const PRINCIPLES = [
  {
    icon: Doc,
    title: 'Plain-language explanations',
    body: 'We aim to explain rates, terms, and total cost in everyday language so you can compare options with confidence.',
  },
  {
    icon: Clock,
    title: 'Your timeline',
    body: 'Financing is a big decision. Take the time you need to ask questions and review the details.',
  },
  {
    icon: Shield,
    title: 'Care with your information',
    body: 'We ask only for what’s needed to start the conversation, and you choose how you’d like to be contacted.',
  },
]

// Neutral consumer-education checklist — useful no matter where a customer finances.
const CHECKLIST = [
  'The APR, not just the monthly payment',
  'The total cost over the full term',
  'How the term length affects total interest',
  'Whether there is a prepayment penalty',
  'Which add-on products are optional',
  'Every fee included in the amount financed',
]

export default function Commitments() {
  return (
    <section id="approach" className="section commitments" aria-labelledby="approach-title">
      <div className="container commitments-layout">
        <div>
          <Reveal className="section-head">
            <p className="eyebrow">Our approach</p>
            <h2 id="approach-title" className="section-title">
              Clarity first, at your pace.
            </h2>
            <p className="section-lead">
              The right financing decision is an informed one. Here’s what guides every conversation at RG PRIME AUTO
              FINANCE.
            </p>
          </Reveal>
          <div className="principles">
            {PRINCIPLES.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} className="principle" delay={i * 90}>
                <span className="principle-icon">
                  <Icon />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="checklist card" delay={120}>
          <div className="checklist-plate" aria-hidden="true">
            <span>RG</span>
            <span>PRIME</span>
          </div>
          <h3>Before you sign anything, understand:</h3>
          <ul>
            {CHECKLIST.map((item) => (
              <li key={item}>
                <span className="check">
                  <Check width={14} height={14} />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="checklist-foot">Bring this list to your consultation — we’re glad to walk through each item.</p>
        </Reveal>
      </div>
    </section>
  )
}
