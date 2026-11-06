(function () {
  'use strict';

  const IMG = (k) => '/assets/img/can-' + k + '.webp';
  const IMG_SM = (k) => '/assets/img/can-' + k + '-sm.webp';

  const FLAVORS = {
    focus: {
      name: 'Focus', bg: '#E4D9C6', ink: '#1E2B4F', hero: '#EDB993', caffeine: 100,
      en: { when: 'Morning', tag: 'Smooth energy. Clear focus. No crash.', for: 'Deep work, study sessions and the first hour of the inbox.', effect: 'Smooth cold brew. Caffeine helps improve concentration.', ingredients: ['L-theanine', 'Lion’s mane', 'Rhodiola', 'Guarana'] },
      es: { when: 'Mañana', tag: 'Energía suave. Concentración clara. Sin bajón.', for: 'Trabajo concentrado, sesiones de estudio y la primera hora de correos.', effect: 'Cold brew suave. La cafeína ayuda a mejorar la concentración.', ingredients: ['L-teanina', 'Melena de león', 'Rhodiola', 'Guaraná'] },
    },
    calm: {
      name: 'Calm', bg: '#2E4A2C', ink: '#F1EADF', hero: '#B9D0AE', caffeine: 60,
      en: { when: 'Afternoon', tag: 'Calm mind. Balanced energy. No crash.', for: 'Long meetings and busy days, without the wired feeling.', effect: 'Mellow cold brew. Just 60mg caffeine.', ingredients: ['L-theanine', 'Ashwagandha', 'Chamomile'] },
      es: { when: 'Tarde', tag: 'Mente en calma. Energía equilibrada. Sin bajón.', for: 'Reuniones largas y días ajetreados, sin sentirte acelerado.', effect: 'Cold brew suave y ligero. Solo 60 mg de cafeína.', ingredients: ['L-teanina', 'Ashwagandha', 'Manzanilla'] },
    },
    energy: {
      name: 'Energy', bg: '#3F3470', ink: '#F1EADF', hero: '#C9B8E6', caffeine: 140,
      en: { when: 'Anytime', tag: 'Lifted energy. Steady performance. No crash.', for: 'Training, early starts and long drives.', effect: 'Bold cold brew. Caffeine helps increase alertness.', ingredients: ['L-theanine', 'Guarana', 'Ginseng'] },
      es: { when: 'Cuando quieras', tag: 'Energía elevada. Rendimiento constante. Sin bajón.', for: 'Entrenamientos, madrugones y viajes largos en coche.', effect: 'Cold brew intenso. La cafeína ayuda a aumentar el estado de alerta.', ingredients: ['L-teanina', 'Guaraná', 'Ginseng'] },
    },
  };
  const ORDER = ['focus', 'calm', 'energy'];
  const MAX_CAFFEINE = 140;

  const PLANS = [
    { id: 'single', price: 3.49, cans: 1,
      en: { name: 'Single can', note: 'One-time purchase' },
      es: { name: 'Lata individual', note: 'Compra única' } },
    { id: 'pack', price: 37.68, cans: 12, compare: 41.88,
      en: { name: '12-pack', note: 'One-time purchase', badge: 'Save 10%' },
      es: { name: 'Pack de 12', note: 'Compra única', badge: 'Ahorra un 10%' } },
    { id: 'sub', price: 32.03, cans: 12, compare: 41.88, monthly: true,
      en: { name: '12-pack subscription', note: 'Delivered monthly · skip or cancel anytime', badge: 'Best value' },
      es: { name: 'Suscripción pack de 12', note: 'Envío mensual · pausa o cancela cuando quieras', badge: 'Mejor precio' } },
  ];
  const FROM_PER_CAN = 32.03 / 12;

  const COMPARE = {
    en: [
      ['Energy', 'Caffeine, and not much else', 'Real cold brew plus 100mg L-theanine'],
      ['Sugar & dairy', 'Often loaded with sugar, dairy and additives', '0g sugar, oat milk'],
      ['Function', 'Caffeine only', 'A different botanical blend in each flavor'],
      ['Taste', 'Flavor traded for convenience', 'Real coffee flavor, no weird aftertaste'],
    ],
    es: [
      ['Energía', 'Cafeína, y poco más', 'Cold brew de verdad más 100 mg de L-teanina'],
      ['Azúcar y lácteos', 'A menudo cargado de azúcar, lácteos y aditivos', '0 g de azúcar, bebida de avena'],
      ['Función', 'Solo cafeína', 'Una mezcla botánica distinta en cada sabor'],
      ['Sabor', 'Sabor sacrificado por la comodidad', 'Sabor a café de verdad, sin regusto raro'],
    ],
  };

  const INGREDIENTS = [
    { id: 'cold-brew-coffee', in: ['all'], bg: '#E7C4A4',
      en: { name: 'Cold brew coffee', dose: '60–140mg caffeine', does: '100% Arabica, steeped cold for a smooth, low-acid cup. In Focus and Energy, caffeine helps increase alertness and improve concentration.' },
      es: { name: 'Café cold brew', dose: '60–140 mg de cafeína', does: '100% arábica, extraído en frío para una taza suave y poco ácida. En Focus y Energy, la cafeína ayuda a aumentar el estado de alerta y a mejorar la concentración.' } },
    { id: 'l-theanine', in: ['all'], bg: '#C7E5CC',
      en: { name: 'L-theanine', dose: '100mg', does: 'An amino acid found naturally in green tea, with 100mg in every can.' },
      es: { name: 'L-teanina', dose: '100 mg', does: 'Un aminoácido presente de forma natural en el té verde, con 100 mg en cada lata.' } },
    { id: 'oat-milk', in: ['all'], bg: '#F2E2BF',
      en: { name: 'Oat milk', does: 'A creamy, dairy-free base. No added sugar.' },
      es: { name: 'Bebida de avena', does: 'Una base cremosa y sin lácteos. Sin azúcares añadidos.' } },
    { id: 'lions-mane', in: ['focus'], bg: '#F7D9A6',
      en: { name: 'Lion’s mane', does: 'An edible mushroom prized in East Asian cooking for centuries.' },
      es: { name: 'Melena de león', does: 'Una seta comestible apreciada en la cocina de Asia oriental desde hace siglos.' } },
    { id: 'rhodiola', in: ['focus'], bg: '#F5C9DE',
      en: { name: 'Rhodiola', does: 'An adaptogen that helps the body manage stress and resist fatigue.' },
      es: { name: 'Rhodiola', does: 'Un adaptógeno que ayuda al cuerpo a gestionar el estrés y a resistir la fatiga.' } },
    { id: 'guarana', in: ['focus', 'energy'], bg: '#F8C2AE',
      en: { name: 'Guarana', does: 'A seed from the Amazon, naturally rich in caffeine.' },
      es: { name: 'Guaraná', does: 'Una semilla del Amazonas, rica de forma natural en cafeína.' } },
    { id: 'ashwagandha', in: ['calm'], bg: '#BFE0C4',
      en: { name: 'Ashwagandha', does: 'An adaptogen that helps keep stress in check.' },
      es: { name: 'Ashwagandha', does: 'Un adaptógeno que ayuda a mantener el estrés a raya.' } },
    { id: 'chamomile', in: ['calm'], bg: '#DDEBCD',
      en: { name: 'Chamomile', does: 'A gentle flower traditionally used to help you relax.' },
      es: { name: 'Manzanilla', does: 'Una flor suave usada tradicionalmente para ayudarte a relajarte.' } },
    { id: 'ginseng', in: ['energy'], bg: '#F2C4DB',
      en: { name: 'Ginseng', does: 'A root used for alertness and stamina.' },
      es: { name: 'Ginseng', does: 'Una raíz usada para el estado de alerta y la resistencia.' } },
  ];

  const FAQ = {
    en: [
      ['When can I buy Better Coffee?', 'We’re launching soon. Join the waitlist and we’ll email you the day orders open, plus 15% off subscriptions as a waitlist member.'],
      ['How much caffeine is in each can?', 'Calm has 60mg, Focus 100mg and Energy 140mg of caffeine per 200ml can. Every can also has 100mg of L-theanine.'],
      ['Is it dairy-free?', 'Yes. Every can is made with oat milk instead of dairy.'],
      ['Does it contain sugar?', 'No. Every can has 0g sugar.'],
      ['Who shouldn’t drink it?', 'High caffeine content. Not recommended for children or pregnant or breast-feeding women. If you’re sensitive to caffeine, Calm is the lightest option.'],
      ['How does the subscription work?', 'A 12-pack delivered every month at 15% off. Skip a month or cancel anytime.'],
      ['How should I store it?', 'Keep cans in a cool, dry place and chill them before drinking. Best served cold.'],
    ],
    es: [
      ['¿Cuándo puedo comprar Better Coffee?', 'Lanzamos muy pronto. Únete a la lista de espera y te avisaremos por email el día que abramos los pedidos, con un 15% de descuento en suscripciones por ser de la lista.'],
      ['¿Cuánta cafeína lleva cada lata?', 'Calm lleva 60 mg, Focus 100 mg y Energy 140 mg de cafeína por lata de 200 ml. Todas las latas llevan además 100 mg de L-teanina.'],
      ['¿Lleva lácteos?', 'No. Todas las latas se hacen con bebida de avena en lugar de leche.'],
      ['¿Lleva azúcar?', 'No. Todas las latas tienen 0 g de azúcar.'],
      ['¿Quién no debería tomarlo?', 'Contenido elevado de cafeína. No recomendado para niños ni mujeres embarazadas o en periodo de lactancia. Si eres sensible a la cafeína, Calm es la opción más ligera.'],
      ['¿Cómo funciona la suscripción?', 'Un pack de 12 latas cada mes con un 15% de descuento. Puedes saltarte un mes o cancelar cuando quieras.'],
      ['¿Cómo lo conservo?', 'Guarda las latas en un lugar fresco y seco, y enfríalas antes de tomarlas. Mejor muy frío.'],
    ],
  };

  const WHY_ICONS = [
    '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M6 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/>',
    '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    '<path d="M8 2h8"/><path d="M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2"/><path d="M7 15a6.472 6.472 0 0 1 5 0 6.47 6.47 0 0 0 5 0"/>',
    '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>',
  ];

  const MARQUEE = {
    en: ['Real cold brew coffee', '0g sugar', 'Oat milk', '100mg L-theanine', 'Cold brewed, never bitter', 'Functional stack in every can'],
    es: ['Café cold brew de verdad', '0 g de azúcar', 'Bebida de avena', '100 mg de L-teanina', 'Extraído en frío, nunca amargo', 'Combinación funcional en cada lata'],
  };

  const T = {
    en: {
      announce: 'Launching soon · 15% off subscriptions for waitlist members',
      navCans: 'Our cans', navIngredients: 'Ingredients', navAbout: 'About us', navFaq: 'FAQ', navJoin: 'Join the waitlist',
      heroEyebrow: 'Functional cold latte · Launching soon',
      heroTitle: 'Coffee that does more.',
      heroSub: 'Real cold brew, oat milk and 0g sugar, with a functional blend in every can. Pick your moment: Focus, Calm or Energy.',
      heroSecondary: 'Find your can',
      heroPerk: 'Waitlist members get 15% off subscriptions',
      proofSugar: 'sugar', proofTheanine: 'L-theanine', proofArabica: 'Arabica cold brew', proofDairy: 'dairy · oat milk',
      caffeineShort: 'caffeine', theanineShort: '100mg L-theanine',
      lineupEyebrow: 'The lineup',
      lineupH: 'One can for every part of the day.',
      lineupP: 'Same smooth cold brew base. A different functional blend in each can, so you can pick how you want to feel.',
      caffeineLabel: 'Caffeine', from: 'From', perCan: 'per can', reserve: 'Reserve',
      tagline: 'You’re already <em>10/10</em>, this is just your fuel.',
      why: [
        ['Real cold brew', '100% Arabica, steeped cold for a smooth, low-acid cup.'],
        ['100mg L-theanine', 'An amino acid found naturally in green tea, in every can.'],
        ['Oat milk', 'A creamy, dairy-free base. Nothing artificial to get used to.'],
        ['0g sugar', 'No sugar in any can. Just coffee and the good stuff.'],
      ],
      compareEyebrow: 'Better Coffee vs. the usual',
      compareH: 'Real function. Real coffee flavor.',
      typical: 'Typical canned coffee',
      inside: 'What’s inside',
      insideH: 'Coffee, plus a little help.',
      insideP: 'Every can starts with cold brew, oat milk and 100mg of L-theanine. Each flavor adds its own functional stack.',
      insideNote: 'Enjoy as part of a varied, balanced diet and a healthy lifestyle.',
      all: 'All', every: 'Every can',
      howToBuy: 'Reserve your box · Launching soon',
      lockIn: 'Lock in launch pricing.',
      buyIntro: 'Cold latte with oat milk, 200 ml, 0g sugar. Join the waitlist and we’ll email you the day orders open.',
      flavor: 'Choose your flavor', option: 'Choose your box', stepEmail: 'Save your spot',
      emailLabel: 'Email address', emailPh: 'you@email.com',
      joinCta: 'Join the waitlist',
      reserving: 'Reserving: {summary}. No payment now.',
      summary: '{flavor}, {plan} at {price}',
      onList: 'You’re on the list.',
      confirm: 'We’ll email {email} when orders open. Reserved: {summary}.',
      perMonth: '/mo',
      assure1: 'No payment now', assure2: '15% off subscriptions', assure3: 'Skip or cancel anytime',
      aboutEyebrow: 'About us',
      aboutH: 'Coffee that keeps up with you.',
      aboutP1: 'Better Coffee started with a simple frustration: canned coffee was either loaded with sugar or tasted like an afterthought. We wanted one we’d actually reach for every day.',
      aboutP2: 'So we built it from the coffee up: 100% Arabica, cold brewed for a smooth, low-acid cup, made with oat milk and 0g sugar. Then we gave each part of the day its own can: Focus, Calm and Energy.',
      aboutP3: 'We’re a small team getting ready to launch. Join the waitlist and be among the first to try it.',
      stats: [['100%', 'Arabica coffee, cold brewed'], ['0g', 'Sugar in every can'], ['200ml', 'Cans, made with oat milk'], ['3', 'Flavors for every part of the day']],
      faqEyebrow: 'FAQ', faqH: 'Good questions.', faqMore: 'Something else on your mind?', faqContact: 'Get in touch',
      finalH: 'Be first in line.',
      finalP: 'Join the waitlist for early access and 15% off subscriptions when we launch.',
      finalDone: 'You’re on the list. We’ll be in touch.',
      footerTag: 'Functional cold latte in a can. Focus, Calm, Energy.',
      privacy: 'Privacy Policy', legal: 'Legal Notice', contact: 'Contact', switchTo: 'Ver en español',
      stickyH: '15% off at launch', stickyP: 'For waitlist members', stickyBtn: 'Join',
      accountTitle: 'Your account',
      accountIntro: 'Join the waitlist for early access and 15% off subscriptions when we launch.',
      accountOn: 'You’re on the waitlist', accountAs: 'Signed up as {email}',
      accountPerk: 'We’ll email you the day orders open, with your 15% off code.',
      changeEmail: 'Use a different email', language: 'Language', help: 'Help', close: 'Close',
      canAlt: 'Better Coffee {name} can',
    },
    es: {
      announce: 'Muy pronto · 15% de descuento en suscripciones para la lista de espera',
      navCans: 'Latas', navIngredients: 'Ingredientes', navAbout: 'Nosotros', navFaq: 'Preguntas', navJoin: 'Únete a la lista',
      heroEyebrow: 'Latte frío funcional · Muy pronto',
      heroTitle: 'Café que hace más.',
      heroSub: 'Cold brew de verdad, bebida de avena y 0 g de azúcar, con una mezcla funcional en cada lata. Elige tu momento: Focus, Calm o Energy.',
      heroSecondary: 'Encuentra tu lata',
      heroPerk: 'La lista de espera tiene un 15% de descuento en suscripciones',
      proofSugar: 'de azúcar', proofTheanine: 'de L-teanina', proofArabica: 'cold brew arábica', proofDairy: 'lácteos · avena',
      caffeineShort: 'de cafeína', theanineShort: '100 mg de L-teanina',
      lineupEyebrow: 'La gama',
      lineupH: 'Una lata para cada momento del día.',
      lineupP: 'La misma base de cold brew suave. Una mezcla funcional distinta en cada lata, para que elijas cómo quieres sentirte.',
      caffeineLabel: 'Cafeína', from: 'Desde', perCan: 'por lata', reserve: 'Reservar',
      tagline: 'Ya eres un <em>10/10</em>, esto solo es tu combustible.',
      why: [
        ['Cold brew de verdad', '100% arábica, extraído en frío para una taza suave y poco ácida.'],
        ['100 mg de L-teanina', 'Un aminoácido presente de forma natural en el té verde, en cada lata.'],
        ['Bebida de avena', 'Una base cremosa y sin lácteos. Nada artificial.'],
        ['0 g de azúcar', 'Ninguna lata lleva azúcar. Solo café y lo bueno.'],
      ],
      compareEyebrow: 'Better Coffee vs. lo de siempre',
      compareH: 'Función real. Sabor a café de verdad.',
      typical: 'Café en lata típico',
      inside: 'Qué lleva',
      insideH: 'Café, con una pequeña ayuda.',
      insideP: 'Cada lata parte de cold brew, bebida de avena y 100 mg de L-teanina. Cada sabor añade su propia combinación funcional.',
      insideNote: 'Consúmelo como parte de una dieta variada y equilibrada y de un estilo de vida saludable.',
      all: 'Todas', every: 'Todas las latas',
      howToBuy: 'Reserva tu caja · Muy pronto',
      lockIn: 'Asegura el precio de lanzamiento.',
      buyIntro: 'Latte frío con bebida de avena, 200 ml, 0 g de azúcar. Únete a la lista de espera y te avisaremos por email el día que abramos los pedidos.',
      flavor: 'Elige tu sabor', option: 'Elige tu caja', stepEmail: 'Guarda tu sitio',
      emailLabel: 'Correo electrónico', emailPh: 'tu@email.com',
      joinCta: 'Únete a la lista de espera',
      reserving: 'Reservando: {summary}. No pagas nada ahora.',
      summary: '{flavor}, {plan} a {price}',
      onList: 'Ya estás en la lista.',
      confirm: 'Te escribiremos a {email} cuando abramos los pedidos. Reserva: {summary}.',
      perMonth: '/mes',
      assure1: 'No pagas nada ahora', assure2: '15% dto. en suscripciones', assure3: 'Pausa o cancela cuando quieras',
      aboutEyebrow: 'Sobre nosotros',
      aboutH: 'Café que sigue tu ritmo.',
      aboutP1: 'Better Coffee nació de una frustración muy simple: el café en lata o llevaba un montón de azúcar o sabía a poco. Queríamos uno que de verdad nos apeteciera tomar cada día.',
      aboutP2: 'Así que lo creamos empezando por el café: 100% Arabica, extraído en frío para una taza suave y poco ácida, con bebida de avena y 0 g de azúcar. Después le dimos a cada momento del día su propia lata: Focus, Calm y Energy.',
      aboutP3: 'Somos un equipo pequeño preparando el lanzamiento. Únete a la lista de espera y sé de los primeros en probarlo.',
      stats: [['100%', 'Café Arabica, extraído en frío'], ['0 g', 'De azúcar en cada lata'], ['200ml', 'Latas, con bebida de avena'], ['3', 'Sabores para cada momento del día']],
      faqEyebrow: 'Preguntas frecuentes', faqH: 'Buenas preguntas.', faqMore: '¿Tienes otra duda?', faqContact: 'Escríbenos',
      finalH: 'Sé de los primeros.',
      finalP: 'Únete a la lista de espera para tener acceso anticipado y un 15% de descuento en suscripciones cuando lancemos.',
      finalDone: 'Ya estás en la lista. Te escribiremos pronto.',
      footerTag: 'Latte frío funcional en lata. Focus, Calm, Energy.',
      privacy: 'Política de privacidad', legal: 'Aviso legal', contact: 'Contacto', switchTo: 'View in English',
      stickyH: '15% dto. al lanzar', stickyP: 'Para la lista de espera', stickyBtn: 'Unirme',
      accountTitle: 'Tu cuenta',
      accountIntro: 'Únete a la lista de espera para tener acceso anticipado y un 15% de descuento en suscripciones cuando lancemos.',
      accountOn: 'Estás en la lista de espera', accountAs: 'Registrado como {email}',
      accountPerk: 'Te avisaremos por email el día que abramos los pedidos, con tu código del 15%.',
      changeEmail: 'Usar otro email', language: 'Idioma', help: 'Ayuda', close: 'Cerrar',
      canAlt: 'Lata de Better Coffee {name}',
    },
  };

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const fill = (s, v) => s.replace(/\{(\w+)\}/g, (_, k) => v[k]);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n, lang) => lang === 'es' ? n.toFixed(2).replace('.', ',') + ' €' : '€' + n.toFixed(2);
  const mg = (n, lang) => n + (lang === 'es' ? ' mg' : 'mg');
  const store = {
    get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} },
  };
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const initialLang = () => {
    try {
      const q = new URLSearchParams(window.location.search).get('lang');
      if (q === 'es' || q === 'en') return q;
    } catch (e) {}
    const saved = store.get('bc-lang');
    return saved === 'es' || saved === 'en' ? saved : 'en';
  };

  const state = {
    lang: initialLang(),
    hero: 'focus',
    flavor: 'focus',
    plan: 'sub',
    ingFilter: 'all',
    joinedEmail: store.get('bc-email') || '',
    reserved: false,
  };
  const tx = () => T[state.lang];
  const fl = (k) => Object.assign({ key: k }, FLAVORS[k], FLAVORS[k][state.lang]);
  const plan = (p) => Object.assign({}, p, p[state.lang]);

  function subscribe(email) {
    fetch('https://a.klaviyo.com/client/subscriptions/?company_id=Rgt6u3', {
      method: 'POST',
      headers: { 'content-type': 'application/json', revision: '2024-10-15' },
      body: JSON.stringify({ data: { type: 'subscription', attributes: { profile: { data: { type: 'profile', attributes: { email } } } }, relationships: { list: { data: { type: 'list', id: 'VTWVQX' } } } } }),
    }).catch(function () {});
    store.set('bc-email', email);
    state.joinedEmail = email;
    renderAccount();
  }


  Object.assign(T.en, {
    joinShort: 'Get 15% off', reserveCta: 'Reserve my box', rToday: 'Due today',
    heroDone: 'You’re on the list. Your 15% off is saved.',
    packLine: 'cold latte · oat milk · 0g sugar', packSide: 'functional cold latte', packSub: 'every month · 15% off', stackCoffee: 'coffee', crateCap: '{n} × {flavor}', count: '{n} / 03',
  });
  Object.assign(T.es, {
    joinShort: 'Quiero mi 15%', reserveCta: 'Reservar mi caja', rToday: 'A pagar hoy',
    heroDone: 'Ya estás en la lista. Tu 15% está guardado.',
    packLine: 'latte frío · bebida de avena · 0 g de azúcar', packSide: 'latte frío funcional', packSub: 'cada mes · 15% dto.', stackCoffee: 'café', crateCap: '{n} × {flavor}', count: '{n} / 03',
  });
  const TONE_OF = { focus: 'cream', calm: 'green', energy: 'violet' };
  state.orbit = 'all';
  state.orb = 'cold-brew-coffee';
  state.cmp = 'them';

  /* ---------- Text ---------- */
  function split(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w, i) => '<span class="sw"><span style="--i:' + i + '">' + esc(w) + '</span></span>').join(' ');
  }
  function renderStatic() {
    const t = tx();
    document.documentElement.lang = state.lang;
    $$('[data-i18n]').forEach((el) => {
      const v = t[el.getAttribute('data-i18n')];
      if (typeof v === 'string') el.textContent = v.replace(/<\/?em>/g, '');
    });
    $$('[data-split]').forEach(split);
    $$('[data-i18n-ph]').forEach((el) => { el.placeholder = t[el.getAttribute('data-i18n-ph')]; });
    $$('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t[el.getAttribute('data-i18n-aria')]); });
    $('[data-lang-label]').textContent = state.lang === 'es' ? 'EN' : 'ES';
    $$('[data-set-lang]').forEach((b) => b.classList.toggle('is-on', b.dataset.setLang === state.lang));
    $$('[data-mg]').forEach((el) => { el.textContent = mg(FLAVORS[el.dataset.mg].caffeine, state.lang); });
    $$('.hcan img').forEach((img) => { img.alt = fill(t.canAlt, { name: FLAVORS[img.parentElement.dataset.heroCan].name }); });

    const g = state.lang === 'es' ? '0 g' : '0g';
    $('[data-hero-facts]').innerHTML = [[g, t.proofSugar], [mg(100, state.lang), t.proofTheanine], ['100%', t.proofArabica], ['0', t.proofDairy]]
      .map((f) => '<li><b>' + esc(f[0]) + '</b><span>' + esc(f[1]) + '</span></li>').join('');

    $('[data-statement]').innerHTML = esc(t.tagline.replace(/<\/?em>/g, '')).replace('10/10', '<mark>10/10</mark>');

    $('[data-counts]').innerHTML = t.stats.map((s) => {
      const m = s[0].match(/^(\d+)(.*)$/);
      return '<div class="count"><b data-count="' + (m ? m[1] : '') + '" data-suffix="' + esc(m ? m[2] : '') + '">' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></div>';
    }).join('');
    countsDone = false;

    $('[data-faq]').innerHTML = FAQ[state.lang].map((f, i) =>
      '<details' + (i === 0 ? ' open' : '') + '><summary><span>' + esc(f[0]) + '</span><span class="faq-x" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></span></summary><p class="faq-a">' + esc(f[1]) + '</p></details>'
    ).join('');
  }

  /* ---------- Lineup panels ---------- */
  function renderPanels() {
    const t = tx();
    $('[data-hs-track]').innerHTML = ORDER.map((k, i) => {
      const f = fl(k);
      const stack = [t.stackCoffee].concat(f.ingredients);
      return '<article class="panel" data-panel="' + k + '" style="--p-bg:' + f.bg + ';--p-ink:' + f.ink + '">' +
        '<div class="panel-top"><span class="kicker">' + fill(t.count, { n: String(i + 1).padStart(2, '0') }) + ' · ' + esc(f.when) + '</span><span class="kicker">' + esc(t.lineupEyebrow) + '</span></div>' +
        '<p class="panel-for">' + esc(f.for) + '</p>' +
        '<h2 class="panel-name">' + esc(f.name) + '.</h2>' +
        '<img class="panel-can" src="' + IMG(k) + '" width="462" height="1104" alt="' + esc(fill(t.canAlt, { name: f.name })) + '" loading="lazy">' +
        '<div class="panel-stack"><span class="panel-mg"><b>' + mg(f.caffeine, state.lang) + '</b>' + esc(t.caffeineShort) + '</span>' +
          '<ul class="stack-list">' + stack.map((s) => '<li>' + esc(s) + '.</li>').join('') + '</ul>' +
          '<p class="panel-tag">' + esc(f.tag) + '</p>' +
          '<a href="#reserve" class="pill" data-reserve-flavor="' + k + '">' + esc(t.reserve) + ' ' + esc(f.name) + '</a>' +
        '</div></article>';
    }).join('');
  }
  let hsSpan = 0;
  function updateHS() {
    const hs = $('[data-hs]');
    if (window.innerWidth < 900) { hs.style.removeProperty('--x'); return null; }
    const track = $('[data-hs-track]');
    const r = hs.getBoundingClientRect();
    const span = r.height - window.innerHeight;
    const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
    hsSpan = track.scrollWidth - window.innerWidth;
    track.style.setProperty('--x', (-p * hsSpan).toFixed(1) + 'px');
    $('[data-hs-bar]').style.setProperty('--p', p.toFixed(3));
    const active = r.top <= 1 && r.bottom >= window.innerHeight - 1;
    return active ? ORDER[Math.min(2, Math.round(p * 2))] : null;
  }
  function goPanel(k) {
    const i = ORDER.indexOf(k);
    const hs = $('[data-hs]');
    if (window.innerWidth < 900) {
      hs.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      const panel = $('[data-panel="' + k + '"]');
      const track = $('[data-hs-track]');
      track.scrollTo({ left: panel.offsetLeft - (track.clientWidth - panel.clientWidth) / 2, behavior: 'smooth' });
      return;
    }
    const span = hs.offsetHeight - window.innerHeight;
    window.scrollTo({ top: hs.getBoundingClientRect().top + window.scrollY + span * (i / 2), behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  /* ---------- Orbit ---------- */
  function renderOrbit(animate) {
    const t = tx();
    $('[data-orbit-tabs]').innerHTML = ['all'].concat(ORDER).map((k) =>
      '<button type="button" role="tab" class="seg-btn' + (k === state.orbit ? ' is-on' : '') + '" aria-selected="' + (k === state.orbit) + '" data-orbit-tab="' + k + '">' + esc(k === 'all' ? t.all : FLAVORS[k].name) + '</button>'
    ).join('');
    const list = INGREDIENTS.filter((x) => state.orbit === 'all' || x.in.indexOf('all') > -1 || x.in.indexOf(state.orbit) > -1);
    if (!list.some((x) => x.id === state.orb)) state.orb = list[0].id;
    const core = $('[data-orbit-core]');
    core.classList.toggle('is-trio', state.orbit === 'all');
    core.innerHTML = (state.orbit === 'all' ? ['calm', 'focus', 'energy'] : [state.orbit]).map((k) => '<img src="' + IMG(k) + '" width="462" height="1104" alt="">').join('');
    const orbit = $('[data-orbit]');
    $$('.orb', orbit).forEach((o) => o.remove());
    const n = list.length;
    list.forEach((x0, i) => {
      const x = Object.assign({}, x0, x0[state.lang]);
      const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'orb' + (x.id === state.orb ? ' is-on' : '');
      b.dataset.orb = x.id;
      b.style.cssText = '--x:' + (50 + 43 * Math.cos(a)).toFixed(2) + '%;--y:' + (50 + 41 * Math.sin(a)).toFixed(2) + '%;--i:' + (animate ? i : 0) + ';--ob:' + x.bg;
      b.innerHTML = '<span class="orb-photo"><img src="/assets/img/ingredients/' + x.id + '.webp" alt="" loading="lazy"></span><span class="orb-name">' + esc(x.name) + '</span>';
      orbit.appendChild(b);
    });
    renderOrbDetail();
  }
  function renderOrbDetail() {
    const t = tx();
    const x0 = INGREDIENTS.find((x) => x.id === state.orb);
    const x = Object.assign({}, x0, x0[state.lang]);
    $$('.orb').forEach((o) => o.classList.toggle('is-on', o.dataset.orb === state.orb));
    const tags = x.in.map((k) => {
      const c = k === 'all' ? { bg: '#1E2B4F', ink: '#F1EADF', name: t.every } : FLAVORS[k];
      return '<span class="od-tag" style="--tb:' + c.bg + ';--ti:' + c.ink + '">' + esc(c.name) + '</span>';
    }).join('');
    $('[data-orbit-detail]').innerHTML = '<div class="od-swap">' + (x.dose ? '<p class="od-dose">' + esc(x.dose) + '</p>' : '') +
      '<h3 class="od-name">' + esc(x.name) + '.</h3><p class="od-does" style="margin-top:12px">' + esc(x.does) + '</p><div class="od-tags" style="margin-top:16px">' + tags + '</div></div>';
  }

  /* ---------- Compare switch ---------- */
  function renderCmp(animate) {
    const sw = $('.switch');
    sw.dataset.side = state.cmp;
    $$('.switch-opt').forEach((b) => b.classList.toggle('is-on', b.dataset.cmp === state.cmp));
    const us = state.cmp === 'us';
    const dl = $('[data-cmp-rows]');
    dl.className = 'cmp ' + (us ? 'is-us' : 'is-them') + (animate ? ' cmp-swap' : '');
    dl.innerHTML = COMPARE[state.lang].map((r, i) => '<div class="cmp-row"><dt>' + esc(r[0]) + '</dt><dd style="--i:' + i + '"><i aria-hidden="true">' + (us ? '✓' : '✕') + '</i><span>' + esc(us ? r[2] : r[1]) + '</span></dd></div>').join('');
  }

  /* ---------- Counters ---------- */
  let countsDone = false;
  function runCounts() {
    countsDone = true;
    $$('[data-count]').forEach((el) => {
      const end = +el.dataset.count;
      const suf = el.dataset.suffix;
      if (!end || reduceMotion) return;
      const t0 = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - t0) / 1400);
        el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + suf;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  /* ---------- Reserve ---------- */
  function summary() {
    const t = tx();
    const f = fl(state.flavor);
    const p = plan(PLANS.find((x) => x.id === state.plan));
    return fill(t.summary, { flavor: f.name, plan: p.name.toLowerCase(), price: money(p.price, state.lang) + (p.monthly ? t.perMonth : '') });
  }
  function renderReserve(refill) {
    const t = tx();
    const f = fl(state.flavor);
    const p = plan(PLANS.find((x) => x.id === state.plan));
    renderPack(f, p, t);
    $('[data-crate-cap]').innerHTML = '<b>' + esc(fill(t.crateCap, { n: p.cans, flavor: f.name })) + '</b><span>' + money(p.price / p.cans, state.lang) + ' ' + esc(t.perCan) + '</span>';
    $('[data-flavor-opts]').innerHTML = ORDER.map((k) =>
      '<button type="button" class="flav-btn' + (k === state.flavor ? ' is-on' : '') + '" aria-pressed="' + (k === state.flavor) + '" data-flavor="' + k + '" style="--fb:' + FLAVORS[k].bg + '"><i></i>' + esc(FLAVORS[k].name) + '</button>'
    ).join('');
    $('[data-plans]').innerHTML = PLANS.map((p0) => {
      const x = plan(p0);
      const on = x.id === state.plan;
      return '<button type="button" class="plan' + (on ? ' is-on' : '') + '" aria-pressed="' + on + '" data-plan="' + x.id + '">' +
        '<span class="plan-main"><span class="plan-name">' + esc(x.name) + (x.badge ? '<span class="badge">' + esc(x.badge) + '</span>' : '') + '</span><span class="plan-note">' + esc(x.note) + '</span></span>' +
        '<span class="plan-price">' + (x.compare ? '<s>' + money(x.compare, state.lang) + '</s>' : '') + '<strong>' + money(x.price, state.lang) + (x.monthly ? '<small>' + esc(t.perMonth) + '</small>' : '') + '</strong><small>' + money(x.price / x.cans, state.lang) + ' ' + esc(t.perCan) + '</small></span></button>';
    }).join('');
    $('[data-today]').textContent = money(0, state.lang);
    $('[data-reserving]').textContent = fill(t.reserving, { summary: summary() });
    $('[data-join="reserve"]').hidden = state.reserved;
    $('[data-success]').hidden = !state.reserved;
    if (state.reserved) $('[data-confirm]').textContent = fill(t.confirm, { email: state.reservedEmail, summary: summary() });
  }


  /* ---------- 12-pack carton ---------- */
  const PACK_SHELL = '<div class="scene" data-mode="pack"><div class="scene-in">' +
    '<div class="floor"></div>' +
    '<div class="pack-float"><div class="pack-settle"><div class="pack">' +
      '<div class="face f-back"></div><div class="face f-left"></div><div class="rim"></div><div class="face f-back-in"></div><div class="face f-left-in"></div><div class="fill"></div>' +
      '<div class="lids"></div>' +
      '<div class="face f-right"><div class="pk-side"><p class="pk-side-title" data-pk-side></p><ul class="pk-stack" data-pk-stack></ul><p class="pk-side-foot"><span>200 ml</span><span data-pk-sidemg></span></p></div></div>' +
      '<div class="face f-front"><div class="pk-front"><p class="pk-brand">better coffee<span>.</span></p><p class="pk-count">12 × 200 ml</p>' +
        '<p class="pk-name" data-pk-name></p><p class="pk-line" data-pk-line></p><p class="pk-mg" data-pk-mg></p></div>' +
        '<span class="sticker" data-pk-sticker></span></div>' +
    '</div></div></div>' +
    '<div class="single"><img data-pk-single src="" width="240" height="573" alt=""></div>' +
  '</div></div>';
  let packFlavor = null;
  let packMode = null;
  let packShown = false;
  function packStep() { return 70; }
  function dropCans(scene, k, animate) {
    const lids = $('.lids', scene);
    const step = packStep();
    const build = () => {
      const d = (r, c) => (animate ? (r * 4 + c) * step : 0) + 'ms';
      let l = '';
      for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) l += '<i class="lid" style="--d:' + d(r, c) + '"></i>';
      lids.innerHTML = l;
      scene.classList.toggle('no-anim', !animate);
      clearTimeout(scene._fullT);
      if (animate) { scene.classList.remove('full'); scene._fullT = setTimeout(() => scene.classList.add('full'), 11 * step + 650); } else scene.classList.add('full');
      const st = $('.pack-settle', scene);
      st.classList.remove('settle');
      if (animate) { void st.offsetWidth; st.style.setProperty('--sd', (11 * step + 520) + 'ms'); st.classList.add('settle'); }
    };
    if (animate && lids.children.length) {
      scene.classList.add('lift');
      scene.classList.remove('full');
      setTimeout(() => { scene.classList.remove('lift'); build(); }, 320);
    } else build();
  }
  function renderPack(f, p, t) {
    const host = $('[data-crate]');
    let scene = $('.scene', host);
    if (!scene) { host.innerHTML = PACK_SHELL; scene = $('.scene', host); setupPackTilt(scene); }
    const mode = p.cans === 1 ? 'single' : 'pack';
    scene.style.setProperty('--c-bg', f.bg);
    scene.style.setProperty('--c-ink', f.ink);
    scene.dataset.sub = p.monthly ? '1' : '0';
    $('[data-pk-name]', scene).textContent = f.name + '.';
    $('[data-pk-line]', scene).textContent = t.packLine;
    $('[data-pk-mg]', scene).textContent = mg(f.caffeine, state.lang) + ' ' + t.caffeineShort + ' · ' + t.theanineShort;
    $('[data-pk-side]', scene).textContent = t.packSide;
    $('[data-pk-stack]', scene).innerHTML = [t.stackCoffee].concat(f.ingredients).map((x) => '<li>' + esc(x) + '.</li>').join('');
    $('[data-pk-sidemg]', scene).textContent = mg(f.caffeine, state.lang);
    $('[data-pk-sticker]', scene).textContent = t.packSub;
    const single = $('[data-pk-single]', scene);
    single.alt = fill(t.canAlt, { name: f.name });
    const flavorChanged = f.key !== packFlavor;
    const modeChanged = mode !== packMode;
    packFlavor = f.key;
    packMode = mode;
    if (mode === 'single') {
      if (flavorChanged || modeChanged) {
        single.src = IMG(f.key);
        const holder = single.parentElement;
        scene.dataset.mode = 'pack'; void holder.offsetWidth; scene.dataset.mode = 'single';
      }
      return;
    }
    scene.dataset.mode = 'pack';
    if (!packShown) { if (reduceMotion) { packShown = true; dropCans(scene, f.key, false); } return; }
    if (flavorChanged || modeChanged) dropCans(scene, f.key, !reduceMotion);
  }
  function revealPack() {
    if (packShown) return;
    packShown = true;
    const scene = $('[data-crate] .scene');
    if (scene && packMode === 'pack') dropCans(scene, packFlavor, !reduceMotion);
  }
  function setupPackTilt(scene) {
    if (reduceMotion || !window.matchMedia('(pointer: fine)').matches) return;
    const col = scene.closest('.crate-col') || scene;
    col.addEventListener('mousemove', (e) => {
      const r = scene.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      scene.style.setProperty('--ry', (dx * 26).toFixed(2) + 'deg');
      scene.style.setProperty('--rx', (dy * -10).toFixed(2) + 'deg');
    });
    col.addEventListener('mouseleave', () => { scene.style.setProperty('--ry', '0deg'); scene.style.setProperty('--rx', '0deg'); });
  }

  /* ---------- Account ---------- */
  function renderAccount() {
    const joined = !!state.joinedEmail;
    $('[data-account-joined]').hidden = !joined;
    $('[data-account-form]').hidden = joined;
    $('[data-account-as]').textContent = fill(tx().accountAs, { email: state.joinedEmail });
  }
  let lastFocus = null;
  function openDrawer() {
    lastFocus = document.activeElement;
    $('[data-overlay]').classList.add('is-open');
    $('[data-drawer]').classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { const c = $('[data-drawer] .drawer-close'); if (c) c.focus(); }, 50);
  }
  function closeDrawer() {
    $('[data-overlay]').classList.remove('is-open');
    $('[data-drawer]').classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function handleJoin(form) {
    const input = form.querySelector('input[type="email"]');
    const email = (input.value || '').trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const box = form.classList.contains('capture') ? form : input;
    box.classList.toggle('is-invalid', !ok);
    if (!ok) { input.focus(); return; }
    subscribe(email);
    const kind = form.dataset.join;
    if (kind === 'reserve') { state.reserved = true; state.reservedEmail = email; renderReserve(false); }
    if (kind === 'final') { form.hidden = true; $('[data-final-done]').hidden = false; }
    if (kind === 'hero') { form.hidden = true; $('[data-hero-note]').hidden = true; const d = $('[data-hero-done]'); d.textContent = tx().heroDone; d.hidden = false; }
  }

  /* ---------- Scroll ---------- */
  let io = null;
  function observe() {
    if (!('IntersectionObserver' in window) || reduceMotion) { $$('[data-split]').forEach((e) => e.classList.add('is-in')); return; }
    if (!io) io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { threshold: 0.2 });
    $$('[data-split]:not(.is-in)').forEach((e) => io.observe(e));
  }
  let tone = 'cream';
  let cmpFlipped = false;
  function onScroll() {
    ticking = false;
    const vh = window.innerHeight;
    const mid = vh * 0.5;
    let next = null;
    const hsTone = updateHS();
    if (hsTone) next = TONE_OF[hsTone];
    if (!next) {
      $$('[data-tone-section]').forEach((s) => { const r = s.getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) next = s.dataset.toneSection; });
      if (!next && window.innerWidth < 900) { const r = $('[data-hs]').getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) next = 'cream'; }
    }
    if (next && next !== tone) { tone = next; document.body.dataset.tone = tone; }

    $$('[data-par]').forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      el.style.setProperty('--py', (((r.top + r.height / 2) - mid) * +el.dataset.par).toFixed(1) + 'px');
    });

    if (!packShown) { const cr = $('[data-crate]').getBoundingClientRect(); if (cr.top < vh * 0.75 && cr.bottom > 0) revealPack(); }
    const counts = $('[data-counts]').getBoundingClientRect();
    if (!countsDone && counts.top < vh * 0.85) runCounts();
    const sw = $('.switch').getBoundingClientRect();
    if (!cmpFlipped && sw.top < vh * 0.7) { cmpFlipped = true; setTimeout(() => { if (state.cmp === 'them') { state.cmp = 'us'; renderCmp(true); } }, 1100); }

    const inView = (el) => { const r = el.getBoundingClientRect(); return r.top < vh && r.bottom > 0; };
    $('[data-dock]').classList.toggle('is-on', $('.hero').getBoundingClientRect().bottom < 0 && !inView($('#reserve')) && !inView($('.footer')));
  }
  let ticking = false;

  function setupTilt() {
    const hero = $('.hero');
    const cans = $$('.hcan');
    if (reduceMotion || !window.matchMedia('(pointer: fine)').matches) return;
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      cans.forEach((c, i) => {
        const m = [1.2, 0.8, 1.2][i];
        c.style.setProperty('--ry', (dx * 22 * m).toFixed(2) + 'deg');
        c.style.setProperty('--rx', (-dy * 10 * m).toFixed(2) + 'deg');
      });
    });
    hero.addEventListener('mouseleave', () => cans.forEach((c) => { c.style.setProperty('--ry', '0deg'); c.style.setProperty('--rx', '0deg'); }));
  }

  function renderAll(animate) {
    renderStatic();
    renderPanels();
    renderOrbit(animate);
    renderCmp(false);
    renderReserve(true);
    renderAccount();
    observe();
    $$('[data-split]').forEach((e) => { const r = e.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) e.classList.add('is-in'); });
    onScroll();
  }
  function setLang(lang) {
    state.lang = lang;
    store.set('bc-lang', lang);
    renderAll(false);
  }

  function setupEvents() {
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    window.addEventListener('resize', () => requestAnimationFrame(onScroll));
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-reserve-flavor],[data-flavor],[data-plan],[data-hero-can],[data-orbit-tab],[data-orb],[data-cmp],[data-open-account],[data-close-drawer],[data-set-lang],[data-toggle-lang],[data-forget],[data-overlay]');
      if (!el) return;
      if (el.matches('[data-reserve-flavor]')) { state.flavor = el.dataset.reserveFlavor; renderReserve(true); return; }
      if (el.matches('[data-flavor]')) { if (state.flavor !== el.dataset.flavor) { state.flavor = el.dataset.flavor; renderReserve(true); } return; }
      if (el.matches('[data-plan]')) { if (state.plan !== el.dataset.plan) { state.plan = el.dataset.plan; renderReserve(true); } return; }
      if (el.matches('[data-hero-can]')) { goPanel(el.dataset.heroCan); return; }
      if (el.matches('[data-orbit-tab]')) { state.orbit = el.dataset.orbitTab; renderOrbit(true); return; }
      if (el.matches('[data-orb]')) { state.orb = el.dataset.orb; renderOrbDetail(); return; }
      if (el.matches('[data-cmp]')) { cmpFlipped = true; if (state.cmp !== el.dataset.cmp) { state.cmp = el.dataset.cmp; renderCmp(true); } return; }
      if (el.matches('[data-open-account]')) { openDrawer(); return; }
      if (el.matches('[data-close-drawer]') || el.matches('[data-overlay]')) { closeDrawer(); return; }
      if (el.matches('[data-set-lang]')) { setLang(el.dataset.setLang); return; }
      if (el.matches('[data-toggle-lang]')) { setLang(state.lang === 'es' ? 'en' : 'es'); return; }
      if (el.matches('[data-forget]')) {
        store.set('bc-email', '');
        state.joinedEmail = '';
        state.reserved = false;
        renderAccount();
        renderReserve(false);
        const i = $('#account-email'); if (i) { i.value = ''; i.focus(); }
      }
    });
    document.addEventListener('mouseover', (e) => {
      const o = e.target.closest('[data-orb]');
      if (o && o.dataset.orb !== state.orb && window.matchMedia('(pointer: fine)').matches) { state.orb = o.dataset.orb; renderOrbDetail(); }
    });
    document.addEventListener('submit', (e) => {
      const form = e.target.closest('[data-join]');
      if (!form) return;
      e.preventDefault();
      handleJoin(form);
    });
    document.addEventListener('input', (e) => {
      const c = e.target.closest('.is-invalid') || (e.target.classList.contains('is-invalid') ? e.target : null);
      if (c) c.classList.remove('is-invalid');
    });
    document.addEventListener('keydown', (e) => {
      const drawer = $('[data-drawer]');
      if (!drawer.classList.contains('is-open')) return;
      if (e.key === 'Escape') { closeDrawer(); return; }
      if (e.key === 'Tab') {
        const f = $$('button, a[href], input', drawer).filter((x) => x.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  renderAll(false);
  setupTilt();
  setupEvents();
})();
