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


// -------- Biografías (modal) - SLIDER POR PÁRRAFO --------
const bios = {
  galileo: {
    titulo: "Galileo Galilei (1564–1642)",
    texto: [
      `Físico, astrónomo y matemático italiano, figura clave de la revolución científica. Perfeccionó el telescopio y realizó observaciones como las lunas de Júpiter y las fases de Venus, apoyando el heliocentrismo. Estudió la caída de los cuerpos y formalizó las leyes del movimiento uniformemente acelerado. Defendió el método experimental y la matematización de la naturaleza, sentando bases para la física clásica.`,
      `Galileo Galilei nació en la ciudad de Pisa (Italia) el 15/02/1564. Estudió de niño en la escuela Jesuita del Monasterio de Vallombrosa (Florencia), intentó seguir la carrera de sacerdote, pero su padre lo rescató y comenzó a estudiar en la Universidad de Pisa, donde descubrió su interés por las matemáticas y comenzó a estudiar con Ostilio Ricci, algebrista discípulo de Trataglia. Ahí es donde se destacó y se graduó; y en 1589 se desempeñó como profesor de la Universidad, durante 3 años, para posteriormente conseguir una plaza de profesor de matemáticas en la Universidad de Padua en la República de Venecia.`,
      `A fines de 1609 Galileo construye un telescopio perfeccionado y lo regala al gobierno de la República Veneciana, esto lo llenó de honores, ya que tenía un gran valor militar. A principios de 1610 dirige su telescopio al cielo y lo convierte en un instrumento de investigación científica, descubre maravillas jamás vistas por otro hombre. Esto lo coloca, junto con Kepler, como uno de los fundadores de la astronomía moderna. Todo lo que descubre lo publica en un libro titulado “Sidereus Nuncius” (El Mensajero de los Astros), una de las obras más famosas del S. XVII, donde se convence de la cosmología copernicana.`,
      `Al defender el modelo “heliocéntrico”, en 1616 tras la censura de las teorías copernicanas, no divulga sus descubrimientos hasta que en 1632 publica “Dialogo”, donde se burla del geocentrismo y “aparentemente del papa”, lo que lo lleva a juicio y condenado arresto domiciliario, en Florencia.`,
      `Para que en 1638 publica su última obra “Discorsi e Dimostrazioni Matematiche”, donde describe “el movimiento con velocidad uniforme constante”, dice que la velocidad=distancia/tiempo; y “el movimiento con aceleración uniforme” la “Ley de la caída libre de los cuerpos”, haciendo mediciones de la caída de los objetos sobre planos inclinados, demostrando la velocidad es proporcional a la aceleración por el tiempo. Y en 1642, en Arcetri (Florencia) acompañado de un pupilo Vincenzo Viviani.`
    ]
  },
  kepler: {
    titulo: "Johannes Kepler (1571–1630)",
    texto: [
      `Astrónomo y matemático alemán, formuló las tres leyes del movimiento planetario a partir de los datos de Tycho Brahe, describiendo órbitas elípticas, áreas iguales en tiempos iguales y la relación entre período y tamaño de la órbita. Sus leyes fueron esenciales para la gravitación universal de Newton y el desarrollo de la mecánica celeste.`,
      `Johannes Kepler nació en la ciudad de Weil der Stadt (Alemania) el 27/12/1571. En contraparte a Galileo, asistió a la escuela de manera irregular y de los 9 a los 11 años, no sólo dejó la escuela, sino que tuvo que trabajar en el campo, por ende, necesitó el doble del tiempo para terminar la escuela primaria. A los 13 años pudo ingresar a un programa de estudio, donde mostró su inteligencia e ingresó a la Universidad de Tubinga (Alemania), donde se graduó y se matriculó en la Facultad de Teología con la idea de proseguir la carrera eclesiástica. Pero tenía una postura “protestante” ante la fe por lo que, afortunadamente, lo llevó a ser candidato para el puesto de profesor en la cátedra de matemática y astronomía de la Escuela protestante de Gratz (Austria) en abril de 1594.`,
      `Kepler estaba a favor de la cosmología copernicana, había aceptado que el Sol podía estar en el centro del Universo; empezó a preguntarse “por qué había sólo 6 planetas (venus, mercurio, tierra, marte, júpiter y Saturno) y no más”, como así también se preguntaba el “porqué de los valores particulares de las velocidades de los planetas en sus órbitas y las relaciones entre las dimensiones de éstas”; y el sueño de encontrar regularidades matemáticas en la Naturaleza. Luego de un año de su llegada a Gratz (1595), tiene la idea de que el Universo está construido entorno a ciertas figuras simétricas, los “sólidos perfectos o pitagóricos” (tetraedro, cubo, octaedro, dodecaedro e icosaedro), propuso relaciones entre los planetas, las distancias entre las órbitas planetarias y las figuras; que condujeron al nacimiento de la astronomía moderna, las cuales fueron expuestas en su primer libro “Mysterium Cosmographicum” (en 1596).`,
      `En 1600 se junta con Tycho Brahe en Praga, con quien trabaja durante 9 años, estudiando las órbitas y en particular la de Marte; publica en 1609 “Astronomia Nova”, la cual contiene las dos primeras de sus tres Leyes y la tercera aparece en su libro “Harmonice Mundi” (1618). Con estas tres leyes cree que resolvió el problema de los movimientos planetarios.`,
      `Las Tres Leyes: 1) Todos los planetas se mueven entorno al Sol en órbitas elípticas teniendo al Sol en uno de sus focos. 2) Un planeta en su órbita elíptica alrededor del Sol describe o barre áreas iguales en tiempos iguales, es decir que mientras más cerca del Sol se mueve más rápido y viceversa. 3) El cuadrado del periodo, el tiempo que el planeta da alrededor del Sol, es proporcional al cubo de la distancia media del planeta al sol, se deduce rápidamente que mientras más amplia sea su órbita más largo será su periodo.`,
      `Luego se dedica a defender a su madre de la orca (1621), culmina el trabajo que tenía con Tycho Brahe (1627); y para noviembre de 1630 en Ratisbona, Alemania, se enferma y fallece.`
    ]
  }
};

const $ = (id)=> document.getElementById(id);
const modal = $('bio-modal');
const bioTitle = $('bio-title');
const bioSlidesContainer = $('bio-slides-container');
const prevBtn = $('prev-slide');
const nextBtn = $('next-slide');
const counterDiv = $('slide-counter');

let currentSlideIndex = 0;
let totalSlides = 0;

function updateSliderUI() {
    bioSlidesContainer.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    prevBtn.disabled = currentSlideIndex === 0;
    nextBtn.disabled = currentSlideIndex === totalSlides - 1;
    counterDiv.textContent = `${currentSlideIndex + 1} / ${totalSlides}`;
}

function moveSlide(direction) {
    const newIndex = currentSlideIndex + direction;
    if (newIndex >= 0 && newIndex < totalSlides) {
        currentSlideIndex = newIndex;
        updateSliderUI();
    }
}

if(prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => moveSlide(-1));
    nextBtn.addEventListener('click', () => moveSlide(1));
}

document.querySelectorAll('.portrait').forEach(card=>{
  const who = card.dataset.person;
  function openBio(){
    const b = bios[who];
    bioTitle.textContent = b.titulo;
    currentSlideIndex = 0;
    totalSlides = b.texto.length;
    
    bioSlidesContainer.innerHTML = b.texto.map((p, i) => 
        `<div class="bio-slide" data-index="${i}"><p>${p}</p></div>`
    ).join('');

    updateSliderUI(); 
    modal.showModal();
  }
  card.addEventListener('click', openBio);
  card.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBio(); }});
});


// -------- LAB: Galileo (MRUA / Tiro vertical) --------
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
        const { y } = phys(t, g, v0, h0);
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


// ----------------------------------------------------
// -------- LABS EXTRA: Caída Libre y Resistencia al Aire (ACTUALIZADOS)
// ----------------------------------------------------

// Constantes globales para estas dos simulaciones
const G_CONST = 9.8; // Gravedad (m/s^2)
const H0_SIM = 20; // Altura inicial de la simulación (m)
const DT = 1/60; // Intervalo de tiempo (s)
const DRAG_COEFF = 0.05; // Coeficiente de arrastre (Arbitrario, ajusta la resistencia)

// -------- LAB extra: Caída libre de dos masas (ACTUALIZADO) --------
const caidaCanvas = $("canvas-caida");
if (caidaCanvas) {
  const ctxCaida = caidaCanvas.getContext("2d");
  let caidaAnim, tCaida = 0;

  function simularCaida() {
    cancelAnimationFrame(caidaAnim);
    tCaida = 0; // Reinicia el tiempo

    const m1 = parseFloat($("masa1").value) || 10;
    const m2 = parseFloat($("masa2").value) || 1;

    // Cálculo del tiempo de vuelo para determinar el fin de la animación
    const tVuelo = Math.sqrt(2 * H0_SIM / G_CONST);
    const pxPerM = caidaCanvas.height / (H0_SIM + 2); // Escala para dibujar

    function draw() {
      tCaida += DT;

      // Cinemática de caída libre (la misma para ambas masas)
      const ySim_new = H0_SIM - 0.5 * G_CONST * tCaida * tCaida;
      const vSim_new = G_CONST * tCaida;
      const aSim = G_CONST; // Aceleración constante

      const ySim = Math.max(0, ySim_new);
      const vSim = (ySim > 0) ? vSim_new : 0;
      const aDisplay = (ySim > 0) ? aSim : 0; // Aceleración es 0 en el suelo

      const groundY = caidaCanvas.height - 10;
      const yPx1 = groundY - (ySim * pxPerM);
      const yPx2 = groundY - (ySim * pxPerM);

      ctxCaida.clearRect(0, 0, caidaCanvas.width, caidaCanvas.height);
      
      // Dibuja el suelo
      ctxCaida.strokeStyle = 'rgba(255,255,255,.25)';
      ctxCaida.beginPath();
      ctxCaida.moveTo(0, groundY + 0.5);
      ctxCaida.lineTo(caidaCanvas.width, groundY + 0.5);
      ctxCaida.stroke();

      // Objeto 1
      ctxCaida.fillStyle = "#7c89ff";
      ctxCaida.beginPath();
      ctxCaida.arc(100, yPx1, 10 + Math.log(m1 + 1) * 5, 0, 2 * Math.PI);
      ctxCaida.fill();

      // Objeto 2
      ctxCaida.fillStyle = "#ffd166";
      ctxCaida.beginPath();
      ctxCaida.arc(200, yPx2, 5 + Math.log(m2 + 1) * 5, 0, 2 * Math.PI);
      ctxCaida.fill();


      // ACTUALIZACIÓN DE LECTURAS (TODOS LOS DATOS)
      $("tcaida").textContent = tCaida.toFixed(2);
      
      // Objeto 1
      $("ycaida1").textContent = ySim.toFixed(2);
      $("vcaida1").textContent = vSim.toFixed(2);
      $("acaida1").textContent = aDisplay.toFixed(2); 
      
      // Objeto 2
      $("ycaida2").textContent = ySim.toFixed(2);
      $("vcaida2").textContent = vSim.toFixed(2);
      $("acaida2").textContent = aDisplay.toFixed(2);

      if (ySim > 0 && tCaida < tVuelo + DT) {
        caidaAnim = requestAnimationFrame(draw);
      }
    }
    draw();
  }

  $("btn-caida").onclick = simularCaida;
  $("btn-caida-reset").onclick = () => {
    cancelAnimationFrame(caidaAnim);
    ctxCaida.clearRect(0, 0, caidaCanvas.width, caidaCanvas.height);
    // Reinicia las lecturas
    $("tcaida").textContent = "—";
    $("ycaida1").textContent = $("vcaida1").textContent = $("acaida1").textContent = "—";
    $("ycaida2").textContent = $("vcaida2").textContent = $("acaida2").textContent = "—";
  };
}

// -------- LAB extra: Resistencia del aire (ACTUALIZADO) --------

// Función de física para el cálculo dinámico de la aceleración
function updatePhysics(y, v, m, drag) {
    if (y <= 0) return { y: 0, v: 0, a: 0 };
    
    let a = G_CONST; 
    
    if (drag) {
        // Aceleración de resistencia: (k * v^2) / m. Resta de la gravedad.
        const resistanceAccel = DRAG_COEFF * v * v / m; 
        a = G_CONST - resistanceAccel; 
    }
    
    // Integración de Euler simple (cálculo de la posición y velocidad futuras)
    const vNew = v + a * DT;
    const yNew = y - vNew * DT; 
    
    return { 
        y: Math.max(0, yNew), 
        v: Math.max(0, vNew),
        a: a 
    };
}


const aireCanvas = $("canvas-aire");
if (aireCanvas) {
  const ctxAire = aireCanvas.getContext("2d");
  let aireAnim, tAire = 0;

  function simularAire() {
    cancelAnimationFrame(aireAnim);
    tAire = 0;

    let ySim1 = H0_SIM;
    let ySim2 = H0_SIM;
    let vSim1 = 0;
    let vSim2 = 0;
    let aSim1 = G_CONST; 
    let aSim2 = G_CONST;

    const mBola = parseFloat($("masaBola").value) || 10;
    const mPluma = parseFloat($("masaPluma").value) || 0.01;
    const conAire = $("aireToggle").checked;

    const pxPerM = aireCanvas.height / (H0_SIM + 2);
    const groundY = aireCanvas.height - 10;
    
    function draw() {
      tAire += DT;

      // Objeto 1 (Bola)
      const res1 = updatePhysics(ySim1, vSim1, mBola, conAire);
      ySim1 = res1.y;
      vSim1 = res1.v;
      aSim1 = res1.a;

      // Objeto 2 (Pluma)
      const res2 = updatePhysics(ySim2, vSim2, mPluma, conAire);
      ySim2 = res2.y;
      vSim2 = res2.v;
      aSim2 = res2.a;

      // Dibuja
      ctxAire.clearRect(0, 0, aireCanvas.width, aireCanvas.height);

      // Dibuja el suelo
      ctxAire.strokeStyle = 'rgba(255,255,255,.25)';
      ctxAire.beginPath();
      ctxAire.moveTo(0, groundY + 0.5);
      ctxAire.lineTo(aireCanvas.width, groundY + 0.5);
      ctxAire.stroke();

      // Posiciones de dibujo
      const yPx1 = groundY - (ySim1 * pxPerM);
      const yPx2 = groundY - (ySim2 * pxPerM);

      // Objeto 1 (Bola)
      ctxAire.fillStyle = "#7c89ff";
      ctxAire.beginPath();
      ctxAire.arc(100, yPx1, 10 + Math.log(mBola + 1) * 5, 0, 2 * Math.PI);
      ctxAire.fill();

      // Objeto 2 (Pluma)
      ctxAire.fillStyle = "#ffd166";
      ctxAire.beginPath();
      ctxAire.arc(200, yPx2, 5 + Math.log(mPluma + 1) * 5, 0, 2 * Math.PI);
      ctxAire.fill();

      // ACTUALIZACIÓN DE LECTURAS (TODOS LOS DATOS)
      $("taire").textContent = tAire.toFixed(2);
      
      // Objeto 1
      $("yaire1").textContent = ySim1.toFixed(2);
      $("vaire1").textContent = vSim1.toFixed(2);
      $("aaire1").textContent = aSim1.toFixed(2); 
      
      // Objeto 2
      $("yaire2").textContent = ySim2.toFixed(2);
      $("vaire2").textContent = vSim2.toFixed(2);
      $("aaire2").textContent = aSim2.toFixed(2);

      if (ySim1 > 0 || ySim2 > 0) {
        aireAnim = requestAnimationFrame(draw);
      }
    }
    draw();
  }
  
  $("btn-aire").onclick = simularAire;
  $("btn-aire-reset").onclick = () => {
    cancelAnimationFrame(aireAnim);
    ctxAire.clearRect(0, 0, aireCanvas.width, aireCanvas.height);
    // Reinicia las lecturas
    $("taire").textContent = "—";
    $("yaire1").textContent = $("vaire1").textContent = $("aaire1").textContent = "—";
    $("yaire2").textContent = $("vaire2").textContent = $("aaire2").textContent = "—";
  };
}

// -------- EXAMEN (LÓGICA RESTAURADA Y COMPLETA) --------
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
  if (!form || !resultBox) return;

  form.innerHTML = "";
  resultBox.innerHTML = ""; 
  document.getElementById('btn-exam-submit').disabled = false; 

  const pool = [...examQuestions];
  chosenQuestions = []; 
  while(chosenQuestions.length<10 && pool.length>0){
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
  if (!form || !resultBox) return;

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
      const userAnswerText = marked ? marked.parentElement.textContent.trim() : "No respondiste esta pregunta.";

      feedbackHTML += `
        <div class="feedback-item incorrect">
          <p>❌ Pregunta ${i+1}: <strong>${q.q}</strong></p>
          <p class="user-answer">Tu respuesta: <em>${userAnswerText}</em></p>
          <p class="correct-explanation">💡 **Explicación Correcta:** ${q.feedback}</p>
        </div>
      `;
      if (marked) marked.parentElement.classList.add('is-incorrect');
      // Marcar la respuesta correcta en el formulario
      const correctOption = questionElement.querySelector(`input[name=q${i}][value="${q.ans}"]`);
      if (correctOption) {
          correctOption.parentElement.classList.add('is-correct');
      }
    }
  });

  feedbackHTML += `</div>`; 
  
  const feedbackContent = score < chosenQuestions.length ? `
    <p>A continuación se muestran las respuestas incorrectas y la corrección:</p>
    ${feedbackHTML}` : '<p style="color:var(--ok);">¡Felicidades! Respondiste todas las preguntas correctamente. 🎉</p>';


  resultBox.innerHTML = `
    <h4 style="color: ${score >= 6 ? 'var(--ok)' : 'var(--warn)'};">
      Puntuación final: ${score}/${chosenQuestions.length}
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
