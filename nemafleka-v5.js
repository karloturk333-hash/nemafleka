'use strict';

/* ═══════════════════════════════════════════════════════════════════════════
   PERFORMANCE-OPTIMIZED NEMA FLEKA JS
   ───────────────────────────────────────────────────────────────────────────
   Key optimizations:
   - rAF-throttled scroll handler (eliminates scroll jank)
   - Lazy-loaded Leaflet map via IntersectionObserver (saves ~200KB on initial load)
   - Page Visibility API to pause carousel when tab is hidden
   - Single debounced resize handler for all modules
   - Cached DOM queries to avoid repeated lookups
   - Optimized counter animation (reduced toLocaleString calls)
   - Before/After slider: removed redundant getBoundingClientRect calls
   - Event listeners only attached when needed (mousemove only during drag)
   ═══════════════════════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════════════════════
   0. SHARED UTILITIES
   ═══════════════════════════════════════════════════════════════════════════ */

/** Debounce: delays execution until `wait` ms after last call */
function _debounce(fn, wait) {
  var timerId = null;
  return function () {
    var ctx = this, args = arguments;
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(function () {
      timerId = null;
      fn.apply(ctx, args);
    }, wait);
  };
}

/** Shared resize callbacks — all modules register here, single listener */
var _resizeCallbacks = [];
function _onResize(fn) {
  _resizeCallbacks.push(fn);
}
window.addEventListener('resize', _debounce(function () {
  for (var i = 0; i < _resizeCallbacks.length; i++) {
    _resizeCallbacks[i]();
  }
}, 150), { passive: true });


/* ═══════════════════════════════════════════════════════════════════════════
   1. BEFORE / AFTER SLIDER (IIFE)
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  var widget  = document.getElementById('ba-widget');
  var afterEl = document.getElementById('ba-after');
  var divider = document.getElementById('ba-divider');
  var handle  = document.getElementById('ba-handle');

  if (!widget || !afterEl || !divider || !handle) return;

  var pct      = 50;
  var rafId    = null;
  var dragging = false;
  var rect     = null; /* lazily computed */

  var slides = {
    couch:    { before: 'images/IMG_0388 (1).jpg', after: 'images/IMG_0396.jpg' },
    mattress: { before: 'images/IMG_0028.jpg',     after: 'images/IMG_0017.jpg' }
  };

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  /** Cache bounding rect — only recalculate when stale */
  function getRect() {
    if (!rect) rect = widget.getBoundingClientRect();
    return rect;
  }

  function invalidateRect() {
    rect = null;
  }

  function applyPct() {
    var r  = getRect();
    var px = (pct / 100) * r.width;
    /* Batch writes — no reads between these */
    afterEl.style.clipPath  = 'inset(0 ' + (r.width - px) + 'px 0 0)';
    divider.style.transform = 'translateX(' + px + 'px)';
    handle.setAttribute('aria-valuenow', Math.round(pct));
  }

  function updateFromClientX(clientX) {
    if (rafId) return;
    rafId = requestAnimationFrame(function () {
      rafId = null;
      var r = getRect();
      var p = ((clientX - r.left) / r.width) * 100;
      pct = clamp(p, 3, 97);
      applyPct();
    });
  }

  /* -- Drag start/end helpers to attach/detach move listeners -- */
  function onMouseMove(e) {
    updateFromClientX(e.clientX);
  }

  function onMouseUp() {
    dragging = false;
    /* Remove listeners when not dragging — saves CPU on every mouse move */
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }

  function onTouchMove(e) {
    if (!dragging) return;
    e.preventDefault();
    updateFromClientX(e.touches[0].clientX);
  }

  function onTouchEnd() {
    dragging = false;
    window.removeEventListener('touchend', onTouchEnd, { passive: true });
  }

  /* -- Mouse -- */
  widget.addEventListener('mousedown', function (e) {
    e.preventDefault();
    dragging = true;
    invalidateRect(); /* Fresh rect on drag start */
    updateFromClientX(e.clientX);
    /* Only listen for move/up while actively dragging */
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  });

  /* -- Touch -- */
  widget.addEventListener('touchstart', function (e) {
    dragging = true;
    invalidateRect();
    updateFromClientX(e.touches[0].clientX);
    window.addEventListener('touchend', onTouchEnd, { passive: true });
  }, { passive: true });

  widget.addEventListener('touchmove', onTouchMove, { passive: false });

  /* -- Keyboard -- */
  handle.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      pct = clamp(pct - 2, 3, 97);
      applyPct();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      pct = clamp(pct + 2, 3, 97);
      applyPct();
    }
  });

  /* -- Resize — invalidate cached rect -- */
  _onResize(function () {
    invalidateRect();
    applyPct();
  });

  /* -- Tab switching -- */
  var tabs = document.querySelectorAll('.ba-tab');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var slideKey  = this.getAttribute('data-slide');
      var slideData = slides[slideKey];
      if (!slideData) return;

      /* Update aria-selected on all tabs */
      tabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');

      /* Fade out, swap images, fade in */
      widget.style.opacity    = '0';
      widget.style.transition = 'opacity 200ms ease';

      setTimeout(function () {
        var beforeImg = widget.querySelector('.ba-before img');
        var afterImg  = widget.querySelector('.ba-after img');
        if (beforeImg) beforeImg.src = slideData.before;
        if (afterImg)  afterImg.src  = slideData.after;

        /* Reset to 50% */
        pct = 50;
        invalidateRect();
        applyPct();

        widget.style.opacity = '1';
      }, 200);
    });
  });

  /* Initial render */
  invalidateRect();
  applyPct();
}());


/* ═══════════════════════════════════════════════════════════════════════════
   2. COVERAGE MAP — LAZY LOADED via IntersectionObserver
   ───────────────────────────────────────────────────────────────────────────
   The Leaflet map is ~200KB of JS + tile requests. Defer initialization
   until the map section is within 300px of the viewport.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  var mapEl = document.getElementById('coverage-map');
  if (!mapEl) return;

  var mapInitialized = false;

  function initMap() {
    if (mapInitialized) return;
    if (typeof L === 'undefined') return;
    mapInitialized = true;

    var center = [45.8833, 16.4167];

    var map = L.map('coverage-map', {
      center: center,
      zoom: 9,
      scrollWheelZoom: false
    });

    /* Store on window for price calculator access */
    window._nfMap = map;

    /* CARTO dark tiles */
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    /* Outer glow circle */
    L.circle(center, {
      radius: 35000,
      fillColor: '#C8FF3E',
      fillOpacity: 0.06,
      weight: 8,
      color: '#C8FF3E',
      opacity: 0.15
    }).addTo(map);

    /* Crisp border circle */
    L.circle(center, {
      radius: 35000,
      fillOpacity: 0,
      weight: 2,
      color: '#C8FF3E',
      opacity: 0.4,
      dashArray: '8 5'
    }).addTo(map);

    /* Center marker — Vrbovec */
    var pinIcon = L.divIcon({
      className: '',
      html: '<div style="width:40px;height:40px;border-radius:50%;background:#181A6E;border:3px solid #C8FF3E;display:flex;align-items:center;justify-content:center;font-family:Nunito,sans-serif;font-weight:900;font-size:16px;color:#C8FF3E;box-shadow:0 4px 12px rgba(0,0,0,0.4)">N</div>',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -24]
    });

    L.marker(center, { icon: pinIcon })
      .addTo(map)
      .bindPopup(
        '<div style="text-align:center;font-family:Nunito,sans-serif">' +
          '<strong style="font-size:1rem;color:#0D0E45">Nema Fleka</strong><br>' +
          '<span style="font-size:0.75rem;color:#3D4060">Vrbovec \u00b7 Dubinsko \u010di\u0161\u0107enje</span><br>' +
          '<span style="font-size:0.7rem;color:#7A7FA8">095 376 5343 \u00b7 091 618 4796</span>' +
        '</div>'
      )
      .openPopup();

    /* City markers — reuse single icon instance */
    var cities = [
      { name: 'Zagreb',            lat: 45.8150, lng: 15.9819 },
      { name: 'Bjelovar',          lat: 45.8986, lng: 16.8425 },
      { name: 'Velika Gorica',     lat: 45.7133, lng: 16.0756 },
      { name: 'Zlatar',            lat: 46.0483, lng: 15.9858 },
      { name: 'Sv. Ivan \u017dabno',    lat: 46.0025, lng: 16.5422 },
      { name: 'Sesvete',           lat: 45.8272, lng: 16.1117 },
      { name: 'Kri\u017e',         lat: 45.6667, lng: 16.5500 },
      { name: 'Lonja',             lat: 45.6833, lng: 16.6833 },
      { name: 'Glogovnica',        lat: 46.0000, lng: 16.5333 },
      { name: '\u010cazma',         lat: 45.7500, lng: 16.6167 },
      { name: 'Ivani\u0107-Grad',   lat: 45.7083, lng: 16.3917 },
      { name: 'Klo\u0161tar Ivani\u0107', lat: 45.7333, lng: 16.4167 },
      { name: 'Kri\u017eevci',     lat: 46.0244, lng: 16.5467 },
      { name: 'Dugo Selo',         lat: 45.8047, lng: 16.2364 },
      { name: 'Sv. Ivan Zelina',   lat: 45.9583, lng: 16.2478 },
      { name: 'Farka\u0161evac',    lat: 45.8333, lng: 16.5500 },
      { name: 'Preseka',           lat: 45.9167, lng: 16.4833 },
      { name: 'Rugvica',           lat: 45.7500, lng: 16.2167 },
      { name: 'Gradec',            lat: 45.9333, lng: 16.4333 },
      { name: 'Popovec',           lat: 45.8833, lng: 16.1333 }
    ];

    var dotIcon = L.divIcon({
      className: '',
      html: '<div style="width:10px;height:10px;border-radius:50%;background:#C8FF3E;border:2px solid rgba(200,255,62,0.4);box-shadow:0 0 6px rgba(200,255,62,0.5)"></div>',
      iconSize: [10, 10],
      iconAnchor: [5, 5]
    });

    cities.forEach(function (city) {
      L.marker([city.lat, city.lng], { icon: dotIcon })
        .addTo(map)
        .bindTooltip(city.name, {
          permanent: true,
          direction: 'top',
          offset: [0, -8],
          className: 'map-city-label'
        });
    });
  }

  /* Observe map section — init when within 300px of viewport */
  var mapSection = mapEl.closest('section') || mapEl;
  var observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      initMap();
      observer.disconnect();
    }
  }, {
    rootMargin: '300px 0px'
  });

  observer.observe(mapSection);
}());


/* ═══════════════════════════════════════════════════════════════════════════
   3. SCROLL PROGRESS BAR + NAV STATE + BACK TO TOP
   ───────────────────────────────────────────────────────────────────────────
   Single scroll listener, rAF-throttled to avoid layout thrashing.
   All DOM writes batched inside the rAF callback.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  var progressBar = document.getElementById('scroll-progress');
  var nav         = document.querySelector('nav.main-nav');
  var backTop     = document.getElementById('back-top');

  var scrollTicking = false;

  window.addEventListener('scroll', function () {
    if (scrollTicking) return;
    scrollTicking = true;

    requestAnimationFrame(function () {
      scrollTicking = false;

      /* Read phase — batch all DOM reads */
      var scrollY      = window.scrollY;
      var scrollHeight = document.documentElement.scrollHeight;
      var innerHeight  = window.innerHeight;
      var maxScroll    = scrollHeight - innerHeight;

      /* Write phase — batch all DOM writes */

      /* Progress bar */
      if (progressBar && maxScroll > 0) {
        var pct = (scrollY / maxScroll) * 100;
        progressBar.style.width = pct + '%';
        progressBar.setAttribute('aria-valuenow', Math.round(pct));
      }

      /* Nav scrolled state — toggle class only when state changes */
      if (nav) {
        var shouldBeScrolled = scrollY > 40;
        var isScrolled = nav.classList.contains('scrolled');
        if (shouldBeScrolled !== isScrolled) {
          nav.classList.toggle('scrolled', shouldBeScrolled);
        }
      }

      /* Back to top visibility — toggle only on state change */
      if (backTop) {
        var shouldBeVisible = scrollY > 600;
        var isVisible = backTop.classList.contains('visible');
        if (shouldBeVisible !== isVisible) {
          backTop.classList.toggle('visible', shouldBeVisible);
        }
      }
    });
  }, { passive: true });

  /* Back to top click */
  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}());


/* ═══════════════════════════════════════════════════════════════════════════
   4. HAMBURGER / MOBILE MENU — Side Panel
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  var overlay    = document.getElementById('mobile-overlay');

  if (!hamburger || !mobileMenu) return;

  /* Cache focusable elements once */
  var focusableSelector = 'a[href], button, [tabindex]:not([tabindex="-1"])';

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    var focusable = mobileMenu.querySelectorAll(focusableSelector);
    if (focusable.length === 0) return;
    var first = focusable[0];
    var last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function openMenu() {
    mobileMenu.classList.add('open');
    if (overlay) overlay.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    var firstLink = mobileMenu.querySelector('.mobile-links a');
    if (firstLink) firstLink.focus();

    mobileMenu.addEventListener('keydown', trapFocus);
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    mobileMenu.removeEventListener('keydown', trapFocus);
  }

  hamburger.addEventListener('click', function () {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (overlay) {
    overlay.addEventListener('click', function () {
      closeMenu();
      hamburger.focus();
    });
  }

  /* Close on link click — single delegated listener */
  mobileMenu.addEventListener('click', function (e) {
    if (e.target.closest('a[href]')) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });
}());

/* ═══════════════════════════════════════════════════════════════════════════
   4b. FOOTER "NA VRH" LINK
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  var topLink = document.querySelector('.footer-top-link');
  if (!topLink) return;

  topLink.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}());


/* ═══════════════════════════════════════════════════════════════════════════
   5. HERO CAROUSEL
   ───────────────────────────────────────────────────────────────────────────
   Improvements:
   - Page Visibility API: pauses rAF loop when tab is hidden (saves CPU)
   - Cleaner rAF lifecycle: cancel on visibility change instead of spinning idle
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  var track        = document.getElementById('hc-track');
  var dots         = document.querySelectorAll('.hc-dot');
  var slides       = document.querySelectorAll('.hc-slide');
  var progressFill = document.getElementById('hc-progress-fill');
  var prevBtn      = document.getElementById('hc-prev');
  var nextBtn      = document.getElementById('hc-next');
  var counterEl    = document.getElementById('hc-counter');

  if (!track || !dots.length || !progressFill || !slides.length) return;

  var TOTAL      = slides.length;
  var DURATION   = 5000;
  var current    = 0;
  var hcPaused   = false;
  var startTime  = null;
  var progressId = null;
  var tabHidden  = false;

  function hcGoTo(n) {
    current = ((n % TOTAL) + TOTAL) % TOTAL;

    /* GPU-accelerated slide via transform */
    track.style.transform = 'translateX(-' + (current * 100) + '%)';

    /* Update dots */
    for (var i = 0; i < dots.length; i++) {
      var isActive = i === current;
      dots[i].classList.toggle('active', isActive);
      dots[i].setAttribute('aria-selected', isActive ? 'true' : 'false');
    }

    /* Update slides */
    for (var j = 0; j < slides.length; j++) {
      slides[j].classList.toggle('active', j === current);
    }

    if (counterEl) {
      counterEl.textContent = (current + 1) + ' / ' + TOTAL;
    }

    /* Reset progress */
    startTime = null;
    progressFill.style.width = '0%';
  }

  function hcStartProgress() {
    function tick(now) {
      if (hcPaused || tabHidden) {
        /* When paused: stop the loop entirely, restart on unpause */
        progressId = null;
        startTime = null;
        return;
      }

      if (!startTime) startTime = now;
      var elapsed  = now - startTime;
      var fraction = Math.min(elapsed / DURATION, 1);

      progressFill.style.width = (fraction * 100) + '%';

      if (elapsed >= DURATION) {
        hcGoTo(current + 1);
      }

      progressId = requestAnimationFrame(tick);
    }

    if (progressId) cancelAnimationFrame(progressId);
    progressId = requestAnimationFrame(tick);
  }

  function resumeCarousel() {
    startTime = null;
    if (!progressId) hcStartProgress();
  }

  /* Controls */
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      hcGoTo(current - 1);
      resumeCarousel();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      hcGoTo(current + 1);
      resumeCarousel();
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      hcGoTo(i);
      resumeCarousel();
    });
  });

  /* Pause on hover */
  var heroRight = document.querySelector('.hero-right');
  if (heroRight) {
    heroRight.addEventListener('mouseenter', function () {
      hcPaused = true;
    });
    heroRight.addEventListener('mouseleave', function () {
      hcPaused = false;
      resumeCarousel();
    });
  }

  /* Touch swipe */
  var touchStartX = 0;
  if (heroRight) {
    heroRight.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    heroRight.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 48) {
        hcGoTo(diff > 0 ? current + 1 : current - 1);
        resumeCarousel();
      }
    }, { passive: true });
  }

  /* Page Visibility API — stop rAF entirely when tab hidden */
  document.addEventListener('visibilitychange', function () {
    tabHidden = document.hidden;
    if (!tabHidden && !hcPaused) {
      resumeCarousel();
    }
  });

  /* Kick off */
  hcGoTo(0);
  hcStartProgress();
}());


/* ═══════════════════════════════════════════════════════════════════════════
   6. SCROLL REVEAL (IntersectionObserver)
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  var observer = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        entries[i].target.classList.add('in');
        observer.unobserve(entries[i].target);
      }
    }
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px'
  });

  for (var i = 0; i < reveals.length; i++) {
    observer.observe(reveals[i]);
  }
}());


/* ═══════════════════════════════════════════════════════════════════════════
   7. COUNTER ANIMATIONS (IntersectionObserver)
   ───────────────────────────────────────────────────────────────────────────
   Optimization: pre-format final value, reduce toLocaleString frequency
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  var counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el, target, duration) {
    var startTs    = null;
    var lastValue  = -1; /* Skip DOM write if value unchanged */
    var finalText  = target.toLocaleString('hr');

    function step(now) {
      if (!startTs) startTs = now;
      var elapsed  = now - startTs;
      var progress = Math.min(elapsed / duration, 1);
      var eased    = easeOutCubic(progress);
      var value    = Math.round(eased * target);

      /* Only update DOM if the displayed number actually changed */
      if (value !== lastValue) {
        lastValue = value;
        el.textContent = progress >= 1 ? finalText : value.toLocaleString('hr');
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        var el     = entries[i].target;
        var target = parseInt(el.getAttribute('data-target'), 10);
        if (!isNaN(target)) {
          animateCounter(el, target, 1800);
        }
        observer.unobserve(el);
      }
    }
  }, {
    threshold: 0.5
  });

  for (var i = 0; i < counters.length; i++) {
    observer.observe(counters[i]);
  }
}());


/* ═══════════════════════════════════════════════════════════════════════════
   8. TIMELINE LINE ANIMATION (IntersectionObserver)
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  var timeline     = document.getElementById('timeline');
  var timelineLine = document.getElementById('timeline-line');

  if (!timeline || !timelineLine) return;

  var observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      timelineLine.classList.add('animated');
      observer.disconnect();
    }
  }, {
    threshold: 0.4
  });

  observer.observe(timeline);
}());


/* ═══════════════════════════════════════════════════════════════════════════
   9. FAQ ACCORDION
   ───────────────────────────────────────────────────────────────────────────
   Uses event delegation on parent container instead of per-button listeners
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  var faqList = document.querySelector('.faq-list');
  if (!faqList) return;

  var questions = faqList.querySelectorAll('.faq-question');
  if (!questions.length) return;

  /* Single delegated listener on the FAQ container */
  faqList.addEventListener('click', function (e) {
    var btn = e.target.closest('.faq-question');
    if (!btn) return;

    var isExpanded = btn.getAttribute('aria-expanded') === 'true';
    var targetId   = btn.getAttribute('aria-controls');
    var answer     = document.getElementById(targetId);

    /* Close all others */
    for (var i = 0; i < questions.length; i++) {
      if (questions[i] !== btn) {
        questions[i].setAttribute('aria-expanded', 'false');
        var otherId     = questions[i].getAttribute('aria-controls');
        var otherAnswer = document.getElementById(otherId);
        if (otherAnswer) otherAnswer.classList.remove('open');
      }
    }

    /* Toggle clicked */
    if (isExpanded) {
      btn.setAttribute('aria-expanded', 'false');
      if (answer) answer.classList.remove('open');
    } else {
      btn.setAttribute('aria-expanded', 'true');
      if (answer) answer.classList.add('open');
    }
  });
}());


/* ═══════════════════════════════════════════════════════════════════════════
   10. PRICE CALCULATOR WIZARD (IIFE) — 3-step progressive disclosure
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var wizardSteps = document.querySelectorAll('.wizard-step');
  if (!wizardSteps.length) return;

  var VRBOVEC   = [45.8833, 16.4167];
  var FREE_KM   = 20;
  var FUEL_RATE  = 0.5;

  var DISCOUNT_TIERS = [
    { min: 5, pct: 20 },
    { min: 3, pct: 15 },
    { min: 2, pct: 10 }
  ];

  var SERVICE_NAMES = {
    couch:    'Kauč',
    armchair: 'Fotelja',
    chair:    'Stolica',
    ottoman:  'Tabure',
    carpet:   'Tepih',
    mattress: 'Madrac',
    car:      'Auto'
  };

  /* State */
  var currentStep     = 1;
  var currentDistance  = null;
  var currentAddress  = null;
  var routeLine       = null;
  var selectedItems   = {};
  var activeServices  = {};

  /* DOM refs */
  var progressBar    = document.querySelector('.wizard-progress');
  var progressSegs   = document.querySelectorAll('.wizard-progress-segment');
  var nextBtn        = document.getElementById('wizard-next');
  var backBtn        = document.getElementById('wizard-back');
  var addressInput   = document.getElementById('calc-address');
  var searchBtn      = document.getElementById('calc-search');
  var sizesContainer = document.getElementById('calc-sizes');

  /* ---- Utilities ---- */

  function haversineDistance(lat1, lon1, lat2, lon2) {
    var R    = 6371;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a    = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
               Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
               Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function getFuelCharge(km) {
    if (km === null || km <= FREE_KM) return 0;
    var extraKm = Math.round(km) - FREE_KM;
    return Math.round(extraKm * FUEL_RATE * 100) / 100;
  }

  function getDiscount(serviceCount) {
    for (var i = 0; i < DISCOUNT_TIERS.length; i++) {
      if (serviceCount >= DISCOUNT_TIERS[i].min) return DISCOUNT_TIERS[i].pct;
    }
    return 0;
  }

  async function geocodeAddress(query) {
    var url = 'https://nominatim.openstreetmap.org/search?format=json&q=' +
              encodeURIComponent(query) + '&countrycodes=hr&limit=1';
    var res = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return null;
    var data = await res.json();
    if (!data.length) return null;
    return {
      lat:  parseFloat(data[0].lat),
      lon:  parseFloat(data[0].lon),
      name: data[0].display_name
    };
  }

  function showRouteOnMap(destLat, destLon) {
    var map = window._nfMap;
    if (!map) return;
    if (routeLine) {
      map.removeLayer(routeLine);
      routeLine = null;
    }
    routeLine = L.polyline(
      [[VRBOVEC[0], VRBOVEC[1]], [destLat, destLon]],
      { color: '#C8FF3E', weight: 3, opacity: 0.8, dashArray: '10 6' }
    ).addTo(map);
    map.fitBounds(routeLine.getBounds().pad(0.3));
  }

  /* ---- Wizard navigation ---- */

  function updateValidation() {
    if (currentStep === 1) {
      var hasItems = Object.keys(selectedItems).length > 0;
      nextBtn.disabled = !hasItems;
    } else if (currentStep === 2) {
      nextBtn.disabled = false;
    }
  }

  function goToStep(step) {
    if (step < 1 || step > 3) return;
    var direction = step > currentStep ? 'forward' : 'reverse';

    /* Hide current step */
    wizardSteps.forEach(function (el) {
      el.classList.remove('active', 'reverse');
    });

    /* Show target step */
    var targetStep = document.querySelector('.wizard-step[data-step="' + step + '"]');
    if (!targetStep) return;
    targetStep.classList.add('active');
    if (direction === 'reverse') targetStep.classList.add('reverse');

    /* Update progress bar */
    progressSegs.forEach(function (seg) {
      var segStep = parseInt(seg.dataset.step, 10);
      seg.classList.remove('active', 'completed');
      if (segStep < step) seg.classList.add('completed');
      if (segStep === step) seg.classList.add('active');
    });
    if (progressBar) {
      progressBar.setAttribute('aria-valuenow', step);
    }

    /* Update navigation buttons */
    backBtn.style.visibility = step === 1 ? 'hidden' : 'visible';

    if (step === 3) {
      nextBtn.style.display = 'none';
      calculateAndShow();
    } else {
      nextBtn.style.display = '';
      var labels = { 1: 'Idi na korak 2: Lokacija', 2: 'Idi na korak 3: Ponuda' };
      nextBtn.setAttribute('aria-label', labels[step] || '');
      nextBtn.textContent = 'Dalje →';
    }

    currentStep = step;
    updateValidation();

    /* Focus management */
    var focusTarget = targetStep.querySelector('input, button:not(:disabled), [tabindex="0"]');
    if (focusTarget) {
      setTimeout(function () { focusTarget.focus(); }, 320);
    }
  }

  /* ---- Next / Back listeners ---- */

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      if (this.disabled) return;
      goToStep(currentStep + 1);
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', function () {
      goToStep(currentStep - 1);
    });
  }

  /* ---- Discount tier highlighting ---- */

  function updateDiscountTiers(serviceCount) {
    var activePct = getDiscount(serviceCount);
    document.querySelectorAll('.calc-tier').forEach(function (el) {
      el.classList.remove('active');
    });
    if (activePct > 0) {
      document.querySelectorAll('.calc-tier').forEach(function (el) {
        var strong = el.querySelector('strong');
        if (strong && strong.textContent === '-' + activePct + '%') {
          el.classList.add('active');
        }
      });
    }
  }

  /* ---- Calculate and display ---- */

  function calculateAndShow() {
    var keys = Object.keys(selectedItems);
    var resultEl    = document.getElementById('calc-result');
    var itemsEl     = document.getElementById('calc-items');
    var discountEl  = document.getElementById('calc-discount');
    var totalEl     = document.getElementById('calc-total');
    var savingsEl   = document.getElementById('calc-savings');
    var breakdownEl = document.getElementById('calc-breakdown');
    var waLink      = document.getElementById('calc-wa-link');

    if (keys.length === 0) {
      totalEl.textContent = '—';
      itemsEl.innerHTML = '';
      if (resultEl) resultEl.classList.remove('visible');
      discountEl.innerHTML = '';
      savingsEl.textContent = '';
      breakdownEl.textContent = '';
      return;
    }

    var subtotal = 0;
    keys.forEach(function (key) {
      subtotal += selectedItems[key].price;
    });

    var serviceCount = keys.length;
    var discountPct  = getDiscount(serviceCount);
    var discountAmt  = Math.round(subtotal * discountPct / 100);
    var afterDiscount = subtotal - discountAmt;

    var fuel   = getFuelCharge(currentDistance);
    var total  = afterDiscount + fuel;
    var distKm = currentDistance !== null ? Math.round(currentDistance) : null;

    /* Items list */
    itemsEl.innerHTML = '';
    keys.forEach(function (key) {
      var line = document.createElement('div');
      line.className = 'calc-item-line';
      var nameSpan = document.createElement('span');
      nameSpan.textContent = SERVICE_NAMES[key] + ' (' + selectedItems[key].label + ')';
      var priceSpan = document.createElement('span');
      priceSpan.className = 'calc-item-price';
      priceSpan.textContent = selectedItems[key].price + '€';
      line.appendChild(nameSpan);
      line.appendChild(priceSpan);
      itemsEl.appendChild(line);
    });

    /* Discount badge */
    if (discountPct > 0) {
      discountEl.innerHTML = '<span class="calc-discount-badge">Popust -' + discountPct + '% (' + serviceCount + ' usluge)</span>';
      savingsEl.textContent = 'Ušteda: ' + discountAmt + '€!';
    } else {
      discountEl.innerHTML = '';
      savingsEl.textContent = serviceCount === 1 ? 'Dodaj još 1 uslugu za 10% popusta!' : '';
    }

    /* Animated total */
    animatePrice(totalEl, total);

    /* Breakdown */
    var breakdown = 'Medjuzbroj: ' + subtotal + '€';
    if (discountPct > 0) {
      breakdown += ' - Popust: ' + discountAmt + '€';
    }
    if (fuel > 0 && distKm !== null) {
      breakdown += ' + Gorivo: ' + fuel + '€ (' + (distKm - FREE_KM) + 'km x 0,50€/km)';
    } else if (distKm !== null) {
      breakdown += ' + Dolazak: besplatno';
    }
    if (distKm !== null) {
      breakdown += ' | Udaljenost: ' + distKm + ' km';
    }
    breakdownEl.textContent = breakdown;

    /* WhatsApp message */
    var addrText = currentAddress || '';
    var msg = 'Bok! Zanima me dubinsko ciscenje.\n\n';
    if (addrText) {
      msg += 'Lokacija: ' + addrText;
      if (distKm !== null) msg += ' (' + distKm + ' km od Vrbovca)';
      msg += '\n\n';
    }
    msg += 'Usluge:\n';
    keys.forEach(function (key) {
      msg += '- ' + SERVICE_NAMES[key] + ' (' + selectedItems[key].label + '): ' + selectedItems[key].price + '€\n';
    });
    msg += '\nProcjena:\n';
    msg += '- Medjuzbroj: ' + subtotal + '€\n';
    if (discountPct > 0) {
      msg += '- Popust -' + discountPct + '%: -' + discountAmt + '€\n';
    }
    if (fuel > 0) {
      msg += '- Gorivo: ' + fuel + '€\n';
    }
    msg += '- Ukupno: ~' + total + '€\n\n';
    msg += 'Mozete li mi dati tocnu ponudu?';

    if (waLink) {
      waLink.href = 'https://wa.me/385953765343?text=' + encodeURIComponent(msg);
    }

    /* Show result panel with animation */
    if (resultEl) resultEl.classList.add('visible');
  }

  /* ---- Animated price counter ---- */

  function animatePrice(el, target) {
    var duration = 600;
    var start = null;
    var from = 0;

    function tick(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var ease = 1 - Math.pow(1 - progress, 3); /* easeOutCubic */
      var val = Math.round(from + (target - from) * ease);
      el.textContent = '~' + val + '€';
      if (progress < 1) requestAnimationFrame(tick);
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = '~' + target + '€';
    } else {
      requestAnimationFrame(tick);
    }
  }

  /* ---- Address search ---- */

  if (searchBtn) {
    searchBtn.addEventListener('click', async function () {
      var distanceEl = document.getElementById('calc-distance');
      var query      = addressInput.value.trim();
      if (!query) {
        addressInput.focus();
        return;
      }

      this.textContent = 'Tražim...';
      this.disabled    = true;

      var result = await geocodeAddress(query);

      this.textContent = 'Pretraži';
      this.disabled    = false;

      if (!result) {
        distanceEl.className   = 'calc-distance-result visible error';
        distanceEl.textContent = 'Adresa nije pronađena. Pokušaj ponovo.';
        currentDistance = null;
        currentAddress  = null;
        return;
      }

      var dist   = haversineDistance(VRBOVEC[0], VRBOVEC[1], result.lat, result.lon);
      var distKm = Math.round(dist);
      var fuel   = getFuelCharge(dist);
      var city   = result.name.split(',')[0];

      currentDistance = dist;
      currentAddress  = city;
      showRouteOnMap(result.lat, result.lon);

      distanceEl.className = 'calc-distance-result visible success';
      if (fuel > 0) {
        distanceEl.textContent = city + ' — ' + distKm + ' km od Vrbovca. Gorivo: ' +
                                 fuel + '€ (' + (distKm - FREE_KM) + 'km x 0,50€/km)';
      } else {
        distanceEl.textContent = city + ' — ' + distKm + ' km od Vrbovca. Dolazak: Besplatno!';
      }
    });
  }

  if (addressInput) {
    addressInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (searchBtn) searchBtn.click();
      }
    });
  }

  /* ---- Service selection ---- */

  var serviceCards = document.querySelectorAll('.calc-service-card');

  serviceCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var service = this.dataset.service;
      var isActive = this.classList.contains('active');

      if (isActive) {
        this.classList.remove('active');
        this.setAttribute('aria-checked', 'false');
        delete activeServices[service];
        delete selectedItems[service];

        var group = document.getElementById('size-' + service);
        if (group) {
          group.classList.remove('visible');
          group.querySelectorAll('.calc-size-btn').forEach(function (b) {
            b.classList.remove('active');
            b.setAttribute('aria-checked', 'false');
          });
        }
      } else {
        this.classList.add('active');
        this.setAttribute('aria-checked', 'true');
        activeServices[service] = true;

        /* Pulse animation */
        this.classList.add('just-selected');
        var ref = this;
        setTimeout(function () { ref.classList.remove('just-selected'); }, 200);

        var group = document.getElementById('size-' + service);
        if (group) group.classList.add('visible');
      }

      /* Show/hide sizes container */
      var anyActive = Object.keys(activeServices).length > 0;
      if (sizesContainer) {
        if (anyActive) {
          sizesContainer.classList.add('visible');
        } else {
          sizesContainer.classList.remove('visible');
        }
      }

      updateDiscountTiers(Object.keys(selectedItems).length);
      updateValidation();
    });

    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  /* ---- Size selection ---- */

  document.querySelectorAll('.calc-size-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var parentGroup = this.closest('.calc-size-group');
      if (parentGroup) {
        parentGroup.querySelectorAll('.calc-size-btn').forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
      }

      this.classList.add('active');
      this.setAttribute('aria-checked', 'true');

      var service = parentGroup ? parentGroup.dataset.service : null;
      if (service) {
        selectedItems[service] = {
          price: parseFloat(this.dataset.price),
          label: this.textContent.trim()
        };
      }

      updateDiscountTiers(Object.keys(selectedItems).length);
      updateValidation();
    });
  });

  /* ---- Init ---- */
  updateValidation();
}());


/* ═══════════════════════════════════════════════════════════════════════════
   9. PROMO POPUP — Scroll-triggered, once per session
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  var overlay = document.getElementById('promo-overlay');
  var popup   = document.getElementById('promo-popup');
  var closeBtn = document.getElementById('promo-close');

  if (!overlay || !popup || !closeBtn) return;

  /* Skip if already dismissed this session */
  try {
    if (sessionStorage.getItem('nf-promo-dismissed')) return;
  } catch (e) { /* storage unavailable — show anyway */ }

  var shown = false;

  function showPopup() {
    if (shown) return;
    shown = true;
    overlay.classList.add('visible');
    popup.classList.add('visible');
    overlay.setAttribute('aria-hidden', 'false');
    popup.setAttribute('aria-hidden', 'false');
    closeBtn.focus();
  }

  function hidePopup() {
    overlay.classList.remove('visible');
    popup.classList.remove('visible');
    overlay.setAttribute('aria-hidden', 'true');
    popup.setAttribute('aria-hidden', 'true');
    try { sessionStorage.setItem('nf-promo-dismissed', '1'); } catch (e) {}
  }

  /* Trigger: user scrolls past 55% of the page */
  function onScroll() {
    var scrollY = window.scrollY || window.pageYOffset;
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 0 && (scrollY / maxScroll) > 0.55) {
      window.removeEventListener('scroll', onScroll);
      /* Small delay so it doesn't feel instant */
      setTimeout(showPopup, 800);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Close handlers */
  closeBtn.addEventListener('click', hidePopup);
  overlay.addEventListener('click', hidePopup);

  /* Escape key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && popup.classList.contains('visible')) {
      hidePopup();
    }
  });
}());
