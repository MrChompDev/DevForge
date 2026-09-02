export function initAmbientBubbles(count = 45): void {
  const container = document.createElement('div');
  container.className = 'ambient-bubbles';
  container.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    const x = Math.random() * 100;
    const delay = Math.random() * 25;
    const dur = 14 + Math.random() * 20;
    const size = 1 + Math.random() * 3;
    const op = 0.12 + Math.random() * 0.32;
    const wobble = -25 + Math.random() * 50;
    dot.style.cssText =
      `--op:${op};--w:${wobble}px;left:${x}%;animation-delay:${delay}s;animation-duration:${dur}s;width:${size}px;height:${size}px;`;
    container.appendChild(dot);
  }
  document.body.prepend(container);
}
