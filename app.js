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
  
  if (route === 'inicio') {
      animateHeroText();
  }
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

// -------- Animaciones on-scroll (para elementos .reveal) --------
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  });
},{ threshold:.12 });
document.querySelectorAll('.reveal').forEach(el=> io.observe(el));

// -------- Animación inicial del texto principal (Slider) --------
function animateHeroText() {
    document.querySelector('.title.slide-up')?.classList.add('in');
    
    setTimeout(() => {
        document.querySelector('.subtitle.fade-in')?.classList.add('in');
    }, 200); 
}

// -------- Biografías (modal) --------
const bios = {
  galileo: {
    titulo: "Galileo Galilei (1564–1642)",
    texto: `
    Físico, astrónomo y matemático italiano, figura clave de la revolución científica.

    Perfeccionó el telescopio y realizó observaciones como las lunas de Júpiter y las fases de Venus, apoyando el heliocentrismo.

    Estudió la caída de los cuerpos y formalizó las leyes del movimiento uniformemente acelerado. Defendió el método experimental y la matematización de la naturaleza, sentando bases para la física clásica.`
  },
  kepler: {
    titulo: "Johannes Kepler (1571–1630)",
    texto: `
    Astrónomo y matemático alemán, formuló las tres leyes del movimiento planetario a partir de los datos de Tycho Brahe.

    Sus leyes describen órbitas elípticas, áreas iguales en tiempos iguales y la relación entre período y tamaño de la órbita (T² ∝ a³).

    Las leyes de Kepler fueron esenciales para la formulación de la gravitación universal por Isaac Newton y el desarrollo de la mecánica celeste.`
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
    
    // CORRECCIÓN 1: Se divide el texto en párrafos. El CSS los posicionará para el scroll horizontal.
    const paragraphs = b.texto.split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .map(p => `<p>${p}</p>`)
      .join('');
      
    bioContent.innerHTML = paragraphs;
    modal.showModal();
  }
  card.addEventListener('click', openBio);
  card.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBio(); }});
});

// -------- LAB: Galileo (MRUA / Tiro vertical) --------
const $ = (id)=> document.getElementById(id);
const gInput = $('g'), v0Input = $('v0'), h0Input = $('h0');
const canvas = $('canvas-galileo');
const ctx = canvas ? canvas.getContext('2d') : null; 
let animId = null, t = 0, dragging = false, dragBias = 0;

function phys(t, g, v0, h0){
  const y = h0 + v0*t - 0.5*g*t*t;
  const v = v0 - g*t;
  return { y, v };
}

if (canvas) { 
  function simular(){
    cancelAnimationFrame(animId);
    t = 0; dragBias = 0;
    const g = Math.max(0, parseFloat(gInput.value) || 9.8);
    const v0 = parseFloat(v0Input.value) || 0;
    const h0 = parseFloat(h0Input.value) || 0;

    const tSube = v0 / g; 
    const hMax = h0 + v0*tSube - 0.5*g*tSube*tSube;
    const disc = (v0*v0) + 2*g*h0; 
    const tVuelo = (v0 + Math.sqrt(disc))/g; 

    $('tvuelo').textContent = (tVuelo || 0).toFixed(2);
    $('hmax').textContent = (hMax || 0).toFixed(2);
    const vImpacto = Math.sqrt(Math.max(0, v0*v0 + 2*g*Math.max(0, hMax))); 
    $('vimpacto').textContent = vImpacto.toFixed(2);

    const pxPerM = canvas.height / Math.max(1, Math.max(hMax, h0) + 2); 
    const groundY = canvas.height - 10;

    function draw(){
      t += 1/60; 
      const { y, v } = phys(t, g, v0, h0);
      const yPx = groundY - (y * pxPerM) - dragBias;

      ctx.clearRect(0,0,canvas.width,canvas.height);

      ctx.strokeStyle = 'rgba(255,255,255,.25)';
      ctx.beginPath();
      ctx.moveTo(0, groundY+0.5);
      ctx.lineTo(canvas.width, groundY+0.5);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(40, groundY - (h0*pxPerM) - dragBias);
      const steps = Math.floor(Math.max(t, tVuelo)*60);
      for(let i=0;i<steps;i++){
        const tt = i/60;
        const { y: yy } = phys(tt, g, v0, h0);
        const yypx = groundY - (yy * pxPerM) - dragBias;
        const xx = 40 + tt* (canvas.width - 100)/Math.max(tVuelo, 1);
        ctx.lineTo(xx, yypx);
      }
      ctx.strokeStyle = 'rgba(124,137,255,.9)';
      ctx.lineWidth = 2;
      ctx.stroke();

      const x = 40 + t * (canvas.width - 100)/Math.max(tVuelo, 1);
      ctx.beginPath();
      ctx.arc(x, yPx, 8, 0, Math.PI*2);
      ctx.fillStyle = '#5be4a8';
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,.7)';
      ctx.font = '14px system-ui, -apple-system, Segoe UI, Roboto';
      ctx.fillText(`t = ${t.toFixed(2)} s`, 20, 24);
      ctx.fillText(`y = ${Math.max(0,y).toFixed(2)} m`, 20, 44);

      $('tcurrent').textContent = t.toFixed(2);
      $('vcurrent').textContent = Math.abs(v).toFixed(2);
      $('ycurrent').textContent = Math.max(0,y).toFixed(2);


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
    $('tcurrent').textContent = $('vcurrent').textContent = $('ycurrent').textContent = '0.00';
    t = 0; dragBias = 0;
  });
  canvas.addEventListener('mousemove', (e)=>{
    if(!dragging) return;
    dragBias += (e.movementY || 0) * 0.6; 
  });
  canvas.addEventListener('mousedown', ()=> dragging = true);
  window.addEventListener('mouseup', ()=> dragging = false);
}


// -------- LAB: Kepler (T² = k·a³) + órbita SVG --------
const aRange = $('a'), aOut = $('aOut'), kInput = $('k');
const outT = $('T'), outT2 = $('T2'), outA3 = $('a3');
const planet = document.getElementById('planet');
const ellipse = document.getElementById('ellipse');

if (aRange && planet && ellipse) {
  function updateKeplerUI(){
    const a = parseFloat(aRange.value);
    const k = parseFloat(kInput.value);
    aOut.textContent = a.toFixed(1);

    const T2 = k * Math.pow(a, 3);
    const T = Math.sqrt(T2);

    outT.textContent = T.toFixed(2);
    outT2.textContent = T2.toFixed(2);
    outA3.textContent = Math.pow(a,3).toFixed(2);

    const duration = Math.max(2, T * 2); 
    planet.style.animationDuration = `${duration}s`;

    const rx0 = 110, ry0 = 80;
    ellipse.setAttribute('rx', (rx0 * Math.cbrt(a/1)).toFixed(1));
    ellipse.setAttribute('ry', (ry0 * Math.cbrt(a/1) * 0.9).toFixed(1));
  }

  let theta = 0;
  function animateOrbit(){
    const rx = parseFloat(ellipse.getAttribute('rx'));
    const ry = parseFloat(ellipse.getAttribute('ry'));
    const cx = 150, cy = 150;
    const dur = parseFloat(getComputedStyle(planet).animationDuration) || 4;
    theta += (2*Math.PI) / (60*dur);
    const x = cx + rx * Math.cos(theta);
    const y = cy + ry * Math.sin(theta);
    planet.setAttribute('cx', x.toFixed(2));
    planet.setAttribute('cy', y.toFixed(2));
    requestAnimationFrame(animateOrbit);
  }
  
  aRange.addEventListener('input', updateKeplerUI);
  kInput.addEventListener('input', updateKeplerUI);

  planet.style.animationDuration = '4s';
  updateKeplerUI();
  animateOrbit();
}


// -------- CONSTANTES DE FÍSICA Y CANVAS PARA CAÍDA LIBRE --------
const G_CONST = 9.8; 
const H0_SIM = 10; 
const PX_PER_M = 20; 
const GROUND_Y = 220; 
const DRAG_COEFF = 0.05; 
const DT = 1/60; 

// -------- LAB extra: Caída libre de dos masas --------
const caidaCanvas = $("canvas-caida");
if (caidaCanvas) {
  const ctxCaida = caidaCanvas.getContext("2d");
  let caidaAnim;
  let tCaida = 0; 

  function simularCaida() {
    cancelAnimationFrame(caidaAnim);
    tCaida = 0; 

    let ySim1 = H0_SIM; 
    let ySim2 = H0_SIM;
    let vSim1 = 0;
    let vSim2 = 0;

    const m1 = parseFloat($("masa1").value) || 1;
    const m2 = parseFloat($("masa2").value) || 1;
    
    function draw() {
      tCaida += DT; 
      
      const ySim_new = Math.max(0, H0_SIM - 0.5 * G_CONST * tCaida * tCaida);
      const vSim_new = G_CONST * tCaida; 

      ySim1 = ySim_new;
      ySim2 = ySim_new;
      vSim1 = vSim_new;
      vSim2 = vSim_new;
      
      const yPx1 = GROUND_Y - ySim1 * PX_PER_M;
      const yPx2 = GROUND_Y - ySim2 * PX_PER_M;
      
      ctxCaida.clearRect(0,0,caidaCanvas.width,caidaCanvas.height);
      
      ctxCaida.strokeStyle = 'rgba(255,255,255,.25)';
      ctxCaida.beginPath();
      ctxCaida.moveTo(0, GROUND_Y);
      ctxCaida.lineTo(caidaCanvas.width, GROUND_Y);
      ctxCaida.stroke();
      
      ctxCaida.fillStyle = "#7c89ff";
      ctxCaida.beginPath(); 
      ctxCaida.arc(100,yPx1,10+Math.log(m1+1)*5,0,2*Math.PI); 
      ctxCaida.fill();
      
      ctxCaida.fillStyle = "#ffd166";
      ctxCaida.beginPath(); 
      ctxCaida.arc(200,yPx2,10+Math.log(m2+1)*5,0,2*Math.PI); 
      ctxCaida.fill();
      
      $("tcaida").textContent = tCaida.toFixed(2);
      $("vcaida1").textContent = vSim1.toFixed(2);
      $("ycaida1").textContent = ySim1.toFixed(2);
      $("vcaida2").textContent = vSim2.toFixed(2);
      $("ycaida2").textContent = ySim2.toFixed(2);

      if (ySim1 > 0 || ySim2 > 0) {
        caidaAnim = requestAnimationFrame(draw);
      }
    }
    draw();
  }
  $("btn-caida").onclick = simularCaida;
  $("btn-caida-reset").onclick = ()=> {
    cancelAnimationFrame(caidaAnim);
    ctxCaida.clearRect(0,0,caidaCanvas.width,caidaCanvas.height);
    $("tcaida").textContent = $("vcaida1").textContent = $("ycaida1").textContent = $("vcaida2").textContent = $("ycaida2").textContent = "0.00";
    tCaida = 0;
  };
}

// -------- LAB extra: Resistencia del aire --------
const aireCanvas = $("canvas-aire");
if (aireCanvas) {
  const ctxAire = aireCanvas.getContext("2d");
  let aireAnim;
  let tAire = 0;

  function updatePhysics(y, v, m, drag) {
      if (y <= 0) return { y: 0, v: 0 };
      
      let a = G_CONST; 
      
      if (drag) {
          const resistanceFactor = DRAG_COEFF * v * v / m;
          a = G_CONST - resistanceFactor; 
      }
      
      const vNew = v + a * DT;
      const yNew = y - vNew * DT; 
      
      return { 
          y: Math.max(0, yNew), 
          v: Math.max(0, vNew)
      };
  }

  function simularAire() {
    cancelAnimationFrame(aireAnim);
    tAire = 0;

    let ySim1 = H0_SIM;
    let ySim2 = H0_SIM;
    let vSim1 = 0;
    let vSim2 = 0;

    const mBola = parseFloat($("masaBola").value) || 1;
    const mPluma = parseFloat($("masaPluma").value) || 0.1;
    const conAire = $("aireToggle").checked;

    function draw() {
      tAire += DT;

      const { y: yNew1, v: vNew1 } = updatePhysics(ySim1, vSim1, mBola, conAire);
      ySim1 = yNew1;
      vSim1 = vNew1;

      const { y: yNew2, v: vNew2 } = updatePhysics(ySim2, vSim2, mPluma, conAire);
      ySim2 = yNew2;
      vSim2 = vNew2;
      
      const yPx1 = GROUND_Y - ySim1 * PX_PER_M;
      const yPx2 = GROUND_Y - ySim2 * PX_PER_M;

      ctxAire.clearRect(0,0,aireCanvas.width,aireCanvas.height);
      
      ctxAire.strokeStyle = 'rgba(255,255,255,.25)';
      ctxAire.beginPath();
      ctxAire.moveTo(0, GROUND_Y);
      ctxAire.lineTo(aireCanvas.width, GROUND_Y);
      ctxAire.stroke();

      ctxAire.fillStyle = "#5be4a8";
      ctxAire.beginPath(); 
      ctxAire.arc(100,yPx1,10+Math.log(mBola+1)*5,0,2*Math.PI); 
      ctxAire.fill();

      ctxAire.fillStyle = "#e66";
      ctxAire.beginPath(); 
      ctxAire.arc(200,yPx2,10+Math.log(mPluma+1)*5,0,2*Math.PI); 
      ctxAire.fill();
      
      $("taire").textContent = tAire.toFixed(2);
      $("vaire1").textContent = vSim1.toFixed(2);
      $("yaire1").textContent = ySim1.toFixed(2);
      $("vaire2").textContent = vSim2.toFixed(2);
      $("yaire2").textContent = ySim2.toFixed(2);

      if (ySim1 > 0 || ySim2 > 0) {
        aireAnim = requestAnimationFrame(draw);
      }
    }
    draw();
  }
  $("btn-aire").onclick = simularAire;
  $("btn-aire-reset").onclick = ()=> {
    cancelAnimationFrame(aireAnim);
    ctxAire.clearRect(0,0,aireCanvas.width,aireCanvas.height);
    $("taire").textContent = $("vaire1").textContent = $("yaire1").textContent = $("vaire2").textContent = $("yaire2").textContent = "0.00";
    tAire = 0;
  };
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
function initInkOnce(){ moveInk(); animateHeroText(); } 
window.addEventListener('load', initInkOnce); 
window.addEventListener('resize', ()=> {
  moveInk();
});

if(modal) { 
  modal.addEventListener('cancel', (e)=> { e.preventDefault(); modal.close(); });
}


// -------- EXAMEN --------
const examQuestions = [
  // Nueva estructura: {q: pregunta, opts: [opciones], ans: índice, feedback: oración explicativa}
  {q:"¿Qué demostró Galileo con la caída de los cuerpos?", opts:["Que los más pesados caen más rápido","Que todos caen con la misma aceleración","Que depende del viento"], ans:1, feedback: "Galileo demostró que **todos los cuerpos caen con la misma aceleración** independientemente de su masa, si se ignora la resistencia del aire."},
  {q:"¿Qué instrumento perfeccionó Galileo?", opts:["Microscopio","Telescopio","Barómetro"], ans:1, feedback: "Galileo perfeccionó el **telescopio**, lo que le permitió hacer observaciones astronómicas cruciales."},
  {q:"¿Qué descubrió Galileo en Júpiter?", opts:["Anillos","Lunas","Nubes"], ans:1, feedback: "Descubrió las cuatro **lunas** más grandes de Júpiter (Io, Europa, Ganímedes y Calisto), que contradecían el modelo geocéntrico."},
  {q:"¿Qué estudió Galileo en los planos inclinados?", opts:["El movimiento uniformemente acelerado","La gravitación universal","La electricidad"], ans:0, feedback: "Los planos inclinados le permitieron estudiar y medir con precisión el **movimiento uniformemente acelerado**."},
  {q:"¿Qué defendía Galileo sobre el conocimiento?", opts:["El método experimental","La autoridad de Aristóteles","La magia"], ans:0, feedback: "Galileo fue un defensor clave del **método experimental**, basando la ciencia en la observación y la medición."},
  {q:"¿Qué forma tienen las órbitas planetarias según Kepler?", opts:["Circulares","Elípticas","Rectangulares"], ans:1, feedback: "La **primera ley de Kepler** establece que los planetas se mueven en órbitas **elípticas**, con el Sol en uno de sus focos."},
  {q:"La 2ª ley de Kepler dice:", opts:["Velocidad constante en toda la órbita","Áreas iguales en tiempos iguales","Planetas inmóviles"], ans:1, feedback: "La **segunda ley de Kepler** afirma que un planeta barre **áreas iguales en tiempos iguales**, lo que implica que la velocidad varía en la órbita."},
  {q:"La 3ª ley de Kepler relaciona:", opts:["Periodo y radio","Tiempo y masa","Periodo y semieje mayor"], ans:2, feedback: "La **tercera ley de Kepler** relaciona el **periodo (T)** de la órbita con el **semieje mayor (a)**, mediante la fórmula T² ∝ a³."},
  {q:"¿Quién proporcionó a Kepler los datos para sus leyes?", opts:["Newton","Copérnico","Tycho Brahe"], ans:2, feedback: "Kepler heredó y analizó los detallados datos de observación de su mentor, el astrónomo **Tycho Brahe**."},
  {q:"¿Qué descubrió Kepler sobre Marte?", opts:["Que su órbita es elíptica","Que no gira","Que tiene anillos"], ans:0, feedback: "El estudio de la órbita de Marte fue crucial para que Kepler dedujera que las órbitas son **elípticas**."},
  {q:"¿Qué representa 'g' en la física de Galileo?", opts:["Gravedad","Gas","Galaxia"], ans:0, feedback: "La 'g' representa la aceleración debida a la **gravedad** terrestre (aproximadamente 9.8 m/s²)."},
  {q:"¿Qué observó Galileo en Venus?", opts:["Manchas","Fases","Nubes"], ans:1, feedback: "Galileo observó las **fases** de Venus, similares a las de la Luna."},
  {q:"¿Qué implican las fases de Venus?", opts:["Prueba del heliocentrismo","Prueba del geocentrismo","Prueba de que Venus no existe"], ans:0, feedback: "Las fases completas de Venus solo pueden ocurrir si **Venus orbita el Sol**, lo que fue una prueba clave para el heliocentrismo."},
  {q:"¿Qué midió Galileo con el péndulo?", opts:["El tiempo","La distancia","La velocidad de la luz"], ans:0, feedback: "Galileo utilizó su estudio del péndulo para medir y estandarizar el **tiempo** en sus experimentos de movimiento."},
  {q:"¿Qué ley explica la variación de velocidad en la órbita?", opts:["1ª","2ª","3ª"], ans:1, feedback: "La **segunda ley de Kepler** explica que el planeta va más rápido cerca del Sol y más lento lejos de él."},
  {q:"Kepler era originario de:", opts:["Italia","Alemania","Francia"], ans:1, feedback: "Johannes Kepler fue un astrónomo y matemático de **Alemania**."},
  {q:"¿Qué descubrió Galileo en el Sol?", opts:["Manchas solares","Eclipses","Auroras"], ans:0, feedback: "Galileo observó las **manchas solares**, sugiriendo que el Sol no era una esfera perfecta e inmutable."},
  {q:"¿Qué descubrió Galileo en la Luna?", opts:["Que es lisa","Que tiene montañas y cráteres","Que brilla sola"], ans:1, feedback: "Galileo descubrió que la Luna tiene una superficie irregular con **montañas y cráteres**, haciéndola similar a la Tierra."},
  {q:"La constante k en la 3ª ley depende de:", opts:["El sistema central","La masa del planeta","Nada"], ans:0, feedback: "La constante 'k' de la tercera ley (T² = k·a³) depende únicamente de la masa del cuerpo central, es decir, del **sistema central** (como el Sol)."},
  {q:"Galileo nació en:", opts:["1564","1571","1642"], ans:0, feedback: "Galileo Galilei nació en Pisa, Italia, en el año **1564**."}
];

let chosenQuestions = []; 

function initExam(){
  const form = document.getElementById('exam-form');
  const resultBox = document.getElementById('exam-result');
  form.innerHTML = "";
  resultBox.innerHTML = ""; 
  document.getElementById('btn-exam-submit').disabled = false; 

  const pool = [...examQuestions];
  chosenQuestions = []; 
  while(chosenQuestions.length<10){
    const i = Math.floor(Math.random()*pool.length);
    chosenQuestions.push(pool.splice(i,1)[0]);
  }

  chosenQuestions.forEach((q,i)=>{
    const field = document.createElement('div');
    field.className="question";
    field.innerHTML = `<h4>${i+1}. ${q.q}</h4>` + 
      q.opts.map((o,j)=>
        `<label><input type="radio" name="q${i}" value="${j}"> ${o}</label>`
      ).join("<br>");
    form.appendChild(field);
  });
}

document.getElementById('btn-exam-submit').onclick = ()=>{
  const form = document.getElementById('exam-form');
  const resultBox = document.getElementById('exam-result');
  let score=0;
  let feedbackHTML = `<div class="feedback-list">`;
  
  chosenQuestions.forEach((q,i)=>{
    const marked = form.querySelector(`input[name=q${i}]:checked`);
    const isCorrect = marked && parseInt(marked.value) === q.ans;
    const questionElement = form.querySelector(`.question:nth-child(${i+1})`);

    questionElement.querySelectorAll('label').forEach(label => label.classList.remove('is-correct', 'is-incorrect'));

    if (isCorrect) {
      score++;
      if (marked) marked.parentElement.classList.add('is-correct');
    } else {
      // CORRECCIÓN 2: Se utiliza el nuevo campo 'feedback'
      const userAnswerText = marked ? marked.parentElement.textContent.trim() : "No respondiste esta pregunta.";

      feedbackHTML += `
        <div class="feedback-item incorrect">
          <p>❌ Pregunta ${i+1}: <strong>${q.q}</strong></p>
          <p class="user-answer">Tu respuesta: <em>${userAnswerText}</em></p>
          <p class="correct-explanation">💡 **Explicación Correcta:** ${q.feedback}</p>
        </div>
      `;
      if (marked) marked.parentElement.classList.add('is-incorrect');
      questionElement.querySelector(`input[name=q${i}][value="${q.ans}"]`).parentElement.classList.add('is-correct');
    }
  });

  feedbackHTML += `</div>`; 
  
  const feedbackContent = score < chosenQuestions.length ? `
    <p>A continuación se muestran las respuestas incorrectas y la corrección:</p>
    ${feedbackHTML}` : '<p style="color:var(--ok);">¡Felicidades! Respondiste todas las preguntas correctamente. 🎉</p>';


  resultBox.innerHTML = `
    <h4 style="color: ${score >= 6 ? 'var(--ok)' : 'var(--warn)'};">
      Puntuación final: ${score}/10
    </h4>
  ` + feedbackContent;
  
  document.getElementById('btn-exam-submit').disabled = true;
};

document.querySelector('[data-route="examen"]').addEventListener('click', initExam);
document.getElementById('btn-exam-reset').onclick = initExam;


// -------- Integración de IA con Gemini --------
const aiQuestionInput = document.getElementById('ai-question');
const aiAnswerDiv = document.getElementById('ai-answer');
const btnAiAsk = document.getElementById('btn-ai-ask');

if(btnAiAsk) { 
    btnAiAsk.addEventListener('click', async () => {
    const question = aiQuestionInput.value.trim();
    if (!question) {
        aiAnswerDiv.textContent = 'Por favor, escribe una pregunta.';
        return;
    }

    aiAnswerDiv.textContent = 'Generando respuesta... ⏳';
    btnAiAsk.disabled = true;

    try {
        const serverlessUrl = window.location.origin + '/api/ask';

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
}
