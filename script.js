const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const navToggle = qs('.nav-toggle');
const navLinks = qs('.nav-links');
const scrollTopButton = qs('.scroll-top');
const yearEl = qs('#year');

const closeMobileNav = () => {
  if (!navLinks || !navToggle) return;
  navLinks.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
};

const initNavigation = () => {
  if (!navToggle || !navLinks) return;

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  qsa('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 980) {
        closeMobileNav();
      }
    });
  });
};

const initSmoothScroll = () => {
  const scrollLinks = qsa('a[href^="#"], [data-scroll]');

  scrollLinks.forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href') || link.dataset.scroll;
      if (!href || href === '#') return;
      const targetEl = qs(href);
      if (!targetEl) return;
      event.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
};

const initScrollTop = () => {
  if (!scrollTopButton) return;

  scrollTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const toggleButtonVisibility = () => {
    if (window.scrollY > 300) {
      scrollTopButton.classList.add('is-visible');
    } else {
      scrollTopButton.classList.remove('is-visible');
    }
  };

  toggleButtonVisibility();
  window.addEventListener('scroll', toggleButtonVisibility, { passive: true });
};

const initCounters = () => {
  const counters = qsa('[data-counter]');
  if (!counters.length || typeof gsap === 'undefined') return;

  const animateCounter = el => {
    const target = Number(el.dataset.counterTarget || 0);
    const counterState = { value: 0 };

    gsap.to(counterState, {
      value: target,
      duration: 2,
      ease: 'power3.out',
      onUpdate: () => {
        el.textContent = Math.round(counterState.value).toLocaleString('da-DK');
      }
    });
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(counter => observer.observe(counter));
};

const initFAQ = () => {
  const faqItems = qsa('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const button = qs('.faq-question', item);
    const answer = qs('.faq-answer', item);
    if (!button || !answer) return;

    button.addEventListener('click', () => {
      const isOpen = item.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(isOpen));
    });
  });
};

const initAOS = () => {
  if (typeof AOS === 'undefined') return;
  AOS.init({
    duration: 800,
    offset: 120,
    easing: 'ease-out-quart',
    once: false
  });
};

const initVanillaTilt = () => {
  if (typeof VanillaTilt === 'undefined') return;
  VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
    max: 14,
    speed: 400,
    glare: true,
    'max-glare': 0.25,
    perspective: 900
  });
};

const initParallax = () => {
  const parallaxElements = qsa('[data-parallax]');
  if (!parallaxElements.length) return;

  const handleParallax = () => {
    const scrollY = window.scrollY;
    parallaxElements.forEach((el, index) => {
      const depth = (index + 1) * 20;
      const translateY = (scrollY * depth) / 1200;
      el.style.transform = `translate3d(0, ${translateY}px, 0)`;
    });
  };

  handleParallax();
  window.addEventListener('scroll', handleParallax, { passive: true });
};

const initHeroOrbs = () => {
  if (typeof gsap === 'undefined') return;
  const orbs = qsa('.hero__orb');
  orbs.forEach((orb, index) => {
    gsap.to(orb, {
      x: () => (index % 2 === 0 ? 40 : -40),
      y: () => (index % 2 === 0 ? -30 : 30),
      duration: 12,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });
  });
};

const initYear = () => {
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
};

const initKonami = () => {
  const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let currentIndex = 0;

  const launchConfetti = () => {
    if (typeof confetti === 'undefined') return;
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 80, zIndex: 9999 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  window.addEventListener('keydown', event => {
    const key = event.key;
    if (key === sequence[currentIndex]) {
      currentIndex += 1;
      if (currentIndex === sequence.length) {
        launchConfetti();
        currentIndex = 0;
      }
    } else {
      currentIndex = key === sequence[0] ? 1 : 0;
    }
  });
};

const init = () => {
  initNavigation();
  initSmoothScroll();
  initScrollTop();
  initCounters();
  initFAQ();
  initAOS();
  initVanillaTilt();
  initParallax();
  initHeroOrbs();
  initYear();
  initKonami();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
