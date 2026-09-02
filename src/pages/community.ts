import '../style.css';
import { initReveal } from '../components/reveal';
import { initAmbientBubbles } from '../components/ambient-bubbles';

initReveal();
initAmbientBubbles();

const regForm = document.getElementById('register-form') as HTMLFormElement | null;
regForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(regForm);
  const name = fd.get('name')?.toString() || 'Diver';
  alert(`Welcome aboard, ${name}! Dive in — the community is waiting below.`);
  regForm.reset();
});

const surveyForm = document.getElementById('survey-form') as HTMLFormElement | null;
const surveyResult = document.getElementById('survey-result') as HTMLElement | null;
surveyForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(surveyForm);
  const data: Record<string, string> = {};
  fd.forEach((v, k) => { data[k] = v.toString(); });

  if (surveyResult) {
    surveyResult.classList.remove('hidden');
    surveyResult.innerHTML =
      `<div class="text-center py-6">
        <p class="text-xl font-semibold text-glow mb-2">Dive profile logged!</p>
        <p class="text-gray-400">You are a <span class="text-white">${data.kind || 'free diver'}</span></p>
        <p class="text-gray-400">Home biome: <span class="text-white">${data.biome || 'Safe Shallows'}</span></p>
        <p class="text-gray-400">Engine: <span class="text-white">${data.engine || 'Not Yet'}</span></p>
        <p class="text-gray-500 mt-4 text-sm">See you in the deep — now go build something.</p>
      </div>`;
  }
});

const counter = document.getElementById('dev-counter');
if (counter) {
  let count = 14200;
  setInterval(() => {
    count += Math.floor(Math.random() * 5);
    counter.textContent = count.toLocaleString();
  }, 3000);
}
