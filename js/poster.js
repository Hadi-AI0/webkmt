/* Poster redesign behaviours (see DESIGN.md).
   Everything is gated behind html.wk26-anim, which is added only when
   IntersectionObserver exists and the reader has not asked for reduced
   motion. With JavaScript unavailable, disabled, or reduced motion on,
   every section renders static and fully visible. */
(function () {
    'use strict';

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) return;

    document.documentElement.classList.add('wk26-anim');

    /* Reveal: elements settle in as they first reach the viewport. */
    var reveals = document.querySelectorAll('body.wk26 [data-reveal]');
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-in');
                io.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    reveals.forEach(function (el) { io.observe(el); });
    /* Safety net: nothing may stay hidden if the observer misfires. */
    window.setTimeout(function () {
        reveals.forEach(function (el) { el.classList.add('is-in'); });
    }, 4000);

    /* Proof: one tool name lights at a time while the others wait.
       Pauses for good on hover or keyboard focus inside the sentence. */
    var names = Array.prototype.slice.call(document.querySelectorAll('.wk26-names .wk26-name'));
    if (names.length > 1) {
        var index = 0;
        var stopped = false;
        var wrap = document.querySelector('.wk26-names');
        if (wrap) {
            wrap.addEventListener('pointerenter', function () { stopped = true; });
            wrap.addEventListener('focusin', function () { stopped = true; });
        }
        window.setInterval(function () {
            if (stopped || document.hidden) return;
            names[index].classList.remove('is-lit');
            index = (index + 1) % names.length;
            names[index].classList.add('is-lit');
        }, 2600);
    }

    /* Name scaling: the hero wordmark grows toward the footer wordmark's
       size across the first screen of scroll. Transform only, no reflow.
       Desktop only; tablet/phone keep the static hero photo instead. */
    var heroName = document.getElementById('wk26HeroName');
    var footerName = document.getElementById('wk26FooterName');
    if (heroName && footerName && window.matchMedia('(min-width: 761px)').matches) {
        var ratio = 1.25;
        var ticking = false;
        function measure() {
            var w = footerName.offsetWidth / Math.max(1, heroName.offsetWidth);
            if (isFinite(w) && w > 1) ratio = w;
        }
        measure();
        window.addEventListener('resize', measure, { passive: true });
        window.addEventListener('scroll', function () {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(function () {
                var t = Math.min(1, Math.max(0, window.scrollY / Math.max(1, window.innerHeight)));
                heroName.style.transform = 'scale(' + (1 + (ratio - 1) * t).toFixed(4) + ')';
                ticking = false;
            });
        }, { passive: true });
    }

    /* Journey: [data-signup] opens the kept auth modal in sign-up mode. */
    document.addEventListener('click', function (ev) {
        var trigger = ev.target.closest ? ev.target.closest('[data-signup]') : null;
        if (!trigger) return;
        ev.preventDefault();
        var login = document.getElementById('loginBtn');
        if (login) login.click();
        window.setTimeout(function () {
            var title = document.getElementById('authModalTitle');
            var swap = document.getElementById('authSwitchBtn');
            if (title && swap && /sign in/i.test(title.textContent || '')) swap.click();
        }, 60);
    });

    /* Portfolio gallery: the kept masonry shows four cards first, which can
       leave the last grid row partly empty (a hole beside the final card).
       Stretch the final card to the row's end whenever the row is short.
       Runs on render, on "show more", and on resize. */
    var grid = document.getElementById('portfolioGrid');
    if (grid) {
        var fillLastRow = function () {
            var cards = grid.children;
            if (!cards.length) return;
            var tracks = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
            var last = cards[cards.length - 1];
            last.style.gridColumn = '';
            var cs = getComputedStyle(last);
            var start = parseInt(cs.gridColumnStart, 10) || 1;
            var gap = parseFloat(cs.columnGap || '0') || 0;
            var trackW = (grid.getBoundingClientRect().width - gap * (tracks - 1)) / tracks;
            var used = Math.round((last.getBoundingClientRect().width + gap) / (trackW + gap));
            if (start + used - 1 < tracks) {
                last.style.gridColumn = start + ' / -1';
            }
        };
        var timer = 0;
        var schedule = function () {
            window.clearTimeout(timer);
            timer = window.setTimeout(fillLastRow, 120);
        };
        new MutationObserver(schedule).observe(grid, { childList: true, subtree: false });
        window.addEventListener('resize', schedule, { passive: true });
        schedule();
    }
})();
