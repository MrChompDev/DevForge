import * as THREE from 'three';
import type { SceneContent } from './init';

const AC = 0x06b6d4, GOLD = 0xffd700;

function createWorkbench(x: number, yBase: number): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ color: AC, transparent: true, opacity: 0.15 });

  const table = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.35), mat);
  table.position.y = 0;
  g.add(table);

  const legMat = new THREE.LineBasicMaterial({ color: AC, transparent: true, opacity: 0.1 });
  for (const [dx, dz] of [[-0.2, -0.12], [0.2, -0.12], [-0.2, 0.12], [0.2, 0.12]]) {
    const pts = [new THREE.Vector3(dx, -0.25, dz), new THREE.Vector3(dx, 0, dz)];
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), legMat));
  }

  const orb = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.08),
    new THREE.MeshBasicMaterial({ color: GOLD, wireframe: true, transparent: true, opacity: 0.5 })
  );
  orb.position.y = 0.15;
  g.add(orb);

  g.position.x = x;
  g.position.y = yBase;
  (g as any).__orb = orb;
  return g;
}

function createBlueprintSheet(): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.LineBasicMaterial({ color: AC, transparent: true, opacity: 0.06 });

  const w = 0.5, h = 0.4;
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    const hLine = [new THREE.Vector3(-w / 2, -h / 2 + t * h, 0), new THREE.Vector3(w / 2, -h / 2 + t * h, 0)];
    const vLine = [new THREE.Vector3(-w / 2 + t * w, -h / 2, 0), new THREE.Vector3(-w / 2 + t * w, h / 2, 0)];
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(hLine), mat));
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(vLine), mat));
  }

  const borderMat = new THREE.LineBasicMaterial({ color: AC, transparent: true, opacity: 0.2 });
  const corners = [
    new THREE.Vector3(-w / 2, -h / 2, 0), new THREE.Vector3(w / 2, -h / 2, 0),
    new THREE.Vector3(w / 2, h / 2, 0), new THREE.Vector3(-w / 2, h / 2, 0),
    new THREE.Vector3(-w / 2, -h / 2, 0),
  ];
  g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(corners), borderMat));

  return g;
}

function createAscendingOrbs(): THREE.Points {
  const count = 80;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const speeds: number[] = [];
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 6;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    sizes[i] = 0.015 + Math.random() * 0.025;
    speeds.push(0.15 + Math.random() * 0.2);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.02, sizeAttenuation: true, transparent: true, opacity: 0.3,
    color: AC, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  (pts as any).__speeds = speeds;
  return pts;
}

export function workshopScene(scene: THREE.Scene): SceneContent {
  const world = new THREE.Group();
  scene.add(world);

  const grid = new THREE.GridHelper(10, 20, AC, 0x164e63);
  grid.position.y = -0.5;
  world.add(grid);

  const benches: THREE.Group[] = [];
  for (let i = -2; i <= 2; i++) {
    const bench = createWorkbench(i * 0.9, -0.2);
    world.add(bench);
    benches.push(bench);
  }

  const sheets: { mesh: THREE.Mesh; ry: number; rx: number; ro: number }[] = [];
  const sheetMat = new THREE.MeshBasicMaterial({ color: AC, transparent: true, opacity: 0.08 });
  for (let i = 0; i < 5; i++) {
    const bp = createBlueprintSheet();
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.4), sheetMat);
    mesh.add(bp);
    const angle = (i / 5) * Math.PI * 2;
    const r = 1.2 + Math.random() * 0.6;
    mesh.position.set(Math.cos(angle) * r, 0.4 + Math.random() * 0.5, Math.sin(angle) * r);
    mesh.rotation.x = -0.2;
    world.add(mesh);
    sheets.push({ mesh, ry: 0.15 + Math.random() * 0.1, rx: 0.3 + Math.random() * 0.3, ro: angle });
  }

  const orbs = createAscendingOrbs();
  world.add(orbs);

  const ambient = new THREE.AmbientLight(0x404060, 0.5);
  scene.add(ambient);

  return {
    animate: (t, mx, my) => {
      world.rotation.x = my * 0.05;
      world.rotation.y = mx * 0.05;

      for (let i = 0; i < benches.length; i++) {
        const b = benches[i];
        const orb = (b as any).__orb as THREE.Mesh;
        orb.position.y = 0.15 + Math.sin(t + i * 0.9) * 0.1;
        orb.scale.setScalar(1 + Math.sin(t * 1.3 + i) * 0.15);
        orb.rotation.x = t * 0.6 + i;
        orb.rotation.y = t * 0.4 + i;
      }

      for (const s of sheets) {
        const angle = s.ro + t * s.ry;
        s.mesh.position.x = Math.cos(angle) * 1.5;
        s.mesh.position.z = Math.sin(angle) * 1.5;
        s.mesh.position.y = 0.4 + Math.sin(t * s.rx + s.ro) * 0.2;
        s.mesh.rotation.z = Math.sin(t * 0.5 + s.ro) * 0.1;
      }

      const oPos = orbs.geometry.attributes.position.array as Float32Array;
      const oSpeeds = (orbs as any).__speeds as number[];
      for (let i = 0; i < 80; i++) {
        oPos[i * 3 + 1] += oSpeeds[i] * 0.005;
        if (oPos[i * 3 + 1] > 2.5) oPos[i * 3 + 1] = -2.5;
      }
      orbs.geometry.attributes.position.needsUpdate = true;
      orbs.rotation.y = t * 0.02;
    },
  };
}
