// -------- SPA Tabs & Ink indicator --------
const tabs = document.querySelectorAll('.tab');
const views = {
  inicio: document.getElementById('view-inicio'),
  formulas: document.getElementById('view-formulas'),
  laboratorio: document.getElementById('view-laboratorio')
};
const ink = document.querySelector('.tab-ink');

function activate(route){
  tabs.forEach(t=>{
    const active = t.dataset.route === route;
    t.classList.toggle('active', active);
    t.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  Object.entries(views).forEach(([key, el])=>{
    el.classList.toggle('active', key === route);
  });
  moveInk();
  window.location.hash = route;
}

function moveInk(){
  const active = document.querySelector('.tab.active');
  if(!active) return;
  const rect = active.getBoundingClientRect();
  const parentRect = active.parentElement.getBoundingClientRect();
  ink.style.width = rect.width + 'px';
  ink.style.left = (rect.left - parentRect.left) + 'px';
}
window.addEventListener('resize', moveInk);

tabs.forEach(t=> t.addEventListener('click', () => activate(t.dataset.route)));
window.addEventListener('hashchange', () => {
  const r = location.hash.replace('#', '') || 'inicio';
  activate(r);
});
activate((location.hash || '#inicio').replace('#',''));

// -------- Animaciones on-scroll --------
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  });
},{ threshold:.12 });
document.querySelectorAll('.reveal').forEach(el=> io.observe(el));

// -------- Biografías (modal) --------
const bios = {
  galileo: {
    titulo: "Galileo Galilei (1564–1642)",
    texto: `
    Físico, astrónomo y matemático italiano, figura clave de la revolución científica.
    Perfeccionó el telescopio y realizó observaciones como las lunas de Júpiter y las fases de Venus, apoyando el heliocentrismo.
    Estudió la caída de los cuerpos y formalizó las leyes del movimiento uniformemente acelerado. Defendió el método experimental
    y la matematización de la naturaleza, sentando bases para la física clásica.`
  },
  kepler: {
    titulo: "Johannes Kepler (1571–1630)",
    texto: `
    Astrónomo y matemático alemán, formuló las tres leyes del movimiento planetario a partir de los datos de Tycho Brahe,
    describiendo órbitas elípticas, áreas iguales en tiempos iguales y la relación entre período y tamaño de la órbita.
    Sus leyes fueron esenciales para la gravitación universal de Newton y el desarrollo de la mecánica celeste.`
  }
};

const modal = document.getElementById('bio-modal');
const bioTitle = document.getElementById('bio-title');
const bioContent = document.getElementById('bio-content');

document.querySelectorAll('.portrait').forEach(card=>{
  const who = card.dataset.person;
  function openBio(){
    const b = bios[who];
    bioTitle.textContent = b.titulo;
    bioContent.innerHTML = `<p>${b.texto}</p>`;
    modal.showModal();
  }
  card.addEventListener('click', openBio);
  card.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBio(); }});
});

// -------- LAB: Galileo (MRUA / Tiro vertical) --------
const $ = (id)=> document.getElementById(id);
const gInput = $('g'), v0Input = $('v0'), h0Input = $('h0');
const canvas = $('canvas-galileo');
const ctx = canvas.getContext('2d');
let animId = null, t = 0, dragging = false, dragBias = 0;

function phys(t, g, v0, h0){
  // s = h0 + v0*t - 1/2 g t^2 (eje vertical hacia arriba)
  const y = h0 + v0*t - 0.5*g*t*t;
  const v = v0 - g*t;
  return { y, v };
}

function simular(){
  cancelAnimationFrame(animId);
  t = 0; dragBias = 0;
  const g = Math.max(0, parseFloat(gInput.value) || 9.8);
  const v0 = parseFloat(v0Input.value) || 0;
  const h0 = parseFloat(h0Input.value) || 0;

  // tiempos clave
  const tSube = v0 / g; // tiempo a altura máxima (si v0>0)
  const hMax = h0 + v0*tSube - 0.5*g*tSube*tSube;
  // resolver tiempo de vuelo desde y=0 (suelo) => 0 = h0 + v0 t - 1/2 g t^2
  const disc = (v0*v0) + 2*g*h0; // por cambio de signo
  const tVuelo = (v0 + Math.sqrt(disc))/g; // raíz positiva

  // mostrar lecturas
  $('tvuelo').textContent = (tVuelo || 0).toFixed(2);
  $('hmax').textContent = (hMax || 0).toFixed(2);
  const vImpacto = Math.sqrt(Math.max(0, v0*v0 + 2*g*Math.max(0, hMax))); // aprox
  $('vimpacto').textContent = vImpacto.toFixed(2);

  const pxPerM = canvas.height / Math.max(1, Math.max(hMax, h0) + 2); // margen
  const groundY = canvas.height - 10;

  function draw(){
    t += 1/60; // 60 FPS
    const { y } = phys(t, g, v0, h0);
    // mapping: y metros -> pantalla
    const yPx = groundY - (y * pxPerM) - dragBias;

    // clear
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // ground
    ctx.strokeStyle = 'rgba(255,255,255,.25)';
    ctx.beginPath();
    ctx.moveTo(0, groundY+0.5);
    ctx.lineTo(canvas.width, groundY+0.5);
    ctx.stroke();

    // trajectory trail
    ctx.beginPath();
    ctx.moveTo(40, groundY - (h0*pxPerM) - dragBias);
    const steps = Math.floor(Math.max(t, tVuelo)*60);
    for(let i=0;i<steps;i++){
      const tt = i/60;
      const yy = groundY - (phys(tt, g, v0, h0).y * pxPerM) - dragBias;
      const xx = 40 + tt* (canvas.width - 100)/Math.max(tVuelo, 1);
      ctx.lineTo(xx, yy);
    }
    ctx.strokeStyle = 'rgba(124,137,255,.9)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // projectile
    const x = 40 + t * (canvas.width - 100)/Math.max(tVuelo, 1);
    ctx.beginPath();
    ctx.arc(x, yPx, 8, 0, Math.PI*2);
    ctx.fillStyle = '#5be4a8';
    ctx.fill();

    // labels
    ctx.fillStyle = 'rgba(255,255,255,.7)';
    ctx.font = '14px system-ui, -apple-system, Segoe UI, Roboto';
    ctx.fillText(`t = ${t.toFixed(2)} s`, 20, 24);
    ctx.fillText(`y = ${Math.max(0,y).toFixed(2)} m`, 20, 44);

    if(t < tVuelo && y >= 0){
      animId = requestAnimationFrame(draw);
    }
  }
  draw();
}

$('btn-simular').addEventListener('click', simular);
$('btn-reiniciar').addEventListener('click', ()=>{
  cancelAnimationFrame(animId);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  $('tvuelo').textContent = $('hmax').textContent = $('vimpacto').textContent = '—';
  t = 0; dragBias = 0;
});
canvas.addEventListener('mousemove', (e)=>{
  if(!dragging) return;
  dragBias += (e.movementY || 0) * 0.6; // mini “empujón”
});
canvas.addEventListener('mousedown', ()=> dragging = true);
window.addEventListener('mouseup', ()=> dragging = false);

// -------- LAB: Kepler (T² = k·a³) + órbita SVG --------
const aRange = $('a'), aOut = $('aOut'), kInput = $('k');
const outT = $('T'), outT2 = $('T2'), outA3 = $('a3');
const planet = document.getElementById('planet');
const ellipse = document.getElementById('ellipse');

function updateKeplerUI(){
  const a = parseFloat(aRange.value);
  const k = parseFloat(kInput.value);
  aOut.textContent = a.toFixed(1);

  const T2 = k * Math.pow(a, 3);
  const T = Math.sqrt(T2);

  outT.textContent = T.toFixed(2);
  outT2.textContent = T2.toFixed(2);
  outA3.textContent = Math.pow(a,3).toFixed(2);

  // Ajustar velocidad de animación: más a => mayor T => animación más lenta.
  // Usamos CSS variable via style: duration en segundos proporcional a T.
  const duration = Math.max(2, T * 2); // escala visual
  planet.style.animationDuration = `${duration}s`;

  // Escalar elipse suave en x/y para sugerir cambio de a
  const rx0 = 110, ry0 = 80;
  ellipse.setAttribute('rx', (rx0 * Math.cbrt(a/1)).toFixed(1));
  ellipse.setAttribute('ry', (ry0 * Math.cbrt(a/1) * 0.9).toFixed(1));
}
aRange.addEventListener('input', updateKeplerUI);
kInput.addEventListener('input', updateKeplerUI);

// animación del planeta alrededor de la elipse (aproximación paramétrica)
let theta = 0;
function animateOrbit(){
  const rx = parseFloat(ellipse.getAttribute('rx'));
  const ry = parseFloat(ellipse.getAttribute('ry'));
  const cx = 150, cy = 150;
  // velocidad angular básica; el factor depende de duración CSS
  const dur = parseFloat(getComputedStyle(planet).animationDuration) || 4;
  theta += (2*Math.PI) / (60*dur);
  const x = cx + rx * Math.cos(theta);
  const y = cy + ry * Math.sin(theta);
  planet.setAttribute('cx', x.toFixed(2));
  planet.setAttribute('cy', y.toFixed(2));
  requestAnimationFrame(animateOrbit);
}
// CSS fallback (define duración inicial)
planet.style.animationDuration = '4s';
updateKeplerUI();
animateOrbit();

// -------- UX niceties --------
function initInkOnce(){ moveInk(); }
window.addEventListener('load', initInkOnce);
window.addEventListener('resize', ()=> {
  // recalcular para retratos al cambiar layout
  moveInk();
});

// -------- Accesibilidad: cerrar modal con ESC --------
modal.addEventListener('cancel', (e)=> { e.preventDefault(); modal.close(); });
