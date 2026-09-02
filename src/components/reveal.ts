export function initReveal(): void {
  const els = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('revealed'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 },
  );
  els.forEach((el) => io.observe(el));
}
