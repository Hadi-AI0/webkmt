/**
 * WebKMT Template Gallery — renderer
 * Renders cards from window.WEBKMT_TEMPLATES (templates-data.js),
 * handles category filters, EN/AR re-rendering (via <html lang>
 * observer, works with the site LanguageManager), and the theme
 * toggle on the templates page.
 */
(function () {
  'use strict';

  var WA_NUMBER = '905013617795';

  var STRINGS = {
    en: {
      setup: 'Setup',
      care: 'Care plan',
      perMonth: '/mo',
      free: 'Free',
      launch: 'Launch This',
      viewDemo: 'View Live Demo',
      demoOnRequest: 'Live Demo on Request',
      launchIn: 'Launch in',
      waLaunch: function (name) { return "Hi! I'm interested in the \"" + name + "\" template for my business."; },
      waDemo: function (name) { return "Hi! I'd like to see a live demo of the \"" + name + "\" template."; }
    },
    ar: {
      setup: 'الإعداد',
      care: 'خطة الرعاية',
      perMonth: '/شهر',
      free: 'مجاني',
      launch: 'أطلق هذا القالب',
      viewDemo: 'شاهد العرض الحي',
      demoOnRequest: 'اطلب عرضاً حياً',
      launchIn: 'الإطلاق خلال',
      waLaunch: function (name) { return 'مرحباً! أنا مهتم بقالب "' + name + '" لنشاطي التجاري.'; },
      waDemo: function (name) { return 'مرحباً! أود مشاهدة عرض حي لقالب "' + name + '".'; }
    }
  };

  var ICONS = {
    clinic: '<path d="M12 22s8-3.6 8-10V5l-8-3-8 3v7c0 6.4 8 10 8 10z"/><path d="M12 8v6M9 11h6"/>',
    food: '<path d="M4 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M8 2v20"/><path d="M20 15V2a5 5 0 0 0-3 5v6c0 1.1.9 2 2 2h1zm0 0v7"/>',
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/>',
    scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88"/><path d="M14.47 14.48 20 20"/><path d="M8.12 8.12 12 12"/>',
    bag: '<path d="M6 7h15l-1.5 9h-12z"/><path d="M6 7 5 3H2"/><circle cx="9" cy="20" r="1.6"/><circle cx="17" cy="20" r="1.6"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    car: '<path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11"/><path d="M3 17v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"/><path d="M3 17h18"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/>',
    check: '<path d="M20 6 9 17l-5-5"/>'
  };

  var WA_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.122 1.535 5.856L0 24l6.335-1.512A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.814 9.814 0 0 1-5.031-1.388l-.361-.214-3.762.897.937-3.664-.235-.375A9.818 9.818 0 0 1 2.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/></svg>';

  function icon(name, size) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || ICONS.link) + '</svg>';
  }

  function currentLang() {
    var l = document.documentElement.getAttribute('lang') || localStorage.getItem('language') || 'en';
    return l.toLowerCase().indexOf('ar') === 0 ? 'ar' : 'en';
  }

  function pick(obj, lang) {
    if (!obj) return '';
    return obj[lang] || obj.en || '';
  }

  function waLink(text) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }

  function priceText(value, s, isMonthly) {
    if (value === 'Free') return s.free;
    return value + (isMonthly ? s.perMonth : '');
  }

  var activeFilter = 'all';

  function render() {
    var grid = document.getElementById('templatesGrid');
    if (!grid || !window.WEBKMT_TEMPLATES) return;
    var lang = currentLang();
    var s = STRINGS[lang];
    var html = '';

    window.WEBKMT_TEMPLATES.forEach(function (t) {
      if (activeFilter !== 'all' && t.cat !== activeFilter) return;
      var name = pick(t.name, lang);
      var nameEn = t.name.en;
      var feats = (t.features[lang] || t.features.en).map(function (f) {
        return '<li>' + icon('check', 14) + '<span>' + f + '</span></li>';
      }).join('');
      var demoBtn = t.demoUrl
        ? '<a class="tpl-btn tpl-btn--ghost" href="' + t.demoUrl + '" target="_blank" rel="noopener">' + s.viewDemo + '</a>'
        : '<a class="tpl-btn tpl-btn--ghost" href="' + waLink(s.waDemo(nameEn)) + '" target="_blank" rel="noopener">' + s.demoOnRequest + '</a>';

      html += '' +
        '<article class="tpl-card" data-cat="' + t.cat + '" id="tpl-' + t.id + '">' +
          '<div class="tpl-preview" style="background:linear-gradient(135deg,' + t.gradient[0] + ',' + t.gradient[1] + ')">' +
            '<div class="tpl-preview__bar"><span class="tpl-preview__dots"><i></i><i></i><i></i></span><span class="tpl-preview__url">' + t.id + '.yourbusiness.com</span></div>' +
            '<div class="tpl-preview__icon">' + icon(t.icon, 44) + '</div>' +
            '<div class="tpl-preview__lines"><i></i><i></i><i></i></div>' +
          '</div>' +
          '<div class="tpl-card__body">' +
            '<h3 class="tpl-card__name">' + name + '</h3>' +
            '<p class="tpl-card__tagline">' + pick(t.tagline, lang) + '</p>' +
            '<ul class="tpl-card__features">' + feats + '</ul>' +
            '<div class="tpl-card__meta">' +
              '<span><strong>' + s.setup + ':</strong> ' + priceText(t.setup, s, false) + '</span>' +
              '<span><strong>' + s.care + ':</strong> ' + priceText(t.care, s, true) + '</span>' +
              '<span><strong>' + s.launchIn + ':</strong> ' + pick(t.days, lang) + '</span>' +
            '</div>' +
            '<div class="tpl-card__actions">' +
              '<a class="tpl-btn tpl-btn--primary" href="' + waLink(s.waLaunch(nameEn)) + '" target="_blank" rel="noopener">' + WA_ICON + s.launch + '</a>' +
              demoBtn +
            '</div>' +
          '</div>' +
        '</article>';
    });

    grid.innerHTML = html;
  }

  function initFilters() {
    var buttons = document.querySelectorAll('.tpl-filter-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        activeFilter = btn.getAttribute('data-filter') || 'all';
        render();
      });
    });
  }

  function initThemeToggle() {
    document.querySelectorAll('.theme-toggle-enhanced').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme') || 'light';
        var next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
      });
    });
  }

  function initLangObserver() {
    // Re-render cards whenever the site LanguageManager switches <html lang>
    var last = currentLang();
    var obs = new MutationObserver(function () {
      var now = currentLang();
      if (now !== last) { last = now; render(); }
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  function init() {
    render();
    initFilters();
    initThemeToggle();
    initLangObserver();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
