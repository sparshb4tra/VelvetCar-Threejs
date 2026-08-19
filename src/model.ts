import * as THREE from 'three'
import monogramUrl from './assets/velvet-monogram.png'
import { paletteFor, type Palette, type ResolvedTheme } from './theme'

/* ------------------------------------------------------------------ */
/*  Geometry (created once, shared across every instance).           */
/* ------------------------------------------------------------------ */

let _geo: ReturnType<typeof _buildGeometries> | null = null

function _buildGeometries() {
  return {
    body: new THREE.BoxGeometry(1.8, 0.62, 4.6),
    cabin: new THREE.BoxGeometry(1.52, 0.38, 2.5),
    roof: new THREE.BoxGeometry(1.44, 0.06, 2.1),
    grille: new THREE.BoxGeometry(1.66, 0.34, 0.08),
    taillight: new THREE.BoxGeometry(1.66, 0.16, 0.06),
    wheel: new THREE.CylinderGeometry(0.36, 0.36, 0.34, 24),
    // PlaneGeometry matching the actual monogram asset aspect ratio (62:80 ≈ 0.775).
    monogram: new THREE.PlaneGeometry(0.55, 0.71)
  }
}

export function getGeometries() {
  if (!_geo) _geo = _buildGeometries()
  return _geo
}

/* ------------------------------------------------------------------ */
/*  Texture — eagerly load the real Velvet monogram from the asset.   */
/* ------------------------------------------------------------------ */

let _monogramTex: THREE.Texture | null = null
new THREE.TextureLoader().load(monogramUrl, (tex) => {
  tex.colorSpace = THREE.SRGBColorSpace
  _monogramTex = tex
  // apply to any already-built monogram materials
  for (const set of Object.values(_mCache)) {
    set.monogram.map = tex
    set.monogram.needsUpdate = true
  }
})

/* ------------------------------------------------------------------ */
/*  Materials (one set per resolved theme, created lazily + cached).  */
/* ------------------------------------------------------------------ */

export interface CarMaterials {
  body: THREE.MeshStandardMaterial
  glass: THREE.MeshStandardMaterial
  tire: THREE.MeshStandardMaterial
  trim: THREE.MeshStandardMaterial
  monogram: THREE.MeshBasicMaterial
  taillight: THREE.MeshStandardMaterial
}

function _buildMaterials(p: Palette): CarMaterials {
  const monogram = new THREE.MeshBasicMaterial({
    color: 'white',
    transparent: true,
    depthWrite: false,
    alphaTest: 0.15
  })
  if (_monogramTex) {
    monogram.map = _monogramTex
    monogram.needsUpdate = true
  }

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
    monogram,
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