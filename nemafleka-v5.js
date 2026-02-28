'use strict';

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
  var rect     = widget.getBoundingClientRect();

  var slides = {
    couch:    { before: 'images/IMG_0388 (1).jpg', after: 'images/IMG_0396.jpg' },
    mattress: { before: 'images/IMG_0028.jpg',     after: 'images/IMG_0017.jpg' }
  };

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function applyPct() {
    rect = widget.getBoundingClientRect();
    var px = (pct / 100) * rect.width;
    afterEl.style.clipPath    = 'inset(0 ' + (rect.width - px) + 'px 0 0)';
    divider.style.transform   = 'translateX(' + px + 'px)';
    handle.setAttribute('aria-valuenow', Math.round(pct));
  }

  function updateFromClientX(clientX) {
    if (rafId) return;
    rafId = requestAnimationFrame(function () {
      rafId = null;
      rect = widget.getBoundingClientRect();
      var p = ((clientX - rect.left) / rect.width) * 100;
      pct = clamp(p, 3, 97);
      applyPct();
    });
  }

  /* -- Mouse -- */
  widget.addEventListener('mousedown', function (e) {
    e.preventDefault();
    dragging = true;
    updateFromClientX(e.clientX);
  });

  window.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  });

  window.addEventListener('mouseup', function () {
    dragging = false;
  });

  /* -- Touch -- */
  widget.addEventListener('touchstart', function (e) {
    dragging = true;
    rect = widget.getBoundingClientRect();
    updateFromClientX(e.touches[0].clientX);
  }, { passive: true });

  widget.addEventListener('touchmove', function (e) {
    if (!dragging) return;
    e.preventDefault();
    updateFromClientX(e.touches[0].clientX);
  }, { passive: false });

  window.addEventListener('touchend', function () {
    dragging = false;
  }, { passive: true });

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

  /* -- Resize -- */
  window.addEventListener('resize', function () {
    rect = widget.getBoundingClientRect();
    applyPct();
  }, { passive: true });

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
        applyPct();

        widget.style.opacity = '1';
      }, 200);
    });
  });

  /* Initial render */
  applyPct();
}());


/* ═══════════════════════════════════════════════════════════════════════════
   2. COVERAGE MAP (IIFE)
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  var mapEl = document.getElementById('coverage-map');
  if (!mapEl || typeof L === 'undefined') return;

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

  /* City markers */
  var cities = [
    { name: 'Zagreb',            lat: 45.8150, lng: 15.9819, dist: '~30 km' },
    { name: 'Bjelovar',          lat: 45.8986, lng: 16.8425, dist: '~34 km' },
    { name: 'Velika Gorica',     lat: 45.7133, lng: 16.0756, dist: '~30 km' },
    { name: 'Zlatar',            lat: 46.0483, lng: 15.9858, dist: '~25 km' },
    { name: 'Sv. Ivan \u017dabno',    lat: 46.0025, lng: 16.5422, dist: '~15 km' },
    { name: 'Sesvete',           lat: 45.8272, lng: 16.1117, dist: '~20 km' },
    { name: 'Kri\u017e',         lat: 45.6667, lng: 16.5500, dist: '~25 km' },
    { name: 'Lonja',             lat: 45.6833, lng: 16.6833, dist: '~30 km' },
    { name: 'Glogovnica',        lat: 46.0000, lng: 16.5333, dist: '~14 km' },
    { name: '\u010cazma',         lat: 45.7500, lng: 16.6167, dist: '~20 km' },
    { name: 'Ivani\u0107-Grad',   lat: 45.7083, lng: 16.3917, dist: '~20 km' },
    { name: 'Klo\u0161tar Ivani\u0107', lat: 45.7333, lng: 16.4167, dist: '~17 km' },
    { name: 'Kri\u017eevci',     lat: 46.0244, lng: 16.5467, dist: '~16 km' },
    { name: 'Dugo Selo',         lat: 45.8047, lng: 16.2364, dist: '~15 km' },
    { name: 'Sv. Ivan Zelina',   lat: 45.9583, lng: 16.2478, dist: '~12 km' },
    { name: 'Farka\u0161evac',    lat: 45.8333, lng: 16.5500, dist: '~10 km' },
    { name: 'Preseka',           lat: 45.9167, lng: 16.4833, dist: '~5 km' },
    { name: 'Rugvica',           lat: 45.7500, lng: 16.2167, dist: '~20 km' },
    { name: 'Gradec',            lat: 45.9333, lng: 16.4333, dist: '~6 km' },
    { name: 'Popovec',           lat: 45.8833, lng: 16.1333, dist: '~18 km' }
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
}());


/* ═══════════════════════════════════════════════════════════════════════════
   3. SCROLL PROGRESS BAR + NAV STATE + BACK TO TOP (combined scroll)
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  var progressBar = document.getElementById('scroll-progress');
  var nav         = document.querySelector('nav.main-nav');
  var backTop     = document.getElementById('back-top');

  window.addEventListener('scroll', function () {
    var scrollY      = window.scrollY || window.pageYOffset;
    var scrollHeight = document.documentElement.scrollHeight;
    var innerHeight  = window.innerHeight;
    var maxScroll    = scrollHeight - innerHeight;

    /* Progress bar */
    if (progressBar && maxScroll > 0) {
      var pct = (scrollY / maxScroll) * 100;
      progressBar.style.width = pct + '%';
      progressBar.setAttribute('aria-valuenow', Math.round(pct));
    }

    /* Nav scrolled state */
    if (nav) {
      if (scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }

    /* Back to top visibility */
    if (backTop) {
      if (scrollY > 600) {
        backTop.classList.add('visible');
      } else {
        backTop.classList.remove('visible');
      }
    }
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

  /* Focus trap for a11y — keeps Tab cycling inside the panel */
  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    var focusable = mobileMenu.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])');
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

    /* Move focus into the panel */
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
    var isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  /* Close on overlay click */
  if (overlay) {
    overlay.addEventListener('click', function () {
      closeMenu();
      hamburger.focus();
    });
  }

  /* Close on link click */
  var menuLinks = mobileMenu.querySelectorAll('a');
  menuLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu();
    });
  });

  /* Escape key */
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

  function hcGoTo(n) {
    current = ((n % TOTAL) + TOTAL) % TOTAL;

    /* Move track — each slide is 100% of container width,
       so translateX(-100%) moves exactly one slide */
    track.style.transform = 'translateX(-' + (current * 100) + '%)';

    /* Update dots */
    dots.forEach(function (dot, i) {
      if (i === current) {
        dot.classList.add('active');
        dot.setAttribute('aria-selected', 'true');
      } else {
        dot.classList.remove('active');
        dot.setAttribute('aria-selected', 'false');
      }
    });

    /* Update active class on slides for subtle zoom effect */
    slides.forEach(function (slide, i) {
      if (i === current) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    /* Update counter */
    if (counterEl) {
      counterEl.textContent = (current + 1) + ' / ' + TOTAL;
    }

    /* Reset progress */
    startTime = null;
    progressFill.style.width = '0%';
  }

  function hcStartProgress() {
    function tick(now) {
      if (hcPaused) {
        startTime = null;
        progressId = requestAnimationFrame(tick);
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

    progressId = requestAnimationFrame(tick);
  }

  /* Controls */
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      hcGoTo(current - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      hcGoTo(current + 1);
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      hcGoTo(i);
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
      startTime = null;
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
        if (diff > 0) {
          hcGoTo(current + 1);
        } else {
          hcGoTo(current - 1);
        }
      }
    }, { passive: true });
  }

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
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px'
  });

  reveals.forEach(function (el) {
    observer.observe(el);
  });
}());


/* ═══════════════════════════════════════════════════════════════════════════
   7. COUNTER ANIMATIONS (IntersectionObserver)
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  var counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el, target, duration) {
    var startTs = null;

    function step(now) {
      if (!startTs) startTs = now;
      var elapsed  = now - startTs;
      var progress = Math.min(elapsed / duration, 1);
      var eased    = easeOutCubic(progress);
      var value    = Math.round(eased * target);

      el.textContent = value.toLocaleString('hr');

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('hr');
      }
    }

    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el     = entry.target;
        var target = parseInt(el.getAttribute('data-target'), 10);
        if (!isNaN(target)) {
          animateCounter(el, target, 1800);
        }
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.5
  });

  counters.forEach(function (el) {
    observer.observe(el);
  });
}());


/* ═══════════════════════════════════════════════════════════════════════════
   8. TIMELINE LINE ANIMATION (IntersectionObserver)
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  var timeline     = document.getElementById('timeline');
  var timelineLine = document.getElementById('timeline-line');

  if (!timeline || !timelineLine) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        timelineLine.classList.add('animated');
        observer.disconnect();
      }
    });
  }, {
    threshold: 0.4
  });

  observer.observe(timeline);
}());


/* ═══════════════════════════════════════════════════════════════════════════
   9. FAQ ACCORDION
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  var questions = document.querySelectorAll('.faq-question');
  if (!questions.length) return;

  questions.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var isExpanded = this.getAttribute('aria-expanded') === 'true';
      var targetId   = this.getAttribute('aria-controls');
      var answer     = document.getElementById(targetId);

      /* Close all others */
      questions.forEach(function (otherBtn) {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          var otherId     = otherBtn.getAttribute('aria-controls');
          var otherAnswer = document.getElementById(otherId);
          if (otherAnswer) otherAnswer.classList.remove('open');
        }
      });

      /* Toggle clicked */
      if (isExpanded) {
        this.setAttribute('aria-expanded', 'false');
        if (answer) answer.classList.remove('open');
      } else {
        this.setAttribute('aria-expanded', 'true');
        if (answer) answer.classList.add('open');
      }
    });
  });
}());


/* ═══════════════════════════════════════════════════════════════════════════
   10. PRICE CALCULATOR (IIFE) — Multi-select with discount tiers
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  var addressInput = document.getElementById('calc-address');
  if (!addressInput) return;

  var VRBOVEC  = [45.8833, 16.4167];
  var FREE_KM  = 20;
  var FUEL_RATE = 0.5;

  /* Discount tiers: [minServices, discountPercent] */
  var DISCOUNT_TIERS = [
    { min: 5, pct: 20 },
    { min: 3, pct: 15 },
    { min: 2, pct: 10 }
  ];

  /* Display names for services */
  var SERVICE_NAMES = {
    couch:    'Kau\u010d',
    armchair: 'Fotelja',
    chair:    'Stolica',
    ottoman:  'Tabure',
    carpet:   'Tepih',
    mattress: 'Madrac',
    car:      'Auto'
  };

  /* State */
  var currentDistance = null;
  var currentAddress  = null;
  var routeLine       = null;
  /* selectedItems: { serviceKey: { price: N, label: 'text' } } */
  var selectedItems   = {};
  var activeServices  = {};  /* tracks which services are toggled on */

  /* --- Utilities --- */

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

  /* --- Discount tier highlighting --- */

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

  /* --- Calculate and display --- */

  function calculateAndShow() {
    var keys = Object.keys(selectedItems);
    if (keys.length === 0) {
      var resultEl = document.getElementById('calc-result');
      if (resultEl) resultEl.classList.remove('visible');
      return;
    }

    var resultEl    = document.getElementById('calc-result');
    var itemsEl     = document.getElementById('calc-items');
    var discountEl  = document.getElementById('calc-discount');
    var totalEl     = document.getElementById('calc-total');
    var savingsEl   = document.getElementById('calc-savings');
    var breakdownEl = document.getElementById('calc-breakdown');
    var waLink      = document.getElementById('calc-wa-link');

    /* Sum up all item prices */
    var subtotal = 0;
    keys.forEach(function (key) {
      subtotal += selectedItems[key].price;
    });

    /* Discount based on number of distinct services */
    var serviceCount = keys.length;
    var discountPct  = getDiscount(serviceCount);
    var discountAmt  = Math.round(subtotal * discountPct / 100);
    var afterDiscount = subtotal - discountAmt;

    /* Fuel charge */
    var fuel   = getFuelCharge(currentDistance);
    var total  = afterDiscount + fuel;
    var distKm = currentDistance !== null ? Math.round(currentDistance) : null;

    /* Build items list */
    itemsEl.innerHTML = '';
    keys.forEach(function (key) {
      var line = document.createElement('div');
      line.className = 'calc-item-line';
      var nameSpan = document.createElement('span');
      nameSpan.textContent = SERVICE_NAMES[key] + ' (' + selectedItems[key].label + ')';
      var priceSpan = document.createElement('span');
      priceSpan.className = 'calc-item-price';
      priceSpan.textContent = selectedItems[key].price + '\u20ac';
      line.appendChild(nameSpan);
      line.appendChild(priceSpan);
      itemsEl.appendChild(line);
    });

    /* Discount badge */
    if (discountPct > 0) {
      discountEl.innerHTML = '<span class="calc-discount-badge">Popust -' + discountPct + '% (' + serviceCount + ' usluge)</span>';
      savingsEl.textContent = 'U\u0161teda: ' + discountAmt + '\u20ac!';
    } else {
      discountEl.innerHTML = '';
      if (serviceCount === 1) {
        savingsEl.textContent = 'Dodaj jo\u0161 1 uslugu za 10% popusta!';
      } else {
        savingsEl.textContent = '';
      }
    }

    /* Total */
    totalEl.textContent = '~' + total + '\u20ac';

    /* Breakdown */
    var breakdown = 'Me\u0111uzbroj: ' + subtotal + '\u20ac';
    if (discountPct > 0) {
      breakdown += ' - Popust: ' + discountAmt + '\u20ac';
    }
    if (fuel > 0 && distKm !== null) {
      breakdown += ' + Gorivo: ' + fuel + '\u20ac (' + (distKm - FREE_KM) + 'km x 0,50\u20ac/km)';
    } else if (distKm !== null) {
      breakdown += ' + Dolazak: besplatno';
    }
    if (distKm !== null) {
      breakdown += ' | Udaljenost: ' + distKm + ' km';
    }
    breakdownEl.textContent = breakdown;

    resultEl.classList.add('visible');

    /* Build WhatsApp message — plain text, no emoji */
    var addrText = currentAddress || '';
    var msg = 'Bok! Zanima me dubinsko ciscenje.\n\n';
    if (addrText) {
      msg += 'Lokacija: ' + addrText;
      if (distKm !== null) msg += ' (' + distKm + ' km od Vrbovca)';
      msg += '\n\n';
    }
    msg += 'Usluge:\n';
    keys.forEach(function (key) {
      msg += '- ' + SERVICE_NAMES[key] + ' (' + selectedItems[key].label + '): ' + selectedItems[key].price + '\u20ac\n';
    });
    msg += '\nProcjena:\n';
    msg += '- Medjuzbroj: ' + subtotal + '\u20ac\n';
    if (discountPct > 0) {
      msg += '- Popust -' + discountPct + '%: -' + discountAmt + '\u20ac\n';
    }
    if (fuel > 0) {
      msg += '- Gorivo: ' + fuel + '\u20ac\n';
    }
    msg += '- Ukupno: ~' + total + '\u20ac\n\n';
    msg += 'Mozete li mi dati tocnu ponudu?';

    if (waLink) {
      waLink.href = 'https://wa.me/385953765343?text=' + encodeURIComponent(msg);
    }
  }

  /* --- Address search --- */

  var searchBtn = document.getElementById('calc-search');
  if (searchBtn) {
    searchBtn.addEventListener('click', async function () {
      var distanceEl = document.getElementById('calc-distance');
      var query      = addressInput.value.trim();
      if (!query) {
        addressInput.focus();
        return;
      }

      this.textContent = 'Tra\u017eim...';
      this.disabled    = true;

      var result = await geocodeAddress(query);

      this.textContent = 'Pretra\u017ei';
      this.disabled    = false;

      if (!result) {
        distanceEl.className   = 'calc-distance-result visible error';
        distanceEl.textContent = 'Adresa nije prona\u0111ena. Poku\u0161aj ponovo.';
        currentDistance = null;
        currentAddress  = null;
        calculateAndShow();
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
        distanceEl.textContent = city + ' \u2014 ' + distKm + ' km od Vrbovca. Gorivo: ' +
                                 fuel + '\u20ac (' + (distKm - FREE_KM) + 'km x 0,50\u20ac/km)';
      } else {
        distanceEl.textContent = city + ' \u2014 ' + distKm + ' km od Vrbovca. Dolazak: Besplatno!';
      }

      calculateAndShow();
    });
  }

  /* Enter key on address input */
  addressInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      var btn = document.getElementById('calc-search');
      if (btn) btn.click();
    }
  });

  /* --- Service selection (multi-select toggle) --- */

  var serviceCards = document.querySelectorAll('.calc-service-card');
  var sizesContainer = document.getElementById('calc-sizes');

  serviceCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var service = this.dataset.service;
      var isActive = this.classList.contains('active');

      if (isActive) {
        /* Deselect: toggle off */
        this.classList.remove('active');
        this.setAttribute('aria-checked', 'false');
        delete activeServices[service];
        delete selectedItems[service];

        /* Hide this service's size group */
        var group = document.getElementById('size-' + service);
        if (group) {
          group.classList.remove('visible');
          group.querySelectorAll('.calc-size-btn').forEach(function (b) {
            b.classList.remove('active');
          });
        }
      } else {
        /* Select: toggle on */
        this.classList.add('active');
        this.setAttribute('aria-checked', 'true');
        activeServices[service] = true;

        /* Show this service's size group */
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

      /* Update discount tier highlighting */
      updateDiscountTiers(Object.keys(selectedItems).length);

      calculateAndShow();
    });

    /* Keyboard support */
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  /* --- Size/detail selection --- */

  document.querySelectorAll('.calc-size-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      /* Deselect siblings in same group */
      var parentGroup = this.closest('.calc-size-group');
      if (parentGroup) {
        parentGroup.querySelectorAll('.calc-size-btn').forEach(function (b) {
          b.classList.remove('active');
        });
      }

      this.classList.add('active');

      /* Get service key from parent group */
      var service = parentGroup ? parentGroup.dataset.service : null;
      if (service) {
        selectedItems[service] = {
          price: parseFloat(this.dataset.price),
          label: this.textContent.trim()
        };
      }

      /* Update discount tier highlighting */
      updateDiscountTiers(Object.keys(selectedItems).length);

      calculateAndShow();
    });
  });
}());
