import './Brand.css'

// Consistent wordmark for RG PRIME AUTO FINANCE.
export default function Brand({ size = 'md' }) {
  return (
    <span className={`brand brand-${size}`}>
      <span className="brand-mark" aria-hidden="true">
        RG
      </span>
      <span className="brand-text">
        <span className="brand-primary metal-text">RG PRIME</span>
        <span className="brand-secondary">AUTO FINANCE</span>
      </span>
    </span>
  )
}
