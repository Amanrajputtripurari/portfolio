import * as THREE from "three";

export interface GlobePalette {
  dot: number;
  dotOpacity: number;
  core: number;
  atmosphere: number;
  arc: number;
  home: number;
  additive: boolean;
}

export interface GlobeHandles {
  group: THREE.Group;
  /** Rotation (y) that puts the home marker facing the camera. */
  homeFacing: number;
  update: (elapsed: number) => void;
}

interface LatLon {
  lat: number;
  lon: number;
}

const RADIUS = 2;
const DOT_COUNT = 2600;
const ARC_SEGMENTS = 64;
const PULSE_LENGTH = 18;

/** Home base and the far ends of the arcs. Decorative: "remote, any time zone". */
const HOME: LatLon = { lat: 21.5, lon: 78 };
const DESTINATIONS: LatLon[] = [
  { lat: 51.5, lon: -0.1 },
  { lat: 40.7, lon: -74 },
  { lat: 1.35, lon: 103.8 },
  { lat: 25.2, lon: 55.3 },
  { lat: -33.9, lon: 151.2 },
  { lat: 52.5, lon: 13.4 },
  { lat: 37.8, lon: -122.4 },
];

export function latLonToVector(lat: number, lon: number, radius = RADIUS): THREE.Vector3 {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

/** Evenly spread dots over the sphere (Fibonacci lattice). */
function createDots(palette: GlobePalette): THREE.Points {
  const positions = new Float32Array(DOT_COUNT * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < DOT_COUNT; i++) {
    const y = 1 - (i / (DOT_COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    positions[i * 3] = Math.cos(theta) * r * RADIUS;
    positions[i * 3 + 1] = y * RADIUS;
    positions[i * 3 + 2] = Math.sin(theta) * r * RADIUS;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: palette.dot,
    size: 0.045,
    transparent: true,
    opacity: palette.dotOpacity,
    depthWrite: false,
  });
  return new THREE.Points(geometry, material);
}

/** Solid inner sphere that hides the dots on the far side. */
function createCore(palette: GlobePalette): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS * 0.985, 64, 64),
    new THREE.MeshBasicMaterial({ color: palette.core }),
  );
}

/** Fresnel rim glow just outside the surface. */
function createAtmosphere(palette: GlobePalette): THREE.Mesh {
  const material = new THREE.ShaderMaterial({
    uniforms: { glowColor: { value: new THREE.Color(palette.atmosphere) } },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 glowColor;
      varying vec3 vNormal;
      void main() {
        // Back faces: brightest just outside the surface, fading to 0 at the outer edge.
        float facing = clamp(-dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
        float intensity = pow(facing, 4.5) * 0.6;
        gl_FragColor = vec4(glowColor, intensity);
      }
    `,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    blending: palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
  });
  return new THREE.Mesh(new THREE.SphereGeometry(RADIUS * 1.12, 64, 64), material);
}

interface Arc {
  base: THREE.Mesh;
  pulse: THREE.Mesh;
  offset: number;
  speed: number;
}

const TUBE_RADIAL = 6;
/** Indices per tube segment, so drawRange can reveal the tube a segment at a time. */
const INDICES_PER_SEGMENT = TUBE_RADIAL * 6;

function createArc(from: THREE.Vector3, to: THREE.Vector3, palette: GlobePalette, index: number): Arc {
  const distance = from.distanceTo(to);
  const lift = RADIUS + distance * 0.34;
  const mid = from.clone().add(to).multiplyScalar(0.5).normalize().multiplyScalar(lift);
  const curve = new THREE.QuadraticBezierCurve3(from, mid, to);

  const blending = palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending;
  const base = new THREE.Mesh(
    new THREE.TubeGeometry(curve, ARC_SEGMENTS, 0.006, TUBE_RADIAL, false),
    new THREE.MeshBasicMaterial({ color: palette.arc, transparent: true, opacity: 0.3, depthWrite: false, blending }),
  );
  const pulse = new THREE.Mesh(
    new THREE.TubeGeometry(curve, ARC_SEGMENTS, 0.016, TUBE_RADIAL, false),
    new THREE.MeshBasicMaterial({ color: palette.arc, transparent: true, opacity: 1, depthWrite: false, blending }),
  );
  pulse.geometry.setDrawRange(0, 0);

  return { base, pulse, offset: index * 0.37, speed: 0.22 + (index % 3) * 0.05 };
}

function createHomeMarker(position: THREE.Vector3, palette: GlobePalette) {
  const group = new THREE.Group();
  group.position.copy(position);
  group.lookAt(position.clone().multiplyScalar(2));

  const dot = new THREE.Mesh(
    new THREE.CircleGeometry(0.05, 24),
    new THREE.MeshBasicMaterial({ color: palette.home, side: THREE.DoubleSide }),
  );
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.07, 0.09, 40),
    new THREE.MeshBasicMaterial({ color: palette.home, transparent: true, side: THREE.DoubleSide, depthWrite: false }),
  );
  dot.position.z = 0.01;
  ring.position.z = 0.01;
  group.add(dot, ring);
  return { group, ring };
}

/** Dotted globe with a rim glow, a home marker, and pulses travelling along arcs. */
export function createGlobe(palette: GlobePalette): GlobeHandles {
  const group = new THREE.Group();
  const home = latLonToVector(HOME.lat, HOME.lon);

  group.add(createCore(palette), createDots(palette), createAtmosphere(palette));

  const arcs = DESTINATIONS.map((dest, index) =>
    createArc(home, latLonToVector(dest.lat, dest.lon), palette, index),
  );
  arcs.forEach((arc) => group.add(arc.base, arc.pulse));

  const marker = createHomeMarker(home, palette);
  group.add(marker.group);

  const update = (elapsed: number) => {
    arcs.forEach((arc) => {
      // Travel out, then pause briefly before the next pulse.
      const t = ((elapsed * arc.speed + arc.offset) % 1.3) / 1.3;
      const head = Math.floor(t * 1.3 * (ARC_SEGMENTS + PULSE_LENGTH));
      const start = Math.max(0, head - PULSE_LENGTH);
      const end = Math.min(ARC_SEGMENTS, head);
      const count = Math.max(0, end - start);
      arc.pulse.geometry.setDrawRange(start * INDICES_PER_SEGMENT, count * INDICES_PER_SEGMENT);
    });

    const ping = (elapsed * 0.8) % 1;
    marker.ring.scale.setScalar(1 + ping * 2.4);
    (marker.ring.material as THREE.MeshBasicMaterial).opacity = 1 - ping;
  };

  return { group, homeFacing: -Math.atan2(home.x, home.z), update };
}
