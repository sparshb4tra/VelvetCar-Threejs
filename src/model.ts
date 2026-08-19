import * as THREE from 'three'
import { paletteFor, type Palette, type ResolvedTheme } from './theme'

/* ------------------------------------------------------------------ */
/*  Geometry (created once, shared across every instance).           */
/* ------------------------------------------------------------------ */

let _geo: ReturnType<typeof _buildGeometries> | null = null

function _buildMonogram(): THREE.ShapeGeometry {
  // Outer triangle — filled "V".
  const outer = new THREE.Shape()
  outer.moveTo(-0.78, 0.66)
  outer.lineTo(0, -0.72)
  outer.lineTo(0.78, 0.66)
  outer.closePath()

  // Inner notch — turns the triangle into two tapered strokes.
  const notch = new THREE.Path()
  notch.moveTo(-0.26, 0.66)
  notch.lineTo(0.26, 0.66)
  notch.lineTo(0, -0.42)
  notch.closePath()
  outer.holes.push(notch)

  return new THREE.ShapeGeometry(outer, 10)
}

function _buildGeometries() {
  return {
    body: new THREE.BoxGeometry(1.8, 0.62, 4.6),
    cabin: new THREE.BoxGeometry(1.52, 0.46, 2.2),
    roof: new THREE.BoxGeometry(1.44, 0.08, 1.7),
    grille: new THREE.BoxGeometry(1.66, 0.34, 0.08),
    taillight: new THREE.BoxGeometry(1.66, 0.16, 0.06),
    wheel: new THREE.CylinderGeometry(0.36, 0.36, 0.34, 24),
    monogram: _buildMonogram()
  }
}

export function getGeometries() {
  if (!_geo) _geo = _buildGeometries()
  return _geo
}

/* ------------------------------------------------------------------ */
/*  Materials (one set per resolved theme, created lazily + cached).  */
/* ------------------------------------------------------------------ */

export interface CarMaterials {
  body: THREE.MeshStandardMaterial
  glass: THREE.MeshStandardMaterial
  tire: THREE.MeshStandardMaterial
  trim: THREE.MeshStandardMaterial
  monogram: THREE.MeshStandardMaterial
  taillight: THREE.MeshStandardMaterial
}

function _buildMaterials(p: Palette): CarMaterials {
  return {
    body: new THREE.MeshStandardMaterial({
      color: p.body, metalness: 0.2, roughness: 0.5
    }),
    glass: new THREE.MeshStandardMaterial({
      color: p.glass, metalness: 0.45, roughness: 0.15
    }),
    tire: new THREE.MeshStandardMaterial({
      color: p.tire, metalness: 0.05, roughness: 0.95
    }),
    trim: new THREE.MeshStandardMaterial({
      color: p.trim, metalness: 0.1, roughness: 0.6
    }),
    monogram: new THREE.MeshStandardMaterial({
      color: p.monogram, metalness: 0.55, roughness: 0.35,
      emissive: new THREE.Color(p.monogram), emissiveIntensity: 0.45
    }),
    taillight: new THREE.MeshStandardMaterial({
      color: p.taillight, metalness: 0.1, roughness: 0.4,
      emissive: new THREE.Color(p.taillight), emissiveIntensity: 0.7
    })
  }
}

const _mCache: Partial<Record<ResolvedTheme, CarMaterials>> = {}

export function getMaterials(theme: ResolvedTheme): CarMaterials {
  let m = _mCache[theme]
  if (!m) {
    m = _buildMaterials(paletteFor(theme))
    _mCache[theme] = m
  }
  return m
}