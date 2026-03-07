// ═══════════════════════════════════════════════════════
//  main.js — Frieze Wandabwa Executive Portfolio
// ═══════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function () {

    // ── Theme Toggle ────────────────────────────────────
    const html = document.documentElement;
    const toggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';

    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            updateThemeIcon(next);
        });
    }

    function updateThemeIcon(theme) {
        if (!toggleBtn) return;
        const icon = toggleBtn.querySelector('i');
        if (!icon) return;
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // ── Mobile Menu ─────────────────────────────────────
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', function () {
            const isOpen = navMenu.classList.toggle('active');
            mobileBtn.setAttribute('aria-expanded', isOpen);
            const icon = mobileBtn.querySelector('i');
            if (icon) icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close menu on nav link click
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function () {
                navMenu.classList.remove('active');
                mobileBtn.setAttribute('aria-expanded', 'false');
                const icon = mobileBtn.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
                document.body.style.overflow = '';
            });
        });

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) &&
                !mobileBtn.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileBtn.setAttribute('aria-expanded', 'false');
                const icon = mobileBtn.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
                document.body.style.overflow = '';
            }
        });
    }

    // ── Scroll-reveal animation ─────────────────────────
    const revealEls = document.querySelectorAll(
        '.card, .expertise-card, .project-card, .cert-badge, .insight-card, .service-card, .metric-item, .timeline-item'
    );

    if ('IntersectionObserver' in window && revealEls.length) {
        // Set initial hidden state
        revealEls.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(18px)';
            el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => observer.observe(el));
    } else {
        // Fallback: just show them
        revealEls.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    }

    // ── Active nav link highlight ────────────────────────
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath === href) {
            link.classList.add('active');
        } else if (href && href !== '/' && currentPath.startsWith(href)) {
            link.classList.add('active');
        }
    });

    // ── Smooth anchor scrolling ─────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ── Copy-to-clipboard for contact elements ──────────
    document.querySelectorAll('[data-copy]').forEach(el => {
        el.style.cursor = 'copy';
        el.addEventListener('click', function (e) {
            e.preventDefault();
            const text = this.dataset.copy;
            navigator.clipboard?.writeText(text).then(() => {
                showNotification('Copied to clipboard!', 'success');
            }).catch(() => {
                fallbackCopy(text);
            });
        });
    });

    function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); showNotification('Copied!', 'success'); }
        catch { showNotification('Copy failed — select manually.', 'error'); }
        document.body.removeChild(ta);
    }

    // ── Global notification helper ─────────────────────
    window.showNotification = function (message, type = 'success') {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const el = document.createElement('div');
        el.className = `notification notification-${type}`;
        el.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
        document.body.appendChild(el);

        setTimeout(() => {
            el.style.animation = 'slideOut .3s ease forwards';
            setTimeout(() => el.remove(), 350);
        }, 4500);
    };

});