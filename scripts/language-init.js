(() => {
  let language;
  try { language = localStorage.getItem('bigdan-language'); } catch {}
  if (!['zh', 'en'].includes(language)) language = /^zh\b/i.test(navigator.language || '') ? 'zh' : 'en';
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.documentElement.dataset.language = language;
  window.bigdanLanguage = language;
})();
