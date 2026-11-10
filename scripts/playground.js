import * as THREE from '../vendor/three/three.module.js';

/** A tiny, entirely local Three.js toy. No models, remote textures or tracking. */
export async function createPlayground({ container, canvas, getScore, onScore = () => {}, onStatus = () => {}, reducedMotion = false }) {
  let renderer;
  let observer, intersectionObserver;
  let disposed = false, contextUnavailable = false;
  let audioContext = null, raf = 0, pointer = null;
  const resources = new Set();
  const listeners = [];
  const own = resource => { resources.add(resource); return resource; };
  const listen = (target, type, handler, options) => {
    target.addEventListener(type, handler, options);
    listeners.push([target, type, handler, options]);
  };
  // Clean up everything already created, even if initialization stopped midway.
  const safely = cleanup => { try { cleanup(); } catch { /* Continue releasing the remaining resources. */ } };
  const destroy = () => {
    if (disposed) return;
    disposed = true;
    contextUnavailable = true;
    pointer = null;
    if (raf) safely(() => cancelAnimationFrame(raf));
    raf = 0;
    if (observer) safely(() => observer.disconnect());
    if (intersectionObserver) safely(() => intersectionObserver.disconnect());
    listeners.splice(0).forEach(([target, type, handler, options]) => {
      safely(() => target.removeEventListener(type, handler, options));
    });
    if (audioContext && audioContext.state !== 'closed') {
      safely(() => Promise.resolve(audioContext.close()).catch(() => {}));
    }
    audioContext = null;
    resources.forEach(resource => safely(() => resource.dispose()));
    resources.clear();
    if (renderer) safely(() => renderer.dispose());
    delete canvas.dataset.ready;
  };

  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-4, 4, 3.5, -3.5, 0.1, 40);
    camera.position.set(0, 2.35, 10);
    camera.lookAt(0, 0.05, 0);
    const world = new THREE.Group();
    scene.add(world);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xcfbca4, 2.7));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(-4, 7, 6);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xffedd1, 1.3);
    rimLight.position.set(5, 1, -2);
    scene.add(rimLight);

    const colors = { yellow: '#ffcb28', blue: '#386cf5', coral: '#ff846d', purple: '#b3a1f1', lime: '#c8e972', ink: '#20221f' };
    const softMaterial = (color, roughness = 0.54) => own(new THREE.MeshPhysicalMaterial({ color, roughness, metalness: 0, clearcoat: 0.13, clearcoatRoughness: 0.6 }));
    const yellow = softMaterial(colors.yellow);
    const blue = softMaterial(colors.blue, 0.42);
    const coral = softMaterial(colors.coral);
    const purple = softMaterial(colors.purple);
    const lime = softMaterial(colors.lime);

    // The low plinth and contact shadows ground the toys without expensive shadow maps.
    const plinth = new THREE.Mesh(own(new THREE.CylinderGeometry(2.55, 2.48, 0.14, 64)), softMaterial('#f5eddb', 0.9));
    plinth.position.set(0, -2.02, -0.15);
    world.add(plinth);
    const rim = new THREE.Mesh(own(new THREE.TorusGeometry(2.48, 0.018, 6, 80)), softMaterial('#e6d8bd', 0.9));
    rim.rotation.x = -Math.PI / 2;
    rim.position.copy(plinth.position).y += 0.076;
    world.add(rim);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = shadowCanvas.height = 128;
    const shadowContext = shadowCanvas.getContext('2d');
    const shadowGradient = shadowContext.createRadialGradient(64, 64, 0, 64, 64, 64);
    shadowGradient.addColorStop(0, 'rgba(89,65,26,.24)');
    shadowGradient.addColorStop(0.45, 'rgba(89,65,26,.12)');
    shadowGradient.addColorStop(1, 'rgba(89,65,26,0)');
    shadowContext.fillStyle = shadowGradient;
    shadowContext.fillRect(0, 0, 128, 128);
    const shadowTexture = own(new THREE.CanvasTexture(shadowCanvas));
    const shadow = new THREE.Mesh(own(new THREE.PlaneGeometry(4.4, 3.1)), own(new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false })));
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(0, -1.936, 0.05);
    world.add(shadow);

    const sun = new THREE.Group();
    sun.position.set(0, 0.32, 0.1);
    sun.rotation.z = -0.10;
    const body = new THREE.Mesh(own(new THREE.SphereGeometry(1.19, 48, 32)), yellow);
    body.scale.set(1.06, 1, 0.7);
    sun.add(body);
    const rayGeometry = own(new THREE.CapsuleGeometry(0.135, 0.29, 4, 12));
    [32, 105, 195, 276].forEach(degrees => {
      const angle = THREE.MathUtils.degToRad(degrees);
      const ray = new THREE.Mesh(rayGeometry, yellow);
      ray.position.set(Math.cos(angle) * 1.65, Math.sin(angle) * 1.60, 0.02);
      ray.rotation.z = angle - Math.PI / 2;
      ray.rotation.x = 0.09;
      sun.add(ray);
    });
    world.add(sun);

    const faceCanvas = document.createElement('canvas');
    faceCanvas.width = faceCanvas.height = 512;
    const faceContext = faceCanvas.getContext('2d');
    const faceTexture = own(new THREE.CanvasTexture(faceCanvas));
    faceTexture.colorSpace = THREE.SRGBColorSpace;
    const face = new THREE.Mesh(own(new THREE.PlaneGeometry(2.26, 2.26)), own(new THREE.MeshBasicMaterial({ map: faceTexture, transparent: true, depthWrite: false, toneMapped: false })));
    face.position.set(0, 0, 0.855);
    sun.add(face);
    let faceVariant = 0;
    const drawFace = (variant = 0, blink = false) => {
      const c = faceContext;
      c.clearRect(0, 0, 512, 512);
      c.strokeStyle = c.fillStyle = colors.ink;
      c.lineWidth = 18;
      c.lineCap = 'round';
      c.lineJoin = 'round';
      if (variant === 1 || blink) {
        c.beginPath(); c.moveTo(145, 201); c.quadraticCurveTo(171, 179, 197, 201); c.stroke();
      } else {
        c.beginPath(); c.moveTo(141, 185); c.quadraticCurveTo(170, 181, 195, 198); c.quadraticCurveTo(173, 203, 154, 222); c.stroke();
      }
      if (blink) {
        c.beginPath(); c.moveTo(297, 200); c.quadraticCurveTo(321, 182, 345, 200); c.stroke();
      } else {
        c.beginPath(); c.ellipse(321, 192, 25, 38, -0.16, 0, Math.PI * 2); c.fill();
        c.fillStyle = '#fffefa'; c.beginPath(); c.ellipse(319, 177, 7, 9, -0.2, 0, Math.PI * 2); c.fill();
      }
      c.fillStyle = c.strokeStyle = colors.ink;
      c.lineWidth = 17;
      c.beginPath(); c.moveTo(171, 269); c.bezierCurveTo(211, 312, 293, 291, 333, 252); c.stroke();
      if (variant !== 2) {
        c.lineWidth = 14;
        c.beginPath(); c.moveTo(259, 289); c.bezierCurveTo(269, 356, 319, 358, 321, 271); c.stroke();
      }
      c.lineWidth = 12;
      c.beginPath(); c.moveTo(328, 246); c.quadraticCurveTo(340, 247, 342, 260); c.stroke();
      faceTexture.needsUpdate = true;
    };
    drawFace();

    const roundedShape = (width, height, radius) => {
      const s = new THREE.Shape();
      const x = -width / 2, y = -height / 2;
      s.moveTo(x + radius, y); s.lineTo(x + width - radius, y);
      s.quadraticCurveTo(x + width, y, x + width, y + radius);
      s.lineTo(x + width, y + height - radius); s.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      s.lineTo(x + radius, y + height); s.quadraticCurveTo(x, y + height, x, y + height - radius);
      s.lineTo(x, y + radius); s.quadraticCurveTo(x, y, x + radius, y);
      return s;
    };
    const cubeGeometry = own(new THREE.ExtrudeGeometry(roundedShape(0.77, 0.77, 0.14), { depth: 0.53, bevelEnabled: true, bevelSize: 0.10, bevelThickness: 0.10, bevelSegments: 4, curveSegments: 8 }));
    cubeGeometry.translate(0, 0, -0.265);
    const cube = new THREE.Mesh(cubeGeometry, coral);
    cube.rotation.set(0.24, -0.32, 0.20);
    const ring = new THREE.Mesh(own(new THREE.TorusGeometry(0.46, 0.145, 20, 56)), blue);
    ring.rotation.set(0.2, 0.45, -0.22);
    const starShape = new THREE.Shape();
    for (let i = 0; i < 10; i++) {
      const a = Math.PI / 2 + i * Math.PI / 5;
      const r = i % 2 === 0 ? 0.49 : 0.245;
      const x = Math.cos(a) * r, y = Math.sin(a) * r;
      if (!i) starShape.moveTo(x, y); else starShape.lineTo(x, y);
    }
    starShape.closePath();
    const starGeometry = own(new THREE.ExtrudeGeometry(starShape, { depth: 0.19, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.08, bevelSegments: 4, curveSegments: 8 }));
    starGeometry.translate(0, 0, -0.095);
    const star = new THREE.Mesh(starGeometry, purple);
    star.rotation.set(-0.15, 0.2, -0.16);
    const orb = new THREE.Mesh(own(new THREE.SphereGeometry(0.36, 28, 20)), lime);
    const orbiters = [
      { mesh: ring, base: new THREE.Vector3(-2.02, 1.05, 0.23), phase: 0.8 },
      { mesh: cube, base: new THREE.Vector3(2.03, 1.48, -0.22), phase: 2.2 },
      { mesh: star, base: new THREE.Vector3(2.02, -0.87, 0.72), phase: 4.1 },
      { mesh: orb, base: new THREE.Vector3(-1.84, -0.91, 0.72), phase: 5.6 },
    ];
    orbiters.forEach(item => { item.mesh.position.copy(item.base); item.target = item.base.clone(); world.add(item.mesh); });
    const hitTargets = [body, ...orbiters.map(item => item.mesh)];

    const particleGeometry = own(new THREE.BoxGeometry(0.10, 0.055, 0.035));
    const particleMaterials = [yellow, blue, coral, purple, lime];
    const particles = Array.from({ length: 36 }, (_, i) => {
      const mesh = new THREE.Mesh(particleGeometry, particleMaterials[i % particleMaterials.length]);
      mesh.visible = false;
      world.add(mesh);
      return { mesh, velocity: new THREE.Vector3(), life: 0, maximum: 1 };
    });

    let score = 0, muted = true, language = 'zh', inView = true;
    let previousTime = 0, lastPop = -10000, activeUntil = 0;
    let dragRotation = 0, hoverX = 0, hoverY = 0, blinkState = false;
    const startTime = performance.now();
    const raycaster = new THREE.Raycaster();
    const pointerCoordinates = new THREE.Vector2();

    const sound = (celebrate = false) => {
      if (muted || disposed || contextUnavailable) return;
      try {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioClass) return;
        audioContext ||= new AudioClass();
        if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
        const tones = celebrate ? [523.25, 659.25, 783.99] : [420 + (score % 5) * 85];
        tones.forEach((frequency, index) => {
          const oscillator = audioContext.createOscillator();
          const gain = audioContext.createGain();
          const time = audioContext.currentTime + index * 0.075;
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(frequency, time);
          oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.3, time + 0.08);
          gain.gain.setValueAtTime(0, time);
          gain.gain.linearRampToValueAtTime(0.035, time + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.19);
          oscillator.connect(gain); gain.connect(audioContext.destination);
          oscillator.start(time); oscillator.stop(time + 0.2);
          oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
        });
      } catch { /* Sound is a progressive enhancement. */ }
    };

    const requestFrame = () => {
      if (!raf && !disposed && !contextUnavailable && inView && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const pop = () => {
      if (disposed || contextUnavailable) return;
      score = (getScore ? Number(getScore()) || 0 : score) + 1;
      lastPop = performance.now();
      activeUntil = lastPop + 1500;
      const celebrate = score % 5 === 0;
      if (!reducedMotion) {
        const count = celebrate ? 32 : 14;
        particles.slice(0, count).forEach((particle, index) => {
          const angle = (index / count) * Math.PI * 2 + Math.random() * 0.3;
          const speed = (celebrate ? 3.5 : 2.5) + Math.random() * 1.5;
          particle.mesh.position.set(0, 0.5, 1.0);
          particle.velocity.set(Math.cos(angle) * speed, Math.sin(angle) * speed + 1.4, (Math.random() - 0.5) * 1.5);
          particle.life = particle.maximum = 0.65 + Math.random() * 0.6;
          particle.mesh.visible = true;
        });
      }
      drawFace(celebrate ? 1 : faceVariant);
      onScore(score);
      if (disposed || contextUnavailable) return;
      onStatus(celebrate ? 'celebrate' : 'pop');
      sound(celebrate);
      requestFrame();
    };
    const shuffle = () => {
      if (disposed || contextUnavailable) return;
      faceVariant = (faceVariant + 1) % 3;
      drawFace(faceVariant);
      orbiters.forEach((item, index) => {
        item.target.x = item.base.x * (faceVariant === 1 ? -1 : 1);
        item.target.y = item.base.y + Math.sin(index * 2.5 + faceVariant) * 0.24;
        if (reducedMotion) item.mesh.position.copy(item.target);
      });
      activeUntil = performance.now() + 1000;
      onStatus('shuffle');
      requestFrame();
    };

    function tick(now) {
      raf = 0;
      if (disposed || contextUnavailable || !inView || document.hidden) return;
      const delta = Math.min((now - (previousTime || now)) / 1000, 0.035);
      previousTime = now;
      const time = (now - startTime) / 1000;
      const popAge = (now - lastPop) / 1000;
      const bounce = !reducedMotion && popAge >= 0 && popAge < 0.9 ? Math.sin(Math.PI * popAge / 0.9) * Math.exp(-popAge * 0.75) : 0;
      const squash = !reducedMotion && popAge >= 0 && popAge < 0.3 ? Math.exp(-popAge * 22) * 0.14 : 0;
      sun.position.y = 0.32 + bounce * 1.0 + (reducedMotion ? 0 : Math.sin(time * 1.35) * 0.085);
      sun.scale.set(1 + squash - bounce * 0.045, 1 - squash + bounce * 0.075, 1);
      sun.rotation.z = -0.10 + (reducedMotion ? 0 : Math.sin(time * 0.75) * 0.045 + bounce * 0.12);
      shadow.scale.setScalar(1 - bounce * 0.2);
      const damping = 1 - Math.exp(-delta * 5);
      world.rotation.y += ((dragRotation + hoverX * 0.08) - world.rotation.y) * damping;
      world.rotation.x += (hoverY * 0.035 - world.rotation.x) * damping;
      orbiters.forEach((item, index) => {
        item.mesh.position.lerp(item.target, reducedMotion ? 1 : damping);
        if (!reducedMotion) {
          item.mesh.position.y = item.target.y + Math.sin(time * 1.1 + item.phase) * 0.13;
          item.mesh.rotation.z += delta * (index % 2 ? 0.08 : -0.09);
          item.mesh.rotation.y += delta * 0.10;
        }
      });
      let alive = false;
      particles.forEach(particle => {
        if (particle.life <= 0) return;
        particle.life -= delta;
        particle.mesh.visible = particle.life > 0;
        if (!particle.mesh.visible) return;
        alive = true;
        particle.velocity.y -= delta * 5;
        particle.mesh.position.addScaledVector(particle.velocity, delta);
        particle.mesh.rotation.x += delta * 5;
        particle.mesh.rotation.z += delta * 3;
        particle.mesh.scale.setScalar(Math.min(1, particle.life / 0.3));
      });
      const shouldBlink = !reducedMotion && time % 6.5 > 6.3;
      if (shouldBlink !== blinkState) { blinkState = shouldBlink; drawFace(faceVariant, shouldBlink); }
      renderer.render(scene, camera);
      if (!reducedMotion || now < activeUntil || alive) requestFrame();
    }

    const resize = () => {
      if (disposed || contextUnavailable) return;
      const bounds = container.getBoundingClientRect();
      const width = Math.max(1, bounds.width), height = Math.max(1, bounds.height);
      const isSmall = width < 500;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 1.8));
      renderer.setSize(width, height, false);
      const aspect = width / height;
      const halfHeight = Math.max(3.15, 3.12 / aspect);
      camera.left = -halfHeight * aspect; camera.right = halfHeight * aspect;
      camera.top = halfHeight; camera.bottom = -halfHeight;
      camera.updateProjectionMatrix();
      activeUntil = performance.now() + 50;
      requestFrame();
    };
    observer = new ResizeObserver(resize);
    observer.observe(container);
    intersectionObserver = new IntersectionObserver(entries => {
      if (disposed || contextUnavailable) return;
      inView = entries[0]?.isIntersecting ?? true;
      if (inView) { previousTime = 0; requestFrame(); }
      else if (raf) { cancelAnimationFrame(raf); raf = 0; }
    }, { threshold: 0.01 });
    intersectionObserver.observe(container);

    const pointerDown = event => {
      if (disposed || contextUnavailable) return;
      if (event.button !== 0 && event.pointerType === 'mouse') return;
      pointer = { x: event.clientX, y: event.clientY, lastX: event.clientX, moved: false, type: event.pointerType, time: performance.now() };
    };
    const pointerMove = event => {
      if (disposed || contextUnavailable) return;
      const bounds = canvas.getBoundingClientRect();
      if (!reducedMotion) {
        hoverX = (event.clientX - bounds.left) / bounds.width - 0.5;
        hoverY = (event.clientY - bounds.top) / bounds.height - 0.5;
      }
      if (pointer) {
        if (Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) > 10) pointer.moved = true;
        if (pointer.type === 'mouse' || Math.abs(event.clientX - pointer.x) > Math.abs(event.clientY - pointer.y) * 1.5) {
          dragRotation = THREE.MathUtils.clamp(dragRotation + (event.clientX - pointer.lastX) * 0.0035, -0.45, 0.45);
        }
        pointer.lastX = event.clientX;
      }
      activeUntil = performance.now() + 200;
      requestFrame();
    };
    const pointerUp = event => {
      if (disposed || contextUnavailable) return;
      if (pointer && !pointer.moved && performance.now() - pointer.time < 650) {
        const bounds = canvas.getBoundingClientRect();
        pointerCoordinates.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -((event.clientY - bounds.top) / bounds.height) * 2 + 1);
        raycaster.setFromCamera(pointerCoordinates, camera);
        if (raycaster.intersectObjects(hitTargets).length) pop();
      }
      pointer = null;
    };
    const pointerLeave = () => { if (!disposed && !contextUnavailable) { hoverX = hoverY = 0; pointer = null; } };
    const pointerCancel = () => { if (!disposed && !contextUnavailable) pointer = null; };
    const visibility = () => {
      if (disposed || contextUnavailable) return;
      if (document.hidden && raf) { cancelAnimationFrame(raf); raf = 0; }
      else { previousTime = 0; requestFrame(); }
    };
    const contextLost = event => {
      if (disposed || contextUnavailable) return;
      event.preventDefault();
      contextUnavailable = true;
      pointer = null;
      canvas.dataset.ready = 'false';
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      onStatus('unavailable');
    };
    canvas.style.touchAction = 'pan-y';
    listen(canvas, 'pointerdown', pointerDown);
    listen(canvas, 'pointermove', pointerMove, { passive: true });
    listen(canvas, 'pointerup', pointerUp);
    listen(canvas, 'pointerleave', pointerLeave);
    listen(canvas, 'pointercancel', pointerCancel);
    listen(canvas, 'webglcontextlost', contextLost);
    listen(document, 'visibilitychange', visibility);
    resize();
    renderer.render(scene, camera);
    if (contextUnavailable) throw new Error('The WebGL context became unavailable during initialization.');
    canvas.dataset.ready = 'true';
    onStatus('ready');

    return {
      pop,
      shuffle,
      setMuted(value) { if (!disposed) muted = Boolean(value); },
      setLanguage(value) { if (!disposed) language = value === 'en' ? 'en' : 'zh'; },
      destroy
    };
  } catch (error) {
    destroy();
    canvas.dataset.ready = 'false';
    throw error;
  }
}
