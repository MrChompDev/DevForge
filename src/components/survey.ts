export function initSurvey(formId: string, resultId: string) {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  const result = document.getElementById(resultId) as HTMLElement | null;

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data: Record<string, string> = {};
    fd.forEach((v, k) => { data[k] = v.toString(); });

    if (result) {
      result.classList.remove('hidden');
      result.innerHTML =
        `<div class="text-center py-8">
          <p class="text-xl font-semibold text-cyber-cyan mb-2">Thanks for your feedback!</p>
          <p class="text-gray-400">Engine: <span class="text-white">${data.engine || 'N/A'}</span></p>
          <p class="text-gray-400">Experience: <span class="text-white">${data.experience || 'N/A'}</span></p>
          <p class="text-gray-400">Role: <span class="text-white">${data.role || 'N/A'}</span></p>
          <p class="text-gray-400 mt-4 text-sm">DevForge Community values your input.</p>
        </div>`;
    }
  });
}

export function initRegistration(formId: string) {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = fd.get('name')?.toString() || 'Developer';
    alert(`Welcome to DevForge, ${name}! Check your email for next steps.`);
    form.reset();
  });
}
