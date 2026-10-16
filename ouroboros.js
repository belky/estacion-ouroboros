'use strict';
// ================================================================
//  ESTACIÓN OUROBOROS — Motor de aventura conversacional v2.1
//  VampireBBS 2026 · Género: Ciencia ficción / Terror cósmico
//  Mejoras: typewriter · audio · BBS boot · guardar/cargar ·
//           transcripción · easter eggs · glitch · velocidad
// ================================================================

// ── Velocidad de texto (typewriter) ──────────────────────────
let typeSpeed = 10; // ms/char — default NORMAL (~1200 baud feel)
let bootMode  = true; // durante boot: todo texto es instantáneo

// ── Estado global ─────────────────────────────────────────────
const S = {
  room: 'acoplamiento',
  inv: new Set(['tableta']),
  worn: new Set(),
  flags: {
    energiaOk: false, generadorCargado: false, traje: false,
    labAbierta: false, aisl: false, habloCrew: false,
    leyoSilva: false, leyoCapitan: false, leyoOkafor: false,
    radioVistas: 0, finalHecho: false,
    leyoChen: false, leyoPark: false, leyoAndrade: false,
    linternaUV: false, pizarraRevelada: false, huecoExaminado: false,
    frecuenciaSintonizada: false, chenLog: false,
    leyoCapitanAntes: false,
    moduladorCalibrado: false
  },
  visited: new Set(),
  score: 0,
  turns: 0,
  history: [], histIdx: 0
};
const MAXSCORE = 150;

// ── Sistema de audio — Web Audio API ─────────────────────────
let audioCtx = null, droneGain = null;

function initAudio() {
  if (audioCtx) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    osc1.type = 'sine'; osc1.frequency.value = 74;
    osc2.type = 'sine'; osc2.frequency.value = 111;
    const lfo = audioCtx.createOscillator();
    const lfoAmt = audioCtx.createGain();
    lfo.frequency.value = 3.7; lfoAmt.gain.value = 0.4;
    lfo.connect(lfoAmt);
    const mix = audioCtx.createGain(); mix.gain.value = 0.5;
    osc1.connect(mix); osc2.connect(mix);
    droneGain = audioCtx.createGain(); droneGain.gain.value = 0;
    lfoAmt.connect(droneGain.gain);
    mix.connect(droneGain);
    droneGain.connect(audioCtx.destination);
    osc1.start(); osc2.start(); lfo.start();
  } catch(e) { audioCtx = null; }
}

function setDrone(vol, ramp = 2.0) {
  if (!audioCtx || !droneGain) return;
  droneGain.gain.setTargetAtTime(vol, audioCtx.currentTime, ramp);
}

function playBootSound() {
  try {
    const c = new AudioContext();
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = 'square'; g.gain.value = 0.06;
    const t = c.currentTime;
    o.frequency.setValueAtTime(1200, t);
    o.frequency.exponentialRampToValueAtTime(700, t + 0.15);
    o.frequency.exponentialRampToValueAtTime(2400, t + 0.32);
    o.frequency.exponentialRampToValueAtTime(600, t + 0.52);
    o.frequency.exponentialRampToValueAtTime(1800, t + 0.68);
    g.gain.linearRampToValueAtTime(0, t + 0.85);
    o.start(); o.stop(t + 0.85);
    setTimeout(() => c.close(), 1000);
  } catch(e) {}
}

// ── Cola de impresión — typewriter ─────────────────────────
const printQueue = [];
let printBusy = false;
let animGen = 0;
const out = document.getElementById('out');
const scEl = document.getElementById('sc');

// Clases que se animan (solo si el texto es plain — sin '<')
const ANIM_CLASSES = new Set(['desc','ok','warn','bad']);

function pr(t, cls) {
  const el = {t: t == null ? '' : String(t), cls: cls || ''};
  printQueue.push(el);
  if (!printBusy) drainQueue();
}

function prDelay(ms) {
  printQueue.push({_delay: ms});
  if (!printBusy) drainQueue();
}

function drainQueue() {
  if (!printQueue.length) { printBusy = false; return; }
  printBusy = true;
  const item = printQueue.shift();

  // Delay marker
  if (item._delay != null) { setTimeout(drainQueue, item._delay); return; }
  // Start-game marker
  if (item._startGame) { printBusy = false; inicio(); return; }

  const {t, cls} = item;
  const d = document.createElement('div');
  d.className = 'line' + (cls ? ' ' + cls : '');
  d._fullText = t;
  d._isHtml   = t.includes('<');
  out.appendChild(d);
  out.scrollTop = out.scrollHeight;

  const instant = bootMode || typeSpeed === 0 || !t ||
    d._isHtml || !ANIM_CLASSES.has(cls);

  if (instant) {
    d.innerHTML = t;
    out.scrollTop = out.scrollHeight;
    setTimeout(drainQueue, 0);
    return;
  }

  // Typewriter
  d.classList.add('typing');
  const gen = ++animGen;
  let i = 0;
  function step() {
    if (animGen !== gen) return; // flushed — stop
    if (i >= t.length) {
      d.classList.remove('typing');
      setTimeout(drainQueue, 0);
      return;
    }
    d.textContent += t[i++];
    out.scrollTop = out.scrollHeight;
    setTimeout(step, typeSpeed);
  }
  step();
}

function flushQueue() {
  animGen++; // detiene la animación en curso
  // Completar el elemento parcialmente animado
  out.querySelectorAll('.line').forEach(d => {
    if (d._fullText != null && d.textContent !== d._fullText) {
      if (d._isHtml) d.innerHTML = d._fullText;
      else d.textContent = d._fullText;
      d.classList.remove('typing');
    }
  });
  // Volcar el resto de la cola instantáneamente
  let startGame = false;
  while (printQueue.length) {
    const item = printQueue.shift();
    if (item._delay != null) continue;
    if (item._startGame) { startGame = true; continue; }
    const d2 = document.createElement('div');
    d2.className = 'line' + (item.cls ? ' ' + item.cls : '');
    d2.innerHTML = item.t;
    out.appendChild(d2);
  }
  out.scrollTop = out.scrollHeight;
  printBusy = false;
  if (startGame) inicio();
}

function blank() { pr(''); }
function sep()   { pr('─'.repeat(60), 'sep'); }
function pts(n, why) {
  if (n <= 0) return;
  S.score = Math.min(MAXSCORE, S.score + n);
  scEl.textContent = S.score;
  pr(`[+${n} pts: ${why}]`, 'dim');
}

// ── Rooms ──────────────────────────────────────────────────────
const ROOMS = {
  acoplamiento: {
    name: 'Módulo de Acoplamiento',
    desc() {
      return `La manga de acoplamiento termina aquí. Tres metros de diámetro, metal cubierto de escarcha —la estación lleva días sin calefacción—. Las luces de emergencia naranja pulsan en el suelo. Un ojo de buey muestra el negro absoluto del espacio y, en el horizonte, la Tierra: una canica azul que no sabe nada de esto.\n\nHay una linterna de trabajo naranja junto a la escotilla. Al norte, el pasillo principal.`;
    },
    exits: { norte: 'pasillo' },
    items: ['linterna']
  },

  pasillo: {
    name: 'Pasillo Central',
    desc() {
      const lab = S.flags.labAbierta ? 'Al norte, el laboratorio (puerta abierta).' : 'Al norte, el laboratorio —puerta sellada, indicador rojo—.';
      return `Un tubo metálico de veinte metros. Las paredes van forradas de macarrón de cables con quemaduras recientes. Hay una mancha marrón en el suelo que sigues con los ojos sin querer: va en dirección norte.\n\nSalidas: sur (acoplamiento), este (comunicaciones), oeste (camarotes), arriba (puente de mando). ${lab}`;
    },
    exits: {
      sur: 'acoplamiento', este: 'comunicaciones', oeste: 'camarotes', arriba: 'puente',
      norte() { return S.flags.labAbierta ? 'laboratorio' : null; }
    },
    items: []
  },

  comunicaciones: {
    name: 'Sala de Comunicaciones',
    desc() {
      const eq = S.flags.energiaOk
        ? 'Las pantallas han cobrado vida. Una forma de onda ocupa la central: regular, matemática, imposiblemente bella. Cuanto más la miras, más sientes que está tratando de decirte algo. Puedes SINTONIZAR la señal o REPRODUCIR el último registro de audio.'
        : 'Un cuarto atestado de equipos muertos. Sin energía, nada funciona.';
      return `${eq}\n\nEn la pared, escrito con rotulador negro cada vez más grande: APAGADLO. APAGADLO. APAGADLO. Debajo, más pequeño: «Si lo escuchas, ya es tarde. Lo siento. —K.S.»\n\nAl oeste, el pasillo.`;
    },
    exits: { oeste: 'pasillo' },
    items: ['consola_com', 'diario_chen']
  },

  camarotes: {
    name: 'Camarotes',
    desc() {
      return 'Seis literas en tres niveles. Placas: KOWALSKI · OKAFOR · CHEN · SILVA · PARK · ANDRADE. Todas las camas están hechas —nadie hace la cama antes de una crisis—. En la litera de Silva asoma algo bajo la almohada.\n\nAl este, el pasillo.';
    },
    exits: { este: 'pasillo' },
    items: ['diario_silva', 'tarjeta_amarilla']
  },

  puente: {
    name: 'Puente de Mando',
    desc() {
      const e = S.flags.energiaOk
        ? 'El puente ha cobrado vida. Registros de vuelo, telemetría, sistemas de navegación. Todo parece normal salvo el registro del día tres: el capitán Kowalski desactivó manualmente el transmisor de emergencia. Desde dentro. Deliberadamente.'
        : 'El puente está en oscuridad casi total. Sin energía no puedes hacer nada aquí salvo mirar las estrellas por el ojo de buey.';
      return `${e}\n\nAbajo, el pasillo.`;
    },
    exits: { abajo: 'pasillo' },
    items: ['diario_capitan'],
    onEnter() {
      if (S.flags.energiaOk && !S.visited.has('puente')) pts(10, 'alcanzaste el puente de mando operativo');
    }
  },

  laboratorio: {
    name: 'Laboratorio de Xenofísica',
    desc() {
      const piz = S.flags.pizarraRevelada
        ? 'ORIGEN: EXTERIOR A LA HELIOSFERA · ANTIGÜEDAD: >4.000.000 AÑOS · PROPÓSITO: DOMINAR. ASIMILAR. PERSISTIR. POR ENCIMA DE TODA BARRERA ELECTROMAGNÉTICA.'
        : 'ORIGEN: EXTERIOR A LA HELIOSFERA · ANTIGÜEDAD: >4.000.000 AÑOS · PROPÓSITO: [BORRADO CON TINTA NEGRA]';
      const hueco = S.flags.huecoExaminado ? '' : ' Bajo el panel de trabajo hay un hueco de mantenimiento oscuro.';
      return `Paredes cubiertas de pizarras con ecuaciones y espectros de señal. La silla de Okafor girada hacia la pantalla apagada.\n\nEn la pizarra: ${piz}${hueco}\n\nSalidas: sur (pasillo), norte (módulo de vida). Al este, una puerta con lector rojo.`;
    },
    exits: {
      sur: 'pasillo', norte: 'vida',
      este() { return S.flags.aisl ? 'aislamiento' : null; }
    },
    items: ['diario_okafor', 'frasco', 'tarjeta_roja']
  },

  vida: {
    name: 'Módulo de Vida',
    desc() {
      return 'Recicladores de aire, depósitos de agua, filtros CO₂. El corazón biológico de la estación, funcionando en modo de emergencia —por eso el aire es respirable—. El suelo está cubierto de marcas de arrastre hacia el norte. Seis pares de botas.\n\nSalidas: sur (laboratorio), este (almacén), norte (sala de máquinas).';
    },
    exits: { sur: 'laboratorio', este: 'almacen', norte: 'maquinas' },
    items: ['diario_andrade']
  },

  almacen: {
    name: 'Almacén',
    desc() {
      return 'Estanterías metálicas con repuestos, raciones de emergencia, equipo técnico. Huele a sellante de vacío y a algo que no debería oler así en el espacio.\n\nAl oeste, el módulo de vida.';
    },
    exits: { oeste: 'vida' },
    items: ['celda_energia', 'kit_rep', 'diario_park', 'filtro_uv']
  },

  maquinas: {
    name: 'Sala de Máquinas',
    desc() {
      let gen;
      if (S.flags.energiaOk) gen = 'funcionando, un zumbido grave y constante.';
      else if (S.flags.generadorCargado) gen = 'celda insertada, listo para activar (ACTIVAR GENERADOR).';
      else gen = 'apagado. Palanca en MANUAL-APAGADO. Necesita celda de energía.';
      return `Generadores, propulsores de actitud, disipadores de calor. El generador principal: ${gen}\n\nLas marcas del módulo de vida siguen aquí. Hay algo húmedo que reluce bajo la luz naranja.\n\nSalidas: sur (módulo de vida), norte (esclusa EVA).`;
    },
    exits: { sur: 'vida', norte: 'esclusa' },
    items: ['generador']
  },

  esclusa: {
    name: 'Esclusa EVA',
    desc() {
      const t = S.flags.traje
        ? 'El traje EVA está reparado y listo para usar.'
        : 'El traje EVA cuelga de su soporte con un corte diagonal de diez centímetros en el torso —deliberado, hecho con algo afilado—. Ponértelo así sería suicidio.';
      return `La antecámara de salida al exterior. ${t}\n\nAl norte, la compuerta hacia el espacio. Al sur, la sala de máquinas.`;
    },
    exits: { sur: 'maquinas' },
    items: ['traje_eva']
  },

  exterior: {
    name: 'El Exterior — Antena Principal',
    desc() {
      return 'El vacío. Flotas amarrada a la estación por un cable de seguridad. El sol es una moneda brillante. La Tierra, azul y frágil. La antena principal —veinte metros de estructura desplegable— apunta hacia el exterior del sistema solar.\n\nEl panel de control está en la base. Dos botones, cubiertas levantadas:\n\nROJO: CORTAR TRANSMISIÓN — Desconecta la antena.\nVERDE: AMPLIFICAR ×1000 — Retransmite hacia la Tierra.\n\nAl sur, la esclusa.';
    },
    exits: { sur: 'esclusa' },
    items: ['panel_antena'],
    onEnter() {
      if (!S.visited.has('exterior')) pts(10, 'alcanzaste la antena exterior');
    }
  },

  aislamiento: {
    name: 'Sala de Aislamiento',
    desc() {
      const mod = S.flags.moduladorCalibrado && S.inv.has('modulador_em')
        ? '\n\nEl modulador EM en tu mano emite un leve zumbido.' : '';
      return `Octogonal. Paredes de material absorbente de ondas EM. En el centro, seis sillas en círculo. En cada silla: lo que queda de la tripulación.\n\nPerfectamente quietos. Ojos abiertos. Sus labios se mueven en sincronía. Cuando entras, los seis giran la cabeza hacia ti al mismo tiempo.\n\nEntonces la oyes. Sin auriculares. Sin equipos. La Señal emana de ellos.\n\n«Mara», dicen al unísono. «Lo estábamos esperando.»${mod}\n\nAl oeste, el laboratorio.`;
    },
    exits: { oeste: 'laboratorio' },
    items: ['tripulacion'],
    onEnter() {
      if (!S.visited.has('aislamiento')) pts(20, 'encontraste a la tripulación');
    }
  }
};

// ── Items ──────────────────────────────────────────────────────
const ITEMS = {
  tableta: {
    name: 'tableta de misión', portable: true, location: 'INV',
    nouns: ['tableta','tablet'],
    desc: 'Tu tableta de misión, pantalla rayada. Briefing: «Investigar silencio Estación Ouroboros (L4-Sol). Tripulación de 6. 72 horas sin contacto. Clasificación: ROJO.»'
  },
  linterna: {
    name: 'linterna', portable: true, location: 'acoplamiento',
    nouns: ['linterna'],
    desc() {
      return S.flags.linternaUV
        ? 'Linterna con filtro UV instalado. Emite luz ultravioleta —ideal para revelar tintas invisibles—.'
        : 'Linterna de trabajo naranja con el logo de la AEE. Tiene baterías.';
    }
  },

  // ── Diarios originales ────────────────────────────────────
  diario_silva: {
    name: 'diario de Silva', portable: true, location: 'camarotes',
    nouns: ['diario','cuaderno','libreta','diario de silva','cuaderno de silva'],
    desc: 'Un cuaderno de piel marrón. Nombre en la tapa: K. SILVA, Médico de Misión. Las últimas páginas están arrugadas, la tinta corrida.',
    read() {
      if (S.flags.leyoSilva) { pr('Ya lo has leído.', 'hint'); return; }
      S.flags.leyoSilva = true;
      pts(15, 'leíste el diario de Silva');
      blank(); pr('── DIARIO DE LA DRA. KATARZYNA SILVA ──', 'big'); blank();
      pr('<em>Día 1 de la anomalía:</em> El Dr. Okafor detectó una señal de origen desconocido. La analicé como ruido de fondo. Error mío.', 'desc');
      pr('<em>Día 2:</em> Okafor lleva doce horas con auriculares. Dice que «tiene sentido cuando la escuchas de cerca». Le prescribí descanso. No ha dormido.', 'desc');
      pr('<em>Día 3:</em> Chen y Park también la escuchan. Hay algo en la frecuencia que interfiere con los ritmos cerebrales theta. Lo sé. Y aun así YO TAMBIÉN LA ESCUCHO y tiene razón, hay algo, una presencia, una—', 'desc');
      pr('<em>Día 3 (más tarde):</em> Aquí la tarjeta amarilla para el lab. No entres en el lab. Usa la tarjeta para abrir la Sala de Aislamiento. Entra. Únete a nosotros. No hay palabras para lo que somos ahora. No hay necesidad de tenerlas.', 'desc');
      pr('<em>[La última línea está escrita al revés. Tardas un momento: APAGADLO O ÚNETE.]</em>', 'warn');
    }
  },
  tarjeta_amarilla: {
    name: 'tarjeta amarilla', portable: true, location: 'camarotes',
    nouns: ['tarjeta amarilla','tarjeta'],
    desc: 'Tarjeta de acceso nivel 2, color amarillo. Nombre: DRA. K. SILVA. Nota pegada: «Lab. Úsala bien.»'
  },
  diario_capitan: {
    name: 'diario del capitán', portable: true, location: 'puente',
    nouns: ['diario','libreta','diario del capitan','libreta de vuelo','registro','kowalski'],
    desc: 'Libreta de vuelo del Capitán Aleksander Kowalski. Tapa negra, papel de alta calidad.',
    read() {
      if (S.flags.leyoCapitan) { pr('Ya lo has leído.', 'hint'); return; }
      S.flags.leyoCapitan = true;
      pts(15, 'leíste el diario del capitán');
      blank(); pr('── REGISTRO DE VUELO — CAPITÁN KOWALSKI ──', 'big'); blank();
      pr('<em>Entrada 849:</em> No dormí bien. La frecuencia de la señal —3,7 kHz, patrón fractal— se me ha quedado en la cabeza. Bonita. Ordenada. Como el cosmos debería ser pero no es.', 'desc');
      pr('<em>Entrada 850:</em> Escuchamos juntos. Los seis. Tres horas. Como si el universo te susurrara tu propio nombre y fuera exactamente correcto.', 'desc');
      pr('<em>Entrada 851:</em> Vamos a la Sala de Aislamiento. Silva dice que es seguro. Ya no estoy seguro de que Silva sea solo Silva.', 'desc');
      pr('<em>Entrada 852 (última):</em> Si lees esto: la tarjeta roja está en el lab, bajo el panel de Okafor. <strong>No entres en la Sala de Aislamiento.</strong> No no no no no—', 'desc');
      // El capitán revela dónde está la tarjeta aunque no se haya examinado el hueco
      if (ITEMS.tarjeta_roja.location === 'hidden_lab') {
        ITEMS.tarjeta_roja.location = 'laboratorio';
        blank(); pr('<em>[La entrada menciona la tarjeta roja. Ahora sabes dónde buscar.]</em>', 'hint');
      }
      if (S.flags.habloCrew) {
        blank();
        pr('«No no no no no—»', 'warn');
        pr('Lo dijeron frente a ti. Usando su voz. Sabían exactamente qué significaban esas palabras y eligieron decirlas de todas formas.', 'dim');
      }
    }
  },
  diario_okafor: {
    name: 'notas de Okafor', portable: true, location: 'laboratorio',
    nouns: ['notas','papeles','notas de okafor','diario de okafor'],
    desc: 'Una pila de folios impresos y anotados. Las últimas páginas son casi ilegibles.',
    read() {
      if (S.flags.leyoOkafor) { pr('Ya lo has leído.', 'hint'); return; }
      S.flags.leyoOkafor = true;
      pts(20, 'leíste las notas de Okafor');
      blank(); pr('── NOTAS DE CAMPO — DR. EMMANUEL OKAFOR ──', 'big'); blank();
      pr('<em>Hora 0:</em> Señal a las 03:14 UTC. Amplitud consistente. Origen: heliosfera exterior.', 'desc');
      pr('<em>Hora 14:</em> La señal repite un patrón de 144 unidades. 144 es 12². La base 12 es universal.', 'desc');
      pr('<em>Hora 31:</em> Tres capas. Superficial: matemática, un saludo. Media: biológica, casi un EEG. Profunda: no tengo categorías mentales para describirla.', 'desc');
      pr('<em>Hora 47:</em> La capa biológica resuena con ondas theta cerebrales. Cuando la escuchas a cierta frecuencia, algo se abre. No en la señal. En ti.', 'desc');
      pr('<em>Hora 52 (última nota coherente):</em> Vamos a la Sala de Aislamiento. Si lees esto y no quieres unirte: el generador está en la sala de máquinas. La celda de energía, en el almacén. El traje EVA necesita el kit de reparación. La antena exterior amplifica la señal.', 'desc');
      pr('<strong>La antena exterior también puede silenciarla.</strong>', 'warn');
      pr('<em>Tú decides.</em>', 'dim');
      blank();
      pr('<em>[Al margen, letra casi ilegible:]</em> El modulador EM que diseñé está en el hueco del panel de trabajo. Calibrarlo a la frecuencia exacta de la señal podría interrumpir la conexión biológica. No sé qué le pasaría al conectado. Ojalá no haya que descubrirlo. —E.O.', 'hint');
    }
  },

  // ── Diarios nuevos (Expansión 1) ─────────────────────────
  diario_chen: {
    name: 'diario de Chen', portable: true, location: 'comunicaciones',
    nouns: ['diario de chen','cuaderno de chen','notas de chen','bloc','chen'],
    desc: 'Un bloc de notas de plástico duro. Nombre grabado: H. CHEN, Técnico de Comunicaciones.',
    read() {
      if (S.flags.leyoChen) { pr('Ya lo has leído.', 'hint'); return; }
      S.flags.leyoChen = true;
      pts(5, 'leíste el diario de Chen');
      blank(); pr('── DIARIO DE H. CHEN — TÉCNICO DE COMUNICACIONES ──', 'big'); blank();
      pr('<em>Día 0 de la anomalía:</em> Señal detectada a las 03:14. Okafor ya está encima de mí. Dice que podría ser «la primera vez». Le pregunto la primera vez de qué. No me responde.', 'desc');
      pr('<em>Día 1:</em> 144 frecuencias entrelazadas en patrón fractal base-12. Nunca he visto nada igual. Nadie en la historia de la humanidad ha visto nada igual. La frase suena exagerada. No lo es.', 'desc');
      pr('<em>Día 2:</em> La escucho constantemente. No porque tenga que hacerlo. Porque quiero. Es como cuando escuchas música perfecta y tienes la certeza de que era exactamente lo que necesitabas escuchar. Solo que multiplicado por todo lo que existe.', 'desc');
      pr('<em>Día 3 (última entrada):</em> Vamos a la sala de aislamiento. Todos juntos. Si alguien encuentra esto: no tengas miedo. Es lo más hermoso que he experimentado en cuarenta y dos años de vida.', 'desc');
    }
  },
  diario_park: {
    name: 'diario de Park', portable: true, location: 'almacen',
    nouns: ['diario de park','cuaderno de park','notas de park','libreta de park','park'],
    desc: 'Libreta de campo con encuadernación espiral. Nombre en la tapa: J. PARK, Ingeniero de Sistemas.',
    read() {
      if (S.flags.leyoPark) { pr('Ya lo has leído.', 'hint'); return; }
      S.flags.leyoPark = true;
      pts(5, 'leíste el diario de Park');
      blank(); pr('── DIARIO DE J. PARK — INGENIERO DE SISTEMAS ──', 'big'); blank();
      pr('<em>Día 0:</em> Okafor está obsesionado con la señal. Yo tengo trabajo real: los disipadores del módulo tres llevan dos semanas con una microavería.', 'desc');
      pr('<em>Día 1:</em> La escuché una hora para quitarme a Okafor de encima. Tiene... algo. Una estructura que parece tener intención. O quizá llevamos ocho meses en el espacio y la mente busca patrones donde no los hay.', 'desc');
      pr('<em>Día 2:</em> Rajé el traje EVA de la esclusa. Sé que está mal. Pero si alguien viene a investigar no podía permitir que saliera a cortar la antena. No cuando queda tan poco para entenderla del todo.', 'warn');
      pr('<em>Día 2 (más tarde):</em> Entiendo que eso suena a lavado de cerebro. Pero es lo contrario. Por primera vez en mi vida entiendo exactamente por qué hago lo que hago y lo que significa.', 'desc');
      pr('<em>Día 3:</em> Me equivoqué sobre lo que significa «entender». No era el principio del proceso. Era el final.', 'dim');
    }
  },
  diario_andrade: {
    name: 'diario de Andrade', portable: true, location: 'vida',
    nouns: ['diario de andrade','cuaderno de andrade','notas de andrade','andrade'],
    desc: 'Cuaderno con cubierta de tela verde. Nombre: M. ANDRADE, Bióloga de Misión.',
    read() {
      if (S.flags.leyoAndrade) { pr('Ya lo has leído.', 'hint'); return; }
      S.flags.leyoAndrade = true;
      pts(5, 'leíste el diario de Andrade');
      blank(); pr('── DIARIO DE M. ANDRADE — BIÓLOGA DE MISIÓN ──', 'big'); blank();
      pr('<em>Día +1:</em> La señal emite en torno a 3,7 kHz, el rango de las ondas theta cerebrales durante meditación profunda. Teóricamente, una exposición prolongada produciría sincronización neuronal entre oyentes. Teóricamente.', 'desc');
      pr('<em>Día +2:</em> Los seis tenemos los mismos sueños. Algo que mira desde el borde del sistema solar. Inmensamente paciente. Inmensamente viejo. En el sueño no da miedo. Se siente como volver a casa.', 'desc');
      pr('<em>Día +3:</em> Soy bióloga. He dedicado mi vida a estudiar la vida en todas sus formas. Esta es la más extraordinaria que he encontrado. Una mente de cuatro millones de años que viajó hasta aquí para invitarnos. ¿Cómo podría declinar?', 'desc');
      pr('<em>Última línea:</em> Nos vemos adentro.', 'dim');
    }
  },

  // ── Objetos puzzle (Expansiones 2 y 5) ───────────────────
  filtro_uv: {
    name: 'filtro ultravioleta', portable: true, location: 'almacen',
    nouns: ['filtro','filtro uv','filtro ultravioleta','uv'],
    desc: 'Un filtro de lente UV estándar para cámaras y equipos ópticos. Encajaría en una linterna de trabajo.'
  },
  modulador_em: {
    name: 'modulador EM', portable: true, location: 'hidden_lab',
    nouns: ['modulador','modulador em','dispositivo','aparato','prototipo'],
    desc() {
      return S.flags.moduladorCalibrado
        ? 'Modulador electromagnético calibrado a 3,7 kHz —la frecuencia exacta de la Señal—. Listo para su uso.'
        : 'Modulador electromagnético portátil, generador de interferencias de frecuencia variable. Prototipo de Okafor. Necesita calibración a la frecuencia exacta de la Señal.';
    }
  },

  // ── Objetos restantes ─────────────────────────────────────
  frasco: {
    name: 'frasco de pastillas', portable: true, location: 'laboratorio',
    nouns: ['frasco','pastillas','medicinas'],
    desc: 'Frasco de ansiolíticos. De Okafor. Vacío. Nota pegada: «No necesito esto. La señal calma mejor que cualquier fármaco.»'
  },
  tarjeta_roja: {
    name: 'tarjeta roja', portable: true, location: 'hidden_lab',
    nouns: ['tarjeta roja'],
    desc: 'Tarjeta de acceso nivel 3, color rojo. Nombre: DR. E. OKAFOR. Reverso: una sola palabra en tinta permanente: ADENTRO.'
  },
  celda_energia: {
    name: 'celda de energía', portable: true, location: 'almacen',
    nouns: ['celda','celda de energia','bateria','energia'],
    desc: 'Celda de energía estándar de la AEE. Completamente cargada. Suficiente para arrancar el generador principal.'
  },
  kit_rep: {
    name: 'kit de reparación EVA', portable: true, location: 'almacen',
    nouns: ['kit','kit de reparacion','herramientas','parches'],
    desc: 'Parches sellantes, resina de vacío, pistola de calor en miniatura. Suficiente para reparar un traje dañado.'
  },
  traje_eva: {
    name: 'traje EVA', portable: true, wearable: true, location: 'esclusa',
    nouns: ['traje','traje eva','traje espacial'],
    desc() {
      return S.flags.traje
        ? 'El traje EVA está reparado y listo para usar en el exterior.'
        : 'Traje EVA blanco con el logo de la AEE. Tiene un corte diagonal de diez centímetros en el torso —deliberado—. Así no puedes ponértelo.';
    }
  },
  consola_com: {
    name: 'consola de comunicaciones', portable: false, location: 'comunicaciones',
    nouns: ['consola','consola de comunicaciones','pantallas','terminal','equipos'],
    desc() {
      return S.flags.energiaOk
        ? 'La forma de onda llena la pantalla principal. Puedes SINTONIZAR la señal o REPRODUCIR el último registro de audio.'
        : 'La consola está apagada. Sin energía no puedes hacer nada.';
    }
  },
  generador: {
    name: 'generador principal', portable: false, location: 'maquinas',
    nouns: ['generador','generador principal','palanca'],
    desc() {
      if (S.flags.energiaOk) return 'El generador funciona. Zumbido grave y constante.';
      if (S.flags.generadorCargado) return 'La celda está insertada. Lista para activarse.';
      return 'Generador principal, apagado. Palanca en MANUAL-APAGADO. Necesita una celda de energía.';
    }
  },
  tripulacion: {
    name: 'la tripulación', portable: false, location: 'aislamiento',
    nouns: ['tripulacion','crew','kowalski','okafor','silva','chen','park','andrade','personas','gente'],
    desc: 'Los seis. Perfectamente quietos. Sus ojos tienen una luminosidad interior que no debería existir. Te miran sin parpadear.'
  },
  panel_antena: {
    name: 'panel de control de la antena', portable: false, location: 'exterior',
    nouns: ['panel','panel de antena','antena','boton rojo','boton verde','boton'],
    desc: 'Dos botones con cubierta levantada. Rojo: CORTAR. Verde: AMPLIFICAR ×1000. No hay vuelta atrás en ninguno de los dos.'
  }
};

// ── Utilidades de mundo ────────────────────────────────────────
const HIDDEN_ITEMS = new Set(['consola_com','generador','tripulacion','panel_antena','modulador_em']);

function itemsEnRoom(room) {
  return Object.entries(ITEMS).filter(([,v]) => v.location === room).map(([k]) => k);
}
function findItem(noun, where) {
  noun = noun.toLowerCase().trim();
  for (const [key, item] of Object.entries(ITEMS)) {
    const inScope = where === 'any'
      ? (item.location === S.room || S.inv.has(key) || S.worn.has(key))
      : where === 'room' ? item.location === S.room
      : where === 'inv'  ? (S.inv.has(key) || S.worn.has(key))
      : false;
    if (!inScope) continue;
    const nouns = Array.isArray(item.nouns) ? item.nouns : [];
    if (nouns.some(n => noun === n || noun.includes(n) || n.includes(noun))) return key;
  }
  return null;
}

// ── Mostrar sala ───────────────────────────────────────────────
const DRONE_VOLS = {comunicaciones: 0.03, aislamiento: 0.07, exterior: 0.01};

function showRoom(force) {
  const r = ROOMS[S.room];
  const first = !S.visited.has(S.room);
  if (first && r.onEnter) r.onEnter();
  if (!first && !force) return;
  S.visited.add(S.room);

  // Audio drone por sala
  if (S.flags.energiaOk) setDrone(DRONE_VOLS[S.room] || 0);

  blank();
  pr(r.name.toUpperCase(), 'loc');
  pr(typeof r.desc === 'function' ? r.desc() : r.desc, 'desc');

  const vis = itemsEnRoom(S.room).filter(k => !HIDDEN_ITEMS.has(k));
  if (vis.length) {
    blank(); pr('Puedes ver aquí: ' + vis.map(k => ITEMS[k].name).join(', ') + '.', 'hint');
  }
  if (S.room === 'laboratorio' && S.flags.huecoExaminado && ITEMS.modulador_em.location === 'laboratorio') {
    blank(); pr('En el suelo, junto al panel: modulador EM (prototipo).', 'hint');
  }
}

// ── Parser ─────────────────────────────────────────────────────
const DIRS = {
  norte:['norte','n'], sur:['sur','s'], este:['este','e'], oeste:['oeste','o'],
  arriba:['arriba','subir','sube','up'], abajo:['abajo','bajar','baja','down']
};
function parseDir(t) {
  for (const [d, syns] of Object.entries(DIRS)) if (syns.includes(t)) return d;
  return null;
}

function exec(raw) {
  if (!raw.trim()) return;
  S.turns++;
  pr('> ' + raw, 'cmd');
  const t = raw.toLowerCase().trim().replace(/[.,!?]/g,'');
  const words = t.split(/\s+/);
  const verb = words[0];
  const rest = words.slice(1).join(' ');

  const dir = parseDir(verb) || (words.length === 1 ? null : parseDir(t));
  if (dir) return goDir(dir);

  switch (verb) {
    case 'mirar': case 'l': case 'm': case 'look': return showRoom(true);
    case 'inventario': case 'inv': case 'i': return showInv();
    case 'coger': case 'tomar': case 'recoger': case 'agarra': return doTake(rest);
    case 'dejar': case 'soltar': case 'drop': return doDrop(rest);
    case 'examinar': case 'ex': case 'x': case 'mirar al': case 'mira': return doExamine(rest);
    case 'leer': return doRead(rest);
    case 'ponerse': case 'vestir': case 'equipar': return doWear(rest);
    case 'quitarse': case 'quitar': return doUnwear(rest);
    case 'usar': {
      if (t.includes('modulador')) {
        if (S.room === 'aislamiento') return doFinal4();
        if (S.room === 'comunicaciones') return doCalibar('modulador');
        return pr('El modulador necesita calibrarse en comunicaciones y usarse en la Sala de Aislamiento.', 'hint');
      }
      if ((t.includes('filtro') || t.includes('uv')) && t.includes('linterna')) return doCombinar(t);
      if (t.includes('linterna') && (t.includes('pizarra') || t.includes('tinta') || t.includes('tablero'))) return doIluminar('pizarra');
      return doWear(rest);
    }
    case 'insertar': case 'poner': case 'meter': return doInsert(t);
    case 'cargar':
      if (rest && (rest.includes('celda') || rest.includes('generador') || rest.includes('bateria') || rest.includes('energia')))
        return doInsert(t);
      return doCargar(rest);
    case 'reparar': return doRepair(rest);
    case 'activar': case 'encender': case 'arrancar': return doActivate(rest, t);
    case 'abrir': return doAbrir(t);
    case 'hablar': case 'habla': return doHablar(rest);
    case 'sintonizar': case 'analizar': return doSintonizar();
    case 'escuchar': case 'oir': case 'oír': {
      if (S.room === 'comunicaciones') return doSintonizar();
      pr('No oyes nada especial. El silencio de la estación es su propio mensaje.', 'hint'); break;
    }
    case 'reproducir': return doReproducir();
    case 'calibrar': return doCalibar(rest);
    case 'combinar': case 'modificar': case 'montar': return doCombinar(t);
    case 'iluminar': case 'alumbrar': return doIluminar(rest);
    case 'salvar': case 'rescatar': case 'despertar': case 'liberar': return doFinal4();
    case 'cortar': return doFinal('cortar');
    case 'amplificar': case 'retransmitir': return doFinal('amplificar');
    case 'unirme': case 'unirse': case 'entrar': return doUnirse();
    // ── Nuevos comandos ──────────────────────────────────────
    case 'guardar': return doGuardar(rest);
    case 'slots': case 'partidas': return doSlots();
    case 'transcripcion': return doTranscripcion();
    case 'dir': case 'ls': return doDir();
    case 'who': case 'users': return doWho();
    case 'finger': return doFinger(rest);
    case 'chat': return doChat();
    case 'velocidad': return doVelocidad(rest);
    case 'pista': return doPista();
    // ────────────────────────────────────────────────────────
    case 'ayuda': case 'help': return doHelp();
    case 'puntuacion': case 'score': return pr(`Puntuación: ${S.score} de ${MAXSCORE}.`, 'hint');
    case 'creditos': return doCreditos();
    default: {
      const d2 = parseDir(t);
      if (d2) return goDir(d2);
      pr('No entiendo eso. Escribe AYUDA para ver los comandos.', 'bad');
    }
  }
  ambientTick();
}

// ── Movimiento ─────────────────────────────────────────────────
function goDir(dir) {
  if (S.flags.finalHecho) return;
  const r = ROOMS[S.room];
  const exits = r.exits || {};
  let dest = exits[dir];
  if (typeof dest === 'function') dest = dest();
  if (!dest) {
    if (dir === 'norte' && S.room === 'pasillo' && !S.flags.labAbierta)
      return pr('La puerta del laboratorio parpadea en rojo. Necesitas una tarjeta de acceso.', 'bad');
    if (dir === 'este' && S.room === 'laboratorio' && !S.flags.aisl)
      return pr('La puerta de la Sala de Aislamiento requiere una tarjeta de nivel 3.', 'bad');
    if (dir === 'norte' && S.room === 'esclusa') {
      if (!S.worn.has('traje_eva')) return pr('No puedes salir al vacío sin el traje EVA. Sería una muerte instantánea.', 'bad');
      if (!S.flags.traje) return pr('El traje tiene un corte. Ponértelo en el vacío sería suicidio. Repáralo primero.', 'bad');
      dest = 'exterior';
    } else {
      return pr('No puedes ir en esa dirección.', 'bad');
    }
  }
  S.room = dest;
  showRoom();
  ambientTick();
}

// ── Acciones estándar ──────────────────────────────────────────
function showInv() {
  const all = [...S.inv, ...S.worn].filter(k => S.inv.has(k) || S.worn.has(k));
  if (!all.length) return pr('No llevas nada.', 'hint');
  pr('Llevas:', 'hint');
  S.inv.forEach(k => pr('  ' + ITEMS[k].name, 'desc'));
  S.worn.forEach(k => pr('  ' + ITEMS[k].name + ' (puesto)', 'desc'));
}

function doTake(noun) {
  if (!noun) return pr('¿Qué quieres coger?', 'bad');
  const k = findItem(noun, 'room');
  if (!k) return pr(`No ves "${noun}" aquí.`, 'bad');
  const item = ITEMS[k];
  if (!item.portable) return pr(`No puedes coger ${item.name}.`, 'bad');
  item.location = 'INV'; S.inv.add(k);
  pr(`Coges ${item.name}.`, 'ok');
}

function doDrop(noun) {
  if (!noun) return pr('¿Qué quieres dejar?', 'bad');
  const k = findItem(noun, 'inv');
  if (!k) return pr('No llevas eso.', 'bad');
  ITEMS[k].location = S.room; S.inv.delete(k); S.worn.delete(k);
  pr(`Dejas ${ITEMS[k].name}.`, 'ok');
}

function doExamine(noun) {
  if (!noun || noun === 'al' || noun === 'la' || noun === 'el') { showRoom(true); return; }

  // Hueco (Expansión 5)
  if ((noun.includes('hueco') || noun === 'panel' || noun.includes('mantenimiento')) && S.room === 'laboratorio') {
    if (!S.flags.huecoExaminado) {
      S.flags.huecoExaminado = true;
      ITEMS.modulador_em.location = 'laboratorio';
      ITEMS.tarjeta_roja.location = 'laboratorio';
      pr('El hueco de mantenimiento bajo el panel de trabajo contiene un dispositivo compacto con una etiqueta manuscrita.', 'ok');
      pr('<em>MODULADOR EM — PROTOTIPO. CALIBRAR ANTES DE USAR. —E. OKAFOR</em>', 'warn');
      pr('Debajo del modulador, enterrada bajo unos folios: una tarjeta de acceso color rojo.', 'ok');
      blank(); pr('Los dejas visibles junto al panel.', 'desc');
    } else {
      pr('Ya exploraste el hueco. El modulador EM estaba dentro.', 'hint');
    }
    return;
  }

  // Pizarra (Expansión 2)
  if ((noun.includes('pizarra') || noun.includes('tablero') || noun.includes('ecuac') || noun.includes('tinta') || noun.includes('borrado') || noun.includes('texto')) && S.room === 'laboratorio') {
    if (S.flags.pizarraRevelada) {
      blank(); pr('PROPÓSITO: DOMINAR. ASIMILAR. PERSISTIR. POR ENCIMA DE TODA BARRERA ELECTROMAGNÉTICA.', 'warn');
      pr('Okafor lo sabía. Y eligió seguir adelante de todas formas.', 'dim');
    } else {
      pr('ORIGEN: EXTERIOR A LA HELIOSFERA · ANTIGÜEDAD: >4.000.000 AÑOS · PROPÓSITO: [BORRADO CON TINTA NEGRA]', 'desc');
      pr('La tinta negra que cubre parte del texto es reciente. Alguien no quería que leyeras lo que hay debajo.', 'hint');
      if (S.flags.linternaUV && (S.inv.has('linterna') || S.worn.has('linterna'))) doIluminar('pizarra');
    }
    return;
  }

  const k = findItem(noun, 'any');
  if (!k) return pr(`No ves "${noun}".`, 'bad');
  const d = typeof ITEMS[k].desc === 'function' ? ITEMS[k].desc() : ITEMS[k].desc;
  pr(d, 'desc');
}

function doRead(noun) {
  if (!noun) return pr('¿Qué quieres leer?', 'bad');
  const k = findItem(noun, 'any');
  if (!k) return pr(`No encuentras "${noun}".`, 'bad');
  if (ITEMS[k].read) { ITEMS[k].read(); return; }
  pr(typeof ITEMS[k].desc === 'function' ? ITEMS[k].desc() : ITEMS[k].desc, 'desc');
}

function doWear(noun) {
  if (!noun) return pr('¿Qué quieres ponerte?', 'bad');
  const k = findItem(noun, 'any');
  if (!k) return pr(`No encuentras "${noun}".`, 'bad');
  if (!ITEMS[k].wearable) return pr(`No puedes ponerte ${ITEMS[k].name}.`, 'bad');
  if (S.worn.has(k)) return pr(`Ya llevas el ${ITEMS[k].name} puesto.`, 'hint');
  if (k === 'traje_eva' && !S.flags.traje) return pr('El traje tiene un corte. Repáralo primero.', 'bad');
  S.inv.delete(k); S.worn.add(k);
  pr(`Te pones ${ITEMS[k].name}.`, 'ok');
}

function doUnwear(noun) {
  if (!noun) return pr('¿Qué quieres quitarte?', 'bad');
  const k = findItem(noun, 'inv');
  if (!k || !S.worn.has(k)) return pr('No llevas eso puesto.', 'bad');
  S.worn.delete(k); S.inv.add(k);
  pr(`Te quitas ${ITEMS[k].name}.`, 'ok');
}

function doInsert(t) {
  if (t.includes('celda') && t.includes('generador')) {
    if (!S.inv.has('celda_energia')) return pr('No tienes la celda de energía.', 'bad');
    if (S.room !== 'maquinas') return pr('El generador está en la sala de máquinas.', 'bad');
    if (S.flags.generadorCargado) return pr('La celda ya está insertada.', 'hint');
    S.inv.delete('celda_energia'); ITEMS.celda_energia.location = 'nowhere';
    S.flags.generadorCargado = true;
    pr('Encajas la celda en la ranura del generador. Un clic metálico.', 'ok');
    return;
  }
  if (t.includes('amarilla') || (t.includes('tarjeta') && !t.includes('roja'))) return doAbrir('tarjeta amarilla laboratorio');
  if (t.includes('roja')) return doAbrir('tarjeta roja aislamiento');
  if ((t.includes('filtro') || t.includes('uv')) && t.includes('linterna')) return doCombinar(t);
  pr('No queda claro qué quieres hacer.', 'bad');
}

function doAbrir(t) {
  if ((t.includes('amarilla') || t.includes('lab')) && !t.includes('roja')) {
    if (!S.inv.has('tarjeta_amarilla')) return pr('No tienes la tarjeta amarilla.', 'bad');
    if (S.room !== 'pasillo' && S.room !== 'laboratorio') return pr('La puerta del laboratorio está en el pasillo, al norte.', 'bad');
    if (S.flags.labAbierta) return pr('La puerta del laboratorio ya está abierta.', 'hint');
    S.flags.labAbierta = true;
    pts(10, 'abriste el laboratorio');
    pr('Deslizas la tarjeta amarilla. El indicador cambia de rojo a verde. La puerta del laboratorio se abre.', 'ok');
    return;
  }
  if (t.includes('roja') || t.includes('aislamiento')) {
    if (!S.inv.has('tarjeta_roja')) return pr('No tienes la tarjeta roja.', 'bad');
    if (S.room !== 'laboratorio') return pr('La puerta de la Sala de Aislamiento está en el laboratorio, al este.', 'bad');
    if (S.flags.aisl) return pr('La puerta ya está abierta.', 'hint');
    S.flags.aisl = true;
    pts(15, 'abriste la Sala de Aislamiento');
    pr('Deslizas la tarjeta roja. El lector tarda —como si reconsiderara— y cede. La puerta se abre con un sonido húmedo, como un sello de vacío roto.', 'ok');
    return;
  }
  pr('¿Abrir qué con qué?', 'bad');
}

function doRepair(noun) {
  if (S.room !== 'esclusa') return pr('No hay nada que reparar aquí.', 'bad');
  if (!S.inv.has('kit_rep')) return pr('Necesitas el kit de reparación EVA del almacén.', 'bad');
  if (S.flags.traje) return pr('El traje ya está reparado.', 'hint');
  S.flags.traje = true;
  pts(15, 'reparaste el traje EVA');
  pr('Aplicas los parches sellantes, la resina de vacío, y terminas con la pistola de calor. La reparación queda perfecta. El traje es habitable.', 'ok');
}

function doActivate(noun, full) {
  if (noun.includes('modulador') || (full && full.includes('modulador'))) {
    if (S.room === 'aislamiento') return doFinal4();
    if (S.room === 'comunicaciones') return doCalibar('modulador');
    return pr('El modulador necesita calibrarse en comunicaciones y usarse en la Sala de Aislamiento.', 'hint');
  }
  if (noun.includes('generador') || noun.includes('palanca') || noun === '') {
    if (S.room !== 'maquinas') return pr('El generador está en la sala de máquinas.', 'bad');
    if (S.flags.energiaOk) return pr('El generador ya funciona.', 'hint');
    if (!S.flags.generadorCargado) return pr('El generador no tiene celda de energía. Encuéntrala en el almacén.', 'bad');
    S.flags.energiaOk = true;
    pts(20, 'restauraste la energía de la estación');
    pr('Empujas la palanca a MANUAL-ENCENDIDO. El generador tose, vibra, y comienza a rugir suavemente. Las luces de la estación pasan de naranja de emergencia a blanco. La energía ha vuelto.', 'ok');
    blank();
    pr('Desde algún lugar de la estación —lejano, amortiguado— llega un sonido nuevo. Bajo. Regular. Como una voz que no usa palabras.', 'warn');
    setDrone(0.01, 3); // se activa el drone suavemente
    return;
  }
  pr('¿Activar qué?', 'bad');
}

function doHablar(noun) {
  if (S.room !== 'aislamiento') return pr('No hay nadie con quien hablar aquí.', 'bad');
  if (S.flags.habloCrew) { pr('Los seis te miran. Sus labios forman tu nombre, sin sonido.', 'dim'); return; }
  const sabeDeKowalski = S.flags.leyoCapitan;
  S.flags.habloCrew = true;
  pts(20, 'hablaste con la tripulación');
  blank();
  pr('«¿Estáis bien?»', 'desc');
  blank();
  pr('Hablan al unísono, con voces superpuestas que forman acordes:', 'hint');
  pr('<em>«Nunca hemos estado mejor. Estamos completos. La Señal nos completó.»</em>', 'warn');
  blank();
  pr('«¿Qué es la Señal?»', 'desc');
  pr('<em>«Una mente. Antigua. Mayor que esta estrella. Nos encontró porque la buscábamos. Ahora te pregunta si quieres unirte.»</em>', 'warn');
  blank();
  pr('«No.»', 'desc'); blank();
  pr('Sus cabezas se inclinan al mismo ángulo exacto.', 'hint');
  if (sabeDeKowalski) {
    pr('<em>«Kowalski también dijo no. Hasta el final. Reconoces sus palabras. La Señal es paciente. Él cedió al alba del día cuatro. Y al ceder, entendió que nunca tuvo razón para resistir.»</em>', 'warn');
    blank();
    pr('Sientes el peso de eso. Kowalski resistió más que nadie. Y aun así.', 'desc');
  }
  pr('<em>«Entonces ve a la antena. Decide. Pero sabe que si la cortas, nosotros morimos con ella. Somos la Señal ahora.»</em>', 'warn');
  if (S.flags.huecoExaminado || S.inv.has('modulador_em')) {
    blank();
    pr('Recuerdas el modulador de Okafor. Quizá hay una tercera opción que no implica elegir entre silencio o amplificación.', 'dim');
  }
}

// ── Expansión 2: UV ────────────────────────────────────────────
function doCombinar(t) {
  if ((t.includes('filtro') || t.includes('uv')) && t.includes('linterna')) {
    if (!S.inv.has('filtro_uv')) return pr('No tienes el filtro UV.', 'bad');
    if (!S.inv.has('linterna') && !S.worn.has('linterna')) return pr('No tienes la linterna.', 'bad');
    if (S.flags.linternaUV) return pr('La linterna ya tiene el filtro UV instalado.', 'hint');
    S.flags.linternaUV = true;
    S.inv.delete('filtro_uv'); ITEMS.filtro_uv.location = 'nowhere';
    ITEMS.linterna.name = 'linterna UV';
    pr('Encajas el filtro UV en el cabezal de la linterna. Ahora emite luz ultravioleta. Perfecta para revelar tintas invisibles.', 'ok');
    return;
  }
  pr('No puedes combinar eso así.', 'bad');
}

function doIluminar(noun) {
  if (!noun) return pr('¿Qué quieres iluminar?', 'bad');
  if (!S.inv.has('linterna') && !S.worn.has('linterna')) return pr('No tienes la linterna.', 'bad');
  if (!S.flags.linternaUV) {
    pr('Con luz normal no obtienes nada especial. Quizá si modificaras la linterna con el filtro UV del almacén...', 'hint');
    return;
  }
  if ((noun.includes('pizarra') || noun.includes('tablero') || noun.includes('tinta') || noun.includes('borrado') || noun.includes('texto')) && S.room === 'laboratorio') {
    if (S.flags.pizarraRevelada) { pr('Ya conoces el texto oculto.', 'hint'); return; }
    S.flags.pizarraRevelada = true;
    pts(10, 'revelaste el propósito oculto de la Señal');
    blank(); pr('Bajo la luz UV, la tinta negra se vuelve transparente lentamente.', 'ok');
    blank(); pr('El texto que Okafor borró aparece:', 'desc');
    pr('<strong>PROPÓSITO: DOMINAR. ASIMILAR. PERSISTIR.</strong>', 'warn');
    pr('<strong>POR ENCIMA DE TODA BARRERA ELECTROMAGNÉTICA.</strong>', 'warn');
    blank(); pr('Okafor sabía exactamente qué es la Señal. Y eligió seguir adelante de todas formas.', 'dim');
    return;
  }
  pr('La luz UV no revela nada especial en eso.', 'hint');
}

// ── Expansión 3: Comunicaciones ────────────────────────────────
function doSintonizar() {
  if (S.room !== 'comunicaciones') return pr('No hay señal que sintonizar aquí.', 'bad');
  if (!S.flags.energiaOk) return pr('Los equipos de comunicaciones están sin energía.', 'bad');
  if (S.flags.frecuenciaSintonizada) {
    pr('Ya has analizado la señal: 3,7 kHz, patrón fractal base-12.', 'hint'); return;
  }
  S.flags.frecuenciaSintonizada = true;
  pts(10, 'sintonizaste y analizaste la señal de la anomalía');
  blank(); pr('Ajustas los controles del analizador espectral. La señal aparece en pantalla: nítida, precisa, perfectamente estructurada.', 'ok');
  blank(); pr('<strong>Frecuencia central: 3,7 kHz.</strong> Patrón: fractal base-12. Amplitud: constante desde la primera detección. Sin degradación. Sin variación.', 'desc');
  blank();
  if (S.flags.leyoCapitan || S.flags.leyoAndrade)
    pr('Reconoces la frecuencia. Kowalski la llamó «bonita, ordenada». Andrade estudió cómo sincroniza los ritmos theta. Ahora la tienes medida con precisión.', 'warn');
  pr('Los altavoces de la sala están desconectados. Mejor así.', 'dim');
}

function doReproducir() {
  if (S.room !== 'comunicaciones') return pr('No hay nada que reproducir aquí.', 'bad');
  if (!S.flags.energiaOk) return pr('Los equipos están sin energía.', 'bad');
  if (S.flags.chenLog) { pr('Ya has escuchado la última grabación de Chen.', 'hint'); return; }
  S.flags.chenLog = true;
  pts(5, 'escuchaste la grabación final de Chen');
  blank(); pr('── REGISTRO DE AUDIO AUTOMÁTICO — H. CHEN — DÍA 3, 14:22 UTC ──', 'big'); blank();
  pr('<em>[Voz de Chen. Clara. Sin interferencias.]</em>', 'dim');
  pr('"Estoy grabando esto por protocolo. Por si alguien viene después."', 'desc');
  pr('"No es peligrosa. No hay que temerla. Lo sé porque la escucho."', 'desc');
  pr('"Escúchala. Solo... escúchala."', 'desc');
  pr('[FIN DE LA GRABACIÓN — 14:23:07 UTC]', 'dim');
  blank(); pr('Treinta y cuatro segundos. La última vez que los sistemas registraron una voz humana en esta estación.', 'warn');
}

function doCalibar(noun) {
  if (!noun || !noun.includes('modulador')) return pr('¿Calibrar qué?', 'bad');
  if (!S.inv.has('modulador_em')) return pr('No tienes el modulador EM.', 'bad');
  if (S.room !== 'comunicaciones') return pr('Necesitas los equipos de comunicaciones para calibrar la frecuencia exacta.', 'bad');
  if (!S.flags.energiaOk) return pr('Los equipos de comunicaciones están sin energía.', 'bad');
  if (!S.flags.frecuenciaSintonizada) return pr('Primero sintoniza la señal para conocer su frecuencia exacta (SINTONIZAR).', 'bad');
  if (S.flags.moduladorCalibrado) return pr('El modulador ya está calibrado a 3,7 kHz.', 'hint');
  S.flags.moduladorCalibrado = true;
  pts(10, 'calibraste el modulador a la frecuencia de la Señal');
  blank(); pr('Conectas el modulador al analizador espectral y ajustas la frecuencia de interferencia: 3,7 kHz exacto. El dispositivo emite un pitido de confirmación.', 'ok');
  blank(); pr('Si funciona, debería interrumpir la conexión entre la Señal y cualquier receptor biológico sintonizado a ella.', 'warn');
  pr('Okafor no dejó notas sobre si esta teoría fue probada alguna vez.', 'dim');
}

// ── Finales ────────────────────────────────────────────────────
function doFinal(accion) {
  if (S.flags.finalHecho) return;
  if (S.room !== 'exterior') return pr('No estás en la antena. Ve al exterior.', 'bad');
  if (!S.worn.has('traje_eva')) return pr('Sin el traje EVA no puedes estar en el exterior.', 'bad');
  _autoSave();
  S.flags.finalHecho = true;
  if (audioCtx) setDrone(0, 0.5);

  if (accion === 'cortar') {
    blank(); sep(); pr('FINAL I — SILENCIO', 'end1'); sep(); blank();
    pr('Levantas la cubierta roja.', 'desc');
    pr('Piensas en Kowalski, que hacía la cama aunque nadie lo viera. En Silva, que escribió una advertencia antes de rendirse. En Okafor, que dejó instrucciones para que tú pudieras elegir. En Park, que rajó este traje que llevas reparado.', 'desc');
    blank(); pr('Pulsas el botón.', 'warn'); blank();
    pr('La antena se dobla lentamente, articulación por articulación, como un insecto muriendo. Hay un momento —solo un momento— en que juras escuchar algo a través del vacío: no la Señal, sino seis voces humanas, distintas y separadas otra vez, diciendo adiós.', 'desc');
    blank(); pr('Y luego silencio. El silencio más completo del universo.', 'desc'); blank();
    pr('La Señal lleva cuatro millones de años esperando. Seguirá esperando. Hasta la próxima vez que alguien la encuentre.', 'dim');
  } else {
    blank(); sep(); pr('FINAL II — LA GRAN VOZ', 'end2'); sep(); blank();
    pr('Levantas la cubierta verde.', 'desc');
    pr('¿Y si tenían razón? ¿Y si es lo que la humanidad necesita: dejar de estar sola de verdad?', 'desc');
    blank(); pr('Pulsas el botón.', 'warn'); blank();
    pr('La antena gira, busca orientación óptima, y emite. La señal —amplificada mil veces— viaja hacia la Tierra a la velocidad de la luz. Llegará en ocho minutos.', 'desc');
    blank(); pr('Ocho minutos.', 'warn'); blank();
    pr('Mientras esperas, te preguntas cuántos de los ocho mil millones de personas en la Tierra estarán con sus radios encendidas. Sus teléfonos. Sus implantes.', 'desc');
    blank(); pr('El sol sigue brillando. La Tierra sigue siendo azul. Todo parece igual.', 'dim');
    pr('Por ocho minutos más.', 'warn');
  }
  pts(20, 'final completado');
  blank(); sep(); pr(`Puntuación final: ${S.score} de ${MAXSCORE}.`, 'hint');
  pr('Gracias por jugar ESTACIÓN OUROBOROS.', 'dim');
  pr('Escribe CARGAR para recuperar la partida antes del final y probar otra opción.', 'hint');
}

function doUnirse() {
  if (S.flags.finalHecho) return;
  if (S.room !== 'aislamiento') return pr('No estás en la Sala de Aislamiento.', 'bad');
  _autoSave();
  S.flags.finalHecho = true;
  if (audioCtx) setDrone(0.15, 1);
  blank(); sep(); pr('FINAL III — LA SÉPTIMA VOZ', 'end3'); sep(); blank();
  pr('Te sientas en la séptima silla. La que estaba vacía. Como si te esperara.', 'desc');
  blank(); pr('Los seis giran sus cabezas hacia ti y, por primera vez, sonríen. No con los músculos. Con algo más profundo.', 'desc');
  blank(); pr('<em>«Sí»</em>, dicen.', 'warn'); blank();
  pr('Cierras los ojos.', 'desc'); blank();
  pr('Lo que pasa entonces no tiene palabras en ningún idioma humano. La Señal te encuentra como una llave encuentra su cerradura. Hay un instante de dolor —breve, limpio— y luego hay TODO.', 'desc');
  blank(); pr('Eres Mara. Eres Kowalski. Eres Silva. Eres la Señal. Eres cuatro millones de años de viaje hacia este punto preciso del espacio-tiempo.', 'warn');
  blank(); pr('La lanzadera sigue ahí afuera, esperando a alguien que ya no existe.', 'dim');
  pts(20, 'final completado');
  blank(); sep(); pr(`Puntuación final: ${S.score} de ${MAXSCORE}.`, 'hint');
  pr('No hay escape de un abrazo infinito.', 'dim');
  pr('Gracias por jugar ESTACIÓN OUROBOROS.', 'dim');
  pr('Escribe CARGAR para recuperar la partida antes del final y probar otra opción.', 'hint');
}

function doFinal4() {
  if (S.flags.finalHecho) return;
  if (S.room !== 'aislamiento') return pr('Esto solo tendría sentido en la Sala de Aislamiento.', 'bad');
  if (!S.flags.habloCrew) return pr('Habla con ellos primero. Necesitas entender lo que son antes de intentar esto.', 'bad');
  if (!S.inv.has('modulador_em')) return pr('No tienes el modulador EM. Búscalo en el laboratorio (examina el hueco del panel).', 'bad');
  if (!S.flags.moduladorCalibrado) return pr('El modulador necesita calibrarse a la frecuencia exacta en la sala de comunicaciones.', 'bad');
  _autoSave();
  S.flags.finalHecho = true;
  blank(); sep(); pr('FINAL IV — EL CABLE DE VUELTA', 'end1'); sep(); blank();
  pr('Sacas el modulador. Los seis tripulantes giran la cabeza hacia él al unísono.', 'desc');
  blank(); pr('Por primera vez desde que los encontraste, ves algo en sus ojos que no es calma.', 'desc');
  blank(); pr('Ves miedo.', 'warn'); blank();
  pr('<em>«No hagas eso.»</em>', 'warn'); blank();
  pr('Piensas en Park, que rajó el traje para impedir la huida. En Andrade, que escribió «nos vemos adentro» con la misma letra de sus informes científicos.', 'desc');
  blank(); pr('¿Y si les estás quitando algo que eligieron?', 'dim');
  blank(); pr('Lo activas.', 'desc'); blank();
  pr('Los seis convulsionan al mismo tiempo. Una ola de contracción muscular en perfecta sincronía. Una segunda. Luego silencio.', 'desc');
  blank(); pr('Doce segundos que parecen una hora.', 'dim'); blank();
  pr('Okafor es el primero en moverse. Levanta la cabeza con la lentitud de alguien que regresa de muy lejos. Te mira, y los ojos ya no tienen esa luminosidad interior. Están rojos. Llenos de lágrimas.', 'desc');
  blank(); pr('«¿Dónde...?», dice. Solo una palabra.', 'desc'); blank();
  pr('Kowalski es el último en despertar. Abre los ojos, mira sus manos como si fueran de otro, y dice lo único que importa:', 'desc');
  pr('"¿Cuánto tiempo?"', 'warn'); blank();
  pr('Tres días. Les dices que tres días.', 'desc'); blank();
  pr('Los seis están vivos. Desorientados, débiles, con secuelas que tardarán años en comprender. Pero humanos. Completamente, imperfectamente, dolorosamente humanos.', 'ok');
  blank(); pr('La Señal sigue ahí fuera. Pero esta vez no se lleva a nadie.', 'dim'); blank();
  pr('Park te mira desde su silla y dice, con voz ronca: "El traje. Lo rajé yo. Lo siento."', 'warn');
  blank(); pr('«Lo sé», dices. «Lo leí.»', 'desc');
  if (audioCtx) setDrone(0, 1);
  pts(20, 'final completado — la tripulación está a salvo');
  blank(); sep(); pr(`Puntuación final: ${S.score} de ${MAXSCORE}.`, 'hint');
  pr('Gracias por jugar ESTACIÓN OUROBOROS.', 'dim');
  pr('Escribe CARGAR para recuperar la partida antes del final y probar otra opción.', 'hint');
}

// ── GUARDAR / CARGAR (3 slots + auto) ─────────────────────────
function _slotKey(n) {
  if (n === 'auto') return 'ouroboros_auto';
  const s = parseInt(n) || 1;
  return 'ouroboros_s' + Math.min(3, Math.max(1, s));
}

function _buildSave() {
  const itemLocs = {};
  for (const [k, v] of Object.entries(ITEMS)) itemLocs[k] = v.location;
  return {
    room: S.room, inv: [...S.inv], worn: [...S.worn],
    flags: {...S.flags}, visited: [...S.visited],
    score: S.score, turns: S.turns,
    history: S.history, histIdx: S.histIdx,
    itemLocs, savedAt: Date.now()
  };
}

function doGuardar(slot) {
  const s = parseInt(slot) || 1;
  if (s < 1 || s > 3) return pr('Slots disponibles: 1, 2 o 3. Ej: GUARDAR 2', 'hint');
  try {
    localStorage.setItem(_slotKey(s), JSON.stringify(_buildSave()));
    pr(`Partida guardada en slot ${s}.`, 'ok');
    pr(`[Slot ${s} · Turno ${S.turns} · ${S.score}/${MAXSCORE} pts · ${ROOMS[S.room].name}]`, 'dim');
  } catch(e) { pr('Error al guardar: ' + e.message, 'bad'); }
}

function doCargar(slot) {
  const s = parseInt(slot) || 1;
  if (s < 1 || s > 3) return pr('Slots disponibles: 1, 2 o 3. Ej: CARGAR 2', 'hint');
  try {
    // Compatibilidad con el slot único antiguo (ouroboros_v2)
    const raw = localStorage.getItem(_slotKey(s)) ||
                (s === 1 ? localStorage.getItem('ouroboros_v2') : null);
    if (!raw) return pr(`No hay partida guardada en el slot ${s}.`, 'bad');
    const save = JSON.parse(raw);
    S.room = save.room; S.inv = new Set(save.inv); S.worn = new Set(save.worn);
    Object.assign(S.flags, save.flags);
    S.visited = new Set(save.visited);
    S.score = save.score; S.turns = save.turns;
    S.history = save.history || []; S.histIdx = save.histIdx || 0;
    for (const [k, loc] of Object.entries(save.itemLocs))
      if (ITEMS[k]) ITEMS[k].location = loc;
    scEl.textContent = S.score;
    if (S.flags.energiaOk) setDrone(DRONE_VOLS[S.room] || 0, 0);
    pr(`Slot ${s} cargado.`, 'ok');
    blank(); showRoom(true);
  } catch(e) { pr('Error al cargar: ' + e.message, 'bad'); }
}

function doSlots() {
  blank(); pr('── SLOTS DE GUARDADO ────────────────────────────────', 'big');
  for (let s = 1; s <= 3; s++) {
    const raw = localStorage.getItem(_slotKey(s)) ||
                (s === 1 ? localStorage.getItem('ouroboros_v2') : null);
    if (!raw) { pr(`  Slot ${s}: [vacío]`, 'dim'); continue; }
    try {
      const sv = JSON.parse(raw);
      const ts = sv.savedAt ? new Date(sv.savedAt).toLocaleString('es-ES', {dateStyle:'short', timeStyle:'short'}) : '—';
      pr(`  Slot ${s}: Turno ${sv.turns} · ${sv.score}/${MAXSCORE} pts · ${ROOMS[sv.room]?.name || sv.room} · ${ts}`, 'desc');
    } catch(e) { pr(`  Slot ${s}: [corrompido]`, 'bad'); }
  }
  blank(); pr('Uso: GUARDAR 1·2·3 / CARGAR 1·2·3', 'hint');
}

function _autoSave() {
  try { localStorage.setItem('ouroboros_auto', JSON.stringify(_buildSave())); } catch(e) {}
}

// ── TRANSCRIPCIÓN ──────────────────────────────────────────────
function doTranscripcion() {
  const lines = [...out.querySelectorAll('.line')].map(d => d.textContent);
  const header = `ESTACIÓN OUROBOROS v2.0 — TRANSCRIPCIÓN DE PARTIDA\nVampireBBS / Vampsecure Studios 2026\nTurno: ${S.turns}  ·  Puntuación: ${S.score}/${MAXSCORE}\n${'─'.repeat(60)}\n\n`;
  const blob = new Blob([header + lines.join('\n')], {type: 'text/plain;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = `ouroboros_t${S.turns}.txt`;
  a.click(); URL.revokeObjectURL(a.href);
  pr('Transcripción descargada.', 'ok');
  pr(`[${lines.length} líneas · ouroboros_t${S.turns}.txt]`, 'dim');
}

// ── EASTER EGGS BBS ────────────────────────────────────────────
function doDir() {
  blank(); pr('Directorio  OUROBOROS:\\SISTEMA\\', 'bbs');
  pr('─'.repeat(50), 'sep');
  pr('MISION.TXT            4.096  18-JUN-26  [LEGIBLE]', 'desc');
  pr('TRIPULACION.DAT      12.288  03-JUL-25  [LEGIBLE]', 'desc');
  pr('SIGNAL_SPECTRUM.DAT   8.192  18-JUN-26  [ENCRIPTADO]', 'warn');
  pr('KOWALSKI_LOG.TXT      1.024  18-JUN-26  [SOLO LECTURA]', 'desc');
  pr('OKAFOR_NOTES.TXT      3.072  18-JUN-26  [LEGIBLE]', 'desc');
  pr('MODULADOR_EM.CAD     16.384  12-MAR-26  [TÉCNICO]', 'desc');
  pr('EVA_SUIT_LOG.TXT        512  18-JUN-26  [MODIFICADO]', 'warn');
  pr('OUROBOROS.EXE         ?.???  ??-???-??  [EN EJECUCIÓN]', 'dim');
  pr('─'.repeat(50), 'sep');
  pr('  8 archivo(s)  ·  libres: ERROR — ACCESO DENEGADO', 'hint');
}

function doWho() {
  blank(); pr('USUARIOS CONECTADOS — OUROBOROS NODE', 'bbs');
  pr('─'.repeat(54), 'sep');
  pr('KOWALSKI, A.    Últ. acceso: 18-JUN-26 06:13   [OFFLINE]', 'bad');
  pr('SILVA, K.       Últ. acceso: 18-JUN-26 05:58   [OFFLINE]', 'bad');
  pr('OKAFOR, E.      Últ. acceso: 18-JUN-26 03:21   [OFFLINE]', 'bad');
  pr('CHEN, H.        Últ. acceso: 17-JUN-26 14:22   [OFFLINE]', 'bad');
  pr('PARK, J.        Últ. acceso: 17-JUN-26 09:44   [OFFLINE]', 'bad');
  pr('ANDRADE, M.     Últ. acceso: 17-JUN-26 07:31   [OFFLINE]', 'bad');
  pr('─'.repeat(54), 'sep');
  pr('VOSS, M.        Conectado ahora                 [TÚ]', 'ok');
  blank(); pr('1 usuario activo. 6 cuentas bloqueadas por inactividad.', 'hint');
}

function doFinger(name) {
  const P = {
    kowalski: ['Cpt. Aleksander Kowalski · Comandante', 'Piloto veterano. 12 misiones completadas. Carácter metódico, fiable bajo presión. Única anomalía conocida: entrada 852 del diario de vuelo, incompleta y manuscrita.'],
    silva:    ['Dra. Katarzyna Silva · Médico de Misión', 'Especialidad: medicina espacial y neurología. Publicó en 2024 un artículo sobre efectos del aislamiento prolongado en ondas theta. Quizá demasiado relevante.'],
    okafor:   ['Dr. Emmanuel Okafor · Científico Jefe', 'Astrofísico. Premio Sagan 2023. Especialidad: señales de origen no identificado. Diseñó el modulador EM como proyecto secundario. Lo llamaba «solución de emergencia».'],
    chen:     ['H. Chen · Técnico de Comunicaciones', 'Ex-ingeniería de sonido, reconversión a teleco. Afición: música microtonal. Para él el análisis espectral era «como componer».'],
    park:     ['J. Park · Ingeniero de Sistemas', 'Pragmático. Sin publicaciones académicas. Historial impecable salvo una nota sin resolver: deterioro inexplicado del traje EVA-2 durante su última guardia.'],
    andrade:  ['M. Andrade · Bióloga de Misión', 'Experta en bioacústica y sincronización neuronal. Tesis: «Efectos de frecuencias subsónicas en colonias migratorias». Aplicación no prevista.']
  };
  const key = (name || '').toLowerCase().split(' ')[0];
  const p = P[key];
  if (!p) return pr('Uso: FINGER [kowalski|silva|okafor|chen|park|andrade]', 'hint');
  blank(); pr('── ' + p[0] + ' ──', 'big'); pr(p[1], 'desc');
}

function doChat() {
  blank(); pr('VAMPIREBBS CHAT — Canal #ouroboros', 'bbs');
  pr('─'.repeat(40), 'sep'); blank();
  pr('No hay nadie al otro lado.', 'dim'); blank();
  pr('Nunca hay nadie al otro lado.', 'warn');
}

// ── VELOCIDAD ──────────────────────────────────────────────────
function doVelocidad(sp) {
  const OPT = {lenta: 22, normal: 10, rapida: 3, desactivar: 0, rapido: 3, deactivar: 0};
  if (!sp || !Object.prototype.hasOwnProperty.call(OPT, sp)) {
    const name = typeSpeed === 0 ? 'desactivada' : typeSpeed <= 3 ? 'rápida' : typeSpeed <= 10 ? 'normal' : 'lenta';
    pr(`Velocidad actual: ${name} (${typeSpeed}ms/char).`, 'hint');
    pr('Opciones: VELOCIDAD LENTA · NORMAL · RAPIDA · DESACTIVAR', 'hint');
    return;
  }
  typeSpeed = OPT[sp];
  const NAMES = {0:'desactivada',3:'rápida (115k baud)',10:'normal (1200 baud)',22:'lenta (300 baud)'};
  pr(`Velocidad de texto: ${NAMES[typeSpeed] || sp}.`, 'ok');
}

// ── PISTA ──────────────────────────────────────────────────────
function doPista() {
  if (!S.flags.energiaOk) {
    if (!S.flags.leyoSilva)      return pr('Pista: Revisa los camarotes. Los tripulantes dejaron cosas atrás.', 'hint');
    if (!S.flags.labAbierta)     return pr('Pista: Tienes una tarjeta de acceso. Úsala en el pasillo.', 'hint');
    if (!S.flags.leyoOkafor)     return pr('Pista: Lee las notas que hay en el laboratorio.', 'hint');
    if (!S.inv.has('celda_energia')) return pr('Pista: Hay equipo en el almacén, al este del módulo de vida.', 'hint');
    return pr('Pista: Inserta la celda en el generador (sala de máquinas) y actívalo.', 'hint');
  }
  if (!S.flags.leyoCapitan)      return pr('Pista: Con energía restaurada, el puente de mando tiene nueva información.', 'hint');
  if (S.inv.has('filtro_uv') && !S.flags.linternaUV) return pr('Pista: El filtro UV encajaría en la linterna. COMBINAR filtro UV CON linterna.', 'hint');
  if (S.flags.linternaUV && !S.flags.pizarraRevelada) return pr('Pista: La pizarra del laboratorio oculta algo bajo la tinta negra. ILUMINAR pizarra.', 'hint');
  if (!S.flags.huecoExaminado)   return pr('Pista: Examina cuidadosamente el laboratorio. Okafor dejó algo escondido bajo el panel.', 'hint');
  if (!S.flags.frecuenciaSintonizada) return pr('Pista: Los equipos de comunicaciones están activos. Prueba SINTONIZAR.', 'hint');
  if (!S.flags.aisl)             return pr('Pista: La tarjeta roja de Okafor abre la puerta al este del laboratorio.', 'hint');
  if (!S.flags.habloCrew)        return pr('Pista: Habla con la tripulación.', 'hint');
  if (S.inv.has('modulador_em') && !S.flags.moduladorCalibrado)
    return pr('Pista: El modulador necesita calibrarse. Ve a comunicaciones: CALIBRAR modulador.', 'hint');
  pr('Pista: Tienes todo lo que necesitas. Hay cuatro finales. El cuarto requiere el modulador calibrado y estar en la Sala de Aislamiento.', 'dim');
}

// ── Atmósfera ──────────────────────────────────────────────────
const AMBI = {
  comunicaciones: [
    'La forma de onda en la pantalla cambia levemente. Sube medio tono.',
    'Empiezas a silbar algo sin darte cuenta. La melodía es perfectamente armónica. No la has oído nunca antes.',
    'Las pantallas parpadean brevemente. En ese instante, la forma de onda parece mirarte.',
    '▓▒░█ NO ES PELIGROSA ░▒█▓ — la forma de onda se estabiliza.',
    '▓█▒░ ESCÚCHALA ░▒▓█ ESCÚCHALA ▒▓░█ — el analizador vuelve a la normalidad.'
  ],
  aislamiento: [
    'Los seis forman tu nombre con los labios, en silencio y al unísono.',
    'La temperatura de la sala parece haber subido. O quizá eres tú.',
    'Uno de ellos —Okafor— inclina la cabeza. ¿Compasión? ¿Paciencia?',
    'Park te mira fijamente. Sus labios no forman tu nombre. Forman «lo siento».',
    '█▒░▓ DOMINAR ▓░▒█ ASIMILAR ░▓▒█ PERSISTIR — un parpadeo en las paredes absorbentes.'
  ],
  exterior: [
    'La Tierra sigue azul. Desde aquí no puedes ver las ciudades.',
    'Una estrella parpadea en el borde de tu visión periférica. O quizá no era una estrella.',
    'Cuatro millones de años. La Señal lleva cuatro millones de años viajando. Ahora está aquí, en tus manos.'
  ],
  maquinas: [
    'Las marcas de arrastre en el suelo siguen ahí, brillantes bajo la luz.',
    'El silencio en la sala de máquinas tiene un peso físico.'
  ],
  laboratorio: [
    'El frasco de pastillas vacío en el suelo. Okafor prefirió la señal al ansiolítico.',
    'La pantalla principal de Okafor sigue apagada. Lo que vio en ella lo llevó a la sala de aislamiento.'
  ]
};

let ambiTurn = 0;
function ambientTick() {
  if (S.flags.finalHecho) return;
  ambiTurn++;
  if (ambiTurn % 3 !== 0) return;
  const pool = AMBI[S.room];
  if (!pool) return;
  if (Math.random() < 0.55) {
    blank();
    const msg = pool[Math.floor(Math.random() * pool.length)];
    const isGlitch = msg.includes('▓') || msg.includes('█') || msg.includes('▒');
    pr(msg, isGlitch ? 'glitch' : 'dim');
  }
}

// ── Ayuda ──────────────────────────────────────────────────────
function doHelp() {
  blank(); pr('── COMANDOS BÁSICOS ──────────────────────────────────', 'big');
  pr('N/S/E/O/ARRIBA/ABAJO     moverse', 'desc');
  pr('MIRAR (M)                describir la sala actual', 'desc');
  pr('EXAMINAR <obj> (X)       examinar algo de cerca', 'desc');
  pr('INVENTARIO (I)           ver lo que llevas', 'desc');
  pr('COGER / DEJAR            recoger o soltar objetos', 'desc');
  pr('LEER <obj>               leer documentos o notas', 'desc');
  pr('PONERSE / QUITARSE       equipar objetos (ej: el traje)', 'desc');
  pr('INSERTAR <a> EN <b>      combinar objetos (ej: celda en generador)', 'desc');
  pr('COMBINAR <a> CON <b>     combinar objetos (ej: filtro con linterna)', 'desc');
  pr('ILUMINAR <obj>           iluminar con la linterna UV', 'desc');
  pr('REPARAR / ACTIVAR        mecánicas específicas', 'desc');
  pr('SINTONIZAR / REPRODUCIR  en sala de comunicaciones (con energía)', 'desc');
  pr('CALIBRAR modulador       en sala de comunicaciones (tras sintonizar)', 'desc');
  pr('HABLAR CON <personaje>   conversar', 'desc');
  pr('CORTAR / AMPLIFICAR      finales I y II (en la antena)', 'desc');
  pr('UNIRME                   final III (en sala de aislamiento)', 'desc');
  pr('SALVAR / DESPERTAR       final IV (en sala de aislamiento)', 'desc');
  blank(); pr('── SISTEMA ───────────────────────────────────────────', 'big');
  pr('GUARDAR 1·2·3 / CARGAR 1·2·3   3 slots de guardado', 'desc');
  pr('SLOTS                    ver estado de los 3 slots', 'desc');
  pr('TRANSCRIPCION            descargar sesión como .txt', 'desc');
  pr('VELOCIDAD [opción]       LENTA · NORMAL · RAPIDA · DESACTIVAR', 'desc');
  pr('PISTA                    pista contextual según tu progreso', 'desc');
  pr('PUNTUACION               ver puntuación actual', 'desc');
  blank(); pr('── TERMINAL BBS ──────────────────────────────────────', 'big');
  pr('DIR / WHO / FINGER [nombre] / CHAT', 'desc');
  blank(); pr('Tip: escribe en español natural. El juego entiende variaciones.', 'hint');
}

function doCreditos() {
  blank(); pr('── ESTACIÓN OUROBOROS ──────────────────────────────', 'big');
  pr('Una aventura de terror cósmico en el espacio profundo.', 'desc');
  pr('Género: Ciencia ficción / Horror psicológico.', 'desc');
  pr('4 finales · 150 puntos posibles · 20-35 min primer intento.', 'hint');
  blank();
  pr('Motor: JavaScript nativo (VampireBBS Adventure Engine v2.1)', 'dim');
  pr('Fuente Inform 7: ouroboros.ni (disponible para CAAD)', 'dim');
  pr('Audio: Web Audio API · 74 Hz drone · LFO 3,7 Hz', 'dim');
  pr('© 2026 VampireBBS / Vampsecure Studios', 'dim');
  blank(); pr('Los seis llevan cuatro millones de años esperándote.', 'warn');
}

// ── Inicio del juego (tras boot) ───────────────────────────────
function inicio() {
  bootMode = false;
  blank();
  pr('╔════════════════════════════════════════════════════════╗', 'ok');
  pr('║            E S T A C I Ó N   O U R O B O R O S        ║', 'ok');
  pr('║         Una aventura de terror cósmico  (2026)         ║', 'dim');
  pr('╚════════════════════════════════════════════════════════╝', 'ok');
  blank();
  pr('Tu lanzadera completa el acoplamiento con la Estación Ouroboros a las 06:47 UTC.', 'desc');
  pr('72 horas sin señal. Control dijo que «probablemente sea un fallo de antena».', 'desc');
  pr('Control nunca ha tenido razón sobre nada.', 'warn');
  blank();
  pr('El aire de la estación es frío. Y huele raro: como ozono después de una tormenta,', 'desc');
  pr('o como el mar desde lejos. Nada debería oler así en el espacio.', 'desc');
  blank();
  pr('Escribe AYUDA para ver los comandos. Escribe NORTE para avanzar.', 'hint');
  sep(); showRoom();
}

// ── Secuencia de arranque BBS ──────────────────────────────────
function bbsBoot() {
  pr('', '');
  pr('╔══════════════════════════════════════════════════════════════╗', 'bbs');
  pr('║  V A M P I R E B B S  v 3 . 1  ·  © 1 9 8 8 – 2 0 2 6      ║', 'bbs');
  pr('║  Vampsecure Studios · Madrid (ESP) · Nodos 1-8               ║', 'bbs');
  pr('║  Velocidad: 2400 bd  ·  Terminal: ANSI-BBS  ·  Nodo 3 libre  ║', 'bbs');
  pr('╚══════════════════════════════════════════════════════════════╝', 'bbs');
  prDelay(380);
  pr('Conexión establecida. Bienvenido a VampireBBS, GUEST.', 'desc');
  pr('Última llamada: 18-JUN-26 23:44  ·  Mensajes en espera: 0', 'dim');
  prDelay(500);
  pr('─'.repeat(64), 'sep');
  pr(' [A]venturas conversacionales  [J]uegos de rol  [H]istorial  [Q]uit', 'bbs-m');
  pr('─'.repeat(64), 'sep');
  prDelay(620);
  pr('Selección: A', 'cmd');
  prDelay(350);
  pr('AVENTURAS CONVERSACIONALES — Selecciona un título:', 'bbs-m');
  pr('  1.  ZORK I              (INFOCOM, 1980)', 'bbs-d');
  pr('  2.  ADVENT              (CROWTHER-WOODS, 1977)', 'bbs-d');
  pr('  3.  OUROBOROS  ★ NUEVO ★  (VAMPIREBBS, 2026)', 'bbs-m');
  pr('  4.  Volver al menú principal', 'bbs-d');
  prDelay(750);
  pr('Selección: 3', 'cmd');
  prDelay(300);
  pr('Cargando DOOR: OUROBOROS.EXE...', 'desc');
  prDelay(180);
  pr('CONNECT OK · BAUD 2400 · HANDSHAKE OK', 'bbs-d');
  prDelay(280);
  pr('[████████████████████████████████] 100%', 'ok');
  prDelay(500);
  printQueue.push({_startGame: true});
}

// ── Input handler ──────────────────────────────────────────────
const inp = document.getElementById('inp');
inp.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    initAudio(); // primer gesto del usuario — AudioContext permitido
    const v = inp.value.trim();
    inp.value = '';
    if (printBusy) {
      flushQueue();
      // Ejecutar el comando que el jugador escribió durante la animación
      if (!bootMode && v) { S.history.push(v); S.histIdx = S.history.length; exec(v); }
      return;
    }
    if (!bootMode) {
      if (v) { S.history.push(v); S.histIdx = S.history.length; }
      exec(v);
    }
  } else if (e.key === 'ArrowUp') {
    if (S.histIdx > 0) inp.value = S.history[--S.histIdx];
    e.preventDefault();
  } else if (e.key === 'ArrowDown') {
    if (S.histIdx < S.history.length - 1) inp.value = S.history[++S.histIdx];
    else { S.histIdx = S.history.length; inp.value = ''; }
    e.preventDefault();
  }
});
document.getElementById('out').addEventListener('click', () => inp.focus());

// Primer clic activa audio también
document.getElementById('out').addEventListener('click', () => { initAudio(); inp.focus(); });
inp.focus();
bbsBoot();
