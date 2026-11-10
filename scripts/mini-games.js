/** Two small, local-only games for the BigDan Studio playground. */
export function initMiniGames({ getLanguage = () => 'zh' } = {}) {
  const COPY = {
    zh: {
      badge: '小小试玩场', close: '关闭小游戏', demo: '官网互动试玩 · 快乐无需登录',
      catchTitle: '抓住小快乐', catchIntro: '20 秒，看看你能抓住多少张笑脸。',
      memoryTitle: '翻翻好心情', memoryIntro: '找到 6 对小图案，给记忆力热个身。',
      score: '小快乐', time: '剩余时间', best: '本机最佳', moves: '翻牌次数', pairs: '已配对',
      start: '开始玩', restart: '再玩一次', pause: '暂停一下', resume: '继续玩', shuffle: '重新洗牌',
      catchHint: '点击亮起的笑脸。也可以按数字键 1–9。',
      memoryHint: '每次翻开两张，找到相同的图案。',
      catchReady: '准备好了吗？你的 20 秒快乐挑战就要开始了。',
      catchRunning: '找到亮起来的笑脸，点一下！',
      catchHit: n => `收到 ${n} 份小快乐！继续找笑脸。`,
      catchMiss: '不着急，找亮起来的那张笑脸。',
      catchPaused: '已暂停，时间也停住了。准备好就继续。',
      catchEnd: n => `挑战完成！你收集了 ${n} 份小快乐。`,
      catchRecord: n => `新纪录！你收集了 ${n} 份小快乐。`,
      memoryReady: '12 张卡片，6 对好心情。点击开始，慢慢找也没关系。',
      memoryRunning: '先翻一张，看看藏着什么。',
      memoryFirst: name => `找到了${name}，再找找它的朋友。`,
      memoryMatch: n => `配对成功！已经找到 ${n} 对。`,
      memoryMiss: '差一点点！记住它们的位置，再试一次。',
      memoryEnd: n => `全部找到啦！你用 ${n} 次翻牌，收集了 6 对好心情。`,
      slot: n => `格子 ${n}`,
      target: n => `格子 ${n}，这里有笑脸，点击收集`,
      hiddenCard: n => `卡片 ${n}，尚未翻开`,
      shownCard: (n, name) => `卡片 ${n}，${name}`,
      pairedCard: (n, name) => `卡片 ${n}，${name}，已配对`,
      names: ['小太阳', '星星', '樱桃', '蘑菇', '叶子', '爱心'],
      catchBoard: '九宫格笑脸游戏', memoryBoard: '十二张记忆卡片',
      bestMoves: n => `${n} 次`, seconds: n => `${n} 秒`,
    },
    en: {
      badge: 'A little playground', close: 'Close mini game', demo: 'Website mini demo · No sign-in, just smiles',
      catchTitle: 'Catch a Smile', catchIntro: '20 seconds. How many smiles can you catch?',
      memoryTitle: 'Happy Pairs', memoryIntro: 'Find all 6 pairs and warm up your memory.',
      score: 'Smiles', time: 'Time left', best: 'Your best', moves: 'Turns', pairs: 'Matched',
      start: "Let’s play", restart: 'Play again', pause: 'Take a pause', resume: 'Keep playing', shuffle: 'Shuffle again',
      catchHint: 'Tap the glowing smile. Keyboard players: press 1–9.',
      memoryHint: 'Turn over two cards at a time and find the matching pairs.',
      catchReady: 'Ready? Your 20-second happiness challenge is waiting.',
      catchRunning: 'Find the bright yellow smile and give it a tap!',
      catchHit: n => `${n} little smiles collected! Find the next one.`,
      catchMiss: 'No rush. Look for the bright yellow smile.',
      catchPaused: 'Paused. The clock is taking a break, too.',
      catchEnd: n => `All done! You collected ${n} little smiles.`,
      catchRecord: n => `A new best! You collected ${n} little smiles.`,
      memoryReady: '12 cards. 6 happy pairs. Take your time and enjoy the little discoveries.',
      memoryRunning: 'Turn over a card and see what is hiding.',
      memoryFirst: name => `You found ${name}. Now find its friend.`,
      memoryMatch: n => `A match! ${n} happy pairs found.`,
      memoryMiss: 'Almost! Remember where they are and try another pair.',
      memoryEnd: n => `You did it! All 6 happy pairs found in ${n} turns.`,
      slot: n => `Square ${n}`,
      target: n => `Square ${n}, smiling target, tap to collect`,
      hiddenCard: n => `Card ${n}, face down`,
      shownCard: (n, name) => `Card ${n}, ${name}`,
      pairedCard: (n, name) => `Card ${n}, ${name}, matched`,
      names: ['the sun', 'a star', 'cherries', 'a mushroom', 'a leaf', 'a heart'],
      catchBoard: 'Nine-square smile game', memoryBoard: 'Twelve memory cards',
      bestMoves: n => `${n} turns`, seconds: n => `${n}s`,
    },
  };
  const symbols = ['☀️', '⭐', '🍒', '🍄', '🌿', '💛'];
  const normalize = value => String(value || '').toLowerCase().startsWith('en') ? 'en' : 'zh';
  let language = normalize(getLanguage());
  const text = () => COPY[language];
  const uid = `bd-game-${Math.random().toString(36).slice(2, 9)}`;
  const dialog = document.createElement('dialog');
  dialog.className = 'mg-dialog';
  dialog.setAttribute('aria-labelledby', `${uid}-title`);
  dialog.setAttribute('aria-describedby', `${uid}-intro`);
  dialog.innerHTML = `
    <div class="mg-content">
      <header class="mg-header">
        <p class="mg-eyebrow" data-mg="badge"></p>
        <button class="mg-close" type="button" data-mg="close"><span aria-hidden="true">×</span></button>
        <h2 id="${uid}-title" data-mg="title"></h2>
        <p id="${uid}-intro" class="mg-intro" data-mg="intro"></p>
      </header>
      <div class="mg-stats">
        <div><span data-mg="statOneLabel"></span><strong data-mg="statOne">0</strong></div>
        <div><span data-mg="statTwoLabel"></span><strong data-mg="statTwo">20</strong></div>
        <div><span data-mg="bestLabel"></span><strong data-mg="best">0</strong></div>
      </div>
      <p class="mg-hint" data-mg="hint"></p>
      <div class="mg-board" data-mg="board"></div>
      <p class="mg-status" role="status" aria-live="polite" aria-atomic="true" data-mg="status"></p>
      <div class="mg-actions"><button class="mg-primary" type="button" data-mg="primary"></button></div>
      <p class="mg-footnote" data-mg="demo"></p>
    </div>`;
  document.body.append(dialog);
  const ui = Object.fromEntries([...dialog.querySelectorAll('[data-mg]')].map(el => [el.dataset.mg, el]));
  const sunMarkup = '<svg viewBox="0 0 80 80" aria-hidden="true" focusable="false"><circle cx="40" cy="40" r="27" fill="#ffce32"/><path d="M23 33l10 3-9 6" fill="none" stroke="#232323" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="51" cy="34" rx="4.5" ry="6.5" fill="#232323"/><path d="M27 49q14 14 28-2" fill="none" stroke="#232323" stroke-width="4.5" stroke-linecap="round"/><path d="M40 4v5m0 62v5M4 40h5m62 0h5" stroke="#ffce32" stroke-width="6" stroke-linecap="round"/></svg>';
  let game = 'catch';
  let isOpen = false;
  let state;
  let timer = null;
  let flipTimer = null;
  let roundId = 0;
  let returnFocus = null;
  let scrollLock = null;
  let cells = [];

  function readBest(key) {
    try { return Math.max(0, parseInt(localStorage.getItem(key), 10) || 0); }
    catch { return 0; }
  }
  function writeBest(key, value) {
    try { localStorage.setItem(key, String(value)); } catch { /* private browsing still works */ }
  }
  function clearTimers() {
    clearInterval(timer);
    clearTimeout(flipTimer);
    timer = null;
    flipTimer = null;
    roundId++;
  }
  function lockScroll() {
    if (scrollLock) return;
    const body = document.body;
    const keys = ['overflow', 'position', 'top', 'width', 'paddingRight'];
    scrollLock = { x: window.scrollX, y: window.scrollY, styles: Object.fromEntries(keys.map(key => [key, body.style[key]])) };
    const scrollbar = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    const padding = parseFloat(getComputedStyle(body).paddingRight) || 0;
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `${-scrollLock.y}px`;
    body.style.width = '100%';
    if (scrollbar) body.style.paddingRight = `${padding + scrollbar}px`;
  }
  function unlockScroll() {
    if (!scrollLock) return;
    const saved = scrollLock;
    scrollLock = null;
    Object.assign(document.body.style, saved.styles);
    window.scrollTo({ left: saved.x, top: saved.y, behavior: 'instant' });
  }
  function announce(key, arg) {
    state.message = [key, arg];
    const value = text()[key];
    ui.status.textContent = typeof value === 'function' ? value(arg) : value;
  }
  function chooseTarget() {
    if (state.target < 0) { state.target = Math.floor(Math.random() * 9); return; }
    let next = Math.floor(Math.random() * 8);
    if (next >= state.target) next++;
    state.target = Math.min(next, 8);
  }
  function populateBoard(count, className) {
    ui.board.className = `mg-board ${className}`;
    ui.board.replaceChildren();
    cells = Array.from({ length: count }, (_, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mg-cell';
      button.dataset.index = String(index);
      button.addEventListener('click', () => game === 'catch' ? hit(index) : flip(index));
      ui.board.append(button);
      return button;
    });
  }
  function setupCatch() {
    state = { phase: 'ready', score: 0, remaining: 20000, target: -1, best: readBest('bigdan-catch-best'), deadline: 0, nextTarget: 0, message: ['catchReady'] };
    populateBoard(9, 'mg-catch');
    cells.forEach((button, index) => { button.innerHTML = `<span class="mg-target">${sunMarkup}</span><span class="mg-key" aria-hidden="true">${index + 1}</span>`; });
  }
  function setupMemory() {
    const deck = [...Array(6).keys(), ...Array(6).keys()];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    state = { phase: 'ready', moves: 0, pairs: 0, best: readBest('bigdan-memory-best'), deck, flipped: [], matched: new Set(), locked: false, message: ['memoryReady'] };
    populateBoard(12, 'mg-memory');
    cells.forEach((button, index) => { button.innerHTML = `<span class="mg-card-back" aria-hidden="true">?</span><span class="mg-card-front" aria-hidden="true">${symbols[deck[index]]}</span><span class="mg-check" aria-hidden="true">✓</span>`; });
  }
  function render() {
    const t = text();
    dialog.lang = language === 'en' ? 'en' : 'zh-CN';
    dialog.dataset.game = game;
    dialog.dataset.phase = state.phase;
    ui.badge.textContent = t.badge;
    ui.close.setAttribute('aria-label', t.close);
    ui.title.textContent = t[`${game}Title`];
    ui.intro.textContent = t[`${game}Intro`];
    ui.hint.textContent = t[`${game}Hint`];
    ui.demo.textContent = t.demo;
    ui.bestLabel.textContent = t.best;
    ui.board.setAttribute('aria-label', t[`${game}Board`]);
    ui.board.setAttribute('role', 'group');
    if (game === 'catch') {
      ui.statOneLabel.textContent = t.score;
      ui.statTwoLabel.textContent = t.time;
      ui.statOne.textContent = String(state.score);
      ui.statTwo.textContent = t.seconds(Math.ceil(state.remaining / 1000));
      ui.best.textContent = String(state.best);
      ui.primary.textContent = state.phase === 'ready' ? t.start : state.phase === 'running' ? t.pause : state.phase === 'paused' ? t.resume : t.restart;
      cells.forEach((button, index) => {
        const target = state.phase === 'running' && index === state.target;
        button.disabled = state.phase !== 'running';
        button.classList.toggle('is-target', target);
        button.setAttribute('aria-label', target ? t.target(index + 1) : t.slot(index + 1));
      });
    } else {
      ui.statOneLabel.textContent = t.moves;
      ui.statTwoLabel.textContent = t.pairs;
      ui.statOne.textContent = String(state.moves);
      ui.statTwo.textContent = `${state.pairs} / 6`;
      ui.best.textContent = state.best ? t.bestMoves(state.best) : '—';
      ui.primary.textContent = state.phase === 'ready' ? t.start : state.phase === 'over' ? t.restart : t.shuffle;
      cells.forEach((button, index) => {
        const paired = state.matched.has(index);
        const shown = paired || state.flipped.includes(index);
        button.classList.toggle('is-flipped', shown);
        button.classList.toggle('is-matched', paired);
        button.disabled = state.phase !== 'running' || paired;
        button.setAttribute('aria-label', paired ? t.pairedCard(index + 1, t.names[state.deck[index]]) : shown ? t.shownCard(index + 1, t.names[state.deck[index]]) : t.hiddenCard(index + 1));
        button.setAttribute('aria-pressed', String(shown));
      });
    }
    announce(...state.message);
  }
  function tick() {
    if (!isOpen || state.phase !== 'running' || game !== 'catch') return;
    const now = performance.now();
    state.remaining = Math.max(0, state.deadline - now);
    ui.statTwo.textContent = text().seconds(Math.ceil(state.remaining / 1000));
    if (state.remaining <= 0) {
      clearInterval(timer);
      timer = null;
      state.phase = 'over';
      const newBest = state.score > state.best;
      if (newBest) { state.best = state.score; writeBest('bigdan-catch-best', state.best); }
      announce(newBest ? 'catchRecord' : 'catchEnd', state.score);
      render();
    } else if (now >= state.nextTarget) {
      chooseTarget();
      state.nextTarget = now + Math.max(720, 1300 - state.score * 18);
      render();
    }
  }
  function beginCatch(resume = false) {
    clearTimers();
    if (!resume) {
      state.score = 0;
      state.remaining = 20000;
      state.target = -1;
    }
    state.phase = 'running';
    chooseTarget();
    state.deadline = performance.now() + state.remaining;
    state.nextTarget = performance.now() + 1300;
    announce('catchRunning');
    render();
    timer = setInterval(tick, 80);
  }
  function pauseCatch() {
    if (!isOpen || game !== 'catch' || state.phase !== 'running') return;
    state.remaining = Math.max(0, state.deadline - performance.now());
    clearInterval(timer);
    timer = null;
    state.phase = 'paused';
    announce('catchPaused');
    render();
  }
  function hit(index) {
    if (!isOpen || game !== 'catch' || state.phase !== 'running') return;
    const now = performance.now();
    if (now >= state.deadline) { tick(); return; }
    state.remaining = state.deadline - now;
    if (index !== state.target) { announce('catchMiss'); return; }
    state.score++;
    chooseTarget();
    state.nextTarget = now + Math.max(720, 1300 - state.score * 18);
    announce('catchHit', state.score);
    render();
  }
  function beginMemory() {
    clearTimers();
    if (state.phase !== 'ready') setupMemory();
    state.phase = 'running';
    announce('memoryRunning');
    render();
  }
  function flip(index) {
    if (!isOpen || game !== 'memory' || state.phase !== 'running' || state.locked || state.matched.has(index) || state.flipped.includes(index)) return;
    state.flipped.push(index);
    if (state.flipped.length === 1) {
      state.firstSymbol = state.deck[index];
      announce('memoryFirst', text().names[state.firstSymbol]);
      render();
      return;
    }
    state.moves++;
    const [first, second] = state.flipped;
    if (state.deck[first] === state.deck[second]) {
      state.matched.add(first);
      state.matched.add(second);
      state.pairs++;
      state.flipped = [];
      if (state.pairs === 6) {
        state.phase = 'over';
        if (!state.best || state.moves < state.best) {
          state.best = state.moves;
          writeBest('bigdan-memory-best', state.best);
        }
        announce('memoryEnd', state.moves);
      } else announce('memoryMatch', state.pairs);
      render();
    } else {
      state.locked = true;
      announce('memoryMiss');
      render();
      const round = roundId;
      flipTimer = setTimeout(() => {
        if (!isOpen || game !== 'memory' || round !== roundId) return;
        state.flipped = [];
        state.locked = false;
        render();
      }, 800);
    }
  }
  function primary() {
    if (game === 'memory') beginMemory();
    else if (state.phase === 'running') pauseCatch();
    else beginCatch(state.phase === 'paused');
  }
  function finishClose() {
    if (!isOpen) return;
    isOpen = false;
    clearTimers();
    unlockScroll();
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  }
  function close() {
    if (dialog.open) dialog.close();
    finishClose();
  }
  function open(type = 'catch') {
    if (type !== 'catch' && type !== 'memory') return;
    if (!isOpen) returnFocus = document.activeElement;
    clearTimers();
    language = normalize(getLanguage());
    game = type;
    game === 'catch' ? setupCatch() : setupMemory();
    render();
    isOpen = true;
    lockScroll();
    if (!dialog.open) dialog.showModal();
    ui.primary.focus({ preventScroll: true });
  }
  function setLanguage(value) {
    language = normalize(value);
    if (!isOpen) return;
    if (game === 'memory' && state.message[0] === 'memoryFirst') state.message[1] = text().names[state.firstSymbol];
    render();
  }
  const onVisibility = () => { if (document.hidden) pauseCatch(); };
  ui.primary.addEventListener('click', primary);
  ui.close.addEventListener('click', close);
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('close', () => { if (!dialog.open) finishClose(); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
  });
  dialog.addEventListener('keydown', event => {
    if (game === 'catch' && state.phase === 'running' && /^[1-9]$/.test(event.key) && !event.repeat && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      hit(Number(event.key) - 1);
    }
  });
  document.addEventListener('visibilitychange', onVisibility);
  return {
    open, close, setLanguage,
    destroy() { close(); document.removeEventListener('visibilitychange', onVisibility); dialog.remove(); },
  };
}
