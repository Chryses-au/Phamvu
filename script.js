/* ============================================================
   Bryant Phamvu — Portfolio Website
   Scroll-driven interactivity
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     Scroll Reveal — Sections + child elements
     --------------------------------------------------------- */
  const sections = document.querySelectorAll('.section');
  const scrollEls = document.querySelectorAll('.scroll-reveal');

  const revealOpts = { threshold: 0.06, rootMargin: '0px 0px -40px 0px' };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, revealOpts);

  sections.forEach(s => revealObserver.observe(s));
  scrollEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------
     Active Nav Link — Highlight based on scroll position
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
  }, { threshold: 0.25 });

  sections.forEach(section => navObserver.observe(section));

  /* ---------------------------------------------------------
     Mobile Navigation Toggle
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
     Portfolio Subsector Accordions
     --------------------------------------------------------- */
  document.querySelectorAll('.subsector-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const subsector = toggle.closest('.portfolio-subsector');
      const isOpen = subsector.classList.contains('open');

      document.querySelectorAll('.portfolio-subsector.open').forEach(open => {
        if (open !== subsector) {
          open.classList.remove('open');
          open.querySelector('.subsector-toggle').setAttribute('aria-expanded', 'false');
        }
      });

      subsector.classList.toggle('open', !isOpen);
      toggle.setAttribute('aria-expanded', !isOpen);

      if (!isOpen) {
        const gallery = subsector.querySelector('.image-gallery');
        if (gallery) initGallery(gallery);
      }
    });
  });

  /* ---------------------------------------------------------
     Resume Accordions
     --------------------------------------------------------- */
  document.querySelectorAll('.resume-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const entry = toggle.closest('.resume-entry');
      const isOpen = entry.classList.contains('open');
      entry.classList.toggle('open', !isOpen);
      toggle.setAttribute('aria-expanded', !isOpen);
    });
  });

  /* ---------------------------------------------------------
     Image Gallery Navigation
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
     Process Phase Interaction
     --------------------------------------------------------- */
  document.querySelectorAll('.process-phase').forEach(phase => {
    phase.addEventListener('click', () => {
      if (window.innerWidth <= 768) return;
      document.querySelectorAll('.process-phase').forEach(p => {
        p.classList.toggle('active', p === phase);
      });
    });
  });

  /* ---------------------------------------------------------
     Smooth Scroll for Subsector Links
     --------------------------------------------------------- */
  document.querySelectorAll('[data-subsector]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const subsectorId = link.dataset.subsector;
      const subsector = document.getElementById(subsectorId);

      if (subsector) {
        const toggle = subsector.querySelector('.subsector-toggle');
        if (!subsector.classList.contains('open') && toggle) {
          toggle.click();
        }
        setTimeout(() => {
          subsector.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }

      navToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---------------------------------------------------------
     Navbar Background on Scroll
     --------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.style.background = window.scrollY > 10
          ? 'rgba(255, 255, 255, 0.92)'
          : 'rgba(255, 255, 255, 0.82)';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

});
