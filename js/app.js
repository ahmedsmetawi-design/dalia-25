/* Dalia's Birthday Journey — app logic (linear, tap-to-advance) */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const scr = $('#scr');
const params = new URLSearchParams(location.search);

/* ---------------- storage + state ---------------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem('d25_' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('d25_' + k, JSON.stringify(v)); } catch (e) {} }
};
if (params.has('reset')) { try { Object.keys(localStorage).filter(k => k.startsWith('d25_')).forEach(k => localStorage.removeItem(k)); } catch (e) {} }
const S = { lang: store.get('lang', null), ch: store.get('ch', 0), done: store.get('done', false), muted: store.get('muted', false) };
if (params.has('ch')) { S.ch = Math.max(0, Math.min(7, (+params.get('ch') || 1) - 1)); S.done = false; }
const save = () => Object.entries(S).forEach(([k, v]) => store.set(k, v));

let L = null, where = null, calm = false, partyOn = false;

/* ---------------- helpers ---------------- */
const fill = (s, v = {}) => String(s).replace(/\{(\w+)\}/g, (_, k) => (v[k] ?? ''));
const pick = a => a[Math.floor(Math.random() * a.length)];
const rnd = (a, b) => a + Math.random() * (b - a);
const RTL = () => !!(L && L.dir === 'rtl');
const once = f => { let d = false; return (...a) => { if (!d) { d = true; f(...a); } }; };
const COLORS = ['#B9A7F5', '#F2A7C3', '#F7CF6B', '#9FE3C9', '#FFF6E9', '#8EC5F5'];
const BCOLORS = ['#F2A7C3', '#B9A7F5', '#F7CF6B', '#9FE3C9', '#8EC5F5', '#ff9fb2'];
const conf = o => { try { window.confetti && window.confetti(Object.assign({ colors: COLORS, zIndex: 100, disableForReducedMotion: true }, o)); } catch (e) {} };
const burst = (o = {}) => conf(Object.assign({ particleCount: 100, spread: 80, origin: { y: .6 } }, o));
function fireworks(ms = 2500) {
  const end = Date.now() + ms;
  (function f() {
    conf({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0, y: .75 } });
    conf({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1, y: .75 } });
    if (Date.now() < end) requestAnimationFrame(f);
  })();
}
function cannons() {
  conf({ particleCount: 70, angle: 60, spread: 55, startVelocity: 55, origin: { x: 0, y: .9 } });
  conf({ particleCount: 70, angle: 120, spread: 55, startVelocity: 55, origin: { x: 1, y: .9 } });
  SFX.play('horn'); setTimeout(() => SFX.play('pop'), 120);
}
function shake(px = 10) { gsap.fromTo(scr, { x: -px }, { x: 0, duration: .6, ease: 'elastic.out(1,.25)' }); }
function flash(color = '#fff', o = .85) { const f = $('#flash'); f.style.background = color; gsap.fromTo(f, { opacity: o }, { opacity: 0, duration: .7, ease: 'power2.out' }); }
function toast(msg, ms = 2400) {
  const el = document.createElement('div'); el.className = 'toast'; el.innerHTML = msg;
  $('#toasts').appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 400); }, ms);
}
function popword(x, y, text) {
  const el = document.createElement('div'); el.className = 'popword'; el.textContent = text || pick(L.popWords);
  el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.color = pick(COLORS);
  document.body.appendChild(el); setTimeout(() => el.remove(), 1100);
}

/* per-screen timers, cleared on every render */
let leave = [];
const onLeave = f => leave.push(f);
const later = (f, ms) => { const id = setTimeout(f, ms); onLeave(() => clearTimeout(id)); return id; };
const every = (f, ms) => { const id = setInterval(f, ms); onLeave(() => clearInterval(id)); return id; };
const clearScope = () => { const l = leave; leave = []; l.forEach(f => { try { f(); } catch (e) {} }); };

/* ---------------- kinetic words ---------------- */
function words(text) {
  const toks = String(text).match(/<bdi>[\s\S]*?<\/bdi>[^\s]*|<b>[\s\S]*?<\/b>[^\s]*|\S+/g) || [];
  return toks.map(tk => {
    const hot = /\*[^*]+\*/.test(tk);
    return `<span class="w${hot ? ' hot' : ''}">${tk.replace(/\*([^*]+)\*/g, '<em>$1</em>')}</span>`;
  }).join(' ');
}
const plain = s => String(s).replace(/<[^>]+>/g, '').replace(/\*/g, '');
const sizeCls = s => { const n = plain(s).length; return n <= 22 ? 'xl' : n <= 48 ? 'lg' : n <= 95 ? 'md' : 'sm'; };
function kin(root, o = {}) {
  const ws = $$('.w', root); if (!ws.length) return 0;
  const st = o.stagger ?? Math.min(.11, 1.8 / ws.length), dl = o.delay || 0;
  // words enter in reading order, sliding in from the reading side (right in Arabic, left in English)
  gsap.fromTo(ws, { opacity: 0, x: RTL() ? 46 : -46, y: 20, scale: .3, rotation: () => (RTL() ? -1 : 1) * rnd(0, 14) },
    { opacity: 1, x: 0, y: 0, scale: 1, rotation: 0, duration: .55, ease: 'back.out(2.2)', stagger: st, delay: dl });
  ws.forEach((w, i) => {
    if (!w.classList.contains('hot')) return;
    later(() => { SFX.play('chime'); gsap.fromTo(w, { scale: 1.7 }, { scale: 1, duration: .7, ease: 'elastic.out(1,.4)' }); }, (dl + i * st) * 1000 + 350);
  });
  return (dl + ws.length * st) * 1000 + 450;
}

/* ---------------- custom graphics ---------------- */
const THEMES = {
  lav: ['#B9A7F5', '#8EC5F5'], pink: ['#F2A7C3', '#B9A7F5'], gold: ['#F7CF6B', '#F2A7C3'], mint: ['#9FE3C9', '#8EC5F5'],
  sky: ['#8EC5F5', '#9FE3C9'], siren: ['#ff5a6e', '#5a8bff'], rainbow: ['#F2A7C3', '#9FE3C9'], night: ['#563A8C', '#B9A7F5']
};
function art(emo, theme = 'lav', cls = '') {
  const [a, b] = THEMES[theme] || THEMES.lav;
  return `<div class="art ${cls}" style="--a:${a};--b:${b}"><div class="blob"></div><div class="blob b2"></div><div class="ring"></div>
    <div class="emo">${emo}</div><i class="orb o1">✦</i><i class="orb o2">★</i><i class="orb o3">✦</i></div>`;
}
function popArt(root) {
  const a = $('.art', root); if (!a) return;
  gsap.fromTo(a, { scale: .5, opacity: 0 }, { scale: 1, opacity: 1, duration: .5, ease: 'power2.out' });
  gsap.fromTo($('.emo', a), { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: .9, ease: 'elastic.out(1,.45)', delay: .05 });
}
const splat = c => `<svg viewBox="0 0 200 200" class="splat"><path fill="${c}" d="M100 18c14 0 18 20 31 22s30-14 40-3-6 27 0 38 26 12 25 27-22 14-26 27 12 30 1 40-27-5-39 1-15 28-31 28-18-22-31-26-31 10-40 0 6-27-1-38-27-13-27-28 22-15 26-28-12-29-1-39 28 4 40-2 18-25 33-25z"/><circle cx="30" cy="40" r="9" fill="${c}"/><circle cx="178" cy="150" r="7" fill="${c}"/><circle cx="160" cy="24" r="5" fill="${c}"/></svg>`;

/* ---------------- screens + taps ---------------- */
function render(html, cls = '') {
  clearScope(); disarm();
  $$('.stage', scr).forEach(old => { old.style.pointerEvents = 'none'; gsap.to(old, { opacity: 0, scale: 1.06, duration: .35, onComplete: () => old.remove() }); });
  const el = document.createElement('div'); el.className = 'stage ' + cls; el.innerHTML = html;
  scr.appendChild(el);
  gsap.fromTo(el, { opacity: 0, scale: .95 }, { opacity: 1, scale: 1, duration: .45, ease: 'power2.out' });
  return el;
}
let tapFn = null;
function armTap(ms, fn, hint = true) {
  tapFn = null;
  later(() => { tapFn = fn; if (hint) $('#taphint').classList.add('on'); }, ms);
}
function disarm() { tapFn = null; $('#taphint').classList.remove('on'); }
function doTap() { if (!tapFn) return; const f = tapFn; disarm(); SFX.play('tap'); f(); }
document.addEventListener('click', e => {
  if (e.target.closest('#hud,#moon,.balloon,.shooter,#modal,#ytbox,button,a,.noadv,.wishover')) return;
  doTap();
});
document.addEventListener('keydown', e => { if ([' ', 'Enter', 'ArrowRight', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); doTap(); } });

function stepBar(i, n) { $('#stepbar i').style.width = (n ? ((i + 1) / n * 100) : 0) + '%'; }
function runSteps(list, done, i = 0) {
  if (i >= list.length) { stepBar(0, 0); return done(); }
  stepBar(i, list.length);
  list[i](once(() => runSteps(list, done, i + 1)));
}

/* a generic big kinetic sentence with a graphic */
const say = (text, emo, theme = 'lav', sfx = 'whoosh', extra) => next => {
  const el = render(`${emo ? art(emo, theme) : ''}<div class="say ${sizeCls(text)}">${words(text)}</div>`, 'th-' + theme);
  if (emo) popArt(el);
  SFX.play(sfx);
  if (extra) extra(el);
  const ms = kin($('.say', el), { delay: emo ? .25 : 0 });
  armTap(Math.min(ms, 1500) + 250, next);
};

function setLang(l) {
  S.lang = l; save(); L = CONTENT[l];
  document.documentElement.lang = l; document.documentElement.dir = L.dir;
  $('#btnLang').textContent = l === 'en' ? 'ع' : 'EN';
  $('#taphint').innerHTML = `👆 ${L.common.tap}`;
  document.title = l === 'en' ? "Dalia's Birthday Journey: Level 25 🎮" : 'رحلة عيد ميلاد داليا: المستوى 25 🎮';
}

/* ================================================================ INTRO */
function langScreen() {
  where = 'lang';
  const el = render(`<div class="langpick">${art('🎈', 'pink')}
    <h1 class="title">Pick your language<span class="ar-t">اختاري اللغة</span></h1>
    <div class="row"><button class="btn big lav" data-l="en">English</button>
    <button class="btn big pink" data-l="ar" style="font-family:'Baloo Bhaijaan 2',sans-serif">عربي</button></div>
    <p class="small">🔊 Sound on · علّي الصوت</p></div>`);
  popArt(el);
  $$('[data-l]', el).forEach(b => b.onclick = () => {
    SFX.init(); SFX.setMuted(S.muted); SFX.track(CONFIG.music.intro);
    setLang(b.dataset.l); SFX.play('pop'); cannons();
    $('#hud').classList.remove('hidden');
    afterLang();
  });
}
function afterLang() {
  const unlock = new Date(CONFIG.unlockAt).getTime();
  if (Date.now() < unlock && !params.has('preview')) gate(); else if (params.has('skip')) startScreen(); else loading();
}
function gate() {
  where = 'gate';
  const el = render(`${art('⏳', 'night')}<h1 class="title" style="font-size:36px">${L.gate.title}</h1><p class="lead">${L.gate.line}</p>
    <div class="countdown">${[0, 1, 2].map(i => `<div class="cd"><b id="cd${i}">--</b><span>${L.gate.labels[i]}</span></div>`).join('')}</div>`);
  popArt(el);
  const unlock = new Date(CONFIG.unlockAt).getTime();
  const tick = () => {
    const d = Math.max(0, unlock - Date.now()), s = Math.floor(d / 1000);
    [Math.floor(s / 3600), Math.floor(s % 3600 / 60), s % 60].forEach((n, i) => { const c = $('#cd' + i); if (c) c.textContent = String(n).padStart(2, '0'); });
    if (d <= 0) { clearInterval(id); $('.title', el).textContent = L.gate.zero; burst({ particleCount: 200, spread: 120 }); SFX.play('tada'); later(loading, 1800); }
  };
  const id = every(tick, 1000); tick();
}
function loading() {
  where = 'loading';
  const el = render(`<div id="ldart"></div><div class="say lg" id="ldt"></div><div class="ldbar"><i id="ldb"></i></div>`, 'loadstage');
  const th = ['pink', 'gold', 'lav', 'mint', 'sky']; let k = 0;
  const showK = () => {
    const [emo, line] = L.loading[k];
    $('#ldart', el).innerHTML = art(emo, th[k]); popArt(el);
    $('#ldt', el).innerHTML = words(line); kin($('#ldt', el));
    gsap.to($('#ldb', el), { width: ((k + 1) / L.loading.length * 100) + '%', duration: 3.3, ease: 'power1.inOut' });
    SFX.play(k % 2 ? 'sparkle' : 'pop'); conf({ particleCount: 30, spread: 70, startVelocity: 25, origin: { y: .35 }, colors: [THEMES[th[k]][0], '#fff'] });
    later(() => { k++; if (k < L.loading.length) showK(); else startScreen(); }, 3500);
  };
  showK();
}
function startScreen() {
  where = 'start';
  const resume = S.ch > 0 && !S.done;
  const el = render(`<div class="label">${L.start.label}</div>
    <div class="giftstar">${CONFIG.images.start ? `<img class="img-slot" src="${CONFIG.images.start}" alt="">` : `<div class="gs-box bob">🎁</div><div class="gs-25">25</div>`}
      <span class="sparkle" style="top:0;left:6px">✨</span><span class="sparkle" style="top:26px;right:0;animation-delay:.6s">⭐</span><span class="sparkle" style="bottom:12px;left:0;animation-delay:1.1s">💫</span></div>
    <h1 class="title st-title">${L.start.title}</h1>
    <div class="say sm st-intro">${words(L.start.intro)}</div>
    <button class="btn big pulse" id="go">${resume ? L.start.resume : L.start.cta}</button>
    <p class="small">${L.start.sound}</p>`, 'startstage');
  gsap.from($('.st-title', el), { scale: 2.4, opacity: 0, duration: .8, ease: 'back.out(1.6)', delay: .2 });
  later(() => { SFX.play('slam'); shake(8); }, 650);
  kin($('.st-intro', el), { delay: .9 });
  $('#go', el).onclick = () => { SFX.play('tada'); if (S.done) S.ch = 0; S.done = false; save(); chapter(S.ch); };
}

/* ================================================================ JOURNEY MAP */
const CH = ['art', 'passport', 'lab', 'kdrama', 'pop', 'gift', 'cake', 'letter'];
const CH_ICON = ['🎨', '🛂', '🔬', '🎬', '🎈', '🎁', '🎂', '💌'];
const NODES_BASE = [[70, 318], [215, 286], [265, 228], [140, 196], [48, 140], [160, 104], [262, 62], [150, 24]];
let NODES = NODES_BASE;   // mirrored in Arabic so the path starts on the right
function pips() {
  $('#pips').innerHTML = CH.map((c, i) => `<i class="${i < S.ch || where === 'finale' ? 'done' : i === S.ch && where === 'journey' ? 'cur' : ''}"></i>`).join('');
}
function segPath(a, b, k) {
  const [x0, y0] = NODES[a], [x1, y1] = NODES[b], bend = (k % 2 ? 40 : -40) * (RTL() ? -1 : 1);
  return `M${x0} ${y0} Q${(x0 + x1) / 2 + bend} ${(y0 + y1) / 2 + 10} ${x1} ${y1}`;
}
function mapSVG(i) {
  let segs = '';
  for (let k = 0; k < 7; k++) segs += `<path class="seg ${k < i - 1 ? 'gold' : k === i - 1 ? 'gold draw' : ''}" d="${segPath(k, k + 1, k)}"/>`;
  const nodes = NODES.map(([x, y], k) => `<g class="node ${k < i ? 'done' : k === i ? 'cur' : 'todo'}" transform="translate(${x} ${y})">
      <circle r="21"/><text y="7" text-anchor="middle">${CH_ICON[k]}</text>${k < i ? '<text class="tick" x="15" y="-10">✓</text>' : ''}</g>`).join('');
  const [sx, sy] = NODES[Math.max(0, i - 1)];
  return `<svg viewBox="0 0 310 345" class="map">${segs}${nodes}<text id="tok" x="${sx}" y="${sy - 24}" text-anchor="middle" font-size="30">🥳</text></svg>`;
}
function chapter(i) {
  if (i >= CH.length) return finale();
  S.ch = i; save(); where = 'journey'; pips();
  NODES = RTL() ? NODES_BASE.map(([x, y]) => [310 - x, y]) : NODES_BASE;
  calm = false;
  const el = render(`<div class="lvl"><div class="lvlnum">${L.common.level} <b>${i + 1}</b> <span>${L.common.of} 8</span></div>
      <h1 class="lvlname">${words(L.chapters[CH[i]])}</h1><div class="say sm lvlsay">${words(L.mapSay[i])}</div></div>
    <div class="mapwrap">${mapSVG(i)}</div><div class="enterbtn">${L.common.enter} 👆</div>`, 'mapstage');
  SFX.track(CONFIG.music[CH[i]]);
  SFX.play('rise');
  const d = $('.seg.draw', el);
  if (d) { const len = d.getTotalLength(); gsap.fromTo(d, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: .9, ease: 'power2.inOut', delay: .3 }); }
  const [tx, ty] = NODES[i], tok = $('#tok', el);
  if (i > 0) {
    const [sx, sy] = NODES[i - 1];
    gsap.timeline({ delay: .35 })
      .to(tok, { attr: { x: (sx + tx) / 2, y: Math.min(sy, ty) - 70 }, duration: .45, ease: 'power2.out' })
      .to(tok, { attr: { x: tx, y: ty - 24 }, duration: .45, ease: 'bounce.out' })
      .add(() => { SFX.play('star'); conf({ particleCount: 40, spread: 70, startVelocity: 25, origin: { x: .5, y: .62 } }); });
  } else gsap.fromTo(tok, { attr: { y: ty - 120 } }, { attr: { y: ty - 24 }, duration: .8, ease: 'bounce.out', delay: .3 });
  gsap.fromTo($('.lvlnum', el), { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: 'back.out(2)' });
  kin($('.lvlname', el), { delay: .3, stagger: .12 });
  kin($('.lvlsay', el), { delay: .9 });
  later(cannons, 500);
  later(() => $('.enterbtn', el).classList.add('on'), 1300);
  armTap(1300, () => runSteps(BUILD[CH[i]](), () => chapter(i + 1)), false);
}

/* ================================================================ CHAPTERS */
const BUILD = {};

/* ---------- 1. Art ---------- */
BUILD.art = () => {
  const A = L.art, s = [];
  ['🎨', '🖼️', '🌈'].forEach((e, k) => s.push(say(A.intro[k], e, ['pink', 'lav', 'rainbow'][k])));
  A.colors.forEach((c, k) => s.push(next => {
    const el = render(`<div class="wash" style="--c:${c.hex}"></div>${splat(c.hex)}<div class="brush">🖌️</div>
      <h1 class="cname">${c.name}</h1><div class="say md dark">${words(c.msg)}</div>`, 'colorstage');
    gsap.fromTo($('.wash', el), { clipPath: 'circle(0% at 50% 30%)' }, { clipPath: 'circle(150% at 50% 30%)', duration: 1.1, ease: 'power3.inOut' });
    gsap.fromTo($('.splat', el), { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 1, ease: 'elastic.out(1,.5)', delay: .25 });
    gsap.fromTo($('.brush', el), { x: RTL() ? 200 : -200, y: 120, rotation: RTL() ? 60 : -60 }, { x: 0, y: 0, rotation: 0, duration: .8, ease: 'back.out(1.5)', delay: .1 });
    gsap.fromTo($('.cname', el), { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, duration: .5, ease: 'power4.in', delay: .55, onComplete: () => { SFX.play('slam'); shake(6); } });
    SFX.play('whoosh'); later(() => SFX.play('sparkle'), 500);
    later(() => conf({ particleCount: 80, spread: 100, origin: { y: .3 }, colors: [c.hex, '#fff'] }), 600);
    const ms = kin($('.say', el), { delay: 1 });
    armTap(Math.min(ms, 2200), next);
  }));
  ['📄', '✏️', '🌈', '🖌️'].forEach((e, k) => s.push(say(A.outro[k], e, ['lav', 'pink', 'rainbow', 'gold'][k], k === 3 ? 'tada' : 'whoosh',
    k === 3 ? () => later(() => burst({ particleCount: 160, spread: 140 }), 400) : null)));
  return s;
};

/* ---------- 2. Passport ---------- */
BUILD.passport = () => {
  const P = L.passport, s = [];
  s.push(say(P.intro[0], '🧳', 'sky'), say(P.intro[1], '✈️', 'mint'));
  s.push(next => {
    const c = P.cover;
    const el = render(`<div class="pbook"><div class="ppage1"><div class="photo">🥳</div><p>${c[2]}</p><p>${c[3]}</p></div>
      <div class="pcover"><div class="globe">🌍</div><b>${c[0]}</b><span>${c[1]}</span></div></div>`, 'ppstage');
    gsap.fromTo($('.pbook', el), { y: 300, rotation: 20 }, { y: 0, rotation: -3, duration: .8, ease: 'back.out(1.4)' });
    later(() => { gsap.to($('.pcover', el), { rotateY: L.dir === 'rtl' ? 170 : -170, duration: 1, ease: 'power2.inOut' }); SFX.play('whoosh'); }, 1100);
    later(() => { SFX.play('sparkle'); conf({ particleCount: 50, spread: 90, origin: { y: .45 } }); }, 1900);
    armTap(2100, next);
  });
  P.stamps.forEach((st, k) => s.push(next => {
    const el = render(`<div class="ppage"><div class="bigstamp s${k}"><span class="ic">${st.icon}</span><b>${st.stamp}</b><em>28.11.2026</em></div>
      <h1 class="cname">${st.name}</h1><div class="say md">${words(st.msg)}</div>${st.extra ? `<p class="extra">${st.extra}</p>` : ''}</div>`, 'ppstage');
    SFX.play('rise');
    gsap.fromTo($('.bigstamp', el), { scale: 4, opacity: 0, rotation: -35 }, { scale: 1, opacity: 1, rotation: k % 2 ? 7 : -8, duration: .45, ease: 'power4.in', delay: .35,
      onComplete: () => { SFX.play('thump'); shake(14); flash('#F2A7C3', .35); conf({ particleCount: 40, spread: 90, startVelocity: 20, origin: { y: .3 }, colors: ['#2E5090', '#F2A7C3'] }); } });
    gsap.fromTo($('.cname', el), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .5, delay: .9 });
    const ms = kin($('.say', el), { delay: 1.1 });
    if (st.extra) gsap.fromTo($('.extra', el), { opacity: 0, y: 20 }, { opacity: 1, y: 0, delay: ms / 1000 });
    armTap(Math.min(ms, 2400), next);
  }));
  s.push(say(P.outro[0], '🛂', 'gold', 'tada', () => later(() => burst({ particleCount: 150, spread: 130 }), 300)), say(P.outro[1], '🌍', 'mint'));
  return s;
};

/* ---------- 3. Lab ---------- */
BUILD.lab = () => {
  const B = L.lab, s = [];
  s.push(say(B.intro[0], '🚨', 'siren', 'horn'), say(B.intro[1], '🔢', 'lav'), say(B.intro[2], '🔬', 'mint'));
  B.cards.forEach((c, k) => s.push(next => {
    const el = render(`${art(c.icon, ['gold', 'sky', 'night', 'pink'][k], 'flask')}<div class="chip">${c.name}</div>
      <div class="say md">${words(c.fact)}</div><p class="link hand">${c.link}</p>
      <div class="bubbles">${'<i></i>'.repeat(10)}</div>`, 'labstage' + (k === 1 ? ' yinmn' : ''));
    popArt(el); SFX.play('sparkle');
    gsap.fromTo($('.chip', el), { scale: 0 }, { scale: 1, duration: .5, ease: 'back.out(3)', delay: .3 });
    const ms = kin($('.say', el), { delay: .5 });
    later(() => { gsap.fromTo($('.link', el), { opacity: 0, y: 20, scale: .8 }, { opacity: 1, y: 0, scale: 1, duration: .6, ease: 'back.out(2)' }); SFX.play('chime'); }, ms + 300);
    armTap(Math.min(ms + 700, 2800), next);
  }));
  s.push(next => { SFX.track(CONFIG.music.facts); say(B.factsIntro[0], '🃏', 'gold')(next); }, say(B.factsIntro[1], '👆', 'pink'));
  // 25 facts — one tap each
  s.push(next => {
    const el = render(`<div class="factnum"><small>#</small><b id="fn">1</b></div>
      <div class="dots">${B.facts.map(() => '<i></i>').join('')}</div><div class="say md" id="ft"></div>`, 'factstage');
    let k = 0;
    const showK = () => {
      const fn = $('#fn', el); fn.textContent = k + 1;
      gsap.fromTo(fn, { scale: 2.2, rotation: rnd(-20, 20), opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: .5, ease: 'back.out(2.5)' });
      $$('.dots i', el)[k].classList.add('on');
      const ft = $('#ft', el); ft.innerHTML = words(B.facts[k]); ft.className = 'say ' + (plain(B.facts[k]).length > 80 ? 'sm' : 'md');
      const ms = kin(ft, { delay: .15, stagger: .04 });
      SFX.play(['pop', 'tick', 'sparkle', 'clack'][k % 4]);
      if (k === 24) { fireworks(2500); SFX.play('tada'); }
      else conf({ particleCount: 18, spread: 60, startVelocity: 18, origin: { y: .25 } });
      armTap(Math.min(ms, 900), () => { k++; if (k < B.facts.length) showK(); else next(); });
    };
    showK();
  });
  s.push(next => { SFX.track(CONFIG.music.lab); say(B.quizIntro[0], '🧪', 'mint', 'horn')(next); }, say(B.quizIntro[1], '😌', 'lav'));
  let score = 0;
  B.quiz.forEach((q, k) => s.push(next => {
    if (k === 0) score = 0;
    const el = render(`<div class="qnum">${k + 1} / 3</div><div class="say lg">${words(q.q)}</div>
      <div class="row qbtns"><button class="btn big mint" data-a="1">${B.yes}</button><button class="btn big pink" data-a="0">${B.no}</button></div>
      <div class="say sm quizfb" id="qf"></div>`, 'quizstage');
    SFX.play('whoosh'); kin($('.say', el));
    $$('[data-a]', el).forEach(b => b.onclick = () => {
      $$('[data-a]', el).forEach(x => x.disabled = true);
      const ok = (b.dataset.a === '1') === q.a; if (ok) score++;
      b.classList.add(ok ? 'right' : 'wrong');
      SFX.play(ok ? 'tada' : 'wrong'); if (ok) burst({ particleCount: 70, origin: { y: .7 } }); else shake(10);
      const f = $('#qf', el); f.innerHTML = words((ok ? B.right : B.wrong) + q.fb); kin(f);
      armTap(700, next);
    });
  }));
  s.push(next => say(score === 3 ? B.perfect : B.less, '🤓', 'gold', 'tada', () => fireworks(1500))(next));
  return s;
};

/* ---------- 4. K-drama ---------- */
BUILD.kdrama = () => {
  const K = L.kdrama, s = [];
  s.push(next => {
    const el = render(`<div class="clapper"><div class="ctop"></div><div class="cbody">${K.slate.map(x => `<div>${x}</div>`).join('')}</div></div>`, 'kstage');
    gsap.fromTo($('.clapper', el), { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'back.out(1.5)' });
    later(() => { $('.clapper', el).classList.add('clap'); SFX.play('clap'); shake(8); flash('#fff', .6); }, 1200);
    armTap(1700, next);
  });
  K.scenes.forEach((sc, k) => s.push(next => {
    const el = render(`<div class="bars"><i></i><i></i></div><div class="sv">${sc.v}</div><div class="ep">${K.ep} · <bdi>${k + 1}/3</bdi></div>
      <h1 class="stitle">${words(sc.title)}</h1><p class="ssub hand">${sc.sub}</p><div class="say sm">${words(sc.body)}</div><div class="snote">${sc.note}</div>`, 'kstage scene');
    gsap.fromTo($$('.bars i', el), { scaleY: 0 }, { scaleY: 1, duration: .6, ease: 'power3.out' });
    gsap.fromTo($('.sv', el), { scale: .4, opacity: 0 }, { scale: 1.15, opacity: 1, duration: 6, ease: 'power1.out' });
    SFX.play('whoosh');
    kin($('.stitle', el), { delay: .3, stagger: .15 });
    gsap.fromTo($('.ssub', el), { opacity: 0 }, { opacity: 1, delay: .9 });
    const ms = kin($('.say', el), { delay: 1.2, stagger: .05 });
    later(() => { $('.snote', el).classList.add('on'); SFX.play('chime'); }, ms);
    armTap(Math.min(ms, 3000), next);
  }));
  s.push(say(K.end, '🎬', 'night', 'chime', () => later(() => conf({ particleCount: 80, spread: 120, colors: ['#fff', '#F7CF6B'] }), 500)));
  return s;
};

/* ---------- 5. Pop 25 ---------- */
BUILD.pop = () => {
  const P = L.pop, s = [];
  s.push(say(P.intro[0], '🎈', 'pink'), say(P.intro[1], '📌', 'gold', 'horn'));
  s.push(next => {
    calm = true; $$('#partylayer .balloon').forEach(b => b.remove());
    const el = render(`<div class="popcount"><b id="pc">0</b><span>/ 25</span></div><div class="arena"></div>`, 'popstage');
    const arena = $('.arena', el); let popped = 0, done = false;
    const spawn = () => {
      if (done) return;
      const alive = $$('.balloon', arena).length;
      if (alive >= 6 || popped + alive >= 25) return;
      const b = document.createElement('div'); b.className = 'balloon';
      b.style.left = rnd(4, 80) + '%'; b.style.setProperty('--dur', rnd(4.5, 7) + 's'); b.style.setProperty('--c', pick(BCOLORS));
      b.innerHTML = '<div class="b"></div><div class="s"></div>';
      b.addEventListener('pointerdown', e => {
        if (b.dataset.p) return; b.dataset.p = 1; b.remove(); popped++;
        SFX.play('pop'); popword(e.clientX, e.clientY);
        conf({ particleCount: 26, spread: 70, startVelocity: 22, origin: { x: e.clientX / innerWidth, y: e.clientY / innerHeight } });
        const pc = $('#pc', el); if (pc) { pc.textContent = popped; gsap.fromTo(pc, { scale: 1.6 }, { scale: 1, duration: .4, ease: 'back.out(3)' }); }
        if (popped >= 25) {
          done = true; SFX.play('tada'); fireworks(3000); shake(12);
          $('.popcount', el).innerHTML = `<div class="say lg">${words(P.win)}</div>`; kin($('.popcount', el));
          calm = false; armTap(1500, next);
        }
      });
      b.addEventListener('animationend', () => b.remove());
      arena.appendChild(b);
    };
    spawn(); every(spawn, 550);
    onLeave(() => { calm = false; });
  });
  return s;
};

/* ---------- 6. Gift + Big Show ---------- */
BUILD.gift = () => {
  const G = L.gift, s = [];
  s.push(say(G.intro[0], '👏', 'gold'), say(G.intro[1], '🤔', 'lav'), say(G.intro[2], '🎁', 'pink', 'sparkle'));
  s.push(next => {
    const el = render(`<div class="giftbig noadv">${CONFIG.images.gift ? `<img src="${CONFIG.images.gift}" alt="">` : '🎁'}</div><div class="say lg" id="gh">${words(G.hint)}</div>`, 'giftstage');
    const box = $('.giftbig', el); let taps = 0;
    gsap.fromTo(box, { y: -400 }, { y: 0, duration: .8, ease: 'bounce.out' });
    later(() => SFX.play('thump'), 600);
    kin($('#gh', el), { delay: .8 });
    box.onclick = () => {
      taps++;
      const gh = $('#gh', el);
      if (taps < 3) {
        SFX.play(taps === 1 ? 'clack' : 'rise');
        gsap.fromTo(box, { rotation: -14 }, { rotation: 0, duration: .7, ease: 'elastic.out(1.2,.2)' });
        gsap.to(box, { scale: 1 + taps * .15, duration: .3 });
        gh.innerHTML = words(G.shake[taps - 1]); kin(gh);
        conf({ particleCount: 25 * taps, spread: 60, origin: { y: .45 } });
      } else if (taps === 3) {
        gh.innerHTML = words(G.shake[2]); kin(gh);
        SFX.play('rise');
        gsap.to(box, { scale: 2.6, rotation: 360, duration: .7, ease: 'power3.in', onComplete: () => {
          SFX.play('boom'); flash('#fff', 1); shake(20); box.style.opacity = 0;
          burst({ particleCount: 250, spread: 360, startVelocity: 45, origin: { y: .45 } });
          later(next, 500);
        } });
      }
    };
  });
  s.push(bigShow);
  return s;
};

/* ---------- the Big Show: particle canvas + fireworks ---------- */
function bigShow(next) {
  calm = true; $$('#partylayer .balloon,#partylayer .shooter').forEach(b => b.remove());
  const B = L.show;
  const el = render(`<canvas id="cv"></canvas><div class="showline say xl" id="sl"></div>
    <div class="showbtn"><button class="btn big pulse hidden" id="tocake">${B.next}</button></div>`, 'showstage');
  const cv = $('#cv', el), cx = cv.getContext('2d'), dpr = Math.min(2, window.devicePixelRatio || 1);
  let W = 0, H = 0;
  const resize = () => { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  resize(); addEventListener('resize', resize); onLeave(() => removeEventListener('resize', resize));
  const N = W < 600 ? 1000 : 1600, PAL = ['#B9A7F5', '#F2A7C3', '#F7CF6B', '#9FE3C9', '#8EC5F5', '#ffffff'];
  const P = Array.from({ length: N }, () => ({ x: rnd(0, W), y: rnd(0, H), vx: 0, vy: 0, tx: rnd(0, W), ty: rnd(0, H), c: pick(PAL), s: rnd(1.6, 3.2) }));
  const sparks = [];
  function sample(shape) {
    const text = shape === 'NAME' ? B.name : shape;
    const w = Math.floor(W), h = Math.floor(H * .46), oc = document.createElement('canvas'); oc.width = w; oc.height = h;
    const o = oc.getContext('2d', { willReadFrequently: true });
    const emoji = /\p{Extended_Pictographic}/u.test(text);
    const fam = /[؀-ۿ]/.test(text) ? "'Baloo Bhaijaan 2'" : "'Fredoka'";
    let size = emoji ? Math.min(w, h) * .8 : h * .82;
    const setF = () => { o.font = `800 ${size}px ${fam}, 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif`; };
    setF(); while (o.measureText(text).width > w * .9 && size > 20) { size *= .92; setF(); }
    o.textAlign = 'center'; o.textBaseline = 'middle'; o.fillStyle = '#fff';
    o.fillText(text, w / 2, h / 2 + (emoji ? size * .04 : size * .06));
    const d = o.getImageData(0, 0, w, h).data, pts = [], step = 3, top = H * .1;
    for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) {
      const i = (y * w + x) * 4;
      if (d[i + 3] > 140) pts.push({ x, y: y + top, c: emoji ? `rgb(${d[i]},${d[i + 1]},${d[i + 2]})` : pick(PAL) });
    }
    for (let i = pts.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pts[i], pts[j]] = [pts[j], pts[i]]; }
    return pts;
  }
  function form(shape) {
    const pts = sample(shape); if (!pts.length) return;
    P.forEach((p, i) => { const q = pts[i % pts.length]; p.tx = q.x + rnd(-1, 1); p.ty = q.y + rnd(-1, 1); p.c = q.c; });
  }
  function explode(f = 1) { P.forEach(p => { const a = rnd(0, 6.283), v = rnd(4, 16) * f; p.vx += Math.cos(a) * v; p.vy += Math.sin(a) * v; }); }
  function rocket(x, y) {
    const col = pick(PAL);
    for (let i = 0; i < 70; i++) { const a = rnd(0, 6.283), v = rnd(1, 6); sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, c: col }); }
    SFX.play('firework');
  }
  let raf;
  const loop = () => {
    cx.globalCompositeOperation = 'source-over'; cx.fillStyle = 'rgba(22,12,44,.3)'; cx.fillRect(0, 0, W, H);
    for (const p of P) {
      p.vx += (p.tx - p.x) * .05; p.vy += (p.ty - p.y) * .05; p.vx *= .83; p.vy *= .83; p.x += p.vx; p.y += p.vy;
      cx.fillStyle = p.c; cx.fillRect(p.x, p.y, p.s, p.s);
    }
    cx.globalCompositeOperation = 'lighter';
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i]; s.vy += .06; s.vx *= .985; s.x += s.vx; s.y += s.vy; s.life -= .013;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      cx.globalAlpha = s.life; cx.fillStyle = s.c; cx.fillRect(s.x, s.y, 2.4, 2.4); cx.globalAlpha = 1;
    }
    raf = requestAnimationFrame(loop);
  };
  loop(); onLeave(() => cancelAnimationFrame(raf));
  let b = -1, auto = null;
  const beat = () => {
    disarm(); clearTimeout(auto);
    b++; if (b >= B.beats.length) return;
    const bt = B.beats[b];
    explode(b ? 1 : .3); SFX.play(b % 2 ? 'boom' : 'rise'); if (b) { flash(pick(PAL), .35); shake(12); }
    later(() => form(bt.shape), 220);
    later(() => rocket(rnd(W * .15, W * .85), rnd(H * .1, H * .4)), 400);
    const sl = $('#sl', el); sl.innerHTML = words(bt.line); sl.className = 'showline say ' + sizeCls(bt.line); kin(sl, { delay: .35 });
    if (bt.finale) {
      SFX.play('tada'); fireworks(4500);
      every(() => rocket(rnd(W * .1, W * .9), rnd(H * .08, H * .45)), 450);
      later(() => { $('#tocake', el).classList.remove('hidden'); gsap.fromTo('#tocake', { scale: 0 }, { scale: 1, duration: .6, ease: 'back.out(2)' }); }, 2200);
    } else {
      auto = later(beat, 4300);
      armTap(1200, beat, b === 0);
    }
  };
  $('#tocake', el).onclick = () => { calm = false; SFX.play('whoosh'); next(); };
  const fontsReady = document.fonts ? Promise.race([Promise.all([document.fonts.load("800 80px 'Fredoka'"), document.fonts.load("800 80px 'Baloo Bhaijaan 2'")]), new Promise(r => setTimeout(r, 900))]) : Promise.resolve();
  fontsReady.then(() => later(beat, 300));
}

/* ---------- 7. Cake ---------- */
const CCOL = ['#f2a7c3', '#b9a7f5', '#9fe3c9', '#f7cf6b', '#8ec5f5'];
BUILD.cake = () => [next => {
  const C = L.cake;
  const el = render(`<div class="say md" id="cinstr">${words(C.instr)}</div>
    <div class="cakewrap noadv" id="cake" role="button" aria-label="cake"><div class="candles" id="cnd"></div>
      <div class="tier t1"><div class="dots"></div></div><div class="tier t2"><div class="dots"></div></div><div class="tier t3"><div class="dots"></div></div><div class="plate"></div></div>
    <div id="micbox"><button class="btn ghost" id="mic">${C.mic}</button><p class="small">${C.micHint}</p></div>`, 'cakestage');
  kin($('#cinstr', el));
  gsap.fromTo($('#cake', el), { y: 300, scale: .6 }, { y: 0, scale: 1, duration: .9, ease: 'back.out(1.3)' });
  const cnd = $('#cnd', el), candles = [];
  for (let k = 0; k < 25; k++) {
    const back = k < 12, idx = back ? k : k - 12, cnt = back ? 12 : 13;
    const c = document.createElement('div'); c.className = 'candle';
    c.style.left = (3 + idx * (92 / (cnt - 1))) + '%'; c.style.bottom = (back ? 18 : 0) + 'px'; c.style.zIndex = back ? 1 : 2;
    c.style.setProperty('--c', CCOL[k % 5]); c.innerHTML = '<div class="fl"></div><div class="smoke"></div>';
    cnd.appendChild(c); candles.push(c);
  }
  gsap.from(candles, { scaleY: 0, transformOrigin: 'bottom', duration: .3, stagger: .04, delay: .8, onStart: () => SFX.play('sparkle') });
  let lastBlow = 0, stream = null, raf = null, done = false;
  const stopMic = () => { if (raf) cancelAnimationFrame(raf); if (stream) stream.getTracks().forEach(tk => tk.stop()); stream = null; };
  onLeave(stopMic);
  const blow = n => {
    if (done) return;
    candles.filter(c => !c.classList.contains('out')).sort(() => Math.random() - .5).slice(0, n).forEach(c => c.classList.add('out'));
    SFX.play('blow');
    const left = candles.filter(c => !c.classList.contains('out')).length, pr = C.progress;
    $('#cinstr', el).textContent = left > 15 ? fill(pr[0], { n: left }) : left > 8 ? pr[1] : left > 3 ? pr[2] : pr[3];
    if (left === 0) finish();
  };
  const finish = () => {
    done = true; stopMic(); $('#micbox', el).classList.add('hidden');
    const ci = $('#cinstr', el); ci.className = 'say xl'; ci.innerHTML = words(C.done); kin(ci);
    SFX.play('tada'); fireworks(3500); burst({ particleCount: 250, spread: 160, origin: { y: .55 } }); shake(10);
    armTap(2200, next);
  };
  $('#cake', el).onclick = () => blow(4);
  $('#mic', el).onclick = async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = SFX.ctx; if (!ctx) throw new Error('no ctx');
      const src = ctx.createMediaStreamSource(stream), an = ctx.createAnalyser(); an.fftSize = 512; src.connect(an);
      const buf = new Uint8Array(an.fftSize); let hot = 0;
      $('#mic', el).textContent = C.micOn;
      const loop = () => {
        an.getByteTimeDomainData(buf); let sum = 0;
        for (let k = 0; k < buf.length; k++) { const v = (buf[k] - 128) / 128; sum += v * v; }
        hot = Math.sqrt(sum / buf.length) > .16 ? hot + 1 : 0;
        if (hot > 3 && Date.now() - lastBlow > 140) { lastBlow = Date.now(); blow(1); }
        if (!done) raf = requestAnimationFrame(loop);
      };
      loop();
    } catch (e) { toast(C.micNo); }
  };
}];

/* ---------- 8. Letter ---------- */
BUILD.letter = () => {
  const M = L.letter, s = [];
  const emos = ['🌙', '💌', '🎂', '🛠️', '🌠', '📸', '🚶', '😂', '🤝', '✨', '🎬', '🎨', '🥳'];
  const ths = ['night', 'pink', 'gold', 'lav', 'sky', 'pink', 'mint', 'gold', 'lav', 'rainbow', 'night', 'mint', 'pink'];
  M.steps.forEach((t, k) => s.push(say(t, emos[k % emos.length], ths[k % ths.length], k === 9 ? 'tada' : 'whoosh',
    k === 9 ? () => later(() => burst({ particleCount: 140, spread: 140 }), 350) : k === 5 ? () => later(() => SFX.play('sparkle'), 600) : null)));
  s.push(next => {
    const el = render(`<div class="envwrap"><div class="env">💌</div></div>
      <div class="card tape cakemsg letter">${M.card.map(p => `<p>${p}</p>`).join('')}<p class="sign">${M.sign}</p></div>
      <button class="btn big" id="wish">${M.wish}</button>`, 'letterstage');
    const env = $('.env', el);
    gsap.fromTo(env, { scale: 0, rotation: -30 }, { scale: 1.3, rotation: 0, duration: .7, ease: 'back.out(2)' });
    later(() => { gsap.to(env, { y: -60, scale: .6, opacity: 0, duration: .5 }); SFX.play('whoosh'); }, 1000);
    gsap.fromTo($('.letter', el), { y: 120, opacity: 0, rotation: 4 }, { y: 0, opacity: 1, rotation: -1, duration: .8, ease: 'back.out(1.4)', delay: 1.2 });
    gsap.from($$('.letter p', el), { opacity: 0, y: 14, stagger: .5, delay: 1.6 });
    gsap.fromTo($('#wish', el), { opacity: 0 }, { opacity: 1, delay: 3.4 });
    later(() => { SFX.play('chime'); conf({ particleCount: 60, spread: 100, origin: { y: .3 } }); }, 1600);
    $('#wish', el).onclick = () => {
      const o = document.createElement('div'); o.className = 'wishover';
      o.innerHTML = `<span class="shoot">🌠</span><div class="emoji-xl">✨</div><div>${M.wishDone}</div><button class="btn">${L.common.close}</button>`;
      document.body.appendChild(o); SFX.play('sparkle'); burst({ particleCount: 80, colors: ['#fff', '#F7CF6B'] });
      o.onclick = () => o.remove();
    };
    armTap(3800, next);
  });
  return s;
};

/* ================================================================ FINALE */
function finale() {
  S.done = true; save(); where = 'finale'; pips();
  const F = L.finale;
  if (!partyOn) SFX.track(CONFIG.music.letter);
  const el = render(`${art('🎉', 'rainbow')}<h1 class="title fin-title">${words(F.title)}</h1>
    <div class="stack fin-btns">
      <button class="btn big pink" id="partybtn">${partyOn ? F.partyOff : F.party}<small>${F.partySub}</small></button>
      <button class="btn lav" id="moreconf">${F.confetti}</button>
      <button class="btn ghost" id="replay">${F.replay}</button>
      <button class="btn ghost" id="credits">${F.credits}</button>
    </div>`, 'finstage');
  popArt(el); kin($('.fin-title', el), { stagger: .12 });
  gsap.from($$('.fin-btns .btn', el), { y: 40, opacity: 0, stagger: .12, delay: .8 });
  fireworks(2500); SFX.play('tada');
  $('#partybtn', el).onclick = togglePartyMode;
  $('#moreconf', el).onclick = () => { fireworks(1800); burst({ particleCount: 200, spread: 150 }); SFX.play('pop'); SFX.play('horn'); };
  $('#replay', el).onclick = () => { if (partyOn) togglePartyMode(); S.done = false; save(); SFX.play('whoosh'); chapter(0); };
  $('#credits', el).onclick = () => openModal(`<h3>${F.creditsTitle}</h3><ul class="credits">${CONFIG.credits.map(c => `<li>${c}</li>`).join('')}<li>🪩 ${CONFIG.partySong.title} (YouTube)</li></ul><button class="btn" data-close>${L.common.close}</button>`);
}

/* ================================================================ PARTY MODE (YouTube) */
let partyTimer = null;
function togglePartyMode() {
  partyOn = !partyOn;
  document.body.classList.toggle('party', partyOn);
  const box = $('#ytbox'), pb = $('#partybtn');
  if (partyOn) {
    SFX.duck(true); SFX.play('horn'); cannons();
    const id = CONFIG.partySong.youtubeId;
    box.innerHTML = `<div class="ythead"><b>🪩 ${CONFIG.partySong.title}</b><button id="ytx" aria-label="stop">✕</button></div>
      <div class="ytframe"><iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1" title="party song" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>
      <p class="small">${L.finale.ytHint}</p>`;
    box.classList.remove('hidden');
    gsap.fromTo(box, { y: 300 }, { y: 0, duration: .6, ease: 'back.out(1.4)' });
    $('#ytx').onclick = togglePartyMode;
    partyTimer = setInterval(() => burst({ particleCount: 60, spread: 120, origin: { x: rnd(.2, .8), y: rnd(.2, .5) } }), 2500);
    if (pb) pb.innerHTML = `${L.finale.partyOff}<small>${L.finale.partySub}</small>`;
  } else {
    box.classList.add('hidden'); box.innerHTML = '';
    clearInterval(partyTimer); SFX.duck(false);
    if (pb) pb.innerHTML = `${L.finale.party}<small>${L.finale.partySub}</small>`;
  }
  Party.rate(partyOn ? 700 : 1500);
}

/* ================================================================ FLYING THINGS */
const Party = (() => {
  const layer = $('#partylayer'); let id = null, rate = 1500;
  const balloon = () => {
    if (calm || document.hidden || !L) return;
    if ($$('.balloon', layer).length >= (partyOn ? 10 : where === 'journey' ? 2 : 5)) return;
    const b = document.createElement('div'); b.className = 'balloon';
    b.style.left = rnd(2, 86) + 'vw'; b.style.setProperty('--dur', rnd(9, 14) + 's'); b.style.setProperty('--c', pick(BCOLORS));
    b.innerHTML = '<div class="b"></div><div class="s"></div>';
    b.addEventListener('pointerdown', e => {
      b.remove(); SFX.play('pop'); popword(e.clientX, e.clientY);
      conf({ particleCount: 24, spread: 60, startVelocity: 22, origin: { x: e.clientX / innerWidth, y: e.clientY / innerHeight } });
    });
    b.addEventListener('animationend', () => b.remove());
    layer.appendChild(b);
  };
  const shooter = () => {
    if (calm || document.hidden || !L) return;
    const e = document.createElement('div'); e.className = 'shooter'; e.textContent = pick(['🎉', '🎈', '⭐', '🎁', '🧁', '🎶', '✨', '🪅', '🎊', '💫', '🍰', '🥳']);
    layer.appendChild(e);
    const ltr = Math.random() < .2 ? RTL() : !RTL(), y0 = rnd(.15, .7) * innerHeight, x0 = ltr ? -70 : innerWidth + 70, x1 = ltr ? innerWidth + 70 : -70;
    SFX.play('whoosh');
    gsap.set(e, { x: x0, y: y0 });
    gsap.to(e, { keyframes: [{ x: (x0 + x1) / 2, y: y0 - rnd(60, 160), duration: .9, ease: 'power1.out' }, { x: x1, y: y0 + rnd(-40, 120), duration: .9, ease: 'power1.in' }], onComplete: () => e.remove() });
    gsap.to(e, { rotation: ltr ? 540 : -540, duration: 1.8, ease: 'none' });
    e.addEventListener('pointerdown', ev => { SFX.play('sparkle'); popword(ev.clientX, ev.clientY); conf({ particleCount: 30, spread: 80, origin: { x: ev.clientX / innerWidth, y: ev.clientY / innerHeight } }); gsap.killTweensOf(e); e.remove(); });
  };
  const loopShooter = () => setTimeout(() => { shooter(); loopShooter(); }, rnd(partyOn ? 2000 : 5500, partyOn ? 3500 : 9000));
  return {
    start() { if (id) return; id = setInterval(balloon, rate); loopShooter(); },
    rate(ms) { rate = ms; if (id) { clearInterval(id); id = setInterval(balloon, rate); } }
  };
})();

function buildSky() {
  const st = $('#stars');
  for (let k = 0; k < 70; k++) {
    const s = document.createElement('span'); s.className = 'st' + (Math.random() < .15 ? ' big' : '');
    s.style.cssText = `left:${rnd(0, 100)}%;top:${rnd(0, 100)}%;--d:${rnd(2, 5)}s;--dl:${-rnd(0, 5)}s`;
    st.appendChild(s);
  }
  ['🎈', '⭐', '🎂', '🪐', '🖌️', '🐾', '📚', '🎵', '✦', '🎀'].forEach((e, k) => {
    const s = document.createElement('span'); s.className = 'sticker'; s.textContent = e;
    s.style.cssText = `left:${k % 2 ? rnd(86, 95) : rnd(1, 9)}%;top:${rnd(12, 92)}%;--dl:${-rnd(0, 6)}s`;
    st.appendChild(s);
  });
}

/* ================================================================ HUD / MODAL / EGGS */
function openModal(html) {
  const m = $('#modal'); $('.sheet', m).innerHTML = html; m.classList.remove('hidden');
  $$('[data-close]', m).forEach(b => b.onclick = closeModal);
}
function closeModal() { $('#modal').classList.add('hidden'); }
function rerender() {
  if (where === 'journey') chapter(S.ch);
  else if (where === 'finale') finale();
  else if (where === 'start') startScreen();
  else if (where === 'gate') gate();
}
function bindHud() {
  $('#btnLang').onclick = () => { setLang(S.lang === 'en' ? 'ar' : 'en'); SFX.play('tap'); rerender(); };
  const mute = () => { $('#btnMute').textContent = S.muted ? '🔇' : '🔊'; };
  $('#btnMute').onclick = () => { S.muted = !S.muted; save(); SFX.setMuted(S.muted); mute(); };
  mute();
  $('#btnConfetti').onclick = () => { burst({ particleCount: 120, spread: 100, origin: { x: rnd(.2, .8), y: rnd(.3, .6) } }); SFX.play('pop'); SFX.play('horn'); };
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
  let lp = null; const logo = $('#logo');
  logo.addEventListener('pointerdown', () => { lp = setTimeout(walkCat, 650); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => logo.addEventListener(ev, () => clearTimeout(lp)));
  logo.addEventListener('click', () => { SFX.play('sparkle'); burst({ particleCount: 50, origin: { x: L && L.dir === 'rtl' ? .9 : .1, y: .08 } }); });
  logo.addEventListener('contextmenu', e => e.preventDefault());
  let moonTaps = 0;
  $('#moon').onclick = () => {
    if (!L) return; moonTaps++; SFX.play('tap');
    if (moonTaps === 5) { $('#moon').classList.add('hatted'); toast(L.eggs.moon); burst({ particleCount: 60, origin: { x: .85, y: .12 } }); }
  };
  let lastShake = 0, lastMag = null;
  window.addEventListener('devicemotion', e => {
    const a = e.accelerationIncludingGravity; if (!a || !L) return;
    const mag = Math.abs(a.x) + Math.abs(a.y) + Math.abs(a.z);
    if (lastMag != null && Math.abs(mag - lastMag) > 30 && Date.now() - lastShake > 2500) {
      lastShake = Date.now(); burst({ particleCount: 200, spread: 160, origin: { y: .4 } }); SFX.play('pop'); toast(L.eggs.shake);
    }
    lastMag = mag;
  });
}
function walkCat() {
  if (!L) return;
  const cat = $('#cat');
  if (CONFIG.images.cat) cat.innerHTML = `<img src="${CONFIG.images.cat}" alt="" style="width:64px">`;
  cat.classList.remove('walk'); void cat.offsetWidth; cat.classList.add('walk');
  toast(L.eggs.cat, 3000); SFX.play('sparkle');
}

/* ================================================================ BOOT */
buildSky(); bindHud(); Party.start();
langScreen();
})();
