import * as THREE from 'three';
import type { SceneContent } from './init';

const AC = 0x06b6d4, AC2 = 0x22d3ee, FIRE = 0xff6b35, GOLD = 0xffd700;

function taperBox(w: number, h: number, d: number, taper: number): THREE.BoxGeometry {
  const g = new THREE.BoxGeometry(w, h, d);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    if (p.getY(i) > 0) { p.setX(i, p.getX(i) * taper); p.setZ(i, p.getZ(i) * taper); }
  }
  (p as any).needsUpdate = true;
  g.computeVertexNormals();
  return g;
}

function createAnvil(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ color: AC, transparent: true, opacity: 0.25, wireframe: false });
  const wfMat = new THREE.MeshBasicMaterial({ color: AC2, wireframe: true, transparent: true, opacity: 0.3 });

  const body = new THREE.Mesh(taperBox(0.9, 0.5, 0.5, 0.65), mat);
  body.position.y = 0.15;
  g.add(body);
  g.add(new THREE.LineSegments(new THREE.EdgesGeometry(body.geometry), wfMat));

  const top = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.1, 0.4), mat);
  top.position.y = 0.45;
  g.add(top);
  g.add(new THREE.LineSegments(new THREE.EdgesGeometry(top.geometry), wfMat));

  const base = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.12, 0.65), mat);
  base.position.y = -0.14;
  g.add(base);
  g.add(new THREE.LineSegments(new THREE.EdgesGeometry(base.geometry), wfMat));

  const horn = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 6), mat);
  horn.position.set(0.62, 0.35, 0);
  horn.rotation.z = -0.4;
  g.add(horn);
  g.add(new THREE.LineSegments(new THREE.EdgesGeometry(horn.geometry), wfMat));

  return g;
}

function createHammer(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ color: AC2, wireframe: true, transparent: true, opacity: 0.5 });

  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.7, 6), mat);
  handle.position.y = 0.35;
  g.add(handle);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.12), mat);
  head.position.y = 0.7;
  g.add(head);

  return g;
}

function createFireParticles(): THREE.Points {
  const count = 300;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const vel: number[] = [];

  const c1 = new THREE.Color(FIRE), c2 = new THREE.Color(GOLD);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 0.2 + Math.random() * 0.6;
    pos[i * 3] = Math.cos(angle) * r;
    pos[i * 3 + 1] = -0.5 + Math.random() * 0.3;
    pos[i * 3 + 2] = Math.sin(angle) * r;
    vel.push(0.3 + Math.random() * 0.5);
    const c = c1.clone().lerp(c2, Math.random());
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const pts = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.04, sizeAttenuation: true, transparent: true, opacity: 0.6,
    blending: THREE.AdditiveBlending, depthWrite: false, vertexColors: true,
  }));
  (pts as any).__vel = vel;
  return pts;
}

function createSparks(): THREE.Points {
  const count = 120;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const vel: number[][] = [];
  for (let i = 0; i < count; i++) {
    pos[i * 3] = 0; pos[i * 3 + 1] = -10; pos[i * 3 + 2] = 0;
    vel.push([(Math.random() - 0.5) * 3, Math.random() * 3 + 1, (Math.random() - 0.5) * 3]);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.03, sizeAttenuation: true, transparent: true, opacity: 0.8,
    color: GOLD, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  (pts as any).__vel = vel;
  (pts as any).__active = false;
  (pts as any).__life = 0;
  return pts;
}

function createPlanet(): THREE.Group {
  const g = new THREE.Group();

  const outer = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 1), new THREE.MeshBasicMaterial({ color: AC, wireframe: true, transparent: true, opacity: 0.2 }));
  g.add(outer);
  const mid = new THREE.Mesh(new THREE.DodecahedronGeometry(0.75), new THREE.MeshBasicMaterial({ color: AC2, wireframe: true, transparent: true, opacity: 0.15 }));
  g.add(mid);
  const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.35), new THREE.MeshBasicMaterial({ color: AC, wireframe: true, transparent: true, opacity: 0.35 }));
  g.add(core);

  const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.02, 8, 48), new THREE.MeshBasicMaterial({ color: AC, transparent: true, opacity: 0.2 }));
  ringA.rotation.x = Math.PI / 2.8; g.add(ringA);
  const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.02, 8, 48), new THREE.MeshBasicMaterial({ color: AC2, transparent: true, opacity: 0.12 }));
  ringB.rotation.z = Math.PI / 3; ringB.rotation.x = Math.PI / 4; g.add(ringB);
  const ringC = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.02, 8, 48), new THREE.MeshBasicMaterial({ color: AC, transparent: true, opacity: 0.08 }));
  ringC.rotation.y = Math.PI / 2; ringC.rotation.x = Math.PI / 1.5; g.add(ringC);

  const orbitCount = 6;
  const orbiters: { mesh: THREE.Mesh; speed: number; radius: number; phase: number; yOffset: number }[] = [];
  const orbGeos = [new THREE.OctahedronGeometry(0.08), new THREE.TetrahedronGeometry(0.08), new THREE.OctahedronGeometry(0.06), new THREE.TetrahedronGeometry(0.09)];
  for (let i = 0; i < orbitCount; i++) {
    const mesh = new THREE.Mesh(orbGeos[i % 4], new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? AC : AC2, wireframe: true, transparent: true, opacity: 0.4 + Math.random() * 0.3 }));
    const radius = 1.8 + Math.random() * 0.6, phase = (i / orbitCount) * Math.PI * 2, yOff = (Math.random() - 0.5) * 1.2;
    mesh.position.set(Math.cos(phase) * radius, yOff, Math.sin(phase) * radius);
    g.add(mesh);
    orbiters.push({ mesh, speed: 0.1 + Math.random() * 0.1, radius, phase, yOffset: yOff });
  }

  const pCount = 300;
  const pg = new THREE.BufferGeometry();
  const pos = new Float32Array(pCount * 3);
  const speeds: number[] = [];
  for (let i = 0; i < pCount; i++) {
    const theta = Math.random() * Math.PI * 2, phi = Math.acos(2 * Math.random() - 1), r = 1.5 + Math.random() * 3.5;
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta); pos[i * 3 + 1] = (Math.random() - 0.5) * 4; pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    speeds.push(0.002 + Math.random() * 0.005);
  }
  pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const particles = new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.01, color: AC, transparent: true, opacity: 0.25, sizeAttenuation: true }));
  g.add(particles);

  (g as any).__hub = { outer, mid, core, ringA, ringB, ringC };
  (g as any).__orbiters = orbiters;
  (g as any).__pCount = pCount;
  (g as any).__speeds = speeds;
  (g as any).__particles = particles;
  return g;
}

export function forgeScene(scene: THREE.Scene): SceneContent {
  const world = new THREE.Group();
  scene.add(world);

  const grid = new THREE.GridHelper(10, 20, AC, 0x164e63);
  grid.position.y = -0.6;
  world.add(grid);

  const anvil = createAnvil();
  anvil.position.y = 0.2;
  world.add(anvil);

  const hammerPivot = new THREE.Group();
  hammerPivot.position.set(0.5, 0.9, 0);
  const hammer = createHammer();
  hammerPivot.add(hammer);
  world.add(hammerPivot);

  const fire = createFireParticles();
  fire.position.y = 0.1;
  world.add(fire);

  const sparks = createSparks();
  sparks.position.set(0.0, 0.5, 0.0);
  world.add(sparks);

  const planet = createPlanet();
  planet.position.set(0, 1.1, 0);
  planet.scale.setScalar(0.7);
  world.add(planet);

  const ambient = new THREE.AmbientLight(0x404060, 0.5);
  scene.add(ambient);
  const backLight = new THREE.PointLight(AC, 0.5, 20);
  backLight.position.set(-3, 4, -3);
  scene.add(backLight);

  let hitPhase = -1;

  return {
    animate: (t, mx, my) => {
      world.rotation.x = my * 0.08;
      world.rotation.y = mx * 0.08;

      const cycle = 2.0;
      const phase = (t % cycle) / cycle;

      let swing: number;
      if (phase < 0.25) {
        const p = phase / 0.25;
        swing = -0.15 + p * 0.55;
        if (p > 0.95 && hitPhase !== 1) hitPhase = 1;
      } else if (phase < 0.35) {
        swing = 0.4;
        if (hitPhase === 1) {
          hitPhase = 2;
          const s = sparks as any;
          s.__active = true;
          s.__life = 0;
          const sPos = s.geometry.attributes.position.array as Float32Array;
          const sAttr = s.geometry.attributes.position;
          const vel = s.__vel as number[][];
          for (let i = 0; i < 120; i++) {
            sPos[i * 3] = (Math.random() - 0.5) * 0.06;
            sPos[i * 3 + 1] = 0;
            sPos[i * 3 + 2] = (Math.random() - 0.5) * 0.06;
            vel[i] = [(Math.random() - 0.5) * 3.5, 1 + Math.random() * 3, (Math.random() - 0.5) * 3.5];
          }
          (sAttr as any).needsUpdate = true;
          anvil.position.y = 0.18;
        } else {
          anvil.position.y += (0.2 - anvil.position.y) * 0.1;
        }
      } else if (phase < 0.5) {
        const p = (phase - 0.35) / 0.15;
        swing = 0.4 - p * 0.05;
        anvil.position.y += (0.2 - anvil.position.y) * 0.1;
      } else {
        const p = (phase - 0.5) / 0.5;
        swing = 0.35 - p * 0.5;
        anvil.position.y = 0.2;
      }

      hammerPivot.rotation.z = swing;

      const fPos = fire.geometry.attributes.position.array as Float32Array;
      const fVel = (fire as any).__vel as number[];
      for (let i = 0; i < 300; i++) {
        fPos[i * 3 + 1] += fVel[i] * 0.008;
        if (fPos[i * 3 + 1] > 1.5) {
          fPos[i * 3 + 1] = -0.3;
          const angle = Math.random() * Math.PI * 2;
          const r = 0.2 + Math.random() * 0.6;
          fPos[i * 3] = Math.cos(angle) * r;
          fPos[i * 3 + 2] = Math.sin(angle) * r;
        }
      }
      (fire.geometry.attributes.position as any).needsUpdate = true;
      (fire.material as THREE.PointsMaterial).opacity = 0.4 + Math.sin(t * 1.5) * 0.15;

      const sPts = sparks as any;
      if (sPts.__active) {
        sPts.__life += 0.016;
        const sPos = sPts.geometry.attributes.position.array as Float32Array;
        const sVel = sPts.__vel as number[][];
        for (let i = 0; i < 120; i++) {
          sPos[i * 3] += sVel[i][0] * 0.02;
          sPos[i * 3 + 1] += sVel[i][1] * 0.02;
          sPos[i * 3 + 2] += sVel[i][2] * 0.02;
          sVel[i][1] -= 0.03;
        }
        (sPts.geometry.attributes.position as any).needsUpdate = true;
        sPts.material.opacity = Math.max(0, 1 - sPts.__life * 1.5);
        if (sPts.__life > 1.5) sPts.__active = false;
      }

      const hub = (planet as any).__hub as Record<string, THREE.Mesh>;
      hub.outer.rotation.x = t * 0.04; hub.outer.rotation.y = t * 0.07;
      hub.mid.rotation.x = -t * 0.08; hub.mid.rotation.y = -t * 0.05;
      const pulse = 0.6 + Math.sin(t * 0.8) * 0.15; hub.core.scale.setScalar(pulse); hub.core.rotation.x = -t * 0.12; hub.core.rotation.y = -t * 0.15;
      hub.ringA.rotation.z = t * 0.04; hub.ringB.rotation.y = t * 0.06; hub.ringC.rotation.x = t * 0.08;

      const orbiters = (planet as any).__orbiters as { mesh: THREE.Mesh; speed: number; radius: number; phase: number; yOffset: number }[];
      for (const o of orbiters) { const angle = o.phase + t * o.speed; o.mesh.position.x = Math.cos(angle) * o.radius; o.mesh.position.z = Math.sin(angle) * o.radius; o.mesh.position.y = o.yOffset + Math.sin(t * 0.5 + o.phase) * 0.3; o.mesh.rotation.x = t * 0.6 + o.phase; o.mesh.rotation.y = t * 0.4 + o.phase; }

      const pCount = (planet as any).__pCount as number;
      const pSpeeds = (planet as any).__speeds as number[];
      const pPts = (planet as any).__particles as THREE.Points;
      const pPos = pPts.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) { pPos[i * 3 + 1] += pSpeeds[i]; if (pPos[i * 3 + 1] > 2.5) pPos[i * 3 + 1] = -2.5; }
      (pPts.geometry.attributes.position as any).needsUpdate = true;

      planet.rotation.y = t * 0.03;
    },
  };
}
