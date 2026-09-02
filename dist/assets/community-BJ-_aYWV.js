import{i as c,a as m}from"./ambient-bubbles-CNNAS53L.js";c();m();const n=document.getElementById("register-form");n==null||n.addEventListener("submit",e=>{var s;e.preventDefault();const t=((s=new FormData(n).get("name"))==null?void 0:s.toString())||"Diver";alert(`Welcome aboard, ${t}! Dive in — the community is waiting below.`),n.reset()});const a=document.getElementById("survey-form"),o=document.getElementById("survey-result");a==null||a.addEventListener("submit",e=>{e.preventDefault();const i=new FormData(a),t={};i.forEach((s,l)=>{t[l]=s.toString()}),o&&(o.classList.remove("hidden"),o.innerHTML=`<div class="text-center py-6">
        <p class="text-xl font-semibold text-glow mb-2">Dive profile logged!</p>
        <p class="text-gray-400">You are a <span class="text-white">${t.kind||"free diver"}</span></p>
        <p class="text-gray-400">Home biome: <span class="text-white">${t.biome||"Safe Shallows"}</span></p>
        <p class="text-gray-400">Engine: <span class="text-white">${t.engine||"Not Yet"}</span></p>
        <p class="text-gray-500 mt-4 text-sm">See you in the deep — now go build something.</p>
      </div>`)});const r=document.getElementById("dev-counter");if(r){let e=14200;setInterval(()=>{e+=Math.floor(Math.random()*5),r.textContent=e.toLocaleString()},3e3)}
