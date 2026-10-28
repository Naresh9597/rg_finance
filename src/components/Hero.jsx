import HeroVisual from './HeroVisual'
import { ArrowRight, Check } from './Icons'
import './Hero.css'

const HIGHLIGHTS = ['Talk through your options', 'Understand each term', 'Plan a budget before you shop']

export default function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-grid" />
        <div className="hero-glow" />
      </div>

      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="hero-kicker">
            <span className="pulse-dot" aria-hidden="true" />
            Auto financing consultations
          </p>
          <h1 id="hero-title">
            <span className="hero-name metal-text">RG PRIME AUTO FINANCE</span>
            <span className="hero-headline">
              Financing guidance for the <em>road ahead.</em>
            </span>
          </h1>
          <p className="hero-sub">
            Whether you’re eyeing a new vehicle, a pre-owned favorite, or a better fit for your current loan, start
            with a clear conversation about your goals, your budget, and the options that may be available to you.
          </p>

          <div className="hero-ctas">
            <a href="#consult" className="btn btn-primary">
              Get Started <ArrowRight width={18} height={18} />
            </a>
            <a href="#estimate" className="btn btn-ghost">
              Estimate a payment
            </a>
          </div>

          <ul className="hero-highlights">
            {HIGHLIGHTS.map((h) => (
              <li key={h}>
                <Check width={16} height={16} />
                {h}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-visual-wrap">
          <HeroVisual />
        </div>
      </div>

      <a href="#services" className="scroll-cue" aria-label="Scroll to services">
        <span aria-hidden="true" />
      </a>
    </section>
  )
}
