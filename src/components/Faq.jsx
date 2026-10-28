import { useId, useState } from 'react'
import Reveal from './Reveal'
import { Plus } from './Icons'
import './Faq.css'

const FAQS = [
  {
    q: 'Does requesting a consultation mean I’m approved for financing?',
    a: 'No. A consultation is a conversation about your goals and options — it isn’t a credit decision. Any financing is subject to credit review and approval, and terms depend on your individual situation.',
  },
  {
    q: 'Will submitting the consultation form affect my credit?',
    a: 'The form on this page only shares your contact details and preferences so we can follow up. It is not a credit application. If any step later in the process would involve a credit inquiry, ask us about it first — you should always know before it happens.',
  },
  {
    q: 'Is the payment estimator an offer or a rate quote?',
    a: 'No. The estimator uses standard loan math with values you enter, including a hypothetical APR. It’s meant to help you plan and prepare questions. Actual rates and terms, if offered, may be different.',
  },
  {
    q: 'What should I have ready for a consultation?',
    a: 'A rough budget, the type of vehicle you’re considering, and details about any trade-in or current auto loan are a great start. We’ll let you know if anything else would be helpful.',
  },
  {
    q: 'Can I ask questions about refinancing a loan I already have?',
    a: 'Yes. Share your current situation when you reach out and we can talk through whether refinancing is something worth exploring for you.',
  },
]

function FaqItem({ q, a, open, onToggle }) {
  const id = useId()
  return (
    <div className={`faq-item ${open ? 'is-open' : ''}`}>
      <h3>
        <button type="button" aria-expanded={open} aria-controls={`${id}-panel`} id={`${id}-btn`} onClick={onToggle}>
          <span>{q}</span>
          <span className="faq-icon" aria-hidden="true">
            <Plus width={18} height={18} />
          </span>
        </button>
      </h3>
      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-btn`} className="faq-panel" inert={!open}>
        <div className="faq-panel-inner">
          <p>{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0)
  return (
    <section id="faq" className="section faq" aria-labelledby="faq-title">
      <div className="container faq-layout">
        <Reveal className="section-head">
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-title" className="section-title">
            Good questions to ask.
          </h2>
          <p className="section-lead">
            Straight answers to common questions. Don’t see yours? Ask during your consultation.
          </p>
        </Reveal>
        <Reveal className="faq-list" delay={80}>
          {FAQS.map((f, i) => (
            <FaqItem key={f.q} {...f} open={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
          ))}
        </Reveal>
      </div>
    </section>
  )
}
