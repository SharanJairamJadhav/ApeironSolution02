/* ===================================
   APEIRON SOLUTIONS - MAIN JS
=================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. NAVIGATION & SCROLL ---
  const header = document.getElementById('header');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');
  const progressBar = document.getElementById('scroll-progress');
  let lastScroll = 0;

  // Scroll Events (Throttled via requestAnimationFrame)
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset;

        // Sticky Header hide/show logic
        if (currentScroll > lastScroll && currentScroll > 100) {
          header.classList.add('scroll-down');
        } else {
          header.classList.remove('scroll-down');
        }
        lastScroll = currentScroll;

        // Scroll Progress
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        progressBar.style.width = (winScroll / height) * 100 + "%";

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Mobile Menu Toggle
  function toggleMenu() {
    const isOpen = mainNav.classList.contains('is-open');
    mainNav.classList.toggle('is-open');
    mobileBtn.classList.toggle('is-active');
    mobileBtn.setAttribute('aria-expanded', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden'; // Lock scroll
  }

  mobileBtn.addEventListener('click', toggleMenu);

  // Close menu on link click or ESC
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (mainNav.classList.contains('is-open')) toggleMenu();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
      toggleMenu();
    }
  });

  // --- 2. SCROLL ANIMATIONS (Intersection Observer) ---
  // Respects prefers-reduced-motion CSS, but we can also check in JS
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-up, .reveal-fade').forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    // Apply instantly if reduced motion
    document.querySelectorAll('.reveal-up, .reveal-fade').forEach(el => {
      el.classList.add('is-revealed');
    });
  }

  // --- 3. MODAL SYSTEM ---
  const modal = document.getElementById('global-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const closeBtns = document.querySelectorAll('.modal-close, .modal-action-close');
  let previouslyFocusedElement;

  function openModal(title, desc) {
    previouslyFocusedElement = document.activeElement;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modal.showModal();
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.close();
    document.body.style.overflow = '';
    if (previouslyFocusedElement) previouslyFocusedElement.focus();
  }

  // Attach to service cards
  document.querySelectorAll('[data-modal="service-modal"]').forEach(card => {
    card.addEventListener('click', () => {
      openModal(card.dataset.title, card.dataset.desc);
    });
    // Keyboard support
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.dataset.title, card.dataset.desc);
      }
    });
  });

  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(); // click outside
  });

  // --- 4. FORM VALIDATION & SUBMISSION ---
  const form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      // Basic reset
      form.querySelectorAll('.form-group').forEach(grp => {
        grp.classList.remove('error');
        const msg = grp.querySelector('.error-msg');
        if (msg) msg.textContent = '';
      });

      // Validate fields
      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          const group = field.closest('.form-group');
          group.classList.add('error');
          group.querySelector('.error-msg').textContent = 'This field is required.';
        } else if (field.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value)) {
            isValid = false;
            const group = field.closest('.form-group');
            group.classList.add('error');
            group.querySelector('.error-msg').textContent = 'Please enter a valid email address.';
          }
        }
      });

      if (isValid) {
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        // Simulate API call (Replace this with actual fetch POST logic)
        setTimeout(() => {
          form.reset();
          btn.textContent = originalText;
          btn.disabled = false;
          document.getElementById('form-success').classList.remove('hidden');

          // Hide success message after 5 seconds
          setTimeout(() => {
            document.getElementById('form-success').classList.add('hidden');
          }, 5000);
        }, 1500);
      }
    });
  }
});