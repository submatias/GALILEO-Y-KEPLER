// -------- SPA Tabs & Ink indicator (CÓDIGO INTACTO) --------
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

// -------- Animaciones on-scroll (CÓDIGO INTACTO) --------
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  });
},{ threshold:.12 });
document.querySelectorAll('.reveal').forEach(el=> io.observe(el));

// -------- Biografías (modal) - MODIFICADO CON NUEVOS PARRAFOS --------
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

const modal = document.getElementById('bio-modal');
const bioTitle = document.getElementById('bio-title');
const bioContent = document.getElementById('bio-content');

document.querySelectorAll('.portrait').forEach(card=>{
  const who = card.dataset.person;
  function openBio(){
    const b = bios[who];
    bioTitle.textContent = b.titulo;
    // MODIFICACIÓN: Usar map para generar HTML con un div para cada párrafo
    bioContent.innerHTML = b.texto.map((p, i) => `<div class="bio-slide" data-index="${i}"><p>${p}</p></div>`).join('');
    modal.showModal();
  }
  card.addEventListener('click', openBio);
  card.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBio(); }});
});

// -------- LAB: Galileo (MRUA / Tiro vertical) (CÓDIGO INTACTO) --------
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

// -------- LAB: Kepler (T² = k·a³) + órbita SVG (CÓDIGO INTACTO) --------
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

// -------- LAB extra: Caída libre de dos masas (CÓDIGO INTACTO) --------
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

// -------- LAB extra: Resistencia del aire (CÓDIGO INTACTO) --------
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

// -------- LAB extra: Plano inclinado (CÓDIGO INTACTO) --------
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

// -------- LAB extra: Gráfico de velocidad (CÓDIGO INTACTO) --------
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
  $("btn-grafico-reset").onclick = ()=> ctxGraf.clearRect(0,0,grafCanvas.width,grafGrafico.height);
}

// -------- UX niceties (CÓDIGO INTACTO) --------
function initInkOnce(){ moveInk(); }
window.addEventListener('load', initInkOnce);
window.addEventListener('resize', ()=> {
  // recalcular para retratos al cambiar layout
  moveInk();
});

// -------- Accesibilidad: cerrar modal con ESC (CÓDIGO INTACTO) --------
modal.addEventListener('cancel', (e)=> { e.preventDefault(); modal.close(); });

// -------- EXAMEN - MODIFICADO CON FEEDBACK --------
const examQuestions = [
  {q:"¿Qué demostró Galileo con la caída de los cuerpos?", opts:["Que los más pesados caen más rápido","Que todos caen con la misma aceleración","Que depende del viento"], ans:1, feedback: "La respuesta correcta es **Que todos caen con la misma aceleración**. Galileo demostró que, en ausencia de resistencia del aire, la aceleración de la gravedad es la misma para todos los objetos, independientemente de su masa."},
  {q:"¿Qué instrumento perfeccionó Galileo?", opts:["Microscopio","Telescopio","Barómetro"], ans:1, feedback: "La respuesta correcta es **Telescopio**. Galileo perfeccionó el diseño existente, logrando un aumento significativo, lo que le permitió hacer importantes descubrimientos astronómicos."},
  {q:"¿Qué descubrió Galileo en Júpiter?", opts:["Anillos","Lunas","Nubes"], ans:1, feedback: "La respuesta correcta es **Lunas**. Descubrió las cuatro lunas más grandes de Júpiter (Ío, Europa, Ganimedes y Calisto), que contradecían la idea de que todo orbitaba la Tierra."},
  {q:"¿Qué estudió Galileo en los planos inclinados?", opts:["El movimiento uniformemente acelerado","La gravitación universal","La electricidad"], ans:0, feedback: "La respuesta correcta es **El movimiento uniformemente acelerado**. Los planos inclinados le permitieron 'ralentizar' la caída libre para poder medir con precisión la relación lineal entre la velocidad y el tiempo, una característica de la aceleración uniforme."},
  {q:"¿Qué defendía Galileo sobre el conocimiento?", opts:["El método experimental","La autoridad de Aristóteles","La magia"], ans:0, feedback: "La respuesta correcta es **El método experimental**. Galileo es considerado el padre del método científico por su énfasis en la observación, la experimentación y la matematización de la naturaleza."},
  {q:"¿Qué forma tienen las órbitas planetarias según Kepler?", opts:["Circulares","Elípticas","Rectangulares"], ans:1, feedback: "La respuesta correcta es **Elípticas**. La Primera Ley de Kepler establece que los planetas se mueven en elipses, con el Sol en uno de los focos."},
  {q:"La 2ª ley de Kepler dice:", opts:["Velocidad constante en toda la órbita","Áreas iguales en tiempos iguales","Planetas inmóviles"], ans:1, feedback: "La respuesta correcta es **Áreas iguales en tiempos iguales**. Esta ley implica que los planetas se mueven más rápido cuando están más cerca del Sol (perihelio) y más lento cuando están más lejos (afelio)."},
  {q:"La 3ª ley de Kepler relaciona:", opts:["Periodo y radio","Tiempo y masa","Periodo y semieje mayor"], ans:2, feedback: "La respuesta correcta es **Periodo y semieje mayor**. La Tercera Ley establece que el cuadrado del período orbital ($T^2$) es proporcional al cubo del semieje mayor de la órbita ($a^3$)."},
  {q:"¿Quién proporcionó a Kepler los datos para sus leyes?", opts:["Newton","Copérnico","Tycho Brahe"], ans:2, feedback: "La respuesta correcta es **Tycho Brahe**. Kepler heredó y analizó los precisos datos de observación de Tycho Brahe tras su muerte, lo que fue crucial para formular sus tres leyes."},
  {q:"¿Qué descubrió Kepler sobre Marte?", opts:["Que su órbita es elíptica","Que no gira","Que tiene anillos"], ans:0, feedback: "La respuesta correcta es **Que su órbita es elíptica**. El estudio riguroso de la órbita de Marte fue lo que finalmente llevó a Kepler a abandonar las órbitas circulares y postular su Primera Ley."},
  {q:"¿Qué representa 'g' en la física de Galileo?", opts:["Gravedad","Gas","Galaxia"], ans:0, feedback: "La respuesta correcta es **Gravedad** (o más precisamente, la aceleración debida a la gravedad)."},
  {q:"¿Qué observó Galileo en Venus?", opts:["Manchas","Fases","Nubes"], ans:1, feedback: "La respuesta correcta es **Fases**. Las fases de Venus son similares a las de la Luna, un fenómeno solo posible si Venus orbita el Sol, lo que fue una prueba clave para el heliocentrismo."},
  {q:"¿Qué implican las fases de Venus?", opts:["Prueba del heliocentrismo","Prueba del geocentrismo","Prueba de que Venus no existe"], ans:0, feedback: "La respuesta correcta es **Prueba del heliocentrismo**. La observación de un ciclo completo de fases de Venus es imposible bajo el modelo geocéntrico ptolemaico."},
  {q:"¿Qué midió Galileo con el péndulo?", opts:["El tiempo","La distancia","La velocidad de la luz"], ans:0, feedback: "La respuesta correcta es **El tiempo**. Galileo notó la isocronía del péndulo (periodo constante para oscilaciones pequeñas) y sugirió su uso para medir el tiempo."},
  {q:"¿Qué ley explica la variación de velocidad en la órbita?", opts:["1ª","2ª","3ª"], ans:1, feedback: "La respuesta correcta es **2ª**. La Segunda Ley de Kepler (Áreas iguales) explica que la velocidad orbital varía, siendo máxima en el perihelio y mínima en el afelio."},
  {q:"Kepler era originario de:", opts:["Italia","Alemania","Francia"], ans:1, feedback: "La respuesta correcta es **Alemania**. Kepler nació en la ciudad de Weil der Stadt, que hoy forma parte de Alemania."},
  {q:"¿Qué descubrió Galileo en el Sol?", opts:["Manchas solares","Eclipses","Auroras"], ans:0, feedback: "La respuesta correcta es **Manchas solares**. Las observó y demostró que estaban en la superficie solar, lo que implicaba que el Sol no era una esfera perfecta e inmutable."},
  {q:"¿Qué descubrió Galileo en la Luna?", opts:["Que es lisa","Que tiene montañas y cráteres","Que brilla sola"], ans:1, feedback: "La respuesta correcta es **Que tiene montañas y cráteres**. Esta observación refutó la idea aristotélica de que los cuerpos celestes eran perfectos y lisos."},
  {q:"La constante k en la 3ª ley depende de:", opts:["El sistema central","La masa del planeta","Nada"], ans:0, feedback: "La respuesta correcta es **El sistema central**. La constante $k$ en $T^2 = k \cdot a^3$ depende de la masa del cuerpo central (como el Sol en nuestro sistema solar)."},
  {q:"Galileo nació en:", opts:["1564","1571","1642"], ans:0, feedback: "La respuesta correcta es **1564**. Nació en Pisa, Italia, en ese año."}
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
      const isCorrect = marked && parseInt(marked.value)===q.ans; // <-- Obtiene si es correcto

      if(isCorrect) score++;
      
      const questionDiv = form.querySelector(`.question:nth-child(${i+1})`);
      if(questionDiv) {
        let prevFeedback = questionDiv.querySelector('.exam-feedback');
        if (prevFeedback) prevFeedback.remove();

        const fb = document.createElement('p');
        fb.className = 'exam-feedback';
        fb.style.marginTop = '.5rem';
        fb.style.padding = '.5rem';
        fb.style.borderRadius = '8px';
        fb.style.border = isCorrect ? '1px solid var(--ok)' : '1px solid var(--warn)';
        fb.style.background = isCorrect ? 'rgba(91, 228, 168, 0.1)' : 'rgba(255, 209, 102, 0.1)';
        fb.style.color = isCorrect ? 'var(--ok)' : 'var(--warn)';
        // Se añade la oración de feedback
        fb.innerHTML = isCorrect ? `✅ ¡Correcto! Buen trabajo.` : `❌ Incorrecto. ${q.feedback}`;
        questionDiv.appendChild(fb);
      }
    });
    resultBox.textContent = `Tu puntuación: ${score}/10`;
    resultBox.style.color = score>=6 ? "var(--ok)" : "var(--warn)";
  };

  document.getElementById('btn-exam-reset').onclick = initExam;
}

// iniciar examen al entrar a la pestaña
document.querySelector('[data-route="examen"]').addEventListener('click', initExam);

// -------- Integración de IA con Gemini (CÓDIGO INTACTO) --------
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
