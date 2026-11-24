/* Built-in party music + sound effects (Web Audio, no files needed).
   If CONFIG.music[mood] has an mp3 path, that file plays instead of the synth. */
window.SFX = (() => {
  let ctx, master, musicBus, sfxBus, noiseBuf, timer = null, mood = null, step = 0, nextT = 0, muted = false;
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

  const MOODS = {
    ambient:  { bpm: 72,  wave: 'sine',     vol: .11, chords: [[60,64,67,71],[57,60,64,67],[53,57,60,64],[55,59,62,65]], arp: [0,2,1,3,2,1,3,2], oct: 12, bell: true },
    art:      { bpm: 80,  wave: 'triangle', vol: .10, chords: [[62,65,69,72],[55,59,62,65],[60,64,67,71],[57,60,64,67]], arp: [0,1,2,3,2,1,0,2], oct: 0, hat: true },
    passport: { bpm: 116, wave: 'square',   vol: .035, chords: [[60,64,67],[55,59,62],[57,60,64],[53,57,60]], arp: [0,1,2,1,0,2,1,2], oct: 12, stac: true, kick: true },
    lab:      { bpm: 100, wave: 'sine',     vol: .09, chords: [[57,60,64],[53,57,60],[60,64,67],[55,59,62]], arp: [0,2,1,2,0,2,1,2], oct: 24, blip: true },
    kdrama:   { bpm: 64,  wave: 'triangle', vol: .12, chords: [[53,57,60,64],[55,59,62,65],[52,55,59,62],[57,60,64,67]], arp: [0,1,2,3,2,3,1,2], oct: 12, bell: true },
    video:    { bpm: 92,  wave: 'triangle', vol: .10, chords: [[60,64,67,72],[55,59,62,67],[57,60,64,69],[53,57,60,65]], arp: [0,1,2,3,1,2,3,2], oct: 12, bell: true, kick: true },
    party:    { bpm: 124, wave: 'square',   vol: .035, chords: [[60,64,67],[53,57,60],[55,59,62],[60,64,67]], arp: [0,1,2,1,2,1,0,1], oct: 12, stac: true, kick: true, hat: true }
  };
  // Happy Birthday (public domain) — [midi, beats]
  const HB = [[67,.75],[67,.25],[69,1],[67,1],[72,1],[71,2],[67,.75],[67,.25],[69,1],[67,1],[74,1],[72,2],
              [67,.75],[67,.25],[79,1],[76,1],[72,1],[71,1],[69,2],[77,.75],[77,.25],[76,1],[72,1],[74,1],[72,3],[0,2]];
  let hbIdx = 0;

  function init() {
    if (ctx) { ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = muted ? 0 : 1; master.connect(ctx.destination);
    musicBus = ctx.createGain(); musicBus.gain.value = 1; musicBus.connect(master);
    sfxBus = ctx.createGain(); sfxBus.gain.value = .8; sfxBus.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    // iOS unlock
    const b = ctx.createBufferSource(); b.buffer = ctx.createBuffer(1, 1, 22050); b.connect(ctx.destination); b.start(0);
    unlockDecks();
  }

  function tone(freq, t, dur, wave = 'sine', vol = .1, bus = musicBus, attack = .01) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = wave; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(bus); o.start(t); o.stop(t + dur + .05);
    return o;
  }
  function noise(t, dur, vol = .2, type = 'highpass', f = 6000, bus = sfxBus, q = 1) {
    const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf; fl.type = type; fl.frequency.setValueAtTime(f, t); fl.Q.value = q;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    s.connect(fl); fl.connect(g); g.connect(bus); s.start(t); s.stop(t + dur + .05);
    return fl;
  }

  function schedule() {
    if (!ctx || !mood) return;
    while (nextT < ctx.currentTime + .15) {
      if (mood === 'birthday') {
        const [m, beats] = HB[hbIdx % HB.length]; const spb = 60 / 100;
        if (m) { tone(mtof(m), nextT, beats * spb * .95, 'sine', .14); tone(mtof(m + 12), nextT, beats * spb * .6, 'triangle', .04); }
        if (hbIdx % 3 === 0 && m) tone(mtof(48 + (m % 12)), nextT, spb * 1.5, 'sine', .07);
        nextT += beats * spb; hbIdx++;
        continue;
      }
      const M = MOODS[mood]; const s8 = 60 / M.bpm / 2;
      const ch = M.chords[Math.floor(step / 8) % M.chords.length];
      const n = ch[M.arp[step % 8] % ch.length] + (M.oct || 0);
      tone(mtof(n), nextT, M.stac ? s8 * .7 : s8 * 1.8, M.wave, M.vol);
      if (M.bell && step % 4 === 0) tone(mtof(n + 12), nextT, s8 * 3, 'sine', M.vol * .35);
      if (step % 4 === 0) tone(mtof(ch[0] - 12), nextT, s8 * 3.6, 'sine', .09);
      if (M.blip && step % 8 === 6) tone(mtof(n + 19), nextT, .08, 'square', .02);
      if (M.kick && step % 4 === 0) { const o = tone(120, nextT, .25, 'sine', .22); o.frequency.exponentialRampToValueAtTime(40, nextT + .2); }
      if (M.hat && step % 2 === 1) noise(nextT, .04, .05, 'highpass', 8000, musicBus);
      nextT += s8; step++;
    }
  }

  /* ---- real tracks: two <audio> elements routed through gain nodes (iOS-safe fades) ---- */
  const decks = []; let deckIdx = 0, curTrack = null, ducked = false;
  function makeDeck() {
    const el = new Audio(); el.preload = 'none'; el.loop = true; el.crossOrigin = 'anonymous'; el.setAttribute('playsinline', '');
    const d = { el, gain: null };
    if (ctx) { try { const src = ctx.createMediaElementSource(el); d.gain = ctx.createGain(); d.gain.gain.value = 0; src.connect(d.gain); d.gain.connect(musicBus); } catch (e) { d.gain = null; } }
    return d;
  }
  function unlockDecks() {
    if (decks.length || !ctx) return;
    decks.push(makeDeck(), makeDeck());
    decks.forEach(d => { try { d.el.src = 'assets/audio/silence.mp3'; const p = d.el.play(); p && p.then(() => d.el.pause()).catch(() => {}); } catch (e) {} });
  }
  function fadeDeck(d, to, sec) {
    if (d.gain) { const g = d.gain.gain, t = ctx.currentTime; g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(to, t + sec); }
    else d.el.volume = Math.max(0, Math.min(1, to));
  }
  function track(name) {
    const src = window.CONFIG && CONFIG.tracks && CONFIG.tracks[name];
    if (!src) return music(name === 'cake' ? 'birthday' : 'video');
    if (name === curTrack) return;
    if (timer) { clearInterval(timer); timer = null; }
    mood = null; curTrack = name;
    if (!decks.length) unlockDecks();
    if (!decks.length) { music('video'); return; }
    const old = decks[deckIdx]; deckIdx = 1 - deckIdx; const d = decks[deckIdx];
    if (old.el.src && !old.el.paused) { fadeDeck(old, 0, 1.2); setTimeout(() => { if (decks[deckIdx] !== old) old.el.pause(); }, 1300); }
    d.el.src = src; d.el.currentTime = 0; d.el.muted = muted;
    fadeDeck(d, 0, 0.01);
    const p = d.el.play();
    const ok = () => fadeDeck(d, ducked ? 0 : .8, 1.2);
    if (p && p.then) p.then(ok).catch(() => { curTrack = null; music('video'); }); else ok();
  }
  function duck(on) {
    ducked = on;
    const d = decks[deckIdx];
    if (d && d.el.src && curTrack) { fadeDeck(d, on ? 0 : .8, .6); if (on) setTimeout(() => ducked && d.el.pause(), 700); else d.el.play().catch(() => {}); }
    if (musicBus && ctx) musicBus.gain.setTargetAtTime(on ? 0 : 1, ctx.currentTime, .15);
  }

  function music(name) {
    if (name === mood) return;
    stopMusic();
    mood = name;
    if (!ctx) return;
    step = 0; hbIdx = 0; nextT = ctx.currentTime + .08;
    timer = setInterval(schedule, 25);
  }
  function stopMusic() {
    if (timer) clearInterval(timer); timer = null;
    decks.forEach(d => { if (!d.el.paused) { fadeDeck(d, 0, .5); setTimeout(() => d.el.pause(), 550); } });
    curTrack = null; mood = null;
  }
  function setMuted(m) {
    muted = m;
    if (master) master.gain.setTargetAtTime(m ? 0 : 1, ctx.currentTime, .05);
    decks.forEach(d => d.el.muted = m);
  }

  const fx = {
    pop() { const t = ctx.currentTime; noise(t, .08, .5, 'highpass', 1500); const o = tone(900, t, .1, 'sine', .25, sfxBus); o.frequency.exponentialRampToValueAtTime(200, t + .08); },
    sparkle() { const t = ctx.currentTime; [84, 88, 91, 96, 100].forEach((m, i) => tone(mtof(m), t + i * .06, .3, 'sine', .12, sfxBus)); },
    star() { const t = ctx.currentTime; [72, 76, 79, 84].forEach((m, i) => tone(mtof(m), t + i * .08, .5, 'triangle', .14, sfxBus)); },
    thump() { const t = ctx.currentTime; const o = tone(160, t, .25, 'sine', .5, sfxBus); o.frequency.exponentialRampToValueAtTime(45, t + .2); noise(t, .1, .35, 'lowpass', 900); },
    clack() { const t = ctx.currentTime; noise(t, .06, .7, 'bandpass', 2500, sfxBus, 3); tone(1800, t, .04, 'square', .08, sfxBus); },
    whoosh() { const t = ctx.currentTime; const f = noise(t, .45, .22, 'bandpass', 400, sfxBus, 2); f.frequency.exponentialRampToValueAtTime(4000, t + .4); },
    horn() { const t = ctx.currentTime; const o = tone(300, t, .7, 'sawtooth', .12, sfxBus, .03); o.frequency.linearRampToValueAtTime(520, t + .25); },
    blow() { const t = ctx.currentTime; noise(t, .35, .25, 'lowpass', 1200); },
    tap() { const t = ctx.currentTime; tone(660, t, .08, 'triangle', .1, sfxBus); },
    tick() { const t = ctx.currentTime; noise(t, .03, .4, 'highpass', 5000); },
    wrong() { const t = ctx.currentTime; tone(220, t, .25, 'triangle', .15, sfxBus); tone(180, t + .12, .3, 'triangle', .15, sfxBus); },
    boom() { const t = ctx.currentTime; const o = tone(90, t, .8, 'sine', .6, sfxBus); o.frequency.exponentialRampToValueAtTime(30, t + .7); noise(t, .6, .5, 'lowpass', 700); },
    rise() { const t = ctx.currentTime; const o = tone(200, t, .6, 'sawtooth', .05, sfxBus, .3); o.frequency.exponentialRampToValueAtTime(1400, t + .55); const f = noise(t, .6, .12, 'bandpass', 300, sfxBus, 2); f.frequency.exponentialRampToValueAtTime(6000, t + .55); },
    firework() { const t = ctx.currentTime; noise(t, .9, .35, 'lowpass', 2500); [0, .12, .2, .33].forEach(d => noise(t + .3 + d, .05, .3, 'highpass', 4000)); },
    chime() { const t = ctx.currentTime; [79, 83, 86].forEach((m, i) => tone(mtof(m), t + i * .05, .7, 'sine', .09, sfxBus)); },
    slam() { const t = ctx.currentTime; noise(t, .18, .45, 'lowpass', 1800); const o = tone(220, t, .2, 'square', .06, sfxBus); o.frequency.exponentialRampToValueAtTime(70, t + .18); },
    clap() { const t = ctx.currentTime; [0, .02, .04].forEach(d => noise(t + d, .08, .5, 'bandpass', 1200, sfxBus, 1.5)); },
    tada() { const t = ctx.currentTime; [60, 64, 67, 72].forEach((m, i) => tone(mtof(m), t + i * .09, .9, 'triangle', .13, sfxBus)); }
  };
  function play(name) { if (!ctx || muted) return; try { fx[name] && fx[name](); } catch (e) {} }

  return { init, track, duck, unlockDecks, music, stopMusic, setMuted, play, get ctx() { return ctx; }, get mood() { return mood; } };
})();
