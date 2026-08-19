import { memo } from 'react'
import type { GroupProps } from '@react-three/fiber'
import { getGeometries, getMaterials } from './model'
import { resolveTheme, usePrefersDark, type VelvetTheme } from './theme'

export interface VelvetCarProps extends GroupProps {
  /**
   * Compass heading in degrees.
   * 0 = forward (+Z / north), 90 = right (+X / east),
   * 180 = rear (-Z / south), 270 = left (-X / west).
   * rotation.y = +degToRad(heading)
   */
  heading?: number
  /** UI theme. `light` = dark car, `dark` = light car, `auto` (default) = OS setting. */
  theme?: VelvetTheme
}

const WHEEL_ROT: [number, number, number] = [0, 0, Math.PI / 2]
const WHEEL_POSITIONS: [number, number, number][] = [
  [0.82, 0.36, 1.45],
  [-0.82, 0.36, 1.45],
  [0.82, 0.36, -1.45],
  [-0.82, 0.36, -1.45]
]

export const VelvetCar = memo(function VelvetCar({
  heading = 0,
  theme = 'auto',
  ...groupProps
}: VelvetCarProps) {
  const prefersDark = usePrefersDark()
  const resolved = resolveTheme(theme, prefersDark)
  const g = getGeometries()
  const m = getMaterials(resolved)

  return (
    <group {...groupProps}>
      <group rotation-y={heading * Math.PI / 180}>

        {WHEEL_POSITIONS.map((p, i) => (
          <mesh key={i} geometry={g.wheel} material={m.tire}
                position={p} rotation={WHEEL_ROT} />
        ))}

        <mesh geometry={g.body} material={m.body} position={[0, 0.74, 0]} />

        <mesh geometry={g.cabin} material={m.glass} position={[0, 1.24, -0.15]} />
        <mesh geometry={g.roof}  material={m.body}  position={[0, 1.46, -0.45]} />

        <mesh geometry={g.grille}    material={m.trim}     position={[0, 0.72, 2.3]} />
        <mesh geometry={g.taillight} material={m.taillight} position={[0, 0.9, -2.3]} />

        <mesh geometry={g.monogram} material={m.monogram}
              position={[0.906, 0.73, 0.1]} rotation={[0, Math.PI / 2, 0]} />
        <mesh geometry={g.monogram} material={m.monogram}
              position={[-0.906, 0.73, 0.1]} rotation={[0, -Math.PI / 2, 0]} />
      </group>
    </group>
  )
})