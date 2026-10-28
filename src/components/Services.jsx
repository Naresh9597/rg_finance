import Reveal from './Reveal'
import { Car, Chat, Refresh, Sparkle, Swap, Wallet } from './Icons'
import './Services.css'

// General service descriptions. Confirm the final list with the client before launch.
const SERVICES = [
  {
    icon: Sparkle,
    title: 'New vehicle financing',
    body: 'Talk through financing approaches for a new vehicle and what to compare before you commit.',
  },
  {
    icon: Car,
    title: 'Pre-owned vehicle financing',
    body: 'Explore how financing a used vehicle can differ — from term length to the total cost over time.',
  },
  {
    icon: Refresh,
    title: 'Refinancing questions',
    body: 'Already have an auto loan? Review your current terms and discuss whether refinancing could be worth exploring.',
  },
  {
    icon: Swap,
    title: 'Trade-in considerations',
    body: 'Understand how a trade-in or remaining loan balance can factor into the amount you finance.',
  },
  {
    icon: Wallet,
    title: 'Budget planning',
    body: 'Work out a monthly payment range that fits your life before you start shopping for a vehicle.',
  },
  {
    icon: Chat,
    title: 'Credit conversations',
    body: 'Have questions about your credit history? Bring them — we’ll discuss what may affect your options.',
  },
]

export default function Services() {
  return (
    <section id="services" className="section services" aria-labelledby="services-title">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">How we can help</p>
          <h2 id="services-title" className="section-title">
            Financing support, from first question to final signature.
          </h2>
          <p className="section-lead">
            Every situation is different. These are the conversations we can start with — tell us where you are, and
            we’ll focus on what matters to you.
          </p>
        </Reveal>

        <ul className="services-grid">
          {SERVICES.map(({ icon: Icon, title, body }, i) => (
            <Reveal as="li" key={title} delay={(i % 3) * 90} className="service card">
              <span className="service-icon">
                <Icon />
              </span>
              <h3>{title}</h3>
              <p>{body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
