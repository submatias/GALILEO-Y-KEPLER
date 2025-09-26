// -------- SPA Tabs & Ink indicator --------
const tabs = document.querySelectorAll('.tab');
const views = {
  inicio: document.getElementById('view-inicio'),
  formulas: document.getElementById('view-formulas'),
  laboratorio: document.getElementById('view-laboratorio'),
  examen: document.getElementById('view-examen')
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

// -------- LAB extra: Caída libre de dos masas --------
const caidaCanvas = $("canvas-caida");
if (caidaCanvas) {
  const ctxCaida = caidaCanvas.getContext("2d");
  let caidaAnim;
  function simularCaida() {
    cancelAnimationFrame(caidaAnim);
    let y1 = 20, y2 = 20;
    const m1 = parseFloat($("masa1").value) || 1;
    const m2 = parseFloat($("masa2").value) || 1;
    function draw() {
      ctxCaida.clearRect(0,0,caidaCanvas.width,caidaCanvas.height);
      // Objeto 1
      ctxCaida.fillStyle = "#7c89ff";
      ctxCaida.beginPath(); 
      ctxCaida.arc(100,y1,10+Math.log(m1+1)*5,0,2*Math.PI); 
      ctxCaida.fill();
      // Objeto 2
      ctxCaida.fillStyle = "#ffd166";
      ctxCaida.beginPath(); 
      ctxCaida.arc(200,y2,10+Math.log(m2+1)*5,0,2*Math.PI); 
      ctxCaida.fill();
      if (y1 < 200 && y2 < 200) {
        y1 += 3; y2 += 3; // misma aceleración para demostrar independencia de la masa
        caidaAnim = requestAnimationFrame(draw);
      }
    }
    draw();
  }
  $("btn-caida").onclick = simularCaida;
  $("btn-caida-reset").onclick = ()=> ctxCaida.clearRect(0,0,caidaCanvas.width,caidaCanvas.height);
}

// -------- LAB extra: Resistencia del aire --------
const aireCanvas = $("canvas-aire");
if (aireCanvas) {
  const ctxAire = aireCanvas.getContext("2d");
  let aireAnim;
  function simularAire() {
    cancelAnimationFrame(aireAnim);
    let y1 = 20, y2 = 20;
    const mBola = parseFloat($("masaBola").value) || 1;
    const mPluma = parseFloat($("masaPluma").value) || 0.1;
    const conAire = $("aireToggle").checked;
    function draw() {
      ctxAire.clearRect(0,0,aireCanvas.width,aireCanvas.height);
      // Bola
      ctxAire.fillStyle = "#5be4a8";
      ctxAire.beginPath(); 
      ctxAire.arc(100,y1,10+Math.log(mBola+1)*5,0,2*Math.PI); 
      ctxAire.fill();
      // Pluma
      ctxAire.fillStyle = "#e66";
      ctxAire.beginPath(); 
      ctxAire.arc(200,y2,10+Math.log(mPluma+1)*5,0,2*Math.PI); 
      ctxAire.fill();
      if (y1 < 200 || y2 < 200) {
        y1 += 3; 
        // Con aire, la pluma se frena más porque su masa es pequeña
        y2 += conAire ? Math.max(0.5, 3 * (mPluma/mBola)) : 3;
        aireAnim = requestAnimationFrame(draw);
      }
    }
    draw();
  }
  $("btn-aire").onclick = simularAire;
  $("btn-aire-reset").onclick = ()=> ctxAire.clearRect(0,0,aireCanvas.width,aireCanvas.height);
}

// -------- LAB extra: Plano inclinado --------
const planoCanvas = $("canvas-plano");
if (planoCanvas) {
  const ctxPlano = planoCanvas.getContext("2d");
  let planoAnim;
  function simularPlano() {
    cancelAnimationFrame(planoAnim);
    const angulo = parseInt($("angulo").value);
    $("anguloOut").textContent = angulo + "°";
    let x = 40, y = 180;
    const rad = angulo * Math.PI/180;
    const dx = Math.cos(rad) * 2;
    const dy = -Math.sin(rad) * 2;
    function draw() {
      ctxPlano.clearRect(0,0,planoCanvas.width,planoCanvas.height);
      ctxPlano.strokeStyle = "#aaa";
      ctxPlano.beginPath();
      ctxPlano.moveTo(20,200);
      ctxPlano.lineTo(300,200 - Math.tan(rad)*280);
      ctxPlano.stroke();
      ctxPlano.fillStyle = "#7c89ff";
      ctxPlano.fillRect(x,y,20,20);
      if (x < 260) {
        x += dx; y += dy;
        planoAnim = requestAnimationFrame(draw);
      }
    }
    draw();
  }
  $("btn-plano").onclick = simularPlano;
  $("btn-plano-reset").onclick = ()=> ctxPlano.clearRect(0,0,planoCanvas.width,planoCanvas.height);
  $("angulo").addEventListener("input", e=> $("anguloOut").textContent = e.target.value+"°");
}

// -------- LAB extra: Gráfico de velocidad --------
const grafCanvas = $("canvas-grafico");
if (grafCanvas) {
  const ctxGraf = grafCanvas.getContext("2d");
  let grafAnim;
  function simularGrafico() {
    cancelAnimationFrame(grafAnim);
    let t=0;
    function draw() {
      ctxGraf.clearRect(0,0,grafCanvas.width,grafCanvas.height);
      ctxGraf.beginPath();
      ctxGraf.moveTo(20,220);
      for (let i=0;i<t;i++){
        const x=20+i, y=220 - 0.8*i;
        ctxGraf.lineTo(x,y);
      }
      ctxGraf.strokeStyle="#7c89ff";
      ctxGraf.stroke();
      if(t<280){ t++; grafAnim=requestAnimationFrame(draw);}
    }
    draw();
  }
  $("btn-grafico").onclick = simularGrafico;
  $("btn-grafico-reset").onclick = ()=> ctxGraf.clearRect(0,0,grafCanvas.width,grafCanvas.height);
}

// -------- UX niceties --------
function initInkOnce(){ moveInk(); }
window.addEventListener('load', initInkOnce);
window.addEventListener('resize', ()=> {
  // recalcular para retratos al cambiar layout
  moveInk();
});

// -------- Accesibilidad: cerrar modal con ESC --------
modal.addEventListener('cancel', (e)=> { e.preventDefault(); modal.close(); });

// -------- EXAMEN --------
const examQuestions = [
  {q:"¿Qué demostró Galileo con la caída de los cuerpos?", opts:["Que los más pesados caen más rápido","Que todos caen con la misma aceleración","Que depende del viento"], ans:1},
  {q:"¿Qué instrumento perfeccionó Galileo?", opts:["Microscopio","Telescopio","Barómetro"], ans:1},
  {q:"¿Qué descubrió Galileo en Júpiter?", opts:["Anillos","Lunas","Nubes"], ans:1},
  {q:"¿Qué estudió Galileo en los planos inclinados?", opts:["El movimiento uniformemente acelerado","La gravitación universal","La electricidad"], ans:0},
  {q:"¿Qué defendía Galileo sobre el conocimiento?", opts:["El método experimental","La autoridad de Aristóteles","La magia"], ans:0},
  {q:"¿Qué forma tienen las órbitas planetarias según Kepler?", opts:["Circulares","Elípticas","Rectangulares"], ans:1},
  {q:"La 2ª ley de Kepler dice:", opts:["Velocidad constante en toda la órbita","Áreas iguales en tiempos iguales","Planetas inmóviles"], ans:1},
  {q:"La 3ª ley de Kepler relaciona:", opts:["Periodo y radio","Tiempo y masa","Periodo y semieje mayor"], ans:2},
  {q:"¿Quién proporcionó a Kepler los datos para sus leyes?", opts:["Newton","Copérnico","Tycho Brahe"], ans:2},
  {q:"¿Qué descubrió Kepler sobre Marte?", opts:["Que su órbita es elíptica","Que no gira","Que tiene anillos"], ans:0},
  {q:"¿Qué representa 'g' en la física de Galileo?", opts:["Gravedad","Gas","Galaxia"], ans:0},
  {q:"¿Qué observó Galileo en Venus?", opts:["Manchas","Fases","Nubes"], ans:1},
  {q:"¿Qué implican las fases de Venus?", opts:["Prueba del heliocentrismo","Prueba del geocentrismo","Prueba de que Venus no existe"], ans:0},
  {q:"¿Qué midió Galileo con el péndulo?", opts:["El tiempo","La distancia","La velocidad de la luz"], ans:0},
  {q:"¿Qué ley explica la variación de velocidad en la órbita?", opts:["1ª","2ª","3ª"], ans:1},
  {q:"Kepler era originario de:", opts:["Italia","Alemania","Francia"], ans:1},
  {q:"¿Qué descubrió Galileo en el Sol?", opts:["Manchas solares","Eclipses","Auroras"], ans:0},
  {q:"¿Qué descubrió Galileo en la Luna?", opts:["Que es lisa","Que tiene montañas y cráteres","Que brilla sola"], ans:1},
  {q:"La constante k en la 3ª ley depende de:", opts:["El sistema central","La masa del planeta","Nada"], ans:0},
  {q:"Galileo nació en:", opts:["1564","1571","1642"], ans:0}
];

function initExam(){
  const form = document.getElementById('exam-form');
  const resultBox = document.getElementById('exam-result');
  form.innerHTML = "";
  resultBox.textContent = "";

  // Selección aleatoria de 10
  const pool = [...examQuestions];
  const chosen = [];
  while(chosen.length<10){
    const i = Math.floor(Math.random()*pool.length);
    chosen.push(pool.splice(i,1)[0]);
  }

  chosen.forEach((q,i)=>{
    const field = document.createElement('div');
    field.className="question";
    field.innerHTML = `<h4>${i+1}. ${q.q}</h4>` + 
      q.opts.map((o,j)=>
        `<label><input type="radio" name="q${i}" value="${j}"> ${o}</label>`
      ).join("<br>");
    form.appendChild(field);
  });

  document.getElementById('btn-exam-submit').onclick = ()=>{
    let score=0;
    chosen.forEach((q,i)=>{
      const marked = form.querySelector(`input[name=q${i}]:checked`);
      if(marked && parseInt(marked.value)===q.ans) score++;
    });
    resultBox.textContent = `Tu puntuación: ${score}/10`;
    resultBox.style.color = score>=6 ? "var(--ok)" : "var(--warn)";
  };

  document.getElementById('btn-exam-reset').onclick = initExam;
}

// iniciar examen al entrar a la pestaña
document.querySelector('[data-route="examen"]').addEventListener('click', initExam);

// -------- Integración de IA con Gemini --------

// --- NUEVO CÓDIGO ---

// 1. Añade los elementos HTML al DOM para que el código funcione
const aiQuestionInput = document.getElementById('ai-question');
const aiAnswerDiv = document.getElementById('ai-answer');
const btnAiAsk = document.getElementById('btn-ai-ask');

// 2. Escucha el clic en el botón
btnAiAsk.addEventListener('click', async () => {
  const question = aiQuestionInput.value.trim();
  if (!question) {
    aiAnswerDiv.textContent = 'Por favor, escribe una pregunta.';
    return;
  }

  aiAnswerDiv.textContent = 'Generando respuesta... ⏳';
  btnAiAsk.disabled = true;

  try {
    // 3. Envía la pregunta a tu función serverless
    // Reemplaza esta URL con la URL de tu función serverless
   const serverlessUrl = 'https://galileo-y-kepler.vercel.app/api/ask';

    const response = await fetch(serverlessUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: question }),
    });

    if (!response.ok) {
      throw new Error('La IA no pudo responder. Inténtalo de nuevo más tarde.');
    }

    const data = await response.json();
    aiAnswerDiv.textContent = data.answer || 'No se pudo obtener una respuesta.';

  } catch (error) {
    console.error('Error al comunicarse con la IA:', error);
    aiAnswerDiv.textContent = 'Hubo un error al procesar tu pregunta. Por favor, revisa la consola para más detalles.';
  } finally {
    btnAiAsk.disabled = false;
  }
});

// --- FIN DEL CÓDIGO NUEVO ---








