import * as THREE from 'three';
import type { SceneContent } from './init';

const ac = 0x06b6d4, ac2 = 0x22d3ee;

export function abstractWorld(scene: THREE.Scene, grid: boolean): SceneContent {
  const world = new THREE.Group();
  scene.add(world);

  if (grid) {
    const g = new THREE.GridHelper(12, 24, ac, 0x164e63);
    g.position.y = -2.8;
    world.add(g);
  }

  const hub = new THREE.Group();
  world.add(hub);

  const outer = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8, 1), new THREE.MeshBasicMaterial({ color: ac, wireframe: true, transparent: true, opacity: 0.25 }));
  hub.add(outer);
  const mid = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2), new THREE.MeshBasicMaterial({ color: ac2, wireframe: true, transparent: true, opacity: 0.2 }));
  hub.add(mid);
  const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.6), new THREE.MeshBasicMaterial({ color: ac, wireframe: true, transparent: true, opacity: 0.5 }));
  hub.add(core);

  const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.025, 8, 48), new THREE.MeshBasicMaterial({ color: ac, transparent: true, opacity: 0.25 }));
  ringA.rotation.x = Math.PI / 2.8; hub.add(ringA);
  const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.025, 8, 48), new THREE.MeshBasicMaterial({ color: ac2, transparent: true, opacity: 0.15 }));
  ringB.rotation.z = Math.PI / 3; ringB.rotation.x = Math.PI / 4; hub.add(ringB);
  const ringC = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.025, 8, 48), new THREE.MeshBasicMaterial({ color: ac, transparent: true, opacity: 0.1 }));
  ringC.rotation.y = Math.PI / 2; ringC.rotation.x = Math.PI / 1.5; hub.add(ringC);

  const orbitCount = 8;
  const orbiters: { mesh: THREE.Mesh; speed: number; radius: number; phase: number; yOffset: number }[] = [];
  const orbGeos = [new THREE.OctahedronGeometry(0.12), new THREE.TetrahedronGeometry(0.12), new THREE.OctahedronGeometry(0.1), new THREE.TetrahedronGeometry(0.14)];
  for (let i = 0; i < orbitCount; i++) {
    const mesh = new THREE.Mesh(orbGeos[i % 4], new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? ac : ac2, wireframe: true, transparent: true, opacity: 0.5 + Math.random() * 0.3 }));
    const radius = 2.8 + Math.random() * 1.2, phase = (i / orbitCount) * Math.PI * 2, yOff = (Math.random() - 0.5) * 2;
    mesh.position.set(Math.cos(phase) * radius, yOff, Math.sin(phase) * radius);
    world.add(mesh);
    orbiters.push({ mesh, speed: 0.15 + Math.random() * 0.15, radius, phase, yOffset: yOff });
  }

  const pCount = 500;
  const pg = new THREE.BufferGeometry();
  const pos = new Float32Array(pCount * 3);
  const speeds: number[] = [];
  for (let i = 0; i < pCount; i++) {
    const theta = Math.random() * Math.PI * 2, phi = Math.acos(2 * Math.random() - 1), r = 2 + Math.random() * 6;
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta); pos[i * 3 + 1] = (Math.random() - 0.5) * 6; pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    speeds.push(0.002 + Math.random() * 0.005);
  }
  pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const particles = new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.012, color: ac, transparent: true, opacity: 0.4, sizeAttenuation: true }));
  world.add(particles);

  const pl = new THREE.PointLight(ac, 0.8, 30); pl.position.set(2, 6, 4);

  scene.add(pl);

  return {
    animate: (t, mx, my) => {
      world.rotation.x = my * 0.08; world.rotation.y = mx * 0.08;
      hub.rotation.x = t * 0.06; hub.rotation.y = t * 0.1;
      outer.rotation.x = t * 0.04; outer.rotation.y = t * 0.07;
      mid.rotation.x = -t * 0.08; mid.rotation.y = -t * 0.05;
      const pulse = 0.6 + Math.sin(t * 0.8) * 0.15; core.scale.setScalar(pulse); core.rotation.x = -t * 0.12; core.rotation.y = -t * 0.15;
      ringA.rotation.z = t * 0.04; ringB.rotation.y = t * 0.06; ringC.rotation.x = t * 0.08;
      for (const o of orbiters) { const angle = o.phase + t * o.speed; o.mesh.position.x = Math.cos(angle) * o.radius; o.mesh.position.z = Math.sin(angle) * o.radius; o.mesh.position.y = o.yOffset + Math.sin(t * 0.5 + o.phase) * 0.4; o.mesh.rotation.x = t * 0.6 + o.phase; o.mesh.rotation.y = t * 0.4 + o.phase; }
      const pa = particles.geometry.attributes.position.array as Float32Array; for (let i = 0; i < pCount; i++) { pa[i * 3 + 1] += speeds[i]; if (pa[i * 3 + 1] > 3) pa[i * 3 + 1] = -3; } particles.geometry.attributes.position.needsUpdate = true; particles.rotation.y = t * 0.01;
    },
  };
}


