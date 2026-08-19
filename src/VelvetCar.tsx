import { memo } from 'react'
import type { GroupProps } from '@react-three/fiber'
import { getGeometries, getMaterials } from './model'
import { resolveTheme, usePrefersDark, type VelvetTheme } from './theme'

export interface VelvetCarProps extends GroupProps {
  /**
   * Compass heading in degrees.
   * 0 = forward (+Z / north), 90 = right (+X / east),
   * 180 = rear (-Z / south), 270 = left (-X / west).
   * Converted internally to `rotation.y = +degToRad(heading)`.
   */
  heading?: number
  /**
   * UI theme. `light` renders a dark car, `dark` a light car.
   * `auto` (default) follows `prefers-color-scheme`.
   */
  theme?: VelvetTheme
}

/* ------------------------------------------------------------------ */
/*  Constant transforms (module scope — avoids per-render allocs).   */
/* ------------------------------------------------------------------ */

const DEG2RAD = Math.PI / 180

const WHEEL_ROT: [number, number, number] = [0, 0, Math.PI / 2]

const WHEEL_POSITIONS: [number, number, number][] = [
  [0.82, 0.36, 1.45],
  [-0.82, 0.36, 1.45],
  [0.82, 0.36, -1.45],
  [-0.82, 0.36, -1.45]
]

/* ------------------------------------------------------------------ */

export const VelvetCar = memo(function VelvetCar({
  heading = 0,
  theme = 'auto',
  ...groupProps
}: VelvetCarProps) {
  const prefersDark = usePrefersDark()
  const resolved = resolveTheme(theme, prefersDark)

  const g = getGeometries()
  const m = getMaterials(resolved)

  // heading (degrees, compass) -> three.js rotation.y.
  // 0° = +Z, 90° = +X, 180° = -Z, 270° = -X.
  const rotationY = heading * DEG2RAD

  return (
    <group {...groupProps}>
      <group rotation-y={rotationY}>

        {/* 4 wheels */}
        {WHEEL_POSITIONS.map((p, i) => (
          <mesh key={i} geometry={g.wheel} material={m.tire}
                position={p} rotation={WHEEL_ROT} />
        ))}

        {/* lower body / main tub */}
        <mesh geometry={g.body} material={m.body}
              position={[0, 0.74, 0]} />

        {/* cabin glass + painted roof (roof sits rearward, exposing windshield) */}
        <mesh geometry={g.cabin} material={m.glass}
              position={[0, 1.24, -0.15]} />
        <mesh geometry={g.roof} material={m.body}
              position={[0, 1.46, -0.45]} />

        {/* front grille + rear taillight */}
        <mesh geometry={g.grille} material={m.trim}
              position={[0, 0.72, 2.3]} />
        <mesh geometry={g.taillight} material={m.taillight}
              position={[0, 0.9, -2.3]} />

        {/* Velvet monogram — side door decals only (actual asset texture) */}
        <mesh geometry={g.monogram} material={m.monogram}
              position={[0.906, 0.76, 0.1]}
              rotation={[0, Math.PI / 2, 0]} />
        <mesh geometry={g.monogram} material={m.monogram}
              position={[-0.906, 0.76, 0.1]}
              rotation={[0, -Math.PI / 2, 0]} />
      </group>
    </group>
  )
})