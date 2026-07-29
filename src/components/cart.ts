export interface CartItem {
  id: string;
  name: string;
  price: number;
}

export function createCart(modalId: string, contentId: string, totalId: string) {
  const modal = document.getElementById(modalId) as HTMLElement | null;
  const content = document.getElementById(contentId) as HTMLElement | null;
  const totalEl = document.getElementById(totalId) as HTMLElement | null;

  const entries: { item: CartItem; qty: number }[] = [];

  function total(): number {
    return entries.reduce((s, e) => s + e.item.price * e.qty, 0);
  }

  function render() {
    if (!content) return;
    if (!entries.length) {
      content.innerHTML =
        '<div class="text-center py-8"><p class="text-gray-400">Your cart is empty</p></div>';
    } else {
      content.innerHTML = entries
        .map(
          (e) =>
            `<div class="flex items-center justify-between glass-card p-4 rounded-lg mb-3" data-id="${e.item.id}">
              <div><p class="font-semibold">${e.item.name}</p><p class="text-accent">$${e.item.price.toFixed(2)}</p></div>
              <div class="flex items-center gap-3">
                <span class="text-sm text-gray-400">x${e.qty}</span>
                <button class="text-red-400 text-sm hover:text-red-300 remove-btn" data-id="${e.item.id}">Remove</button>
              </div>
            </div>`
        )
        .join('');
    }
    if (totalEl) totalEl.textContent = `$${total().toFixed(2)}`;
  }

  function open() {
    if (modal) modal.classList.remove('hidden');
  }

  function close() {
    if (modal) modal.classList.add('hidden');
  }

  content?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.remove-btn') as HTMLElement | null;
    if (btn?.dataset.id) {
      const idx = entries.findIndex((en) => en.item.id === btn.dataset!.id);
      if (idx !== -1) entries.splice(idx, 1);
      render();
    }
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  return { add(item: CartItem) { const existing = entries.find((e) => e.item.id === item.id); if (existing) existing.qty++; else entries.push({ item, qty: 1 }); render(); open(); }, open, close };
}
