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
})();
