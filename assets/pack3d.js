(function () {
  'use strict';

  const host = document.querySelector('[data-crate]');
  if (!host) return;
  const scriptEl = document.currentScript;
  const THREE_SRC = (scriptEl && scriptEl.src ? scriptEl.src.replace(/pack3d\.js(\?.*)?$/, '') : '/assets/') + 'vendor/three.min.js';
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function webglOK() {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }

  let started = false;
  function load() {
    if (started || !webglOK()) return;
    started = true;
    if (window.THREE) { init(); return; }
    const s = document.createElement('script');
    s.src = THREE_SRC;
    s.async = true;
    s.onload = () => { try { init(); } catch (e) { host.classList.remove('is-3d'); } };
    document.head.appendChild(s);
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); load(); } }, { rootMargin: '150% 0px' });
    io.observe(host);
  } else load();

  /* ---------- dimensions (world units: can radius = 1) ---------- */
  const R = 1;
  const HC = 4.78;
  const GAP = 2.08;
  const W = 4 * GAP + 0.14;
  const D = 3 * GAP + 0.14;
  const H = 3.05;
  const TH = 0.07;
  const DROP_FROM = 13;
  const DROP_MS = 1150;
  const STEP_MS = 85;
  const LIFT_MS = 420;
  const FONT = '"Archivo", "Helvetica Neue", Arial, sans-serif';
  const SLOW = (() => { const m = /[?&]slow3d=(\d+)/.exec(window.location.search); return m ? Math.max(1, +m[1]) : 1; })();

  function init() {
    const T = window.THREE;
    const wrap = document.createElement('div');
    wrap.className = 'pack3d';
    wrap.setAttribute('aria-hidden', 'true');
    host.appendChild(wrap);

    const renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.NoToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
    wrap.appendChild(renderer.domElement);
    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    const scene = new T.Scene();
    const pmrem = new T.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(studio(T), 0.035).texture;

    const camera = new T.PerspectiveCamera(27, 1, 0.1, 200);
    const LOOK = new T.Vector3(0, 1.9, 0);

    scene.add(new T.HemisphereLight(0xffffff, 0xcdbfa6, 0.38));
    const key = new T.DirectionalLight(0xfff6ea, 1.05);
    key.position.set(7, 15, 9);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -10; key.shadow.camera.right = 10;
    key.shadow.camera.top = 10; key.shadow.camera.bottom = -10;
    key.shadow.camera.near = 1; key.shadow.camera.far = 40;
    key.shadow.bias = -0.0004;
    key.shadow.radius = 5;
    scene.add(key);
    const rim = new T.DirectionalLight(0xffffff, 0.3);
    rim.position.set(-9, 7, -6);
    scene.add(rim);

    const ground = new T.Mesh(new T.PlaneGeometry(80, 80), new T.ShadowMaterial({ opacity: 0.2 }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const root = new T.Group();
    const settle = new T.Group();
    root.add(settle);
    scene.add(root);

    /* ---------- materials ---------- */
    const metal = new T.MeshStandardMaterial({ color: 0xdfe3e8, metalness: 1, roughness: 0.26 });
    const metalDark = new T.MeshStandardMaterial({ color: 0xb9bfc6, metalness: 1, roughness: 0.38 });
    const kraft = new T.MeshStandardMaterial({ color: 0xb79c76, roughness: 0.92, envMapIntensity: 0.35 });
    const kraftDark = new T.MeshStandardMaterial({ color: 0x9a8160, roughness: 0.95, envMapIntensity: 0.35 });
    const edge = new T.MeshStandardMaterial({ color: 0xe2d2b4, roughness: 0.85, envMapIntensity: 0.35 });
    const kraftFloor = new T.MeshStandardMaterial({ color: 0x7a6247, roughness: 0.97, envMapIntensity: 0.2 });

    /* ---------- can geometry ---------- */
    const profile = [
      [0, 0.12], [0.5, 0.05], [0.84, 0.0], [0.94, 0.03], [0.99, 0.13], [1, 0.3],
      [1, HC - 0.44], [0.985, HC - 0.33], [0.93, HC - 0.2], [0.875, HC - 0.11],
      [0.872, HC - 0.06], [0.89, HC - 0.025], [0.89, HC], [0.862, HC - 0.004], [0.845, HC - 0.05],
      [0.82, HC - 0.085], [0, HC - 0.085],
    ].map((p) => new T.Vector2(p[0], p[1]));
    const canMetalGeo = new T.LatheGeometry(profile, 72);
    const labelH = HC - 0.78;
    const labelGeo = new T.CylinderGeometry(R + 0.004, R + 0.004, labelH, 72, 1, true);
    labelGeo.translate(0, 0.32 + labelH / 2, 0);
    const tabGeo = (() => {
      const s = new T.Shape();
      const w = 0.2, h = 0.34, r = 0.09;
      s.moveTo(-w + r, -h);
      s.lineTo(w - r, -h); s.quadraticCurveTo(w, -h, w, -h + r);
      s.lineTo(w, h - r); s.quadraticCurveTo(w, h, w - r, h);
      s.lineTo(-w + r, h); s.quadraticCurveTo(-w, h, -w, h - r);
      s.lineTo(-w, -h + r); s.quadraticCurveTo(-w, -h, -w + r, -h);
      const hole = new T.Path();
      hole.absellipse(0, 0.12, 0.11, 0.12, 0, Math.PI * 2, false, 0);
      s.holes.push(hole);
      const g = new T.ExtrudeGeometry(s, { depth: 0.025, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2 });
      g.rotateX(-Math.PI / 2);
      return g;
    })();
    const rivetGeo = new T.CylinderGeometry(0.06, 0.06, 0.03, 20);

    const labelCache = {};
    function labelMaterial(d) {
      if (labelCache[d.key]) return labelCache[d.key];
      const tex = new T.CanvasTexture(drawLabel(d));
      tex.encoding = T.sRGBEncoding;
      tex.anisotropy = maxAniso;
      const m = new T.MeshStandardMaterial({ map: tex, roughness: 0.4, metalness: 0.1, envMapIntensity: 0.55 });
      labelCache[d.key] = m;
      return m;
    }

    function makeCan(d) {
      const g = new T.Group();
      const body = new T.Mesh(canMetalGeo, metal);
      const label = new T.Mesh(labelGeo, labelMaterial(d));
      body.castShadow = label.castShadow = true;
      body.receiveShadow = label.receiveShadow = true;
      const tab = new T.Mesh(tabGeo, metalDark);
      tab.position.set(0, HC - 0.07, -0.22);
      tab.castShadow = true;
      const rivet = new T.Mesh(rivetGeo, metalDark);
      rivet.position.set(0, HC - 0.07, 0.02);
      g.add(body, label, tab, rivet);
      return g;
    }

    /* ---------- carton ---------- */
    const box = new T.Group();
    settle.add(box);
    const frontCanvas = document.createElement('canvas');
    frontCanvas.width = 2048; frontCanvas.height = Math.round(2048 * H / (W + 2 * TH));
    const sideCanvas = document.createElement('canvas');
    sideCanvas.width = 1600; sideCanvas.height = Math.round(1600 * H / D);
    const frontTex = new T.CanvasTexture(frontCanvas);
    const sideTex = new T.CanvasTexture(sideCanvas);
    [frontTex, sideTex].forEach((t) => { t.encoding = T.sRGBEncoding; t.anisotropy = maxAniso; });
    const printFront = new T.MeshStandardMaterial({ map: frontTex, roughness: 0.8, envMapIntensity: 0.35 });
    const printSide = new T.MeshStandardMaterial({ map: sideTex, roughness: 0.8, envMapIntensity: 0.35 });
    const printPlain = new T.MeshStandardMaterial({ color: 0xe9dfcc, roughness: 0.8, envMapIntensity: 0.35 });

    function wall(w, h, dpt, mats, x, y, z) {
      const m = new T.Mesh(new T.BoxGeometry(w, h, dpt), mats);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      box.add(m);
      return m;
    }
    // BoxGeometry face order: +x, -x, +y, -y, +z, -z
    wall(W + 2 * TH, H, TH, [edge, edge, edge, edge, printFront, kraft], 0, H / 2, D / 2 + TH / 2);
    wall(W + 2 * TH, H, TH, [edge, edge, edge, edge, kraftDark, printPlain], 0, H / 2, -D / 2 - TH / 2);
    wall(TH, H, D, [printSide, kraft, edge, edge, edge, edge], W / 2 + TH / 2, H / 2, 0);
    wall(TH, H, D, [kraftDark, printPlain, edge, edge, edge, edge], -W / 2 - TH / 2, H / 2, 0);
    wall(W, TH, D, [kraftDark, kraftDark, kraftFloor, kraftDark, kraftDark, kraftDark], 0, TH / 2, 0);

    /* ---------- cans ---------- */
    const cansGroup = new T.Group();
    settle.add(cansGroup);
    const FACE = -57 * Math.PI / 180;
    let cans = [];
    let current = null;
    let mode = 'pack';
    let revealed = false;
    let anim = null;
    let settleT = -1;

    function slotPos(i) {
      const c = i % 4, r = Math.floor(i / 4);
      return [(c - 1.5) * GAP, (r - 1) * GAP];
    }
    function buildCans(d, count) {
      cans.forEach((c) => cansGroup.remove(c.obj));
      cans = [];
      for (let i = 0; i < count; i++) {
        const obj = makeCan(d);
        if (count === 1) { obj.position.set(0, TH, 0); obj.scale.setScalar(1.55); }
        else { const p = slotPos(i); obj.position.set(p[0], TH, p[1]); }
        obj.rotation.y = FACE + (count === 1 ? 0 : (Math.random() - 0.5) * 0.35);
        cansGroup.add(obj);
        cans.push({ obj, tilt: (Math.random() - 0.5) * 0.22, baseY: TH, delay: count === 1 ? 0 : i * STEP_MS });
      }
    }
    function castShadows(c, on) {
      if (c.shadow === on) return;
      c.shadow = on;
      c.obj.traverse((o) => { if (o.isMesh) o.castShadow = on; });
    }
    function hideCans() { cans.forEach((c) => { c.obj.position.y = DROP_FROM + 20; castShadows(c, false); }); }

    function dropY(p) {
      if (p <= 0.66) { const q = p / 0.66; return DROP_FROM * (1 - q * q); }
      if (p <= 0.8) { const q = (p - 0.66) / 0.14; return 0.42 * (1 - (1 - q) * (1 - q)); }
      if (p <= 0.91) { const q = (p - 0.8) / 0.11; return 0.42 * (1 - q * q); }
      if (p <= 0.955) { const q = (p - 0.91) / 0.045; return 0.09 * (1 - (1 - q) * (1 - q)); }
      if (p < 1) { const q = (p - 0.955) / 0.045; return 0.09 * (1 - q * q); }
      return 0;
    }

    function startDrop() {
      if (reduceMotion) { cans.forEach((c) => { c.obj.position.y = c.baseY; c.obj.rotation.z = 0; }); anim = null; return; }
      anim = { type: 'drop', t0: null };
      settleT = -1;
    }
    function startLift(then) {
      if (reduceMotion || !cans.length) { then(); return; }
      anim = { type: 'lift', t0: null, then };
    }

    function apply(data, force) {
      const nextMode = data.cans === 1 ? 'single' : 'pack';
      const changed = force || !current || current.key !== data.key || mode !== nextMode;
      const prevKey = current && current.key;
      current = data;
      drawFront(frontCanvas, data); frontTex.needsUpdate = true;
      drawSide(sideCanvas, data); sideTex.needsUpdate = true;
      printPlain.color.set(data.bg);
      if (!changed) return;
      const go = () => {
        mode = nextMode;
        box.visible = mode === 'pack';
        buildCans(data, mode === 'pack' ? 12 : 1);
        if (revealed) startDrop(); else hideCans();
      };
      if (prevKey && revealed && cans.length) startLift(go); else go();
    }

    function sync(force) {
      const st = window.__bcPack || {};
      if (st.revealed && !revealed) {
        revealed = true;
        if (current) { buildCans(current, mode === 'pack' ? 12 : 1); startDrop(); }
      }
      if (st.data) apply(st.data, force);
    }
    window.addEventListener('bcpack', () => sync(false));

    /* ---------- tilt + resize ---------- */
    let tx = 0, ty = 0, cx = 0, cy = 0;
    if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
      const col = host.closest('.crate-col') || host;
      col.addEventListener('mousemove', (e) => {
        const r = host.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 0.6;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 0.25;
      });
      col.addEventListener('mouseleave', () => { tx = 0; ty = 0; });
    }
    function resize() {
      const r = wrap.getBoundingClientRect();
      const w = Math.max(1, r.width), h = Math.max(1, r.height);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const dist = 27;
      camera.position.set(Math.sin(0.58) * dist, 15.5, Math.cos(0.58) * dist);
      camera.lookAt(LOOK);
      camera.updateProjectionMatrix();
    }
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(wrap);
    window.addEventListener('resize', resize);
    resize();

    /* ---------- loop ---------- */
    let visible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => { visible = es.some((e) => e.isIntersecting); if (visible) loop(); }, { rootMargin: '20% 0px' }).observe(host);
    }
    let raf = 0;
    let last = performance.now();
    function loop() {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    let clock = 0;
    function frame(real) {
      const step = Math.min(50, real - last) / SLOW;
      last = real;
      clock += Math.max(0, step);
      const now = clock;
      const dt = step / 1000;
      if (anim && anim.t0 === null) {
        anim.t0 = now;
        if (anim.type === 'drop') settleT = now + (cans.length - 1) * STEP_MS + DROP_MS * 0.66;
      }
      if (anim) {
        const t = now - anim.t0;
        if (anim.type === 'drop') {
          let busy = false;
          cans.forEach((c) => {
            const p = Math.min(1, Math.max(0, (t - c.delay) / DROP_MS));
            if (p < 1) busy = true;
            c.obj.position.y = c.baseY + dropY(p);
            castShadows(c, c.obj.position.y < 4);
            c.obj.rotation.z = p < 0.66 ? c.tilt * (1 - p / 0.66) : 0;
          });
          if (!busy) anim = null;
        } else {
          const p = Math.min(1, t / LIFT_MS);
          cans.forEach((c, i) => { c.obj.position.y = c.baseY + 16 * p * p * (1 + i * 0.02); castShadows(c, c.obj.position.y < 4); });
          if (p >= 1) { const then = anim.then; anim = null; then(); }
        }
      }
      if (settleT > 0) {
        const s = (now - settleT) / 650;
        if (s >= 1) { settle.scale.set(1, 1, 1); settle.position.y = 0; settleT = -1; }
        else if (s > 0) {
          const k = Math.exp(-4 * s) * Math.sin(s * Math.PI * 3);
          settle.scale.set(1 + 0.012 * k, 1 - 0.022 * k, 1 + 0.012 * k);
          settle.position.y = -0.05 * k;
        }
      }
      cx += (tx - cx) * Math.min(1, dt * 5);
      cy += (ty - cy) * Math.min(1, dt * 5);
      const idle = reduceMotion ? 0 : Math.sin(now / 2600) * 0.05;
      root.rotation.y = cx + idle;
      root.rotation.x = cy * 0.4;
      if (mode === 'single' && cans[0] && !anim) cans[0].obj.rotation.y += dt * 0.45;
      renderer.render(scene, camera);
      if (visible) raf = requestAnimationFrame(frame);
    }

    const ready = () => {
      sync(true);
      try { renderer.compile(scene, camera); } catch (e) {}
      host.classList.add('is-3d');
      loop();
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(ready); else ready();
  }

  /* ---------- environment for metal reflections ---------- */
  function studio(T) {
    const s = new T.Scene();
    const room = new T.Mesh(new T.BoxGeometry(40, 24, 40), new T.MeshBasicMaterial({ color: 0x9e978c, side: T.BackSide }));
    s.add(room);
    const panel = (w, h, x, y, z, rx, ry, c) => {
      const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: c, side: T.DoubleSide }));
      m.position.set(x, y, z);
      m.rotation.set(rx, ry, 0);
      s.add(m);
    };
    panel(18, 8, 0, 11.5, 0, Math.PI / 2, 0, 0xffffff);
    panel(10, 14, -19.5, 3, 2, 0, Math.PI / 2, 0xffffff);
    panel(8, 12, 19.5, 4, -6, 0, -Math.PI / 2, 0xfff1df);
    panel(24, 5, 0, 1.5, -19.5, 0, 0, 0x6f6a62);
    panel(16, 3, 0, -6, 19.5, 0, Math.PI, 0xe9dfcc);
    return s;
  }

  /* ---------- 2D drawing for printed surfaces ---------- */
  function fitFont(g, text, weight, maxW, start) {
    let size = start;
    g.font = weight + ' ' + size + 'px ' + FONT;
    while (g.measureText(text).width > maxW && size > 10) { size -= 4; g.font = weight + ' ' + size + 'px ' + FONT; }
    return size;
  }
  function paperNoise(g, w, h, alpha) {
    g.save();
    g.globalAlpha = alpha;
    for (let i = 0; i < 2600; i++) {
      g.fillStyle = Math.random() < 0.5 ? '#000' : '#fff';
      g.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
    }
    g.restore();
  }

  function drawLabel(d) {
    const c = document.createElement('canvas');
    c.width = 2048; c.height = 1024;
    const g = c.getContext('2d');
    const ink = d.ink;
    g.fillStyle = d.bg; g.fillRect(0, 0, 2048, 1024);
    paperNoise(g, 2048, 1024, 0.05);
    const band = d.key === 'focus' ? '#1E2B4F' : '#F1EADF';
    const bandInk = d.key === 'focus' ? '#F1EADF' : d.bg;
    g.fillStyle = band; g.fillRect(0, 0, 2048, 78);
    g.fillStyle = bandInk; g.font = '700 30px ' + FONT; g.textBaseline = 'middle';
    for (let x = 30; x < 2048; x += 340) g.fillText('BETTER COFFEE', x, 40);

    const cx = 512;
    // vertical flavor word
    const word = d.key === 'focus' ? 'FOCUS' : d.name.toLowerCase();
    g.save();
    g.translate(cx - 120, 900);
    g.rotate(-Math.PI / 2);
    g.fillStyle = ink;
    g.textBaseline = 'alphabetic';
    fitFont(g, word, '900', 780, 300);
    g.fillText(word, 0, 0);
    g.restore();
    // ingredient stack
    g.fillStyle = ink; g.textBaseline = 'alphabetic';
    const list = ['coffee.'].concat(d.labelIngredients.map((x) => x.toLowerCase() + '.'));
    let y = 205;
    list.forEach((s, i) => { g.font = (i === 0 ? '800 62px ' : '300 54px ') + FONT; g.fillText(s, cx - 70, y); y += i === 0 ? 66 : 58; });
    g.fillRect(cx - 70, y - 20, 290, 3);
    g.font = '400 34px ' + FONT;
    (d.labelTag || '').toLowerCase().split('. ').forEach((s, i) => { g.fillText(s.replace(/\.$/, '') + '.', cx - 70, y + 30 + i * 40); });
    g.font = '700 30px ' + FONT;
    g.fillText('COLD LATTE', cx - 50, 790);
    g.fillText('OAT MILK', cx - 30, 826);
    // facts box
    g.strokeStyle = ink; g.lineWidth = 3;
    const bx = cx - 230, bw = 460, by = 850, bh = 90;
    g.strokeRect(bx, by, bw, bh);
    g.beginPath(); g.moveTo(bx + 150, by); g.lineTo(bx + 150, by + bh); g.moveTo(bx + 320, by); g.lineTo(bx + 320, by + bh); g.stroke();
    const cell = (x, big, small) => {
      g.textAlign = 'center';
      g.font = '700 38px ' + FONT; g.fillText(big, x, by + 46);
      g.font = '600 18px ' + FONT; g.fillText(small, x, by + 74);
      g.textAlign = 'left';
    };
    cell(bx + 75, '100mg', 'L-THEANINE');
    cell(bx + 235, d.caffeine + 'mg', 'CAFFEINE');
    cell(bx + 390, '0g', 'SUGAR');
    g.textAlign = 'center'; g.font = '500 34px ' + FONT; g.fillText('200 ml', cx, 990); g.textAlign = 'left';
    // back panel
    const bx2 = 1536;
    g.globalAlpha = 0.9;
    g.textAlign = 'center';
    g.font = '900 96px ' + FONT; g.fillText('better coffee.', bx2, 420);
    g.font = '600 34px ' + FONT; g.fillText('FUNCTIONAL COLD LATTE · 200 ml', bx2, 490);
    g.font = '400 30px ' + FONT; g.fillText('cold brew · oat milk · 0g sugar', bx2, 540);
    g.textAlign = 'left';
    g.globalAlpha = 1;
    return c;
  }

  function drawFront(c, d) {
    const g = c.getContext('2d');
    const w = c.width, h = c.height;
    const t = d.text;
    g.clearRect(0, 0, w, h);
    g.fillStyle = d.bg; g.fillRect(0, 0, w, h);
    paperNoise(g, w, h, 0.06);
    const grad = g.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(255,255,255,0.10)'); grad.addColorStop(1, 'rgba(0,0,0,0.08)');
    g.fillStyle = grad; g.fillRect(0, 0, w, h);
    const pad = 70;
    g.fillStyle = d.ink; g.textBaseline = 'alphabetic';
    g.font = '900 64px ' + FONT;
    g.fillText('better coffee', pad, pad + 50);
    const bw = g.measureText('better coffee').width;
    g.fillStyle = '#6BBF7A'; g.fillText('.', pad + bw, pad + 50);
    g.fillStyle = d.ink;
    if (!d.sub) { g.textAlign = 'right'; g.font = '700 42px ' + FONT; g.fillText('12 × 200 ML', w - pad, pad + 46); g.textAlign = 'left'; }
    fitFont(g, t.name.toLowerCase(), '900', w * 0.62, 330);
    g.fillText(t.name.toLowerCase(), pad - 8, h * 0.72);
    g.font = '600 38px ' + FONT;
    g.fillText(t.line.toLowerCase(), pad, h - pad + 10);
    g.textAlign = 'right'; g.font = '700 38px ' + FONT;
    g.fillText(t.mg.toLowerCase(), w - pad, h - pad + 10);
    g.textAlign = 'left';
    if (d.sub) {
      const r = 150, x = w - pad - r - 20, y = pad + r + 10;
      g.save(); g.translate(x, y); g.rotate(-0.24);
      g.fillStyle = '#6BBF7A'; g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#120F1E'; g.textAlign = 'center'; g.font = '800 40px ' + FONT;
      const parts = t.sticker.split(' · ');
      parts.forEach((s, i) => g.fillText(s, 0, (i - (parts.length - 1) / 2) * 48 + 14));
      g.restore(); g.textAlign = 'left';
    }
  }

  function drawSide(c, d) {
    const g = c.getContext('2d');
    const w = c.width, h = c.height;
    const t = d.text;
    g.clearRect(0, 0, w, h);
    g.fillStyle = d.bg; g.fillRect(0, 0, w, h);
    paperNoise(g, w, h, 0.06);
    g.fillStyle = 'rgba(0,0,0,0.10)'; g.fillRect(0, 0, w, h);
    const pad = 64;
    g.fillStyle = d.ink;
    g.font = '700 40px ' + FONT;
    g.fillText(t.side.toUpperCase(), pad, pad + 40);
    let y = pad + 150;
    t.stack.forEach((s, i) => { g.font = (i === 0 ? '800 66px ' : '300 60px ') + FONT; g.fillText(s.toLowerCase() + '.', pad, y); y += 70; });
    g.font = '700 38px ' + FONT;
    g.fillText('200 ml', pad, h - pad + 6);
    g.textAlign = 'right'; g.fillText(t.sideMg, w - pad, h - pad + 6); g.textAlign = 'left';
  }
})();
