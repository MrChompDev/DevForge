import '../style.css';
import { initThree } from '../three/init';
import { createCart } from '../components/cart';
import { shirtScene } from '../three/shirt';

initThree('hero-3d-canvas', {
  cameraZ: 4.5,
  content: (s) => shirtScene(s),
});

interface Product {
  id: string;
  name: string;
  price: number;
}

const products: Record<string, Product> = {
  hoodie: { id: 'hoodie', name: 'DevForge Hoodie', price: 59.99 },
  keycaps: { id: 'keycaps', name: 'Mechanical Keycaps', price: 39.99 },
  mousepad: { id: 'mousepad', name: 'RGB Mousepad', price: 29.99 },
  devpack: { id: 'devpack', name: 'Developer Asset Pack', price: 49.99 },
  tshirt: { id: 'tshirt', name: 'DevForge T-Shirt', price: 34.99 },
  mug: { id: 'mug', name: 'DevForge Mug', price: 19.99 },
  stickers: { id: 'stickers', name: 'Sticker Pack', price: 14.99 },
  poster: { id: 'poster', name: 'DevForge Poster', price: 24.99 },
};

const shopCart = createCart('cart-modal', 'cart-content', 'cart-total');

(window as any).addToCart = (id: string) => {
  const p = products[id];
  if (p) shopCart.add(p);
};

(window as any).closeCart = () => shopCart.close();


