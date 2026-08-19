# VelvetCar

A minimal, blocky 3D sedan for fleet tracking maps — built with [React Three Fiber](https://docs.pmnd.rs/react-three-fiber).

`VelvetCar` renders a single stylized car marker. It **does not** own a `<Canvas>` — drop it into your existing R3F scene.

## Install

```bash
npm install velvetcar react three @react-three/fiber
```

`velvetcar` peer-depends on `react` (≥18), `three` (≥0.150), and `@react-three/fiber` (≥8).

## Usage

```tsx
import { Canvas } from '@react-three/fiber'
import { VelvetCar } from 'velvetcar'

<Canvas>
  <ambientLight intensity={1.5} />

  <VelvetCar
    heading={vehicle.heading}
    theme={resolvedTheme}
    position={[x, 0, z]}
  />
</Canvas>
```

## Theme

| theme   | car         |
| ------- | ----------- |
| `light` | dark car    |
| `dark`  | light car   |
| `auto`  | follows `prefers-color-scheme` (default) |

`auto` is the default.

## Heading

`heading` is in **degrees**, compass convention:

| heading | world direction      |
| ------- | -------------------- |
| 0       | forward / +Z (north) |
| 90      | right / +X (east)    |
| 180     | rear / -Z (south)    |
| 270     | left / -X (west)     |

The model's local forward is **+Z** (the nose).
`heading` is converted internally to `rotation.y = +degToRad(heading)`:
`0°` points the nose at `+Z`, `90°` at `+X`, `180°` at `-Z`, `270°` at `-X`.
As heading increases the car rotates clockwise when viewed from above
(in the `+Z = north, +X = east` convention).

If your map uses a different world orientation, wrap the car in your own `<group>`.

## Props

`VelvetCar` accepts all standard R3F `<group>` props (`position`, `scale`, `rotation`, ...).

| prop      | type                        | default  | notes                                       |
| --------- | --------------------------- | -------- | ------------------------------------------- |
| `heading` | `number`                    | `0`      | compass heading (degrees)                   |
| `theme`   | `'light' \| 'dark' \| 'auto'` | `'auto'` | UI theme → car color                        |

## Demo

```bash
npm install
npm run dev
```

Open the printed URL. A grid of cars at different headings, a top-down / angled camera
toggle, a heading slider, and light / dark / auto theme buttons let you verify
readability at tracking-marker scale.

## Dev

```bash
npm run typecheck       # tsc --noEmit
npm run build           # library build → dist/
```

## License

MIT