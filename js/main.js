/* ===================================================
   main.js — KartGrowth
   Loads header + footer once from /components/
   and handles all interactions
=================================================== */

(function () {

  // ── 1. COMPONENT LOADER ──────────────────────────
  function loadComponent(placeholderId, filePath, callback) {
    const el = document.getElementById(placeholderId);
    if (!el) return;

    fetch(filePath)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load ' + filePath);
        return res.text();
      })
      .then(function (html) {
        el.innerHTML = html;
        if (typeof callback === 'function') callback();
      })
      .catch(function (err) {
        console.error('Component load error:', err);
      });
  }

  // ── 2. FIGURE OUT PATH DEPTH ─────────────────────
  // Handles root (/), one level deep (/about/), etc.
  function getBasePath() {
    const path = window.location.pathname;
    const depth = path.replace(/\/$/, '').split('/').length - 1;
    return depth <= 1 ? '/' : '../'.repeat(depth - 1);
  }

  // ── 3. HEADER INIT (runs after header loads) ──────
  function initHeader() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const header = document.getElementById('header');

    // Hamburger toggle
    if (hamburger && nav) {
      hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        nav.classList.toggle('open');
      });

      // Close on nav link click
      nav.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
          hamburger.classList.remove('active');
          nav.classList.remove('open');
        });
      });
    }

    // Active link highlight based on current URL
    const currentPath = window.location.pathname;
    if (nav) {
      nav.querySelectorAll('.nav-link').forEach(function (link) {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (
          href === currentPath ||
          (currentPath === '/' && href === '/') ||
          (href !== '/' && currentPath.startsWith(href.replace(/\/$/, '')))
        ) {
          link.classList.add('active');
        }
      });
    }

    // Shrink header on scroll
    if (header) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 60) {
          header.style.height = '58px';
          header.style.boxShadow = '0 4px 24px rgba(0,0,0,0.12)';
        } else {
          header.style.height = '70px';
          header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
        }
      });
    }
  }

  // ── 4. FORM HANDLER ───────────────────────────────
  function initForm() {
    const form = document.getElementById('hero-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      btn.style.opacity = '0.8';

      setTimeout(function () {
        btn.textContent = '✅ Submitted!';
        form.reset();
        setTimeout(function () {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.opacity = '1';
        }, 3000);
      }, 1500);
    });
  }

  // ── 5. BOOT ───────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    const base = getBasePath();

    loadComponent(
      'header-placeholder',
      base + 'components/header.html',
      initHeader   // ← runs AFTER header HTML is injected
    );

    loadComponent(
      'footer-placeholder',
      base + 'components/footer.html'
    );

    initForm();
  });

})();

// ── ABOUT TOGGLE ─────────────────────────────────
function toggleAbout() {
  const extra = document.getElementById('about-extra');
  const btn = document.getElementById('about-toggle');
  const arrow = document.getElementById('about-arrow');

  if (!extra) return;
  const isOpen = extra.classList.contains('open');

  extra.classList.toggle('open');
  btn.innerHTML = isOpen
    ? 'View More <svg id="about-arrow" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'
    : 'View Less <svg id="about-arrow" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 19l7-7-7-7"/></svg>';
  btn.querySelector('svg').style.stroke = 'var(--primary)';
}

// ── SERVICE TABS ─────────────────────────────────
function switchTab(id, btn) {
  // Hide all panels
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  // Show selected
  const panel = document.getElementById('tab-' + id);
  if (panel) panel.classList.add('active');
  if (btn) btn.classList.add('active');
}

// ── ACCORDION ────────────────────────────────────
function toggleAccordion(id) {
  const item = document.getElementById(id);
  if (!item) return;
  const isOpen = item.classList.contains('open');
  // Close all
  document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
  // Open clicked (if it was closed)
  if (!isOpen) item.classList.add('open');
}

// ── CONTACT FORM ─────────────────────────────────
function submitContactForm() {
  const name    = document.getElementById('cf-name');
  const phone   = document.getElementById('cf-phone');
  const email   = document.getElementById('cf-email');

  if (!name || !name.value.trim()) { name.focus(); name.style.borderColor = '#e74c3c'; return; }
  if (!phone || !phone.value.trim()) { phone.focus(); phone.style.borderColor = '#e74c3c'; return; }
  if (!email || !email.value.trim()) { email.focus(); email.style.borderColor = '#e74c3c'; return; }

  const btn = document.querySelector('.form-submit');
  if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }

  setTimeout(function () {
    const formArea = document.getElementById('contact-form-area');
    const success  = document.getElementById('form-success');
    if (formArea) formArea.style.display = 'none';
    if (success)  success.style.display  = 'block';
  }, 1400);
}