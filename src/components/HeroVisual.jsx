import { Component, lazy, Suspense, useRef, useState } from 'react'
import { useInView, useMediaQuery, usePrefersReducedMotion } from '../hooks/useMedia'
import CssCar from './CssCar'
import './HeroVisual.css'

// The WebGL scene (three.js + R3F) is code-split so it never blocks first paint.
const CarScene = lazy(() => import('./CarScene'))

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

// Skip the 3D scene on devices that signal limited resources.
function isConstrainedDevice() {
  // Append ?static to the URL to preview the non-WebGL fallback.
  if (new URLSearchParams(window.location.search).has('static')) return true
  const nav = typeof navigator !== 'undefined' ? navigator : {}
  if (nav.connection?.saveData) return true
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 1) return true
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 1) return true
  return false
}

class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onFail?.()
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

export default function HeroVisual() {
  const ref = useRef(null)
  const reducedMotion = usePrefersReducedMotion()
  const inView = useInView(ref)
  const isSmall = useMediaQuery('(max-width: 600px)')
  const [failed, setFailed] = useState(false)
  const [use3D] = useState(() => typeof window !== 'undefined' && hasWebGL() && !isConstrainedDevice())

  const fallback = <CssCar animate={!reducedMotion} />
  const show3D = use3D && !failed

  return (
    <div
      ref={ref}
      className="hero-visual"
      role="img"
      aria-label="Stylized sports car in metallic graphite, displayed on a glowing blue showroom turntable"
      data-mode={show3D ? 'webgl' : 'css'}
    >
      <div className="visual-halo" aria-hidden="true" />
      {show3D ? (
        <SceneBoundary fallback={fallback} onFail={() => setFailed(true)}>
          <Suspense fallback={fallback}>
            <CarScene
              animate={!reducedMotion}
              active={inView}
              lowPower={isSmall}
              onContextLost={() => setFailed(true)}
            />
          </Suspense>
        </SceneBoundary>
      ) : (
        fallback
      )}
      <div className="visual-chip chip-a" aria-hidden="true">
        <span className="chip-label">Your budget</span>
        <span className="chip-value">Planned first</span>
      </div>
      <div className="visual-chip chip-b" aria-hidden="true">
        <span className="chip-label">Your terms</span>
        <span className="chip-value">Explained clearly</span>
      </div>
    </div>
  )
}
