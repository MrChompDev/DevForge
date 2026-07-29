import '../style.css';
import { initThree } from '../three/init';
import { networkScene } from '../three/network-scene';

initThree('hero-3d-canvas', {
  cameraZ: 5,
  content: (s) => networkScene(s),
});

const regForm = document.getElementById('register-form') as HTMLFormElement | null;
regForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(regForm);
  const name = fd.get('name')?.toString() || 'Developer';
  alert(`Welcome to DevForge, ${name}! Check your email for next steps.`);
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
        <p class="text-xl font-semibold text-accent mb-2">Thanks for your feedback!</p>
        <p class="text-gray-400">Engine: <span class="text-white">${data.engine || 'N/A'}</span></p>
        <p class="text-gray-400">Experience: <span class="text-white">${data.experience || 'N/A'}</span></p>
        <p class="text-gray-400">Role: <span class="text-white">${data.role || 'N/A'}</span></p>
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
