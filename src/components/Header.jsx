import { useEffect, useRef, useState } from 'react'
import { NAV_LINKS } from '../config/site'
import { useActiveSection } from '../hooks/useMedia'
import Brand from './Brand'
import { ArrowRight, Close, Menu } from './Icons'
import './Header.css'

// 'top' (the hero) is observed too, so no link stays highlighted after scrolling back up.
const SECTION_IDS = ['top', ...NAV_LINKS.map((l) => l.id)]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(SECTION_IDS)
  const toggleRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Mobile menu: lock scroll, focus first link, close on Escape or when resized to desktop.
  useEffect(() => {
    if (!open) return
    document.body.classList.add('menu-open')
    panelRef.current?.querySelector('a')?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const mql = window.matchMedia('(min-width: 960px)')
    const onChange = (e) => e.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    mql.addEventListener('change', onChange)
    return () => {
      document.body.classList.remove('menu-open')
      window.removeEventListener('keydown', onKey)
      mql.removeEventListener('change', onChange)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={`site-header ${scrolled || open ? 'is-solid' : ''} ${open ? 'menu-is-open' : ''}`}>
      <div className="container header-inner">
        <a href="#top" className="header-brand" aria-label="RG PRIME AUTO FINANCE — back to top" onClick={close}>
          <Brand />
        </a>

        <nav className="desktop-nav" aria-label="Primary">
          <ul>
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} aria-current={active === l.id ? 'true' : undefined}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <a href="#consult" className="btn btn-primary header-cta">
            Get Started
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={panelRef}
        className={`mobile-menu ${open ? 'is-open' : ''}`}
        hidden={!open}
      >
        <nav aria-label="Mobile" className="container">
          <ul>
            {NAV_LINKS.map((l, i) => (
              <li key={l.id} style={{ '--i': i }}>
                <a href={`#${l.id}`} onClick={close} aria-current={active === l.id ? 'true' : undefined}>
                  {l.label}
                  <ArrowRight />
                </a>
              </li>
            ))}
          </ul>
          <a href="#consult" className="btn btn-primary mobile-cta" onClick={close}>
            Get Started <ArrowRight width={18} height={18} />
          </a>
        </nav>
      </div>
    </header>
  )
}
