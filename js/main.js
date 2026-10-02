/* ==========================================================================
   WMS Company · TRIO — main.js
   Navigation, scroll effects, reveal animations, counters,
   testimonials slider, FAQ accordion, quote form.
   ========================================================================== */

(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Page loader ---------- */
  const loader = $('#page-loader');
  function hideLoader() {
    if (!loader) return;
    loader.classList.add('is-hidden');
    setTimeout(() => loader.remove(), 700);
  }
  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 400);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 400));
    // Safety net: never block the page for more than 2.5s
    setTimeout(hideLoader, 2500);
  }

  /* ---------- Header: scrolled state + progress + back to top ---------- */
  const header = $('#site-header');
  const progress = $('#scroll-progress');
  const backToTop = $('#back-to-top');

  /* Active nav link state (declared before first onScroll call) */
  const navLinks = $$('.nav-link');
  const sections = navLinks
    .map(link => $(link.getAttribute('href')))
    .filter(Boolean);

  function updateActiveNav(y) {
    const offset = y + window.innerHeight * 0.35;
    let current = null;
    sections.forEach(sec => { if (sec.offsetTop <= offset) current = sec; });
    navLinks.forEach(link => {
      link.classList.toggle('is-active', !!current && link.getAttribute('href') === '#' + current.id);
    });
  }

  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    const docH = document.documentElement.scrollHeight - window.innerHeight;

    header.classList.toggle('is-scrolled', y > 24);
    if (progress) progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';
    if (backToTop) backToTop.classList.toggle('is-visible', y > 600);
    updateActiveNav(y);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const navToggle = $('#nav-toggle');
  const mainNav = $('#main-nav');

  function closeNav() {
    mainNav.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Ouvrir le menu');
    document.body.style.overflow = '';
  }
  function openNav() {
    mainNav.classList.add('is-open');
    navToggle.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Fermer le menu');
  }
  navToggle.addEventListener('click', () => {
    mainNav.classList.contains('is-open') ? closeNav() : openNav();
  });
  $$('a', mainNav).forEach(a => a.addEventListener('click', closeNav));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeNav(); });

  /* ---------- Smooth scroll with header offset ---------- */
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      const headerH = header.offsetHeight + 12;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = $$('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
  revealEls.forEach(el => {
    const delay = el.getAttribute('data-delay');
    if (delay) el.style.setProperty('--delay', delay + 'ms');
  });

  // Hero content is always revealed right away (no dependency on scroll position)
  const heroReveals = $$('#hero-section .reveal-up, #hero-section .reveal-left, #hero-section .reveal-right, #hero-section .reveal-scale');
  requestAnimationFrame(() => heroReveals.forEach(el => el.classList.add('is-revealed')));

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.filter(el => !heroReveals.includes(el)).forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-revealed'));
  }

  /* ---------- Animated counters ---------- */
  const counters = $$('[data-counter]');
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const start = performance.now();

    if (prefersReducedMotion) { el.textContent = target + suffix; return; }

    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  } else {
    counters.forEach(c => { c.textContent = c.getAttribute('data-counter') + (c.getAttribute('data-suffix') || ''); });
  }

  /* ---------- Testimonials slider ---------- */
  const slider = $('#testimonial-slider');
  const dotsWrap = $('#testimonial-dots');
  if (slider && dotsWrap) {
    const slides = $$('.testimonial', slider);
    let index = 0;
    let timer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Témoignage ' + (i + 1));
      dot.addEventListener('click', () => { goTo(i); restart(); });
      dotsWrap.appendChild(dot);
    });
    const dots = $$('button', dotsWrap);

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('is-active', k === index));
      dots.forEach((d, k) => {
        d.classList.toggle('is-active', k === index);
        d.setAttribute('aria-selected', k === index ? 'true' : 'false');
      });
    }
    function restart() {
      clearInterval(timer);
      if (!prefersReducedMotion) timer = setInterval(() => goTo(index + 1), 6000);
    }
    goTo(0);
    restart();
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', restart);
  }

  /* ---------- FAQ accordion: single open + animated height ---------- */
  const faqItems = $$('.faq-item');
  faqItems.forEach(item => {
    const summary = $('summary', item);
    const answer = $('.faq-answer', item);
    if (!summary || !answer) return;

    summary.addEventListener('click', e => {
      e.preventDefault();
      const isOpen = item.hasAttribute('open');

      // Close the others
      faqItems.forEach(other => {
        if (other !== item && other.hasAttribute('open')) collapse(other);
      });

      isOpen ? collapse(item) : expand(item);
    });

    function expand(el) {
      const body = $('.faq-answer', el);
      el.setAttribute('open', '');
      if (prefersReducedMotion) return;
      const h = body.scrollHeight;
      body.style.height = '0px';
      body.style.opacity = '0';
      requestAnimationFrame(() => {
        body.style.transition = 'height 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.4s';
        body.style.height = h + 'px';
        body.style.opacity = '1';
      });
      body.addEventListener('transitionend', function done() {
        body.style.height = '';
        body.style.transition = '';
        body.removeEventListener('transitionend', done);
      });
    }

    function collapse(el) {
      const body = $('.faq-answer', el);
      if (prefersReducedMotion) { el.removeAttribute('open'); return; }
      const h = body.scrollHeight;
      body.style.height = h + 'px';
      body.style.opacity = '1';
      requestAnimationFrame(() => {
        body.style.transition = 'height 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s';
        body.style.height = '0px';
        body.style.opacity = '0';
      });
      body.addEventListener('transitionend', function done() {
        el.removeAttribute('open');
        body.style.height = '';
        body.style.opacity = '';
        body.style.transition = '';
        body.removeEventListener('transitionend', done);
      });
    }
  });

  /* ---------- Quote form ---------- */
  const form = $('#quote-form');
  const status = $('#form-status');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = '';

      // Basic validation
      let valid = true;
      $$('[required]', form).forEach(field => {
        const ok = field.checkValidity() && field.value.trim() !== '';
        field.classList.toggle('is-invalid', !ok);
        if (!ok) valid = false;
      });
      if (!valid) {
        status.className = 'form-status is-error';
        status.textContent = 'Merci de compléter les champs obligatoires avant d\'envoyer votre demande.';
        return;
      }

      const btn = $('button[type="submit"]', form);
      btn.classList.add('is-loading');
      const icon = $('i', btn);
      icon.className = 'fa-solid fa-circle-notch';

      const data = Object.fromEntries(new FormData(form).entries());
      data.guests = data.guests ? Number(data.guests) : null;
      data.status = 'nouveau';

      try {
        // Persist to the RESTful table when available (preview / hosted deploy).
        // On Vercel (pure static) this endpoint doesn't exist — we fall back to mailto.
        const res = await fetch('tables/quote_requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('API unavailable');
        showSuccess();
      } catch (err) {
        // Fallback: open the visitor's mail client with a prefilled message
        const subject = encodeURIComponent('Demande de devis — ' + (data.company || data.name));
        const body = encodeURIComponent(
          'Nom : ' + data.name + '\n' +
          'Entreprise : ' + data.company + '\n' +
          'Email : ' + data.email + '\n' +
          'Téléphone : ' + (data.phone || '—') + '\n' +
          'Prestation : ' + data.service + '\n' +
          'Invités : ' + (data.guests || '—') + '\n' +
          'Date : ' + (data.date || '—') + '\n\n' +
          (data.message || '')
        );
        window.location.href = 'mailto:contact@wms-company.tn?subject=' + subject + '&body=' + body;
        showSuccess();
      } finally {
        btn.classList.remove('is-loading');
        icon.className = 'fa-solid fa-paper-plane';
      }

      function showSuccess() {
        status.className = 'form-status is-success';
        status.innerHTML = '<i class="fa-solid fa-circle-check"></i> Merci ! Votre demande a bien été envoyée. Notre équipe vous recontacte sous 24h ouvrées.';
        form.reset();
      }
    });

    // Live-clear error state
    $$('[required]', form).forEach(f => f.addEventListener('input', () => f.classList.remove('is-invalid')));
  }

  /* ---------- Footer year ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

})();
