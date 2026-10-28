import { useRef } from 'react'
import { useInView } from '../hooks/useMedia'

// Fades/slides children in the first time they enter the viewport.
// Reduced-motion users see content immediately (handled in CSS).
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null)
  const visible = useInView(ref, { once: true, rootMargin: '0px 0px -10% 0px' })
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
