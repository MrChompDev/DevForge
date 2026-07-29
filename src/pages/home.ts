import '../style.css';
import { initThree } from '../three/init';
import { forgeScene } from '../three/forge-scene';

initThree('hero-3d-canvas', {
  cameraZ: 4.5,
  content: (s) => forgeScene(s),
});
