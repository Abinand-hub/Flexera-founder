/**
 * Fluxera Founder Roundtable
 * Interactive Logic:
 *  1. Countdown Timer (Friday, October 16, 2026 · 4:30 PM PDT - San Francisco Time)
 *  2. Interactive Outcome Comparison Tabs ("Without" vs "With")
 *  3. Eased Smooth Scroll Animation (with sticky header offset & cubic easing)
 *  4. Scroll Reveal Animations (IntersectionObserver for .rv elements)
 *  5. Scroll Progress Bar & Active Navigation Indicator
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // 1. Countdown Timer (Friday, October 16, 2026 · 4:30 PM PDT - San Francisco Time)
  // -------------------------------------------------------------
  const targetDate = new Date('2026-10-16T16:30:00-07:00').getTime();

  function updateCountdown() {
    const now = Date.now();
    const diff = Math.max(0, targetDate - now);
    const pad = (n) => String(n).padStart(2, '0');

    const days = pad(Math.floor(diff / (1000 * 60 * 60 * 24)));
    const hours = pad(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const mins = pad(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
    const secs = pad(Math.floor((diff % (1000 * 60)) / 1000));

    // Update Hero Countdown elements
    const heroDays = document.getElementById('hero-days');
    const heroHours = document.getElementById('hero-hours');
    const heroMins = document.getElementById('hero-mins');
    const heroSecs = document.getElementById('hero-secs');

    if (heroDays) heroDays.textContent = days;
    if (heroHours) heroHours.textContent = hours;
    if (heroMins) heroMins.textContent = mins;
    if (heroSecs) heroSecs.textContent = secs;

    // Update Registration section countdown elements
    const regDays = document.getElementById('reg-days');
    const regHours = document.getElementById('reg-hours');
    const regMins = document.getElementById('reg-mins');
    const regSecs = document.getElementById('reg-secs');

    if (regDays) regDays.textContent = days;
    if (regHours) regHours.textContent = hours;
    if (regMins) regMins.textContent = mins;
    if (regSecs) regSecs.textContent = secs;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // -------------------------------------------------------------
  // 2. Interactive Outcome Comparison Tabs ("Without" vs "With")
  // -------------------------------------------------------------
  const tabWithout = document.getElementById('tab-without');
  const tabWith = document.getElementById('tab-with');
  const panelWithout = document.getElementById('panel-without');
  const panelWith = document.getElementById('panel-with');

  function switchTab(mode) {
    if (mode === 'without') {
      if (tabWithout) {
        tabWithout.classList.add('active');
        tabWithout.setAttribute('aria-pressed', 'true');
      }
      if (tabWith) {
        tabWith.classList.remove('active');
        tabWith.setAttribute('aria-pressed', 'false');
      }
      if (panelWithout) {
        panelWithout.style.display = 'block';
        panelWithout.classList.add('active');
      }
      if (panelWith) {
        panelWith.style.display = 'none';
        panelWith.classList.remove('active');
      }
    } else if (mode === 'with') {
      if (tabWith) {
        tabWith.classList.add('active');
        tabWith.setAttribute('aria-pressed', 'true');
      }
      if (tabWithout) {
        tabWithout.classList.remove('active');
        tabWithout.setAttribute('aria-pressed', 'false');
      }
      if (panelWith) {
        panelWith.style.display = 'block';
        panelWith.classList.add('active');
      }
      if (panelWithout) {
        panelWithout.style.display = 'none';
        panelWithout.classList.remove('active');
      }
    }
  }

  if (tabWithout && tabWith) {
    tabWithout.addEventListener('click', () => switchTab('without'));
    tabWith.addEventListener('click', () => switchTab('with'));
  }

  // -------------------------------------------------------------
  // 3. Eased Smooth Scroll Animation (Cubic Easing & Sticky Nav Offset)
  // -------------------------------------------------------------
  const navHeight = 72; // height of the sticky navbar

  function smoothScrollTo(targetY, duration = 800) {
    const startY = window.pageYOffset || document.documentElement.scrollTop;
    const distance = targetY - startY;
    if (Math.abs(distance) < 2) return;

    let startTime = null;

    // Smooth cubic in-out easing for a premium feel
    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, Math.round(startY + distance * ease));

      if (elapsed < duration) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  // Intercept all internal anchor links for custom smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const elementTop = targetEl.getBoundingClientRect().top;
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        const offsetPosition = targetId === '#top' ? 0 : elementTop + currentScroll - navHeight;

        smoothScrollTo(Math.max(0, offsetPosition), 750);

        if (history.pushState) {
          history.pushState(null, '', targetId);
        }
      }
    });
  });

  // -------------------------------------------------------------
  // 4. Scroll Reveal Animations (.rv elements enter viewport smoothly)
  // -------------------------------------------------------------
  const revealElements = document.querySelectorAll('.rv');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is unavailable
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // -------------------------------------------------------------
  // 5. Scroll Progress Bar & Active Navigation Indicator
  // -------------------------------------------------------------
  const progressBar = document.getElementById('scroll-progress');
  const navLinks = document.querySelectorAll('.navlinks a');
  const sectionIds = ['explore', 'report', 'agenda'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  function onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Update glowing progress line at the very top
    if (progressBar && docHeight > 0) {
      const percent = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      progressBar.style.width = `${percent}%`;
    }

    // Determine current section in view
    let currentId = '';
    sections.forEach(section => {
      const top = section.offsetTop - navHeight - 140;
      const height = section.offsetHeight;
      if (scrollTop >= top && scrollTop < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});
