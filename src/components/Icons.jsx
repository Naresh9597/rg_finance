/* oxlint-disable react/only-export-components -- icons are built by a small factory */
// Small inline icon set (stroke-based, inherits currentColor). Decorative by default.
const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

const make = (paths) =>
  function Icon(props) {
    return (
      <svg {...base} {...props}>
        {paths}
      </svg>
    )
  }

export const ArrowRight = make(<path d="M5 12h14M13 6l6 6-6 6" />)
export const Menu = make(<path d="M4 7h16M4 12h16M4 17h10" />)
export const Close = make(<path d="M6 6l12 12M18 6L6 18" />)
export const Plus = make(<path d="M12 5v14M5 12h14" />)
export const Check = make(<path d="M5 12.5l4.5 4.5L19 7.5" />)
export const Car = make(
  <>
    <path d="M3 15.5V13l2.2-4.4A2 2 0 0 1 7 7.5h10a2 2 0 0 1 1.8 1.1L21 13v2.5a1 1 0 0 1-1 1h-1" />
    <path d="M5 16.5H4a1 1 0 0 1-1-1M9 16.5h6M3.5 12.5h17" />
    <circle cx="7" cy="16.5" r="2" />
    <circle cx="17" cy="16.5" r="2" />
  </>,
)
export const Sparkle = make(
  <>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
    <path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z" />
  </>,
)
export const Refresh = make(
  <>
    <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8" />
    <path d="M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16" />
    <path d="M20 20v-4h-4" />
  </>,
)
export const Swap = make(
  <>
    <path d="M7 4L3 8l4 4M3 8h14" />
    <path d="M17 12l4 4-4 4M21 16H7" />
  </>,
)
export const Wallet = make(
  <>
    <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3" />
    <path d="M4 7.5V17a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H6.5A2.5 2.5 0 0 1 4 5.5" />
    <circle cx="16" cy="13.5" r="1.2" />
  </>,
)
export const Chat = make(
  <>
    <path d="M4 5h16v11H9l-5 4z" />
    <path d="M8 9.5h8M8 12.5h5" />
  </>,
)
export const Shield = make(
  <>
    <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" />
    <path d="M9 12l2 2 4-4" />
  </>,
)
export const Doc = make(
  <>
    <path d="M7 3h7l5 5v13H7z" />
    <path d="M14 3v5h5M10 13h6M10 17h6" />
  </>,
)
export const Compass = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5l-2 5-5 2 2-5z" />
  </>,
)
export const Clock = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>,
)
export const Info = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </>,
)
