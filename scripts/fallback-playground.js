/** Immediately playable, dependency-free companion to the WebGL scene. */
export function createFallbackPlayground({ container, canvas, fallback, getScore = () => 0, onScore = () => {}, onStatus = () => {}, reducedMotion = false }) {
  const sun = fallback.querySelector('.fallback-sun');
  const ring = fallback.querySelector('.fallback-ring');
  const cube = fallback.querySelector('.fallback-cube');
  const shadow = fallback.querySelector('.fallback-shadow');
  const effects = document.createElement('div');
  effects.className = 'bd-fallback-effects';
  effects.setAttribute('aria-hidden', 'true');
  container.append(effects);

  let active = false, disposed = false, muted = true, language = 'zh';
  let arrangement = 0, pointer = null, angle = 0, offsetX = 0, offsetY = 0;
  let audio = null, feedbackTimer = 0, bounceTimer = 0;
  const timers = new Set(), animations = new Map(), audioNodes = new Set();
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
  const later = (fn, delay) => {
    const id = setTimeout(() => { timers.delete(id); if (!disposed) fn(); }, delay);
    timers.add(id);
    return id;
  };
  const baseAngle = () => [-10, 9, -4][arrangement];
  const restTransform = () => `translate(${offsetX}px,${offsetY}px) rotate(${baseAngle() + angle}deg)`;
  const cancelAnimation = key => { animations.get(key)?.cancel(); animations.delete(key); };
  function animate(key, element, frames, options) {
    cancelAnimation(key);
    if (!element?.animate) return false;
    try {
      const animation = element.animate(frames, options);
      animations.set(key, animation);
      animation.onfinish = () => { if (animations.get(key) === animation) animations.delete(key); };
      return true;
    } catch { return false; }
  }
  function paintPose() {
    sun.style.transform = restTransform();
    ring.style.transform = `translate(${offsetX * -.38}px,${offsetY * -.4}px) rotate3d(1,1,0,25deg) rotate(${angle * -1.3}deg)`;
    cube.style.transform = `translate(${offsetX * .3}px,${offsetY * .35}px) rotate(${18 + angle * .8}deg)`;
  }
  function clearFeedback() {
    clearTimeout(feedbackTimer);
    timers.delete(feedbackTimer);
    sun.classList.remove('bd-fallback-popped', 'bd-fallback-celebrate');
  }
  function stopBounce() {
    cancelAnimation('bounce');
    clearTimeout(bounceTimer); timers.delete(bounceTimer);
  }
  function stopSounds() {
    audioNodes.forEach(node => { try { node.stop?.(); node.disconnect(); } catch {} });
    audioNodes.clear();
  }

  function playSound(celebrate) {
    if (muted || !active || disposed) return;
    try {
      const AudioClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioClass) return;
      audio ||= new AudioClass();
      if (audio.state === 'suspended') audio.resume().catch(() => {});
      const notes = celebrate ? [523.25, 659.25, 783.99] : [480 + (Number(getScore()) % 5) * 80];
      notes.forEach((frequency, index) => {
        const oscillator = audio.createOscillator(), gain = audio.createGain();
        const start = audio.currentTime + index * .075;
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, start);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.25, start + .08);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(.045, start + .012);
        gain.gain.exponentialRampToValueAtTime(.001, start + .23);
        oscillator.connect(gain); gain.connect(audio.destination);
        audioNodes.add(oscillator); audioNodes.add(gain);
        oscillator.onended = () => {
          oscillator.disconnect(); gain.disconnect();
          audioNodes.delete(oscillator); audioNodes.delete(gain);
        };
        oscillator.start(start); oscillator.stop(start + .25);
      });
    } catch { /* A blocked audio device must never block play. */ }
  }

  function burst(celebrate) {
    while (effects.childElementCount > 55) effects.firstElementChild.remove();
    const bounds = container.getBoundingClientRect(), rect = sun.getBoundingClientRect();
    const x = clamp(rect.left - bounds.left + rect.width / 2, 28, bounds.width - 28);
    const y = rect.top - bounds.top + rect.height * .3;
    const label = document.createElement('span');
    label.className = 'bd-fallback-float' + (reducedMotion ? ' is-still' : '');
    label.textContent = celebrate ? (language === 'zh' ? '+1 好耶！' : '+1 YAY!') : '+1';
    label.style.left = `${x}px`; label.style.top = `${y}px`;
    effects.append(label);
    later(() => label.remove(), 1000);
    if (reducedMotion) return;
    const palette = ['#ffce32', '#3262f5', '#ff8267', '#ad99e7', '#a8c560'];
    const count = celebrate ? 26 : 12;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('i');
      const direction = i * Math.PI * 2 / count;
      const distance = Math.min(bounds.width * .34, celebrate ? 150 : 100) * (.6 + Math.random() * .4);
      const dx = clamp(Math.cos(direction) * distance, -x + 12, bounds.width - x - 12);
      const dy = Math.sin(direction) * distance + 65;
      particle.className = 'bd-fallback-confetti';
      particle.style.cssText = `left:${x}px;top:${y + 32}px;background:${palette[i % palette.length]};--bd-dx:${dx}px;--bd-dy:${dy}px;--bd-turn:${90 + Math.random() * 340}deg;animation-delay:${i * 7}ms;`;
      effects.append(particle);
      later(() => particle.remove(), 1250);
    }
  }

  function pop() {
    if (!active || disposed) return;
    stopBounce();
    const score = (Number(getScore()) || 0) + 1;
    onScore(score);
    const celebrate = score % 5 === 0;
    clearFeedback();
    sun.classList.add('bd-fallback-popped');
    if (celebrate) sun.classList.add('bd-fallback-celebrate');
    feedbackTimer = later(clearFeedback, 800);
    if (!reducedMotion) {
      const rest = restTransform();
      const height = Math.min(container.clientHeight * .14, celebrate ? 76 : 58);
      const frames = [
        { transform:rest, offset:0 },
        { transform:`${rest} translateY(9px) scale(1.14,.84)`, offset:.12 },
        { transform:`${rest} translateY(-${height}px) rotate(9deg) scale(.94,1.08)`, offset:.43 },
        { transform:`${rest} translateY(3px) scale(1.08,.92)`, offset:.76 },
        { transform:rest, offset:1 }
      ];
      if (!animate('bounce', sun, frames, { duration:celebrate ? 850 : 660, easing:'cubic-bezier(.2,.7,.3,1)' })) {
        sun.style.transform = `${rest} translateY(-${height}px) scale(1.04,.96)`;
        bounceTimer = later(paintPose, 280);
      }
      animate('shadow', shadow, [{ transform:'scale(1)', opacity:1 }, { transform:'scale(.72)', opacity:.5, offset:.43 }, { transform:'scale(1)', opacity:1 }], { duration:660, easing:'ease-out' });
    }
    burst(celebrate);
    playSound(celebrate);
    onStatus(celebrate ? 'celebrate' : 'pop');
  }

  function shuffle() {
    if (!active || disposed) return;
    stopBounce();
    arrangement = (arrangement + 1) % 3;
    container.dataset.bdArrangement = String(arrangement);
    angle = offsetX = offsetY = 0;
    paintPose();
    if (!reducedMotion) animate('shuffle', sun, [{ opacity:.65 }, { opacity:1 }], { duration:260, easing:'ease-out' });
    onStatus('shuffle');
  }

  function resetPointer() {
    if (pointer) {
      try { if (container.hasPointerCapture?.(pointer.id)) container.releasePointerCapture(pointer.id); } catch {}
    }
    pointer = null;
    container.classList.remove('bd-fallback-dragging');
  }
  function pointerDown(event) {
    if (!active || disposed || (event.pointerType === 'mouse' && event.button !== 0)) return;
    if (event.target.closest?.('button,a,[data-no-playground]')) return;
    resetPointer();
    pointer = { id:event.pointerId, x:event.clientX, y:event.clientY, type:event.pointerType, moved:false, scrolling:false, angle, offsetX, offsetY };
    if (event.pointerType === 'mouse') {
      try { container.setPointerCapture(event.pointerId); } catch {}
    }
  }
  function pointerMove(event) {
    if (!active || !pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y;
    if (Math.hypot(dx, dy) > 8) pointer.moved = true;
    if (pointer.type !== 'mouse' && Math.abs(dy) > 9 && Math.abs(dy) > Math.abs(dx) * 1.15) pointer.scrolling = true;
    if (!pointer.moved || pointer.scrolling) return;
    stopBounce();
    container.classList.add('bd-fallback-dragging');
    const strength = reducedMotion ? .3 : 1;
    angle = clamp(pointer.angle + dx * .2 * strength, -18, 18);
    offsetX = clamp(pointer.offsetX + dx * .12 * strength, -18, 18);
    offsetY = clamp(pointer.offsetY + (pointer.type === 'mouse' ? dy * .12 : 0) * strength, -15, 15);
    paintPose();
  }
  function pointerUp(event) {
    if (!active || !pointer || pointer.id !== event.pointerId) return;
    const click = !pointer.moved && !pointer.scrolling && Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) <= 8;
    resetPointer();
    if (click) pop();
  }
  function pointerLeave(event) {
    if (!pointer) return;
    if (!container.hasPointerCapture?.(event.pointerId)) resetPointer();
  }
  function pointerCancel(event) { if (pointer?.id === event.pointerId) resetPointer(); }
  function visibilityChange() { if (document.hidden) resetPointer(); }
  const listeners = [
    ['pointerdown', pointerDown], ['pointermove', pointerMove], ['pointerup', pointerUp],
    ['pointercancel', pointerCancel], ['pointerleave', pointerLeave], ['lostpointercapture', pointerCancel]
  ];

  function activate() {
    if (disposed) return;
    fallback.classList.remove('is-hidden');
    fallback.inert = false;
    canvas.style.pointerEvents = 'none';
    container.classList.add('bd-fallback-active');
    container.dataset.bdArrangement = String(arrangement);
    if (!active) {
      listeners.forEach(([name, listener]) => container.addEventListener(name, listener, { passive:true }));
      document.addEventListener('visibilitychange', visibilityChange);
      window.addEventListener('blur', resetPointer);
    }
    active = true;
    paintPose();
  }
  function deactivate() {
    resetPointer();
    active = false;
    listeners.forEach(([name, listener]) => container.removeEventListener(name, listener));
    document.removeEventListener('visibilitychange', visibilityChange);
    window.removeEventListener('blur', resetPointer);
    container.classList.remove('bd-fallback-active');
    fallback.classList.add('is-hidden');
    fallback.inert = true;
    canvas.style.pointerEvents = 'auto';
    animations.forEach(animation => animation.cancel()); animations.clear();
    timers.forEach(clearTimeout); timers.clear();
    stopSounds();
    clearFeedback(); effects.replaceChildren();
  }
  activate();
  return {
    activate, deactivate, pop, shuffle,
    setMuted(value) { muted = Boolean(value); if (muted) stopSounds(); },
    setLanguage(value) { language = value === 'en' ? 'en' : 'zh'; },
    destroy() {
      if (disposed) return;
      deactivate(); disposed = true;
      effects.remove();
      if (audio && audio.state !== 'closed') audio.close().catch(() => {});
      delete container.dataset.bdArrangement;
      sun.style.removeProperty('transform'); ring.style.removeProperty('transform'); cube.style.removeProperty('transform');
    }
  };
}
