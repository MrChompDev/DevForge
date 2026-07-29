import '../style.css';
import { initThree } from '../three/init';
import { workshopScene } from '../three/workshop-scene';

initThree('hero-3d-canvas', {
  cameraZ: 5,
  content: (s) => workshopScene(s),
});
