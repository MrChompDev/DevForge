import * as THREE from 'three';

export interface SceneContent {
  animate?: (t: number, mx: number, my: number) => void;
  cleanup?: () => void;
}

export interface ThreeConfig {
  cameraZ?: number;
  content?: (scene: THREE.Scene, world: THREE.Group) => SceneContent;
}

export function initThree(canvasId: string, cfg: ThreeConfig = {}): (() => void) | null {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas) return null;
  const cvs = canvas;

  const cameraZ = cfg.cameraZ ?? 6;

  function getSize() {
    const rect = cvs.parentElement?.getBoundingClientRect() ?? { width: window.innerWidth, height: window.innerHeight };
    return { w: rect.width, h: rect.height };
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, getSize().w / getSize().h, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  const { w, h } = getSize();
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const world = new THREE.Group();
  scene.add(world);

  let mx = 0, my = 0;
  const onMove = (e: MouseEvent) => { const s = getSize(); mx = e.clientX / s.w - 0.5; my = e.clientY / s.h - 0.5; };
  document.addEventListener('mousemove', onMove);

  const onResize = () => { const s = getSize(); camera.aspect = s.w / s.h; camera.updateProjectionMatrix(); renderer.setSize(s.w, s.h); };
  window.addEventListener('resize', onResize);

  camera.position.z = cameraZ;

  let pageAnimate: ((t: number, mx: number, my: number) => void) | undefined;
  let pageCleanup: (() => void) | undefined;

  if (cfg.content) {
    const result = cfg.content(scene, world);
    if (result.animate) pageAnimate = result.animate;
    if (result.cleanup) pageCleanup = result.cleanup;
  }

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    if (pageAnimate) pageAnimate(t, mx, my);
    renderer.render(scene, camera);
  }
  animate();

  return () => {
    window.removeEventListener('resize', onResize);
    document.removeEventListener('mousemove', onMove);
    if (pageCleanup) pageCleanup();
    renderer.dispose();
  };
}
