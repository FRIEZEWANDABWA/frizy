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
    // ── Frieze AI Chatbot ────────────────────────────────
    const botHtml = `
    <div id="frieze-bot-container">
        <button id="frieze-bot-toggle" aria-label="Open Frieze AI Chat">
            <i class="fas fa-robot"></i>
        </button>
        <div id="frieze-bot-window" class="hidden">
            <div class="frieze-bot-header">
                <div style="display:flex;align-items:center;gap:10px;">
                    <img src="/images/profile%20photo.webp" alt="Frieze" style="width:30px;height:30px;border-radius:50%;object-fit:cover;">
                    <div>
                        <strong>Frieze AI</strong><br>
                        <small>Online</small>
                    </div>
                </div>
                <button id="frieze-bot-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="frieze-bot-body" id="frieze-bot-body">
                <div class="bot-msg">Hi! I'm Frieze AI. I can answer questions about my projects, experience, leadership philosophy, or schedule a discussion. How can I help?</div>
            </div>
            <div class="frieze-bot-input">
                <input type="text" id="frieze-bot-text" placeholder="Ask a question..." autocomplete="off">
                <button id="frieze-bot-send"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    </div>
    <style>
        #frieze-bot-container { position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: var(--font-sans); }
        #frieze-bot-toggle { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--blue), var(--teal)); color: #fff; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transition: transform 0.2s; border: none; cursor: pointer; }
        #frieze-bot-toggle:hover { transform: scale(1.05); }
        #frieze-bot-window { width: 320px; height: 420px; background: var(--bg-surface); border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.2); display: flex; flex-direction: column; overflow: hidden; position: absolute; bottom: 70px; right: 0; border: 1px solid var(--border); transition: opacity 0.3s, transform 0.3s; transform-origin: bottom right; }
        #frieze-bot-window.hidden { opacity: 0; transform: scale(0.8); pointer-events: none; }
        .frieze-bot-header { background: var(--navy); color: #fff; padding: 12px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .frieze-bot-header strong { font-size: 0.95rem; }
        .frieze-bot-header small { color: var(--teal); font-size: 0.75rem; }
        #frieze-bot-close { background: none; border: none; color: #fff; cursor: pointer; font-size: 1.1rem; }
        .frieze-bot-body { flex: 1; padding: 16px; overflow-y: auto; background: var(--bg-page); display: flex; flex-direction: column; gap: 12px; font-size: 0.9rem; }
        .bot-msg { background: var(--bg-surface); padding: 10px 14px; border-radius: 12px 12px 12px 0; border: 1px solid var(--border); color: var(--text-body); align-self: flex-start; max-width: 85%; line-height: 1.5; }
        .user-msg { background: var(--blue); color: #fff; padding: 10px 14px; border-radius: 12px 12px 0 12px; align-self: flex-end; max-width: 85%; line-height: 1.5; }
        .frieze-bot-input { display: flex; border-top: 1px solid var(--border); padding: 10px; background: var(--bg-surface); }
        #frieze-bot-text { flex: 1; padding: 8px 12px; border: 1px solid var(--border); border-radius: 20px; outline: none; background: var(--bg-page); color: var(--text-body); font-size: 0.9rem; }
        #frieze-bot-send { background: none; border: none; color: var(--blue); padding: 0 12px; cursor: pointer; font-size: 1.1rem; transition: color 0.2s; }
        #frieze-bot-send:hover { color: var(--teal); }
        [data-theme="dark"] #frieze-bot-window { background: var(--navy-mid); }
        [data-theme="dark"] .bot-msg { background: var(--navy-light); border-color: var(--border-mid); color: #fff; }
        [data-theme="dark"] .frieze-bot-input { background: var(--navy-mid); }
        [data-theme="dark"] #frieze-bot-text { background: var(--navy); border-color: var(--border-mid); color: #fff; }
    </style>
    `;
    
    document.body.insertAdjacentHTML('beforeend', botHtml);
    
    const botToggle = document.getElementById('frieze-bot-toggle');
    const botWindow = document.getElementById('frieze-bot-window');
    const botClose = document.getElementById('frieze-bot-close');
    const botInput = document.getElementById('frieze-bot-text');
    const botSend = document.getElementById('frieze-bot-send');
    const botBody = document.getElementById('frieze-bot-body');

    botToggle.addEventListener('click', () => botWindow.classList.toggle('hidden'));
    botClose.addEventListener('click', () => botWindow.classList.add('hidden'));

    function appendMsg(text, isUser = false) {
        const d = document.createElement('div');
        d.className = isUser ? 'user-msg' : 'bot-msg';
        d.innerHTML = text;
        botBody.appendChild(d);
        botBody.scrollTop = botBody.scrollHeight;
    }

    function getBotResponse(q) {
        q = q.toLowerCase();
        if (q.includes('hello') || q.includes('hi')) return "Hello! How can I assist you today?";
        if (q.includes('experience') || q.includes('work')) return "Frieze has over 10 years of technology leadership experience, managing 500+ enterprise sites and 40+ infrastructure deployments across Africa, currently working at KOFISI Africa.";
        if (q.includes('project') || q.includes('portfolio') || q.includes('case')) return "Key projects include the KOFISI Multi-Center Infrastructure Transformation, leading 500+ network site expansions across Africa, and a High-Profile International Product Launch.";
        if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('phone')) return "You can easily schedule a discussion via the Contact page or email friezekw@gmail.com directly. He is also available at +254718300236 and is currently 'Open to Opportunities'!";
        if (q.includes('skill') || q.includes('expert') || q.includes('domain')) return "Core expertise ranges across Infrastructure & Cloud, IT Leadership & Strategy, Cybersecurity & Risk (ISO 27001), and emerging tech like AI-driven IT operations.";
        if (q.includes('education') || q.includes('cert')) return "Frieze holds a CCNA, ISO 27001 Compliance, Cybersecurity, and 5G Technologies certifications, and is currently pursuing an MSc in Artificial Intelligence at Kenyatta University.";
        if (q.includes('who are you') || q.includes('frieze ai')) return "I am Frieze AI, a digital assistant built to guide you through Frieze Wandabwa's portfolio and experience!";
        if (q.includes('about')) return "Frieze Kere Wandabwa is an Enterprise IT leader specialising in infrastructure architecture, cybersecurity governance, and AI-driven technology strategy across Africa. Based in Nairobi, Kenya.";
        if (q.includes('resume') || q.includes('cv')) return "You can securely request and download Frieze's resume exactly by clicking the 'Request Resume' button in the main navigation menu above.";
        return "That's an excellent question! For more detailed discussions, it's best to connect with Frieze via LinkedIn or by requesting his full resume via the 'Request Resume' button.";
    }

    function handleSend() {
        const txt = botInput.value.trim();
        if(!txt) return;
        appendMsg(txt, true);
        botInput.value = '';
        setTimeout(() => {
            appendMsg(getBotResponse(txt), false);
        }, 600);
    }

    botSend.addEventListener('click', handleSend);
    botInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') handleSend();
    });

