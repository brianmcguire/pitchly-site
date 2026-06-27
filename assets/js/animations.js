// Pitchly AI — site animations
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Scroll reveal via IntersectionObserver ----------
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
      );
      revealEls.forEach((el) => io.observe(el));
    }
  }

  if (reduceMotion) return;

  // ---------- Mouse-tracked spotlight on feature cards ----------
  document.querySelectorAll('.feature').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });

  // ---------- Subtle parallax on hero phone screens ----------
  const screens = document.querySelector('.hero-screens');
  if (screens) {
    let ticking = false;
    const imgs = screens.querySelectorAll('img');
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const y = window.scrollY;
            imgs.forEach((img, i) => {
              const speed = (i - 1) * 0.04 + 0.08; // -0.04 / 0.08 / 0.12
              img.style.setProperty('--py', `${y * speed}px`);
              img.style.translate = `0 ${y * speed * -1}px`;
            });
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  // ---------- Nav shadow on scroll ----------
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 8) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- Headline word-by-word entrance ----------
  document.querySelectorAll('.animate-words').forEach((el) => {
    const text = el.textContent.trim();
    el.textContent = '';
    text.split(/(\s+)/).forEach((chunk, i) => {
      if (/^\s+$/.test(chunk)) {
        el.appendChild(document.createTextNode(chunk));
      } else {
        const span = document.createElement('span');
        span.className = 'word';
        span.style.animationDelay = `${0.06 * i}s`;
        span.textContent = chunk;
        el.appendChild(span);
      }
    });
  });
})();
