import { initMiniGames } from './mini-games.js';
import { createFallbackPlayground } from './fallback-playground.js';

const copy = {
  zh: {
    skip:'跳至主要内容',homeLabel:'big胆studio · 首页',navLabel:'主要导航',mobileNavLabel:'手机导航',navPlay:'玩一下',navAbout:'关于我们',navHello:'打个招呼 <span aria-hidden="true">↗</span>',menuOpen:'打开菜单',menuClose:'关闭菜单',
    heroEyebrow:'小小工作室 · 大大脑洞',heroTitle:'小游戏，<br>大<span class="highlight-word">快乐<svg viewBox="0 0 280 25" aria-hidden="true"><path d="M5 17 Q130 -1 271 13"/></svg></span><span class="headline-dot">。</span>',heroDescription:'把脑洞变成玩法，让碎片时间多一点快乐。<br>欢迎来到 big胆studio，先玩一下，再认识我们。',heroCta:'先玩 20 秒',heroMore:'认识我们',heroFootnote:'生活够复杂，游戏简单点。',
    sceneLive:'快乐营业中',sceneHint:'点我，快乐会弹起来！',canvasLabel:'可互动的三维笑脸太阳；也可以使用下方按钮互动。',scoreLabel:'收集快乐',sceneLoading:'正在唤醒小太阳…',interactionHelp:'拖动转一转 · 点击弹一弹',shuffleLabel:'换个队形',soundOff:'开启音效',soundOn:'关闭音效',popLabel:'戳一下',
    playEyebrow:'快乐，先试玩',playTitle:'来，偷闲一小会。',playIntro:'不用下载，不用准备。<br>挑一个小快乐，现在就出发。',demoTag:'网页小体验',catchOpen:'试玩：抓住小快乐',catchType:'20 秒 · 反应挑战',catchTitle:'抓住小快乐',catchDescription:'快乐冒头的那一刻，别让它溜走。',gameStart:'开玩',memoryOpen:'试玩：翻翻好心情',memoryType:'慢慢来 · 记忆配对',memoryTitle:'翻翻好心情',memoryDescription:'翻开一点好奇，遇见成双的惊喜。',sunOpen:'回到三维小太阳游乐场',sunTag:'随便玩，没关系',sunType:'没有倒计时 · 自由发呆',sunTitle:'和小太阳玩一会',sunDescription:'转一转，戳一下。今天也要有点弹性。',sunStart:'去放松',demoNote:'这些是官网里的互动小体验，也是我们对“轻松好玩”的一点表达。',
    aboutNote:'认真做游戏，<br>轻松过日子。',aboutEyebrow:'认识 big胆studio',aboutTitle:'脑洞大一点，<br>快乐简单点。',aboutDescription:'big胆studio，专注轻松、有趣、易上手的小游戏。我们把脑洞变成玩法，让碎片时间多一点快乐。希望每一款小游戏，都能让你放松一下、会心一笑。',valueOneTitle:'大胆想',valueOneBody:'给小脑洞一个变成游戏的机会。',valueTwoTitle:'轻松玩',valueTwoBody:'少一点门槛，多一点“再来一局”。',valueThreeTitle:'真开心',valueThreeBody:'认真打磨，让小小快乐来得刚刚好。',
    helloEyebrow:'嘿，很高兴你在这里。',helloTitle:'给今天，<br>加一点好玩。',helloBody:'谢谢你来这个小小游乐场坐一会。<br>下一次需要放松时，记得回来玩。',helloButton:'送你一朵小快乐',footerLine:'大胆创意，轻松开玩。',backTop:'回到顶部',
    scenePop:'收集到第 {n} 份小快乐。',sceneCelebrate:'好耶！你已经收集了 {n} 份快乐。',sceneShuffle:'换个姿势，继续开心。',sceneFallback:'小太阳正在以轻量模式陪你玩。',
    wishes:['今天也值得一点不费力的快乐。☺','恭喜，收到一份没有截止日期的好心情。✿','这朵小快乐归你啦。大胆开心！✳','休息不是暂停生活，是给自己充个电。☀'],
    title:'big胆studio · 小游戏，大快乐。',description:'big胆studio / BigDan Studio，专注轻松、有趣、易上手的小游戏。大胆创意，轻松开玩！'
  },
  en: {
    skip:'Skip to content',homeLabel:'BigDan Studio · Home',navLabel:'Main navigation',mobileNavLabel:'Mobile navigation',navPlay:'Let’s play',navAbout:'Our studio',navHello:'Say hello <span aria-hidden="true">↗</span>',menuOpen:'Open menu',menuClose:'Close menu',
    heroEyebrow:'LITTLE STUDIO. BIG IMAGINATION.',heroTitle:'Small games.<br>Big <span class="highlight-word">smiles.<svg viewBox="0 0 280 25" aria-hidden="true"><path d="M5 17 Q130 -1 271 13"/></svg></span>',heroDescription:'A little play. A little surprise. A bigger smile. <br>Welcome to BigDan Studio. Make yourself at play.',heroCta:'Got 20 seconds?',heroMore:'Meet the studio',heroFootnote:'Life is complicated. Play can be simple.',
    sceneLive:'Open for happy',sceneHint:'Poke me. Watch happiness bounce!',canvasLabel:'Interactive 3D smiling sun. You can also use the buttons below to play.',scoreLabel:'Smiles collected',sceneLoading:'Waking up our little sun…',interactionHelp:'Drag to turn · Tap to bounce',shuffleLabel:'Mix things up',soundOff:'Turn sound on',soundOn:'Turn sound off',popLabel:'Poke me',
    playEyebrow:'A LITTLE HAPPINESS, ON THE HOUSE',playTitle:'Take a tiny play break.',playIntro:'No downloads. No warm-up. <br>Pick a little moment of fun.',demoTag:'A little web toy',catchOpen:'Play Catch a Smile',catchType:'20 SECONDS · QUICK REFLEXES',catchTitle:'Catch a Smile',catchDescription:'When happiness pops up, don’t let it get away.',gameStart:'Let’s play',memoryOpen:'Play Happy Pairs',memoryType:'TAKE YOUR TIME · MATCH PAIRS',memoryTitle:'Happy Pairs',memoryDescription:'A little curiosity. A happy little match.',sunOpen:'Return to the 3D sun playground',sunTag:'No rules. Just good vibes.',sunType:'NO TIMER · JUST WANDER',sunTitle:'A Sunny Little Break',sunDescription:'Spin, poke, bounce. Leave room for a little play.',sunStart:'Go unwind',demoNote:'These little website toys are a taste of what “easy to play, easy to love” means to us.',
    aboutNote:'Made with care.<br>Played with a smile.',aboutEyebrow:'MEET BIGDAN STUDIO',aboutTitle:'Think a little bigger.<br>Play a little lighter.',aboutDescription:'BigDan Studio makes lighthearted, easy-to-pick-up little games. We turn curious ideas into playful moments, adding a little joy to the spaces in your day. We hope every game gives you a chance to relax, explore, and smile.',valueOneTitle:'Think boldly',valueOneBody:'Give a small, unexpected idea a chance to play.',valueTwoTitle:'Play lightly',valueTwoBody:'Less to learn. More “just one more go.”',valueThreeTitle:'Make joy',valueThreeBody:'Thoughtful little details. Happy little moments.',
    helloEyebrow:'HEY, WE’RE GLAD YOU’RE HERE.',helloTitle:'Make room<br>for a little fun.',helloBody:'Thanks for stopping by our little playground.<br>Come back whenever your day could use a smile.',helloButton:'A little happiness, for you',footerLine:'Think boldly. Play lightly.',backTop:'Back to top',
    scenePop:'Little smile number {n}, collected.',sceneCelebrate:'Hooray! You’ve collected {n} little smiles.',sceneShuffle:'A fresh little arrangement. Same good vibes.',sceneFallback:'Our little sun is keeping you company in light mode.',
    wishes:['A little easy happiness looks good on you. ☺','One good mood. No expiry date. All yours. ✿','This little moment of joy is yours to keep. ✳','A small break can be a very good idea. ☀'],
    title:'BigDan Studio · Small games. Big smiles.',description:'BigDan Studio makes lighthearted, easy-to-pick-up little games. A little play. A little surprise. A bigger smile.'
  }
};

copy.zh.tickerBold = '大胆创意';
copy.zh.tickerPlay = '轻松开玩';
copy.en.tickerBold = 'THINK BOLDLY';
copy.en.tickerPlay = 'PLAY LIGHTLY';

const iconPaths = {
  '↗':'<path d="M5 19 19 5M5 5h14v14"/>',
  '↑':'<path d="M12 20V4M5 11l7-7 7 7"/>',
  '✳':'<path d="M12 2v20M2 12h20M5 5l14 14M5 19 19 5" stroke-width="2.7"/>',
  '✦':'<path d="M12 1c1 7 4 10 11 11-7 1-10 4-11 11C11 16 8 13 1 12 8 11 11 8 12 1Z" fill="currentColor" stroke="none"/>',
  '✧':'<path d="m12 2 3.5 6.5L22 12l-6.5 3.5L12 22l-3.5-6.5L2 12l6.5-3.5Z"/>',
  '✿':'<g fill="currentColor" stroke="none"><circle cx="12" cy="5" r="4.6"/><circle cx="18.7" cy="9.9" r="4.6"/><circle cx="16.1" cy="17.8" r="4.6"/><circle cx="7.9" cy="17.8" r="4.6"/><circle cx="5.3" cy="9.9" r="4.6"/></g><circle cx="12" cy="12" r="3.2" fill="#fffdf5" stroke="none"/>',
  '☺':'<ellipse cx="15.7" cy="8.5" rx="1.4" ry="2" fill="currentColor" stroke="none"/><path d="m6.3 8.1 3.8 1.5-3 1.5M6.5 15c4.5 5 9 3 12-2" stroke-width="1.9"/>'
};
function enhanceIcons() {
  document.querySelectorAll('span,i,b,div').forEach(element => {
    if (element.children.length) return;
    const icon = iconPaths[element.textContent.trim()];
    if (icon) element.innerHTML = `<svg class="vector-icon" viewBox="0 0 24 24" aria-hidden="true">${icon}</svg>`;
  });
}

let language = window.bigdanLanguage === 'en' ? 'en' : 'zh';
let muted = true;
let smiles = 0;
let wishIndex = 0;
let lastWish = -1;
let sceneUnavailable = false;
const reduceMotionQuery = matchMedia('(prefers-reduced-motion: reduce)');
const $ = selector => document.querySelector(selector);
const canvas = $('#playground-canvas');
const stage = $('#scene-stage');
const fallback = $('#scene-fallback');
const loading = $('#scene-loading');
const sceneStatus = $('#scene-status');
const menuButton = $('.menu-toggle');
const mobileNav = $('#mobile-nav');
let miniGames;
let scene;
let pageDisposed = false;

function setMenu(open) {
  const restoreFocus = !open && mobileNav.contains(document.activeElement);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', copy[language][open ? 'menuClose' : 'menuOpen']);
  mobileNav.hidden = !open;
  if (restoreFocus) menuButton.focus({ preventScroll:true });
}

function refreshSoundLabel() {
  const button = $('#sound-button');
  const label = copy[language][muted ? 'soundOff' : 'soundOn'];
  button.setAttribute('aria-label', label);
  button.title = label;
  button.setAttribute('aria-pressed', String(!muted));
  button.innerHTML = muted
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m11 5-5 4H3v6h3l5 4zM16 9l5 6M21 9l-5 6"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m11 5-5 4H3v6h3l5 4zM15 8c3 2 3 6 0 8M18 5c5 4 5 10 0 14"/></svg>';
}

function applyLanguage(next, remember = true) {
  language = next === 'en' ? 'en' : 'zh';
  document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
  document.documentElement.dataset.language = language;
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const value = copy[language][element.dataset.i18n];
    if (typeof value === 'string') element.innerHTML = value;
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(element => {
    const value = copy[language][element.dataset.i18nAria];
    if (value) element.setAttribute('aria-label', value);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(element => {
    const value = copy[language][element.dataset.i18nTitle];
    if (value) element.title = value;
  });
  document.querySelectorAll('[data-language]').forEach(button => {
    if (button.tagName === 'BUTTON') button.setAttribute('aria-pressed', String(button.dataset.language === language));
  });
  document.title = copy[language].title;
  $('meta[name="description"]').content = copy[language].description;
  $('meta[property="og:title"]').content = copy[language].title;
  $('meta[property="og:description"]').content = copy[language].description;
  $('meta[property="og:locale"]').content = language === 'zh' ? 'zh_CN' : 'en_US';
  $('meta[property="og:locale:alternate"]').content = language === 'zh' ? 'en_US' : 'zh_CN';
  miniGames?.setLanguage(language);
  enhanceIcons();
  scene?.setLanguage(language);
  setMenu(menuButton.getAttribute('aria-expanded') === 'true');
  refreshSoundLabel();
  if (lastWish >= 0) $('#hello-response').textContent = copy[language].wishes[lastWish];
  if (sceneUnavailable) {
    sceneStatus.textContent = copy[language].sceneFallback;
  }
  if (remember) { try { localStorage.setItem('bigdan-language', language); } catch {} }
}

function updateScore(value) {
  smiles = value;
  $('#smile-score').textContent = String(value).padStart(2, '0');
}

function announceStatus(status) {
  if (status === 'ready') {
    // The controller is adopted only after its initialization has completed.
    return;
  }
  if (status === 'unavailable') {
    showFallback();
    return;
  }
  const key = status === 'celebrate' ? 'sceneCelebrate' : status === 'shuffle' ? 'sceneShuffle' : 'scenePop';
  sceneStatus.textContent = copy[language][key].replace('{n}', String(smiles));
}

// Basic play is ready before attempting WebGL or starting the other games.
const fallbackController = createFallbackPlayground({
  container:stage, canvas, fallback, getScore:() => smiles,
  onScore:updateScore, onStatus:announceStatus,
  reducedMotion:reduceMotionQuery.matches
});

function showFallback() {
  const previous = scene;
  scene = fallbackController;
  if (previous && previous !== fallbackController) previous.destroy();
  sceneUnavailable = true;
  document.documentElement.dataset.sceneMode = 'fallback';
  canvas.dataset.ready = 'false';
  fallbackController.activate();
  fallbackController.setLanguage(language);
  fallbackController.setMuted(muted);
  loading.hidden = true;
  refreshSoundLabel();
  sceneStatus.textContent = copy[language].sceneFallback;
}
showFallback();

document.querySelectorAll('[data-language]').forEach(button => {
  if (button.tagName === 'BUTTON') button.addEventListener('click', () => applyLanguage(button.dataset.language));
});
document.querySelectorAll('[data-open-game]').forEach(button => button.addEventListener('click', () => {
  setMenu(false);
  if (miniGames) miniGames.open(button.dataset.openGame);
  else {
    const note = $('.demo-note');
    note.textContent = language === 'zh' ? '小游戏暂时没有加载好，请刷新再试。小太阳还可以继续玩。' : 'The games could not start. Please refresh and try again. Our little sun is still ready to play.';
    note.setAttribute('role', 'status');
    note.scrollIntoView({ block:'center', behavior:'smooth' });
  }
}));
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
mobileNav.querySelectorAll('a').forEach(anchor => anchor.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) setMenu(false); });
const desktopQuery = matchMedia('(min-width: 561px)');
const closeDesktopMenu = event => { if (event.matches) setMenu(false); };
if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', closeDesktopMenu);
else if (desktopQuery.addListener) desktopQuery.addListener(closeDesktopMenu);
$('#pop-button').addEventListener('click', () => scene.pop());
$('#shuffle-button').addEventListener('click', () => scene.shuffle());
$('#sound-button').addEventListener('click', () => {
  muted = !muted;
  scene.setMuted(muted);
  refreshSoundLabel();
  if (!muted) scene.pop();
});
document.querySelectorAll('[data-return-playground]').forEach(anchor => anchor.addEventListener('click', () => {
  setTimeout(() => scene.pop(), reduceMotionQuery.matches ? 0 : 540);
}));
$('#back-top').addEventListener('click', () => window.scrollTo({ top:0, behavior:reduceMotionQuery.matches ? 'instant' : 'smooth' }));

function confettiAt(element) {
  if (reduceMotionQuery.matches) return;
  const rect = element.getBoundingClientRect();
  const colors = ['#ffce32','#fffdf5','#ff947b','#acc76b','#b5a0fa'];
  for (let i = 0; i < 28; i++) {
    const particle = document.createElement('span');
    const angle = Math.PI * 2 * i / 28;
    particle.className = 'hello-confetti';
    particle.setAttribute('aria-hidden', 'true');
    particle.style.cssText = `left:${rect.left + rect.width / 2}px;top:${rect.top + rect.height / 2}px;width:${5 + Math.random() * 5}px;height:${5 + Math.random() * 5}px;background:${colors[i % colors.length]};--dx:${Math.cos(angle) * (100 + Math.random() * 130)}px;--dy:${Math.sin(angle) * 120 + 90}px;--turn:${Math.random() * 540}deg;`;
    document.body.append(particle);
    particle.addEventListener('animationend', () => particle.remove(), { once:true });
    setTimeout(() => particle.remove(), 1500);
  }
}

$('#hello-button').addEventListener('click', event => {
  lastWish = wishIndex % copy[language].wishes.length;
  $('#hello-response').textContent = copy[language].wishes[lastWish];
  wishIndex++;
  confettiAt(event.currentTarget);
});
$('#year').textContent = String(new Date().getFullYear());
applyLanguage(language, false);
document.documentElement.dataset.appReady = 'true';

// A failure in an optional game must not disable the playground or navigation.
try {
  miniGames = initMiniGames({ getLanguage:() => language });
  miniGames.setLanguage(language);
} catch (error) {
  console.warn('The website games could not start.', error);
}

async function startScene() {
  let expired = false;
  let unavailable = false;
  let controller;
  const timeout = setTimeout(() => {
    expired = true;
    if (!pageDisposed) showFallback();
  }, 4500);
  try {
    const { createPlayground } = await import('./playground.js');
    if (expired || pageDisposed) return;
    controller = await createPlayground({
      container:stage, canvas, getScore:() => smiles, reducedMotion:reduceMotionQuery.matches,
      onScore:value => { if (scene === controller) updateScore(value); },
      onStatus:status => {
        if (status === 'unavailable') {
          unavailable = true;
          if (scene === controller) showFallback();
        } else if (scene === controller) announceStatus(status);
      }
    });
    if (expired || unavailable || pageDisposed) {
      controller.destroy();
      if (!pageDisposed) showFallback();
      return;
    }
    fallbackController.deactivate();
    scene = controller;
    sceneUnavailable = false;
    document.documentElement.dataset.sceneMode = '3d';
    loading.hidden = true;
    scene.setLanguage(language);
    scene.setMuted(muted);
  } catch (error) {
    if (controller && scene !== controller) controller.destroy();
    console.info('The interactive sun is using its lightweight fallback.', error?.message || error);
    if (!pageDisposed) showFallback();
  } finally {
    clearTimeout(timeout);
  }
}
startScene();
window.addEventListener('pagehide', event => {
  if (!event.persisted) {
    pageDisposed = true;
    scene.destroy();
    if (scene !== fallbackController) fallbackController.destroy();
    miniGames?.destroy?.();
    if (desktopQuery.removeEventListener) desktopQuery.removeEventListener('change', closeDesktopMenu);
    else if (desktopQuery.removeListener) desktopQuery.removeListener(closeDesktopMenu);
  }
});
