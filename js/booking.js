/**
 * WebKMT Booking Widget — native Cal.com booking modal
 * ----------------------------------------------------
 * Talks ONLY to our server proxy (/api/cal/*), never to Cal directly.
 * Open via: any [data-book-call] element, ?book=1 in the URL,
 * postMessage {type:'webkmt:book-call'} (e.g. from mini-app iframes),
 * or window.WebKMTBooking.open().
 *
 * If booking is not configured/unavailable, it degrades gracefully
 * to a WhatsApp booking prompt — the CTA never dead-ends.
 */
(function () {
  'use strict';

  var WA_NUMBER = '905013617795';
  var API = '/api/cal';

  var S = {
    en: {
      title: 'Book a Free Audit Call',
      subtitle: 'Pick a time that works for you — the calendar invite lands in your inbox.',
      loading: 'Loading availability…',
      pickDay: 'Pick a day',
      pickTime: 'Pick a time',
      noSlots: 'No times available on this day — please try another day.',
      tzNote: function (tz) { return 'Times are shown in your timezone (' + tz + ').'; },
      yourDetails: 'Your details',
      name: 'Full name',
      email: 'Email address',
      phone: 'WhatsApp number (optional)',
      notes: 'Anything we should know? (optional)',
      back: 'Back',
      confirm: 'Confirm Booking',
      booking: 'Booking…',
      invalid: 'Please enter your name and a valid email address.',
      successTitle: "You're booked! 🎉",
      successText: function (email) { return 'A calendar invitation is on its way to ' + email + '.'; },
      successWa: 'Need anything before the call? WhatsApp us',
      errorTitle: 'Something went wrong',
      errorText: 'We could not complete your booking. Please try again, or book in one tap on WhatsApp.',
      tryAgain: 'Try Again',
      fallbackTitle: 'Book on WhatsApp',
      fallbackText: 'Online scheduling is momentarily unavailable — message us and we will set up your free audit call right away.',
      waBtn: 'Book on WhatsApp',
      close: 'Close',
      min: 'min',
      waMsg: "Hi! I'd like to book a free audit call."
    },
    ar: {
      title: 'احجز مكالمة تقييم مجانية',
      subtitle: 'اختر الوقت المناسب لك — وستصلك دعوة التقويم إلى بريدك الإلكتروني.',
      loading: 'جارٍ تحميل المواعيد المتاحة…',
      pickDay: 'اختر اليوم',
      pickTime: 'اختر الوقت',
      noSlots: 'لا توجد مواعيد متاحة في هذا اليوم — جرّب يوماً آخر.',
      tzNote: function (tz) { return 'المواعيد معروضة حسب منطقتك الزمنية (' + tz + ').'; },
      yourDetails: 'بياناتك',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم واتساب (اختياري)',
      notes: 'أي شيء تريد إخبارنا به؟ (اختياري)',
      back: 'رجوع',
      confirm: 'تأكيد الحجز',
      booking: 'جارٍ الحجز…',
      invalid: 'يرجى إدخال اسمك وبريد إلكتروني صحيح.',
      successTitle: 'تم الحجز! 🎉',
      successText: function (email) { return 'دعوة التقويم في طريقها إلى ' + email + '.'; },
      successWa: 'تحتاج أي شيء قبل المكالمة؟ راسلنا واتساب',
      errorTitle: 'حدث خطأ ما',
      errorText: 'لم نتمكن من إتمام حجزك. حاول مرة أخرى، أو احجز بضغطة واحدة عبر واتساب.',
      tryAgain: 'حاول مرة أخرى',
      fallbackTitle: 'احجز عبر واتساب',
      fallbackText: 'الحجز الإلكتروني غير متاح مؤقتاً — راسلنا وسنرتب مكالمة التقييم المجانية فوراً.',
      waBtn: 'احجز عبر واتساب',
      close: 'إغلاق',
      min: 'دقيقة',
      waMsg: 'مرحباً! أود حجز مكالمة تقييم مجانية.'
    }
  };

  var state = {
    open: false,
    step: 'loading', // loading | pick | form | success | error | fallback
    eventTypes: [],
    eventTypeId: null,
    dateISO: null,
    slots: [],
    slotsLoading: false,
    slotISO: null,
    booking: null,
    tz: (Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC')
  };

  var overlay = null, bodyEl = null, titleEl = null, subEl = null;

  function lang() {
    var l = document.documentElement.getAttribute('lang') || localStorage.getItem('language') || 'en';
    return l.toLowerCase().indexOf('ar') === 0 ? 'ar' : 'en';
  }
  function t() { return S[lang()]; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function waLink(text) { return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text); }

  function buildModal() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'bk-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML =
      '<div class="bk-modal">' +
        '<div class="bk-head">' +
          '<div><h3 class="bk-title"></h3><p class="bk-sub"></p></div>' +
          '<button type="button" class="bk-close" aria-label="Close">✕</button>' +
        '</div>' +
        '<div class="bk-body"></div>' +
      '</div>';
    document.body.appendChild(overlay);
    titleEl = overlay.querySelector('.bk-title');
    subEl = overlay.querySelector('.bk-sub');
    bodyEl = overlay.querySelector('.bk-body');
    overlay.querySelector('.bk-close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && state.open) close(); });
  }

  function open() {
    buildModal();
    state.open = true;
    state.step = 'loading';
    state.slotISO = null;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    render();
    loadEventTypes();
  }

  function close() {
    state.open = false;
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function selectedType() {
    return state.eventTypes.find(function (e) { return e.id === state.eventTypeId; }) || state.eventTypes[0] || null;
  }

  function loadEventTypes() {
    fetch(API + '/event-types', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (json) {
        if (!state.open) return;
        if (!json || json.configured === false || !Array.isArray(json.eventTypes) || !json.eventTypes.length) {
          state.step = 'fallback';
        } else {
          state.eventTypes = json.eventTypes;
          state.eventTypeId = json.recommendedId || json.eventTypes[0].id;
          state.step = 'pick';
          if (!state.dateISO) state.dateISO = localISODate(new Date());
          loadSlots();
        }
        render();
      })
      .catch(function () {
        if (!state.open) return;
        state.step = 'fallback';
        render();
      });
  }

  function loadSlots() {
    if (!state.eventTypeId || !state.dateISO) return;
    state.slotsLoading = true;
    state.slots = [];
    renderSlotsArea();
    var qs = new URLSearchParams({ eventTypeId: String(state.eventTypeId), date: state.dateISO, timeZone: state.tz });
    fetch(API + '/slots?' + qs.toString(), { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (json) {
        state.slotsLoading = false;
        state.slots = (json && Array.isArray(json.slots)) ? json.slots : [];
        if (json && json.configured === false) { state.step = 'fallback'; render(); return; }
        renderSlotsArea();
      })
      .catch(function () {
        state.slotsLoading = false;
        state.slots = [];
        renderSlotsArea();
      });
  }

  function localISODate(d) {
    var y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function nextDays(n) {
    var out = [];
    var now = new Date();
    for (var i = 0; i < n; i++) {
      var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      out.push(d);
    }
    return out;
  }

  function fmtTime(iso) {
    return new Intl.DateTimeFormat(lang(), { hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
  }
  function fmtFull(iso) {
    return new Intl.DateTimeFormat(lang(), { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }).format(new Date(iso));
  }

  function render() {
    if (!overlay) return;
    var s = t();
    titleEl.textContent = s.title;
    subEl.textContent = s.subtitle;
    overlay.querySelector('.bk-close').setAttribute('aria-label', s.close);

    if (state.step === 'loading') {
      bodyEl.innerHTML = '<div class="bk-loading"><div class="bk-spinner"></div><p>' + esc(s.loading) + '</p></div>';
      return;
    }
    if (state.step === 'fallback') {
      bodyEl.innerHTML =
        '<div class="bk-fallback">' +
          '<h4>' + esc(s.fallbackTitle) + '</h4>' +
          '<p>' + esc(s.fallbackText) + '</p>' +
          '<a class="bk-btn bk-btn--wa" target="_blank" rel="noopener" href="' + waLink(s.waMsg) + '">' + esc(s.waBtn) + '</a>' +
        '</div>';
      return;
    }
    if (state.step === 'pick') { renderPick(); return; }
    if (state.step === 'form') { renderForm(); return; }
    if (state.step === 'success') { renderSuccess(); return; }
    if (state.step === 'error') {
      bodyEl.innerHTML =
        '<div class="bk-fallback">' +
          '<h4>' + esc(s.errorTitle) + '</h4>' +
          '<p>' + esc(s.errorText) + '</p>' +
          '<div class="bk-actions">' +
            '<button type="button" class="bk-btn bk-btn--primary" id="bkRetry">' + esc(s.tryAgain) + '</button>' +
            '<a class="bk-btn bk-btn--wa" target="_blank" rel="noopener" href="' + waLink(s.waMsg) + '">' + esc(s.waBtn) + '</a>' +
          '</div>' +
        '</div>';
      bodyEl.querySelector('#bkRetry').addEventListener('click', function () { state.step = 'pick'; state.slotISO = null; loadSlots(); render(); });
      return;
    }
  }

  function renderPick() {
    var s = t();
    var typeSelect = '';
    if (state.eventTypes.length > 1) {
      typeSelect = '<label class="bk-label"><select id="bkType" class="bk-input">' +
        state.eventTypes.map(function (e) {
          return '<option value="' + e.id + '"' + (e.id === state.eventTypeId ? ' selected' : '') + '>' + esc(e.title) + ' · ' + e.lengthInMinutes + ' ' + esc(s.min) + '</option>';
        }).join('') + '</select></label>';
    } else if (selectedType()) {
      typeSelect = '<p class="bk-type-line">' + esc(selectedType().title) + ' · ' + selectedType().lengthInMinutes + ' ' + esc(s.min) + '</p>';
    }

    var days = nextDays(14).map(function (d) {
      var iso = localISODate(d);
      var wd = new Intl.DateTimeFormat(lang(), { weekday: 'short' }).format(d);
      var dm = new Intl.DateTimeFormat(lang(), { day: 'numeric', month: 'short' }).format(d);
      return '<button type="button" class="bk-date' + (iso === state.dateISO ? ' is-active' : '') + '" data-date="' + iso + '"><span>' + esc(wd) + '</span><strong>' + esc(dm) + '</strong></button>';
    }).join('');

    bodyEl.innerHTML =
      typeSelect +
      '<p class="bk-label-text">' + esc(s.pickDay) + '</p>' +
      '<div class="bk-dates">' + days + '</div>' +
      '<p class="bk-label-text">' + esc(s.pickTime) + '</p>' +
      '<div id="bkSlots"></div>' +
      '<p class="bk-tz">' + esc(s.tzNote(state.tz)) + '</p>';

    var sel = bodyEl.querySelector('#bkType');
    if (sel) sel.addEventListener('change', function () {
      state.eventTypeId = Number(sel.value);
      state.slotISO = null;
      loadSlots();
    });
    bodyEl.querySelectorAll('.bk-date').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.dateISO = btn.getAttribute('data-date');
        state.slotISO = null;
        bodyEl.querySelectorAll('.bk-date').forEach(function (b) { b.classList.toggle('is-active', b === btn); });
        loadSlots();
      });
    });
    renderSlotsArea();
  }

  function renderSlotsArea() {
    var host = bodyEl && bodyEl.querySelector('#bkSlots');
    if (!host) return;
    var s = t();
    if (state.slotsLoading) {
      host.innerHTML = '<div class="bk-loading bk-loading--sm"><div class="bk-spinner"></div></div>';
      return;
    }
    if (!state.slots.length) {
      host.innerHTML = '<p class="bk-empty">' + esc(s.noSlots) + '</p>';
      return;
    }
    host.innerHTML = '<div class="bk-slots">' + state.slots.map(function (iso) {
      return '<button type="button" class="bk-slot" data-slot="' + esc(iso) + '">' + esc(fmtTime(iso)) + '</button>';
    }).join('') + '</div>';
    host.querySelectorAll('.bk-slot').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.slotISO = btn.getAttribute('data-slot');
        state.step = 'form';
        render();
      });
    });
  }

  function renderForm() {
    var s = t();
    var et = selectedType();
    bodyEl.innerHTML =
      '<p class="bk-summary">📅 <strong>' + esc(et ? et.title : '') + '</strong><br>' + esc(state.slotISO ? fmtFull(state.slotISO) : '') + '</p>' +
      '<p class="bk-label-text">' + esc(s.yourDetails) + '</p>' +
      '<form id="bkForm" novalidate>' +
        '<input class="bk-input" id="bkName" type="text" autocomplete="name" placeholder="' + esc(s.name) + '" required>' +
        '<input class="bk-input" id="bkEmail" type="email" autocomplete="email" placeholder="' + esc(s.email) + '" required>' +
        '<input class="bk-input" id="bkPhone" type="tel" autocomplete="tel" placeholder="' + esc(s.phone) + '">' +
        '<textarea class="bk-input" id="bkNotes" rows="2" placeholder="' + esc(s.notes) + '"></textarea>' +
        '<p class="bk-error" id="bkError" role="alert"></p>' +
        '<div class="bk-actions">' +
          '<button type="button" class="bk-btn bk-btn--ghost" id="bkBack">' + esc(s.back) + '</button>' +
          '<button type="submit" class="bk-btn bk-btn--primary" id="bkSubmit">' + esc(s.confirm) + '</button>' +
        '</div>' +
      '</form>';

    bodyEl.querySelector('#bkBack').addEventListener('click', function () { state.step = 'pick'; render(); });
    bodyEl.querySelector('#bkForm').addEventListener('submit', submitBooking);
  }

  function submitBooking(e) {
    e.preventDefault();
    var s = t();
    var name = bodyEl.querySelector('#bkName').value.trim();
    var email = bodyEl.querySelector('#bkEmail').value.trim();
    var phone = bodyEl.querySelector('#bkPhone').value.trim();
    var notes = bodyEl.querySelector('#bkNotes').value.trim();
    var errEl = bodyEl.querySelector('#bkError');
    var btn = bodyEl.querySelector('#bkSubmit');

    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errEl.textContent = s.invalid;
      return;
    }
    btn.disabled = true;
    btn.textContent = s.booking;

    fetch(API + '/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventTypeId: state.eventTypeId,
        start: state.slotISO,
        name: name,
        email: email,
        phone: phone || undefined,
        notes: notes || undefined,
        timeZone: state.tz,
        language: lang()
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (json) {
        if (json && json.success) {
          state.booking = json.booking;
          state.bookingEmail = email;
          state.step = 'success';
        } else {
          state.step = 'error';
        }
        render();
      })
      .catch(function () {
        state.step = 'error';
        render();
      });
  }

  function renderSuccess() {
    var s = t();
    var b = state.booking || {};
    bodyEl.innerHTML =
      '<div class="bk-success">' +
        '<div class="bk-success-icon">✅</div>' +
        '<h4>' + esc(s.successTitle) + '</h4>' +
        '<p><strong>' + esc(b.title || (selectedType() ? selectedType().title : '')) + '</strong><br>' + esc(b.start ? fmtFull(b.start) : '') + '</p>' +
        '<p>' + esc(s.successText(state.bookingEmail || '')) + '</p>' +
        '<a class="bk-btn bk-btn--wa" target="_blank" rel="noopener" href="' + waLink(s.waMsg) + '">' + esc(s.successWa) + '</a>' +
      '</div>';
  }

  // ---- triggers ----
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest && e.target.closest('[data-book-call]');
    if (trigger) {
      e.preventDefault();
      open();
    }
  });

  window.addEventListener('message', function (e) {
    if (e.origin !== window.location.origin) return;
    if (e.data && (e.data.type === 'webkmt:book-call' || e.data.type === 'service-request')) {
      open();
    }
  });

  // Re-render on language switch (site LanguageManager flips <html lang>)
  var lastLang = lang();
  new MutationObserver(function () {
    var now = lang();
    if (now !== lastLang) {
      lastLang = now;
      if (state.open) render();
      else if (overlay) { titleEl.textContent = t().title; subEl.textContent = t().subtitle; }
    }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  if (/[?&]book=1/.test(window.location.search)) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', open);
    else open();
  }

  window.WebKMTBooking = { open: open, close: close };
})();
