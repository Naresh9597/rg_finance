import { NAV_LINKS, SITE } from '../config/site'
import Brand from './Brand'
import './Footer.css'

const YEAR = new Date().getFullYear()

export default function Footer() {
  const { phone, email, address, hours } = SITE.contact
  const hasContact = phone || email || address || hours

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Brand size="lg" />
            <p>Guidance for exploring auto-financing options with clarity and confidence.</p>
          </div>

          <nav aria-label="Footer">
            <ul className="footer-links">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`}>{l.label}</a>
                </li>
              ))}
              <li>
                <a href="#consult">Request a consultation</a>
              </li>
            </ul>
          </nav>

          {/* Rendered only when real contact details are supplied in src/config/site.js */}
          {hasContact && (
            <address className="footer-contact">
              {phone && <a href={`tel:${phone.replace(/[^\d+]/g, '')}`}>{phone}</a>}
              {email && <a href={`mailto:${email}`}>{email}</a>}
              {address && <span>{address}</span>}
              {hours && <span>{hours}</span>}
            </address>
          )}
        </div>

        <div className="footer-legal">
          <p>
            Information on this website is for general educational purposes and is not an offer to lend, a commitment
            to finance, or a guarantee of approval. Payment estimates are illustrative only. All financing is subject to
            credit review and approval, and terms vary based on individual circumstances.
          </p>
          <p className="footer-copy">
            © {YEAR} {SITE.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
