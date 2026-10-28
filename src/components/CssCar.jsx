import './CssCar.css'

// Lightweight static/CSS fallback for the 3D hero — used when WebGL is unavailable,
// fails, on constrained devices, and while the 3D bundle loads.
export default function CssCar({ animate = true }) {
  return (
    <div className={`css-car ${animate ? 'is-animated' : ''}`} aria-hidden="true">
      <div className="css-stage">
        <div className="css-ring ring-1" />
        <div className="css-ring ring-2" />
        <div className="css-ring ring-3" />
      </div>
      <svg className="css-car-svg" viewBox="0 0 460 180" role="presentation">
        <defs>
          <linearGradient id="cc-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5a6476" />
            <stop offset="0.45" stopColor="#262d3a" />
            <stop offset="1" stopColor="#11151d" />
          </linearGradient>
          <linearGradient id="cc-glass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0a0f18" />
            <stop offset="0.6" stopColor="#1d2c45" />
            <stop offset="1" stopColor="#0a0f18" />
          </linearGradient>
          <radialGradient id="cc-shadow">
            <stop offset="0" stopColor="#000" stopOpacity="0.8" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="230" cy="158" rx="210" ry="14" fill="url(#cc-shadow)" />
        <path
          d="M20 128 L16 100 Q16 78 46 74 L150 66 Q190 34 250 30 L290 31 Q330 34 372 70 Q430 76 444 98 L446 122 Q446 132 432 132 L392 132 A38 38 0 0 0 316 132 L146 132 A38 38 0 0 0 70 132 L30 132 Q20 132 20 128 Z"
          fill="url(#cc-body)"
          stroke="rgba(200,215,240,0.35)"
          strokeWidth="1"
        />
        <path d="M162 68 Q198 42 250 39 L286 40 Q318 43 352 70 Z" fill="url(#cc-glass)" />
        <path d="M60 98 L420 94" stroke="#4da3ff" strokeWidth="2" strokeLinecap="round" />
        <path d="M424 84 L444 92" stroke="#d9ecff" strokeWidth="4" strokeLinecap="round" />
        <path d="M18 92 L28 92" stroke="#ff3d5a" strokeWidth="4" strokeLinecap="round" />
        {[108, 354].map((cx) => (
          <g key={cx} className="css-wheel">
            <circle cx={cx} cy="134" r="30" fill="#0b0d12" />
            <circle cx={cx} cy="134" r="20" fill="#9aa6b8" />
            <circle cx={cx} cy="134" r="22" fill="none" stroke="#4da3ff" strokeWidth="1.5" />
            <circle cx={cx} cy="134" r="6" fill="#1a1f29" />
          </g>
        ))}
      </svg>
    </div>
  )
}
