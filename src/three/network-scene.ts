import * as THREE from 'three';
import type { SceneContent } from './init';

const AC = 0x06b6d4, AC2 = 0x22d3ee, GOLD = 0xffd700;

function createNode(radius: number, color: number, opacity: number): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.IcosahedronGeometry(radius, 0),
    new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity })
  );
}

interface NodeData {
  mesh: THREE.Mesh;
  connections: number[];
  pulsePhase: number;
  orbitSpeed: number;
  orbitRadius: number;
  angle: number;
  yBase: number;
}

function createNetwork(): { group: THREE.Group; nodes: NodeData[]; lines: THREE.LineSegments } {
  const group = new THREE.Group();
  const nodes: NodeData[] = [];
  const linePositions: number[] = [];

  const centralMat = new THREE.MeshBasicMaterial({ color: GOLD, wireframe: true, transparent: true, opacity: 0.6 });
  const central = new THREE.Mesh(new THREE.OctahedronGeometry(0.25), centralMat);
  central.position.set(0, 0, 0);
  group.add(central);
  (central as any).__isCentral = true;

  const count = 18;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const radius = 1.2 + Math.random() * 0.8;
    const yBase = (Math.random() - 0.5) * 1.5;
    const mesh = createNode(0.05 + Math.random() * 0.04, AC, 0.3 + Math.random() * 0.3);
    mesh.position.set(Math.cos(angle) * radius, yBase, Math.sin(angle) * radius);
    group.add(mesh);

    nodes.push({ mesh, connections: [], pulsePhase: Math.random() * Math.PI * 2, orbitSpeed: 0.1 + Math.random() * 0.1, orbitRadius: radius, angle, yBase });

    linePositions.push(0, 0, 0, mesh.position.x, mesh.position.y, mesh.position.z);

    if (i > 0) {
      const prev = nodes[i - 1].mesh.position;
      linePositions.push(prev.x, prev.y, prev.z, mesh.position.x, mesh.position.y, mesh.position.z);
    }
    if (Math.random() > 0.5) {
      const other = Math.floor(Math.random() * i);
      if (other !== i) {
        const op = nodes[other].mesh.position;
        linePositions.push(op.x, op.y, op.z, mesh.position.x, mesh.position.y, mesh.position.z);
      }
    }
  }

  if (count > 2) {
    const last = nodes[count - 1].mesh.position;
    const first = nodes[0].mesh.position;
    linePositions.push(last.x, last.y, last.z, first.x, first.y, first.z);
  }

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const lines = new THREE.LineSegments(
    lineGeo,
    new THREE.LineBasicMaterial({ color: AC, transparent: true, opacity: 0.12 })
  );
  group.add(lines);

  return { group, nodes, lines };
}

function createFlowParticles(): THREE.Points {
  const count = 100;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 2.5;
    pos[i * 3] = Math.cos(angle) * r;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 2;
    pos[i * 3 + 2] = Math.sin(angle) * r;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.015, sizeAttenuation: true, transparent: true, opacity: 0.2,
    color: AC2, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
}

function createSparkleField(): THREE.Points {
  const count = 200;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 8;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.008, sizeAttenuation: true, transparent: true, opacity: 0.15,
    color: GOLD, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
}

export function networkScene(scene: THREE.Scene): SceneContent {
  const world = new THREE.Group();
  scene.add(world);

  const { group, nodes, lines } = createNetwork();
  world.add(group);

  const flow = createFlowParticles();
  world.add(flow);

  const sparkle = createSparkleField();
  world.add(sparkle);

  const central = group.children[0] as THREE.Mesh;

  const ambient = new THREE.AmbientLight(0x404060, 0.5);
  scene.add(ambient);

  return {
    animate: (t, mx, my) => {
      world.rotation.x = my * 0.05;
      world.rotation.y = mx * 0.05;

      central.rotation.x = t * 0.5;
      central.rotation.y = t * 0.8;
      const cPulse = 1 + Math.sin(t * 1.2) * 0.2;
      central.scale.setScalar(cPulse);
      (central.material as THREE.MeshBasicMaterial).opacity = 0.4 + Math.sin(t * 1.2) * 0.2;

      for (const nd of nodes) {
        const angle = nd.angle + t * nd.orbitSpeed;
        nd.mesh.position.x = Math.cos(angle) * nd.orbitRadius;
        nd.mesh.position.z = Math.sin(angle) * nd.orbitRadius;
        nd.mesh.position.y = nd.yBase + Math.sin(t * 0.5 + nd.pulsePhase) * 0.2;
        nd.mesh.rotation.x = t * 0.3 + nd.pulsePhase;
        nd.mesh.rotation.y = t * 0.5 + nd.pulsePhase;
        const pulse = 0.6 + Math.sin(t * 0.8 + nd.pulsePhase) * 0.4;
        nd.mesh.scale.setScalar(pulse);
      }

      const lPos = lines.geometry.attributes.position.array as Float32Array;
      const lCount = lPos.length / 6;
      for (let i = 1; i <= lCount; i++) {
        const ni = (i * 2 - 1) % nodes.length;
        const nd = nodes[ni];
        lPos[i * 6] = 0;
        lPos[i * 6 + 1] = 0;
        lPos[i * 6 + 2] = 0;
        lPos[i * 6 + 3] = nd.mesh.position.x;
        lPos[i * 6 + 4] = nd.mesh.position.y;
        lPos[i * 6 + 5] = nd.mesh.position.z;
      }
      lines.geometry.attributes.position.needsUpdate = true;

      const fPos = flow.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 100; i++) {
        const angle = Math.atan2(fPos[i * 3 + 2], fPos[i * 3]) + 0.005;
        const r = Math.sqrt(fPos[i * 3] * fPos[i * 3] + fPos[i * 3 + 2] * fPos[i * 3 + 2]);
        fPos[i * 3] = Math.cos(angle) * r;
        fPos[i * 3 + 2] = Math.sin(angle) * r;
        fPos[i * 3 + 1] += Math.sin(t + i) * 0.003;
        if (fPos[i * 3 + 1] > 2) fPos[i * 3 + 1] = -2;
      }
      flow.geometry.attributes.position.needsUpdate = true;
      flow.rotation.y = t * 0.015;

      sparkle.rotation.y = t * 0.008;
    },
  };
}
