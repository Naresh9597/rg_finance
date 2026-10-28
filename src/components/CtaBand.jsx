import Reveal from './Reveal'
import { ArrowRight } from './Icons'
import './CtaBand.css'

export default function CtaBand() {
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="container">
        <Reveal className="cta-panel">
          <div className="cta-lines" aria-hidden="true" />
          <p className="cta-brand metal-text">RG PRIME AUTO FINANCE</p>
          <h2 id="cta-title">Ready to talk about your next vehicle?</h2>
          <p className="cta-sub">Start with a conversation about your goals, your budget, and your questions.</p>
          <a href="#consult" className="btn btn-primary">
            Get Started <ArrowRight width={18} height={18} />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
