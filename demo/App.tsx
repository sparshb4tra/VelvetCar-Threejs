import { useState, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { VelvetCar, resolveTheme, usePrefersDark, type VelvetTheme } from '../src'

/* ---- fleet (fixed heading, shows multiple instances) ---- */

const FLEET: { position: [number, number, number]; heading: number }[] = [
  { position: [-10, 0, 0], heading: 0 },
  { position: [-5, 0, 0], heading: 45 },
  { position: [0, 0, 0], heading: 90 },
  { position: [5, 0, 0], heading: 180 },
  { position: [10, 0, 0], heading: 270 }
]

/* ---- camera rig (reacts to topDown prop) ---- */

function Camera({ topDown }: { topDown: boolean }) {
  const { camera } = useThree()
  useEffect(() => {
    if (topDown) {
      camera.position.set(0, 24, 0)
      camera.up.set(0, 0, 1) // +Z = up on screen (north ↑)
      camera.lookAt(0, 0, 0)
    } else {
      camera.up.set(0, 1, 0)
      camera.position.set(13, 10, 16)
      camera.lookAt(0, 0, 0)
    }
  }, [topDown, camera])
  return null
}

/* ---- controls overlay ---- */

const btn = (active: boolean, dark: boolean): React.CSSProperties => ({
  padding: '6px 14px',
  border: active ? '2px solid #d4a62a' : `1px solid ${dark ? '#666' : '#bbb'}`,
  borderRadius: 6,
  background: active ? (dark ? '#2a2c31' : '#fff') : 'transparent',
  color: dark ? '#ddd' : '#222',
  cursor: 'pointer',
  fontSize: 13,
  fontFamily: 'system-ui, sans-serif'
})

/* ---- app ---- */

export function App() {
  const [theme, setTheme] = useState<VelvetTheme>('auto')
  const [heading, setHeading] = useState(35)
  const [topDown, setTopDown] = useState(false)

  const prefersDark = usePrefersDark()
  const resolved = resolveTheme(theme, prefersDark)
  const darkBg = resolved === 'dark'

  const bg = darkBg ? '#0e0f12' : '#e8e9ec'

  return (
    <div style={{ position: 'fixed', inset: 0, background: bg }}>
      <Canvas camera={{ fov: 42 }}>
        <Camera topDown={topDown} />

        <ambientLight intensity={1.5} />
        <directionalLight position={[8, 16, 6]} intensity={1.6} />

        <gridHelper
          args={[
            50, 50,
            darkBg ? '#2a2c31' : '#c9cbd0',
            darkBg ? '#1c1e22' : '#d8dade'
          ]}
        />

        {/* fleet row */}
        {FLEET.map((c, i) => (
          <VelvetCar key={i} theme={theme} heading={c.heading} position={c.position} />
        ))}

        {/* single large car with slider heading */}
        <VelvetCar theme={theme} heading={heading} position={[0, 0, 8]} scale={2} />
      </Canvas>

      {/* overlay */}
      <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        {(['light', 'dark', 'auto'] as const).map((t) => (
          <button key={t} onClick={() => setTheme(t)} style={btn(theme === t, darkBg)}>
            {t}
          </button>
        ))}
        <button onClick={() => setTopDown((v) => !v)} style={btn(topDown, darkBg)}>
          {topDown ? 'angled' : 'top-down'}
        </button>
        <label style={{ marginLeft: 12, color: darkBg ? '#ddd' : '#222', fontSize: 13, fontFamily: 'system-ui' }}>
          heading {heading}°
          <input
            type="range" min={0} max={359} value={heading}
            onChange={(e) => setHeading(Number(e.target.value))}
            style={{ marginLeft: 8, verticalAlign: 'middle' }}
          />
        </label>
      </div>
    </div>
  )
}