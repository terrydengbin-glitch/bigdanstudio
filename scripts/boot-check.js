/* This small classic script remains independent of the bundled application. */
(function () {
  function showStartupIssue() {
    if (document.documentElement.dataset.appReady === 'true') return;
    var loading = document.getElementById('scene-loading');
    if (!loading) return;
    loading.hidden = false;
    loading.removeAttribute('data-i18n');
    loading.textContent = window.bigdanLanguage === 'en'
      ? 'Please refresh to wake up our little sun.'
      : '小太阳还没醒来，请刷新页面再试。';
    loading.setAttribute('role', 'status');
  }
  window.addEventListener('load', showStartupIssue, { once:true });
  setTimeout(showStartupIssue, 8000);
})();
