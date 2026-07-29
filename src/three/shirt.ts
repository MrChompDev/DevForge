import * as THREE from 'three';
import type { SceneContent } from './init';

const AC = 0x06b6d4, AC2 = 0x22d3ee, GOLD = 0xffd700;

function shirtShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0, 1.8);
  s.quadraticCurveTo(-0.5, 1.7, -0.6, 1.4);
  s.lineTo(-1.0, 0.8);
  s.lineTo(-1.3, 0.5);
  s.lineTo(-1.3, 0.0);
  s.lineTo(-0.7, 0.1);
  s.lineTo(-0.5, -1.4);
  s.lineTo(-0.35, -1.7);
  s.lineTo(0.35, -1.7);
  s.lineTo(0.5, -1.4);
  s.lineTo(0.7, 0.1);
  s.lineTo(1.3, 0.0);
  s.lineTo(1.3, 0.5);
  s.lineTo(1.0, 0.8);
  s.lineTo(0.6, 1.4);
  s.quadraticCurveTo(0.5, 1.7, 0, 1.8);
  return s;
}

export function createShirtBlueprint(): THREE.Group {
  const g = new THREE.Group();

  const shape = shirtShape();
  const geo = new THREE.ExtrudeGeometry(shape, { steps: 1, depth: 0.25, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 3 });
  geo.center();

  const wfMat = new THREE.MeshBasicMaterial({ color: AC, wireframe: true, transparent: true, opacity: 0.45 });
  g.add(new THREE.Mesh(geo, wfMat));

  const edgeMat = new THREE.LineBasicMaterial({ color: AC2, transparent: true, opacity: 0.2 });
  g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat));

  const detailMat = new THREE.LineBasicMaterial({ color: AC, transparent: true, opacity: 0.15 });

  const neckPts = [new THREE.Vector3(-0.35, 1.2, 0.13), new THREE.Vector3(-0.2, 1.0, 0.13), new THREE.Vector3(0, 0.9, 0.13), new THREE.Vector3(0.2, 1.0, 0.13), new THREE.Vector3(0.35, 1.2, 0.13)];
  g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(neckPts), detailMat));

  const centerPts = [new THREE.Vector3(0, 1.5, 0.13), new THREE.Vector3(0, -1.5, 0.13)];
  g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(centerPts), new THREE.LineBasicMaterial({ color: AC, transparent: true, opacity: 0.08 })));

  return g;
}

export function createBlueprintGrid(): THREE.Group {
  const g = new THREE.Group();

  const gridMat = new THREE.LineBasicMaterial({ color: AC, transparent: true, opacity: 0.08 });
  const gridMatBold = new THREE.LineBasicMaterial({ color: AC, transparent: true, opacity: 0.18 });

  const half = 4, step = 0.25;
  for (let i = -half; i <= half; i += step) {
    const isBold = Math.abs(i % 1) < 0.01;
    const mat = isBold ? gridMatBold : gridMat;
    const hLine = [new THREE.Vector3(-half, i, -2), new THREE.Vector3(half, i, -2)];
    const vLine = [new THREE.Vector3(i, -half, -2), new THREE.Vector3(i, half, -2)];
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(hLine), mat));
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(vLine), mat));
  }

  const frameMat = new THREE.LineBasicMaterial({ color: AC, transparent: true, opacity: 0.3 });
  const pts = [new THREE.Vector3(-half, -half, -2), new THREE.Vector3(half, -half, -2), new THREE.Vector3(half, half, -2), new THREE.Vector3(-half, half, -2), new THREE.Vector3(-half, -half, -2)];
  g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), frameMat));

  return g;
}

function createOrbitingItems(): { group: THREE.Group; items: { mesh: THREE.Mesh; angle: number; radius: number; yOff: number; speed: number; phase: number }[] } {
  const group = new THREE.Group();
  const items: { mesh: THREE.Mesh; angle: number; radius: number; yOff: number; speed: number; phase: number }[] = [];

  const colors = [GOLD, AC, AC2, 0xff6b35];
  const geos = [
    new THREE.OctahedronGeometry(0.08),
    new THREE.TetrahedronGeometry(0.07),
    new THREE.IcosahedronGeometry(0.06, 0),
    new THREE.BoxGeometry(0.07, 0.07, 0.07),
  ];

  for (let i = 0; i < 8; i++) {
    const mesh = new THREE.Mesh(
      geos[i % 4],
      new THREE.MeshBasicMaterial({ color: colors[i % 4], wireframe: true, transparent: true, opacity: 0.35 })
    );
    const angle = (i / 8) * Math.PI * 2;
    const radius = 1.0 + Math.random() * 0.6;
    mesh.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 0.8, Math.sin(angle) * radius);
    group.add(mesh);
    items.push({ mesh, angle, radius, yOff: (Math.random() - 0.5) * 0.8, speed: 0.2 + Math.random() * 0.15, phase: Math.random() * Math.PI * 2 });
  }

  return { group, items };
}

function createSparkleParticles(): THREE.Points {
  const count = 150;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2, phi = Math.acos(2 * Math.random() - 1), r = 1.5 + Math.random() * 2;
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = (Math.random() - 0.5) * 3;
    pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.01, sizeAttenuation: true, transparent: true, opacity: 0.2,
    color: GOLD, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
}

export function shirtScene(scene: THREE.Scene): SceneContent {
  const world = new THREE.Group();
  scene.add(world);

  const shirt = createShirtBlueprint();
  shirt.position.z = 0.3;
  world.add(shirt);

  const grid = createBlueprintGrid();
  world.add(grid);

  const { group: orbitGroup, items } = createOrbitingItems();
  world.add(orbitGroup);

  const sparkle = createSparkleParticles();
  world.add(sparkle);

  const ambient = new THREE.AmbientLight(0x404040, 0.6);
  scene.add(ambient);

  return {
    animate: (t, mx, my) => {
      world.rotation.x = my * 0.3;
      world.rotation.y = mx * 0.3;

      shirt.rotation.x = Math.sin(t * 0.15) * 0.1;
      shirt.rotation.y = t * 0.2;

      ((shirt.children[0] as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.35 + Math.sin(t * 0.5) * 0.1;

      for (const item of items) {
        const a = item.angle + t * item.speed;
        item.mesh.position.x = Math.cos(a) * item.radius;
        item.mesh.position.z = Math.sin(a) * item.radius;
        item.mesh.position.y = item.yOff + Math.sin(t * 0.6 + item.phase) * 0.3;
        item.mesh.rotation.x = t * 0.5 + item.phase;
        item.mesh.rotation.y = t * 0.3 + item.phase;
      }

      orbitGroup.rotation.y = t * 0.02;

      sparkle.rotation.y = t * 0.01;
      sparkle.rotation.x = Math.sin(t * 0.05) * 0.05;
    },
  };
}
