import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const ACCENT = new THREE.Color('#4da3ff')
const WHEEL_X = 1.35
const WHEEL_R = 0.37
const BODY_DEPTH = 1.86
const WHEEL_Z = BODY_DEPTH / 2 + 0.04

// Side profile of a low coupe, front facing +x. Wheel arches are cut with arcs.
function bodyShape() {
  const s = new THREE.Shape()
  s.moveTo(-2.25, 0.34)
  s.lineTo(-2.32, 0.62)
  s.quadraticCurveTo(-2.34, 0.9, -2.0, 0.94)
  s.lineTo(-1.0, 0.97)
  s.lineTo(1.25, 0.86)
  s.quadraticCurveTo(2.2, 0.8, 2.32, 0.56)
  s.lineTo(2.3, 0.4)
  s.quadraticCurveTo(2.27, 0.32, 2.1, 0.32)
  s.lineTo(WHEEL_X + 0.47, 0.32)
  s.absarc(WHEEL_X, 0.32, 0.47, 0, Math.PI, false)
  s.lineTo(-WHEEL_X + 0.47, 0.32)
  s.absarc(-WHEEL_X, 0.32, 0.47, 0, Math.PI, false)
  s.lineTo(-2.25, 0.34)
  return s
}

function cabinShape() {
  const s = new THREE.Shape()
  s.moveTo(-1.85, 0.93)
  s.quadraticCurveTo(-1.2, 1.36, -0.45, 1.4)
  s.lineTo(0.1, 1.39)
  s.quadraticCurveTo(0.7, 1.34, 1.38, 0.87)
  s.lineTo(-1.85, 0.93)
  return s
}

function extrude(shape, depth, bevel) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.7,
    bevelSegments: 5,
    curveSegments: 28,
  })
  g.translate(0, 0, -depth / 2)
  g.computeVertexNormals()
  return g
}

// Soft radial texture used as a cheap contact shadow (no shadow maps needed).
function shadowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')
  const grd = ctx.createRadialGradient(64, 64, 4, 64, 64, 64)
  grd.addColorStop(0, 'rgba(0,0,0,0.85)')
  grd.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, 128, 128)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

// Procedural studio reflections (no HDR download), attached to scene.environment.
function Environment() {
  const gl = useThree((s) => s.gl)
  const env = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const texture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    pmrem.dispose()
    return texture
  }, [gl])
  useEffect(() => () => env.dispose(), [env])
  return <primitive object={env} attach="environment" />
}

function Wheel({ position, spinRef }) {
  const ref = useRef(null)
  useFrame(() => {
    if (ref.current) ref.current.rotation.z = -spinRef.current
  })
  const side = Math.sign(position[2])
  return (
    <group position={position}>
      <group ref={ref}>
        <mesh rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[WHEEL_R, WHEEL_R, 0.3, 40]} />
          <meshStandardMaterial color="#0b0d12" roughness={0.85} />
        </mesh>
        <mesh rotation-x={Math.PI / 2} position-z={side * 0.155}>
          <cylinderGeometry args={[WHEEL_R * 0.7, WHEEL_R * 0.7, 0.02, 6]} />
          <meshStandardMaterial color="#c8d1de" metalness={1} roughness={0.25} />
        </mesh>
      </group>
      <mesh position-z={side * 0.16}>
        <torusGeometry args={[WHEEL_R * 0.74, 0.012, 8, 48]} />
        <meshBasicMaterial color={ACCENT} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Car({ animate, pointer }) {
  const group = useRef(null)
  const spin = useRef(0)
  const geo = useMemo(
    () => ({ body: extrude(bodyShape(), BODY_DEPTH, 0.14), cabin: extrude(cabinShape(), BODY_DEPTH - 0.5, 0.1) }),
    [],
  )
  const shadow = useMemo(() => shadowTexture(), [])

  useEffect(
    () => () => {
      geo.body.dispose()
      geo.cabin.dispose()
      shadow.dispose()
    },
    [geo, shadow],
  )

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    const dt = Math.min(delta, 0.05)
    if (animate) {
      g.rotation.y += dt * 0.22
      spin.current += dt * 1.6
    }
    // Ease toward the pointer for a gentle parallax tilt.
    const tx = animate ? pointer.current.y * 0.06 : 0
    g.rotation.x += (tx - g.rotation.x) * 0.05
  })

  const sideZ = BODY_DEPTH / 2 + 0.145
  return (
    <group ref={group} rotation-y={-0.6}>
      <mesh geometry={geo.body}>
        <meshPhysicalMaterial
          color="#2c3442"
          metalness={0.85}
          roughness={0.28}
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={1.2}
        />
      </mesh>
      <mesh geometry={geo.cabin}>
        <meshPhysicalMaterial
          color="#0b1424"
          metalness={0.6}
          roughness={0.06}
          clearcoat={1}
          clearcoatRoughness={0.04}
          envMapIntensity={2}
        />
      </mesh>

      {/* Accent light lines along each flank */}
      {[1, -1].map((s) => (
        <mesh key={s} position={[0.05, 0.66, s * sideZ]}>
          <boxGeometry args={[3.2, 0.018, 0.005]} />
          <meshBasicMaterial color={ACCENT} toneMapped={false} />
        </mesh>
      ))}
      {/* Headlight bar and tail light bar */}
      <mesh position={[2.34, 0.6, 0]} rotation-z={-0.35}>
        <boxGeometry args={[0.03, 0.05, BODY_DEPTH * 0.86]} />
        <meshBasicMaterial color="#d9ecff" toneMapped={false} />
      </mesh>
      <mesh position={[-2.38, 0.76, 0]}>
        <boxGeometry args={[0.03, 0.04, BODY_DEPTH * 0.9]} />
        <meshBasicMaterial color="#ff3d5a" toneMapped={false} />
      </mesh>

      {[
        [WHEEL_X, WHEEL_R, WHEEL_Z],
        [WHEEL_X, WHEEL_R, -WHEEL_Z],
        [-WHEEL_X, WHEEL_R, WHEEL_Z],
        [-WHEEL_X, WHEEL_R, -WHEEL_Z],
      ].map((p) => (
        <Wheel key={p.join()} position={p} spinRef={spin} />
      ))}

      <mesh rotation-x={-Math.PI / 2} position-y={0.005} scale={[5.6, 3.2, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} />
      </mesh>
    </group>
  )
}

function Turntable({ animate }) {
  const ring = useRef(null)
  useFrame((_, delta) => {
    if (animate && ring.current) ring.current.rotation.z -= Math.min(delta, 0.05) * 0.15
  })
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2}>
        <circleGeometry args={[3.0, 72]} />
        <meshStandardMaterial color="#0b1222" metalness={0.8} roughness={0.38} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.004}>
        <ringGeometry args={[2.96, 3.0, 96]} />
        <meshBasicMaterial color={ACCENT} toneMapped={false} />
      </mesh>
      <mesh ref={ring} rotation-x={-Math.PI / 2} position-y={0.004}>
        <ringGeometry args={[3.2, 3.23, 96, 1, 0, Math.PI * 1.35]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.55} toneMapped={false} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.003}>
        <ringGeometry args={[2.45, 2.46, 96]} />
        <meshBasicMaterial color="#9fb3d1" transparent opacity={0.25} />
      </mesh>
    </group>
  )
}

function Rig({ animate, pointer }) {
  const target = useMemo(() => new THREE.Vector3(0, 0.55, 0), [])
  useFrame(({ camera }) => {
    if (animate) {
      camera.position.x += (7.0 + pointer.current.x * 0.5 - camera.position.x) * 0.04
    }
    camera.lookAt(target)
  })
  return null
}

export default function CarScene({ animate = true, active = true, lowPower = false, onContextLost }) {
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!animate) return
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [animate])

  // Reduced motion renders a single still frame; off-screen pauses rendering entirely.
  const frameloop = !animate ? 'demand' : active ? 'always' : 'never'

  return (
    <Canvas
      className="car-canvas"
      frameloop={frameloop}
      dpr={lowPower ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [7.0, 2.75, 7.4], fov: 30, near: 0.1, far: 50 }}
      gl={{ antialias: !lowPower, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          onContextLost?.()
        })
      }}
      aria-hidden="true"
      tabIndex={-1}
    >
      <Environment />
      <hemisphereLight args={['#bcd4ff', '#05070d', 0.5]} />
      <directionalLight position={[4, 6, 3]} intensity={1.6} />
      <pointLight position={[-4, 2, -3]} intensity={18} color="#2f7bff" distance={12} />
      <pointLight position={[3, 1.2, -4]} intensity={10} color="#7cc0ff" distance={10} />
      <Rig animate={animate} pointer={pointer} />
      <Car animate={animate} pointer={pointer} />
      <Turntable animate={animate} />
    </Canvas>
  )
}
