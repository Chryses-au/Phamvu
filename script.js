document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     Scroll Reveal
     --------------------------------------------------------- */
  const sections = document.querySelectorAll('.section');
  const scrollEls = document.querySelectorAll('.scroll-reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

  scrollEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------
     Active Nav Link (scroll-snap aware)
     --------------------------------------------------------- */
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { threshold: 0.15, rootMargin: '-10% 0px -10% 0px' });

  sections.forEach(section => navObserver.observe(section));

  /* ---------------------------------------------------------
     Mobile Navigation
     --------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
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

      if (target) {
        const toggle = target.querySelector('.case-toggle');
        if (!target.classList.contains('open') && toggle) toggle.click();
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }

      navToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---------------------------------------------------------
     Navbar Background
     --------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.style.background = window.scrollY > 10
          ? 'rgba(255,255,255,.92)'
          : 'rgba(255,255,255,.82)';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

});
