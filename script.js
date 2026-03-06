document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     Chapter Controller
     --------------------------------------------------------- */
  const chapters = Array.from(document.querySelectorAll('.section'));
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const navbar = document.getElementById('navbar');
  let currentIndex = 0;
  let isTransitioning = false;
  const TRANSITION_MS = 420;

  function updateNav(index) {
    const id = chapters[index].id;
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === id);
    });
  }

  function triggerReveals(section) {
    section.querySelectorAll('.scroll-reveal').forEach(el => {
      el.classList.add('visible');
    });
  }

  function goToChapter(index) {
    if (index < 0 || index >= chapters.length) return;
    if (index === currentIndex || isTransitioning) return;

    isTransitioning = true;
    const prev = chapters[currentIndex];
    const next = chapters[index];
    const goingForward = index > currentIndex;

    prev.classList.remove('active');
    if (goingForward) {
      next.scrollTop = 0;
    } else {
      next.scrollTop = next.scrollHeight - next.clientHeight;
    }
    next.classList.add('active');
    currentIndex = index;
    updateNav(index);
    triggerReveals(next);

    setTimeout(() => { isTransitioning = false; wheelAccum = 0; }, TRANSITION_MS + 300);
  }

  chapters[0].classList.add('active');
  updateNav(0);
  triggerReveals(chapters[0]);

  /* ---------------------------------------------------------
     Scroll-Reveal Observer (inner elements)
     --------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    revealObserver.observe(el);
  });

  /* ---------------------------------------------------------
     Wheel → Chapter Transition
     --------------------------------------------------------- */
  const BOUNDARY_TOL = 3;

  function isAtBottom(el) {
    return el.scrollHeight - el.clientHeight - el.scrollTop < BOUNDARY_TOL;
  }
  function isAtTop(el) {
    return el.scrollTop < BOUNDARY_TOL;
  }
  function isNonScrollable(el) {
    if (getComputedStyle(el).overflowY === 'hidden') return true;
    return el.scrollHeight <= el.clientHeight + BOUNDARY_TOL;
  }

  let wheelAccum = 0;
  let lastWheelTime = 0;
  const WHEEL_TRIGGER = 80;

  document.addEventListener('wheel', (e) => {
    if (isTransitioning) { e.preventDefault(); return; }

    const now = Date.now();
    if (now - lastWheelTime > 250) wheelAccum = 0;
    lastWheelTime = now;

    const active = chapters[currentIndex];
    const nonScrollable = isNonScrollable(active);
    const atBottom = nonScrollable || isAtBottom(active);
    const atTop = nonScrollable || isAtTop(active);

    if (e.deltaY > 0 && atBottom) {
      e.preventDefault();
      wheelAccum += e.deltaY;
      if (wheelAccum >= WHEEL_TRIGGER) {
        goToChapter(currentIndex + 1);
        wheelAccum = 0;
      }
    } else if (e.deltaY < 0 && atTop) {
      e.preventDefault();
      wheelAccum += e.deltaY;
      if (wheelAccum <= -WHEEL_TRIGGER) {
        goToChapter(currentIndex - 1);
        wheelAccum = 0;
      }
    } else {
      wheelAccum = 0;
    }
  }, { passive: false });

  /* ---------------------------------------------------------
     Touch → Chapter Transition
     --------------------------------------------------------- */
  let touchStartY = 0;
  const SWIPE_THRESHOLD = 50;

  document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (isTransitioning) return;
    const deltaY = touchStartY - e.changedTouches[0].clientY;
    const active = chapters[currentIndex];
    const nonScrollable = isNonScrollable(active);
    const atBottom = nonScrollable || isAtBottom(active);
    const atTop = nonScrollable || isAtTop(active);

    if (deltaY > SWIPE_THRESHOLD && atBottom) {
      goToChapter(currentIndex + 1);
    } else if (deltaY < -SWIPE_THRESHOLD && atTop) {
      goToChapter(currentIndex - 1);
    }
  }, { passive: true });

  /* ---------------------------------------------------------
     Keyboard → Chapter Transition
     --------------------------------------------------------- */
  document.addEventListener('keydown', (e) => {
    if (isTransitioning) return;
    const active = chapters[currentIndex];
    const nonScrollable = isNonScrollable(active);
    const atBottom = nonScrollable || isAtBottom(active);
    const atTop = nonScrollable || isAtTop(active);

    if ((e.key === 'ArrowDown' || e.key === 'PageDown') && atBottom) {
      e.preventDefault();
      goToChapter(currentIndex + 1);
    } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && atTop) {
      e.preventDefault();
      goToChapter(currentIndex - 1);
    }
  });

  /* ---------------------------------------------------------
     Nav Click → Chapter
     --------------------------------------------------------- */
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.dataset.section;
      const idx = chapters.findIndex(ch => ch.id === targetId);
      if (idx !== -1) goToChapter(idx);
    });
  });

  /* ---------------------------------------------------------
     Mobile Navigation
     --------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  mobileMenu.querySelectorAll('a[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.dataset.section;
      const idx = chapters.findIndex(ch => ch.id === targetId);
      if (idx !== -1) goToChapter(idx);
      navToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  /* ---------------------------------------------------------
     Case Study Accordions
     --------------------------------------------------------- */
  document.querySelectorAll('.case-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const study = toggle.closest('.case-study');
      const isOpen = study.classList.contains('open');

      document.querySelectorAll('.case-study.open').forEach(open => {
        if (open !== study) {
          open.classList.remove('open');
          open.querySelector('.case-toggle').setAttribute('aria-expanded', 'false');
        }
      });

      study.classList.toggle('open', !isOpen);
      toggle.setAttribute('aria-expanded', !isOpen);

      if (!isOpen) {
        const gallery = study.querySelector('[data-gallery]');
        if (gallery) initGallery(gallery);
      }
    });
  });

  /* ---------------------------------------------------------
     Tech Detail Toggles
     --------------------------------------------------------- */
  document.querySelectorAll('.tech-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const detail = toggle.closest('.tech-detail');
      detail.classList.toggle('open');
    });
  });

  /* ---------------------------------------------------------
     Experience Accordions
     --------------------------------------------------------- */
  document.querySelectorAll('.exp-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const entry = toggle.closest('.exp-entry');
      const isOpen = entry.classList.contains('open');
      entry.classList.toggle('open', !isOpen);
      toggle.setAttribute('aria-expanded', !isOpen);
    });
  });

  /* ---------------------------------------------------------
     Image Gallery
     --------------------------------------------------------- */
  function initGallery(gallery) {
    const slides = gallery.querySelectorAll('.gallery-slide');
    if (slides.length <= 1) return;

    const prevBtn = gallery.querySelector('.gallery-prev');
    const nextBtn = gallery.querySelector('.gallery-next');
    const counter = gallery.querySelector('.gallery-counter');
    let current = 0;

    slides.forEach((s, i) => s.classList.toggle('active', i === 0));
    updateCounter();

    function goTo(index) {
      slides[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      updateCounter();
    }

    function updateCounter() {
      if (counter) counter.textContent = `${current + 1} / ${slides.length}`;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
  }

  /* ---------------------------------------------------------
     Subsector Deep Links
     --------------------------------------------------------- */
  document.querySelectorAll('[data-subsector]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.dataset.subsector;
      const target = document.getElementById(id);

      const portfolioIdx = chapters.findIndex(ch => ch.id === 'portfolio');
      if (portfolioIdx !== -1) goToChapter(portfolioIdx);

      if (target) {
        setTimeout(() => {
          const toggle = target.querySelector('.case-toggle');
          if (!target.classList.contains('open') && toggle) toggle.click();
          setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }, TRANSITION_MS);
      }

      navToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  /* ---------------------------------------------------------
     Navbar Background (tracks active section scroll)
     --------------------------------------------------------- */
  let ticking = false;

  chapters.forEach(section => {
    section.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          navbar.style.background = section.scrollTop > 10
            ? 'rgba(255,255,255,.92)'
            : 'rgba(255,255,255,.82)';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  });

});
