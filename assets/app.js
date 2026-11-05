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
      heroTitle: 'Cold coffee that does more.',
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
      heroTitle: 'Café frío que hace más.',
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


  const EXTRA = {
    en: {
      specSugar: 'Sugar', specTheanine: 'L-theanine', specCan: 'Can', specBase: 'Base', specBaseVal: 'Oat milk',
      receiptTitle: 'Order preview',
      factsTitle: 'Functional facts', factsSub: 'Per can · 200 ml',
      fCaffeine: 'Caffeine', fTheanine: 'L-theanine', fSugar: 'Sugar', fDairy: 'Dairy', fDairyVal: '0g · oat milk', fStack: 'Functional stack',
      factsNote: 'High caffeine content. Not recommended for children or pregnant or breast-feeding women.',
      mxIng: 'Ingredient', mxWhat: 'What it is',
      usual: 'The usual',
      rFlavor: 'Flavor', rBox: 'Box', rPrice: 'Price', rPerCan: 'Per can', rPerk: 'Waitlist perk', rPerkVal: '15% off subs', rToday: 'Due today',
      badge: '15% OFF · JOIN THE WAITLIST · ',
      count: '{n} / 03',
    },
    es: {
      specSugar: 'Azúcar', specTheanine: 'L-teanina', specCan: 'Lata', specBase: 'Base', specBaseVal: 'Avena',
      receiptTitle: 'Resumen del pedido',
      factsTitle: 'Datos funcionales', factsSub: 'Por lata · 200 ml',
      fCaffeine: 'Cafeína', fTheanine: 'L-teanina', fSugar: 'Azúcar', fDairy: 'Lácteos', fDairyVal: '0 g · avena', fStack: 'Mezcla funcional',
      factsNote: 'Contenido elevado de cafeína. No recomendado para niños ni mujeres embarazadas o en periodo de lactancia.',
      mxIng: 'Ingrediente', mxWhat: 'Qué es',
      usual: 'Lo de siempre',
      rFlavor: 'Sabor', rBox: 'Caja', rPrice: 'Precio', rPerCan: 'Por lata', rPerk: 'Ventaja lista', rPerkVal: '15% dto. subs', rToday: 'A pagar hoy',
      badge: '15% DTO · ÚNETE A LA LISTA · ',
      count: '{n} / 03',
    },
  };
  Object.assign(T.en, EXTRA.en);
  Object.assign(T.es, EXTRA.es);

  /* ---------- Static text ---------- */
  function renderStatic() {
    const t = tx();
    document.documentElement.lang = state.lang;
    $$('[data-i18n]').forEach((el) => {
      const v = t[el.getAttribute('data-i18n')];
      if (typeof v === 'string') el.textContent = v.replace(/<\/?em>/g, '');
    });
    $$('[data-i18n-ph]').forEach((el) => { el.placeholder = t[el.getAttribute('data-i18n-ph')]; });
    $$('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t[el.getAttribute('data-i18n-aria')]); });
    $$('.hc').forEach((img) => { const k = img.className.match(/hc-(\w+)/)[1]; img.alt = fill(t.canAlt, { name: FLAVORS[k].name }); });
    $$('[data-set-lang]').forEach((b) => b.classList.toggle('is-on', b.dataset.setLang === state.lang));
    const bp = $('[data-badge]'); bp.textContent = t.badge; bp.setAttribute('textLength', '462'); bp.setAttribute('lengthAdjust', 'spacing');

    const ann = new Array(8).fill('<span>' + esc(t.announce) + '</span><span>✦</span>').join('');
    $('[data-announce]').innerHTML = ann;
    const run = MARQUEE[state.lang].concat(MARQUEE[state.lang]);
    $('[data-marquee]').innerHTML = run.map((s) => '<span class="t-item">' + esc(s) + '</span><span class="t-sep">//</span>').join('');

    const words = t.tagline.replace(/<\/?em>/g, '').split(' ');
    $('[data-statement]').innerHTML = words.map((w) => {
      const hl = w.indexOf('10/10') > -1 ? ' hl' : '';
      const can = /,$/.test(w) ? ' <img class="inline-can" src="' + IMG_SM('energy') + '" alt="" width="240" height="573">' : '';
      return '<span class="w' + hl + '">' + esc(w) + '</span>' + can;
    }).join(' ');

    $('[data-stats]').innerHTML = t.stats.map((s) => '<div class="stat"><strong>' + esc(s[0]) + '</strong><span>' + esc(s[1]) + '</span></div>').join('');

    $('[data-faq]').innerHTML = FAQ[state.lang].map((f, i) =>
      '<details' + (i === 0 ? ' open' : '') + '><summary><span>' + esc(f[0]) + '</span><span class="faq-tog" aria-hidden="true"></span></summary><p class="faq-a">' + esc(f[1]) + '</p></details>'
    ).join('');

    const rows = COMPARE[state.lang];
    const card = (cls, title, idx) => '<div class="vs-card ' + cls + '"><p class="vs-title">' + esc(title) + '</p><dl>' +
      rows.map((r) => '<div class="vs-row"><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[idx]) + '</dd></div>').join('') + '</dl></div>';
    $('[data-versus]').innerHTML = card('them', t.usual, 1) + card('us', 'Better Coffee', 2);

    renderMatrix();
  }

  /* ---------- Functional facts label ---------- */
  function factsHTML(k) {
    const t = tx();
    const f = fl(k);
    return '<p class="facts-title">' + esc(t.factsTitle) + '</p>' +
      '<p class="facts-sub">' + esc(f.name) + ' · ' + esc(t.factsSub) + '</p>' +
      '<div class="facts-row"><b>' + esc(t.fCaffeine) + '</b><b>' + mg(f.caffeine, state.lang) + '</b></div>' +
      '<div class="facts-row"><b>' + esc(t.fTheanine) + '</b><b>' + mg(100, state.lang) + '</b></div>' +
      '<div class="facts-row"><span>' + esc(t.fSugar) + '</span><span>' + (state.lang === 'es' ? '0 g' : '0g') + '</span></div>' +
      '<div class="facts-row thick"><span>' + esc(t.fDairy) + '</span><span>' + esc(t.fDairyVal) + '</span></div>' +
      '<div class="facts-bot"><b>' + esc(t.fStack) + '</b>' + esc(f.ingredients.join(', ')) + '</div>' +
      '<p class="facts-note">' + esc(t.factsNote) + '</p>';
  }

  /* ---------- Story ---------- */
  let storyIdx = -1;
  function renderStory(idx, animate) {
    const t = tx();
    const k = ORDER[idx];
    const f = fl(k);
    const story = $('[data-story]');
    story.style.setProperty('--s-bg', f.bg);
    story.style.setProperty('--s-ink', f.ink);
    $('[data-story-count]').textContent = fill(t.count, { n: String(idx + 1).padStart(2, '0') });
    $('[data-story-when]').textContent = f.when;
    $('[data-story-name]').textContent = f.name;
    $('[data-story-tag]').textContent = f.tag;
    $('[data-story-for]').textContent = f.for;
    const cta = $('[data-story-cta]');
    cta.textContent = t.reserve + ' ' + f.name;
    cta.dataset.reserveFlavor = k;
    $('[data-story-facts]').innerHTML = factsHTML(k);
    $$('[data-story-can]').forEach((img) => img.classList.toggle('is-on', img.dataset.storyCan === k));
    $$('[data-story-nav] button').forEach((b, i) => b.classList.toggle('is-on', i === idx));
    if (animate && !reduceMotion) {
      const copy = $('.story-copy');
      copy.classList.remove('story-swap'); void copy.offsetWidth; copy.classList.add('story-swap');
    }
  }
  function renderStoryChrome() {
    $('[data-story-nav]').innerHTML = ORDER.map((k, i) =>
      '<button type="button" data-story-go="' + i + '"><span>' + String(i + 1).padStart(2, '0') + ' ' + esc(FLAVORS[k].name) + '</span><span>' + mg(FLAVORS[k].caffeine, state.lang) + '</span></button>'
    ).join('');
    const t = tx();
    $('[data-story-mobile]').innerHTML = ORDER.map((k, i) => {
      const f = fl(k);
      return '<div class="sm-panel" style="--s-bg:' + f.bg + ';--s-ink:' + f.ink + '">' +
        '<p class="mono-label">' + fill(t.count, { n: String(i + 1).padStart(2, '0') }) + ' · ' + esc(f.when) + '</p>' +
        '<h3 class="story-name">' + esc(f.name) + '</h3>' +
        '<p class="story-tag">' + esc(f.tag) + '</p>' +
        '<p class="story-for">' + esc(f.for) + '</p>' +
        '<a href="#reserve" class="btn btn-stage" data-reserve-flavor="' + k + '">' + esc(t.reserve) + ' ' + esc(f.name) + '</a>' +
        '<div class="facts">' + factsHTML(k) + '</div>' +
        '<div class="sm-can"><img src="' + IMG(k) + '" alt="' + esc(fill(t.canAlt, { name: f.name })) + '" width="462" height="1104" loading="lazy"></div>' +
      '</div>';
    }).join('');
    storyIdx = -1;
  }
  function storyProgress() {
    const story = $('[data-story]');
    const r = story.getBoundingClientRect();
    const span = r.height - window.innerHeight;
    return span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
  }
  function updateStory() {
    const p = storyProgress();
    const idx = Math.min(ORDER.length - 1, Math.floor(p * ORDER.length));
    if (idx !== storyIdx) { renderStory(idx, storyIdx !== -1); storyIdx = idx; }
    $$('[data-story-nav] button').forEach((b, i) => {
      const local = Math.min(1, Math.max(0, p * ORDER.length - i));
      b.style.setProperty('--p', (local * 100).toFixed(1) + '%');
    });
  }
  function goStory(i) {
    const story = $('[data-story]');
    const span = story.offsetHeight - window.innerHeight;
    const top = story.getBoundingClientRect().top + window.scrollY + span * ((i + 0.15) / ORDER.length);
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  /* ---------- Statement fill ---------- */
  function updateStatement() {
    const el = $('[data-statement]');
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
    const ws = $$('.w', el);
    const n = Math.round(p * ws.length);
    ws.forEach((w, i) => w.classList.toggle('on', i < n));
  }

  /* ---------- Matrix ---------- */
  function renderMatrix() {
    const t = tx();
    const head = '<div class="mx-row mx-head" role="row"><span role="columnheader">' + esc(t.mxIng) + '</span><span class="mx-d" role="columnheader">' + esc(t.mxWhat) + '</span>' +
      ORDER.map((k) => '<span class="mx-c" role="columnheader"><span class="mx-flavor" style="--d:' + FLAVORS[k].bg + '"><i></i>' + esc(FLAVORS[k].name) + '</span></span>').join('') + '</div>';
    const rows = INGREDIENTS.map((x0) => {
      const x = Object.assign({}, x0, x0[state.lang]);
      return '<div class="mx-row" role="row">' +
        '<div class="mx-name" role="cell"><span class="mx-photo" style="--ing-bg:' + x.bg + '"><img src="' + '/assets/img/ingredients/' + x.id + '.webp" alt="" loading="lazy"></span><div><h3>' + esc(x.name) + '</h3>' + (x.dose ? '<span class="mx-dose">' + esc(x.dose) + '</span>' : '') + '</div></div>' +
        '<p class="mx-desc" role="cell">' + esc(x.does) + '</p>' +
        ORDER.map((k) => {
          const has = x.in.indexOf('all') > -1 || x.in.indexOf(k) > -1;
          return '<span class="mx-c" role="cell" aria-label="' + esc(FLAVORS[k].name + (has ? ' ✓' : ' –')) + '">' + (has ? '<span class="dot" style="--d:' + FLAVORS[k].bg + '"></span>' : '<span class="dash"></span>') + '</span>';
        }).join('') +
      '</div>';
    }).join('');
    $('[data-matrix]').innerHTML = head + rows;
  }

  /* ---------- Order ---------- */
  function renderOrder() {
    const t = tx();
    const f = fl(state.flavor);
    const p = plan(PLANS.find((x) => x.id === state.plan));
    $('[data-flavor-opts]').innerHTML = ORDER.map((k) => {
      const on = k === state.flavor;
      return '<button type="button" class="tile' + (on ? ' is-on' : '') + '" aria-pressed="' + on + '" data-flavor="' + k + '" style="--t-bg:' + FLAVORS[k].bg + ';--t-ink:' + FLAVORS[k].ink + '">' +
        '<span class="tile-name">' + esc(FLAVORS[k].name) + '</span><span class="tile-mg">' + mg(FLAVORS[k].caffeine, state.lang) + ' ' + esc(t.caffeineShort) + '</span>' +
        '<img src="' + IMG_SM(k) + '" alt="" width="240" height="573">' +
        '<span class="tile-check" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span></button>';
    }).join('');
    $('[data-plans]').innerHTML = PLANS.map((p0) => {
      const x = plan(p0);
      const on = x.id === state.plan;
      return '<button type="button" class="plan' + (on ? ' is-on' : '') + '" aria-pressed="' + on + '" data-plan="' + x.id + '"><span class="box" aria-hidden="true"></span>' +
        '<span class="plan-main"><span class="plan-name">' + esc(x.name) + (x.badge ? '<span class="tagb">' + esc(x.badge) + '</span>' : '') + '</span><span class="plan-note">' + esc(x.note) + '</span></span>' +
        '<span class="plan-price">' + (x.compare ? '<s>' + money(x.compare, state.lang) + '</s>' : '') + '<strong>' + money(x.price, state.lang) + '</strong><small>' + (x.monthly ? esc(t.perMonth) + ' · ' : '') + money(x.price / x.cans, state.lang) + ' ' + esc(t.perCan) + '</small></span></button>';
    }).join('');

    const line = (a, b, cls) => '<div class="r-line' + (cls ? ' ' + cls : '') + '"><span>' + esc(a) + '</span><i></i><span>' + esc(b) + '</span></div>';
    $('[data-receipt]').innerHTML =
      line(t.rFlavor, f.name) +
      line(t.rBox, p.name) +
      line(t.rPrice, money(p.price, state.lang) + (p.monthly ? t.perMonth : '')) +
      line(t.rPerCan, money(p.price / p.cans, state.lang)) +
      line(t.rPerk, t.rPerkVal, 'r-perk') +
      line(t.rToday, money(0, state.lang), 'r-total');

    $('[data-join="reserve"]').hidden = state.reserved;
    $('[data-success]').hidden = !state.reserved;
    if (state.reserved) $('[data-confirm]').textContent = fill(t.confirm, { email: state.reservedEmail, summary: summary() });
  }
  function summary() {
    const t = tx();
    const f = fl(state.flavor);
    const p = plan(PLANS.find((x) => x.id === state.plan));
    return fill(t.summary, { flavor: f.name, plan: p.name.toLowerCase(), price: money(p.price, state.lang) + (p.monthly ? t.perMonth : '') });
  }

  /* ---------- Account drawer ---------- */
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
    const input = $('#account-email');
    if (input && !state.joinedEmail && !input.value) input.value = $('#reserve-email').value;
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
    input.classList.toggle('is-invalid', !ok);
    if (!ok) { input.focus(); return; }
    subscribe(email);
    if (form.dataset.join === 'reserve') { state.reserved = true; state.reservedEmail = email; renderOrder(); }
    if (form.dataset.join === 'final') { form.hidden = true; $('[data-final-done]').hidden = false; }
  }

  function renderAll() {
    renderStatic();
    renderStoryChrome();
    renderOrder();
    renderAccount();
    onScroll();
  }
  function setLang(lang) {
    state.lang = lang;
    store.set('bc-lang', lang);
    renderAll();
  }

  /* ---------- Scroll ---------- */
  let ticking = false;
  function onScroll() {
    ticking = false;
    $('.nav').classList.toggle('is-scrolled', window.scrollY > 40);
    if (window.innerWidth >= 900) updateStory();
    if (reduceMotion) $$('[data-statement] .w').forEach((w) => w.classList.add('on')); else updateStatement();
    const vh = window.innerHeight;
    const inView = (el) => { const r = el.getBoundingClientRect(); return r.top < vh && r.bottom > 0; };
    const pastHero = $('.hero').getBoundingClientRect().bottom < 0;
    $('[data-sticky-cta]').classList.toggle('is-on', pastHero && !inView($('#reserve')) && !inView($('.footer')));
  }

  function setupEvents() {
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    window.addEventListener('resize', () => requestAnimationFrame(onScroll));
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-reserve-flavor],[data-flavor],[data-plan],[data-story-go],[data-open-account],[data-close-drawer],[data-set-lang],[data-toggle-lang],[data-forget],[data-overlay]');
      if (!el) return;
      if (el.matches('[data-reserve-flavor]')) { state.flavor = el.dataset.reserveFlavor; renderOrder(); return; }
      if (el.matches('[data-flavor]')) { state.flavor = el.dataset.flavor; renderOrder(); return; }
      if (el.matches('[data-plan]')) { state.plan = el.dataset.plan; renderOrder(); return; }
      if (el.matches('[data-story-go]')) { goStory(+el.dataset.storyGo); return; }
      if (el.matches('[data-open-account]')) { openDrawer(); return; }
      if (el.matches('[data-close-drawer]') || el.matches('[data-overlay]')) { closeDrawer(); return; }
      if (el.matches('[data-set-lang]')) { setLang(el.dataset.setLang); return; }
      if (el.matches('[data-toggle-lang]')) { setLang(state.lang === 'es' ? 'en' : 'es'); return; }
      if (el.matches('[data-forget]')) {
        store.set('bc-email', '');
        state.joinedEmail = '';
        state.reserved = false;
        renderAccount();
        renderOrder();
        const i = $('#account-email'); if (i) { i.value = ''; i.focus(); }
      }
    });
    document.addEventListener('submit', (e) => {
      const form = e.target.closest('[data-join]');
      if (!form) return;
      e.preventDefault();
      handleJoin(form);
    });
    document.addEventListener('input', (e) => {
      if (e.target.classList && e.target.classList.contains('is-invalid')) e.target.classList.remove('is-invalid');
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

  renderAll();
  setupEvents();
})();
