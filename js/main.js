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
        '.card, .expertise-card, .project-card, .cert-badge, .insight-card, .service-card, .metric-item, .timeline-item, .testimonial-card'
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

    document.querySelectorAll('.nav-details').forEach((detail) => {
        if (detail.querySelector('.nav-submenu .nav-link.active')) {
            detail.setAttribute('open', '');
        }
    });

    document.addEventListener('click', function (e) {
        document.querySelectorAll('.nav-details[open]').forEach((detail) => {
            if (!detail.contains(e.target)) detail.removeAttribute('open');
        });
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

    // ── Testimonials carousel (home): panel 1 = 3 quotes, panel 2 = 3 quotes ──
    (function initTestimonialCarousel() {
        const root = document.getElementById('testimonial-carousel');
        if (!root) return;

        const track = root.querySelector('.testimonial-carousel-track');
        const panels = Array.from(root.querySelectorAll('.testimonial-panel'));
        const dots = Array.from(root.querySelectorAll('.testimonial-carousel-dot'));
        if (!track || panels.length !== 2) return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let index = 0;
        let timer = null;
        const intervalMs = 5000;

        function setPanel(i) {
            index = i % 2;
            track.classList.toggle('is-panel-1', index === 1);
            panels.forEach((panel, j) => {
                const on = j === index;
                panel.setAttribute('aria-hidden', on ? 'false' : 'true');
            });
            dots.forEach((dot, j) => {
                const on = j === index;
                dot.classList.toggle('is-active', on);
                dot.setAttribute('aria-selected', on ? 'true' : 'false');
            });
        }

        function next() {
            setPanel(index + 1);
        }

        function start() {
            stop();
            if (prefersReduced) return;
            timer = window.setInterval(next, intervalMs);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach((dot, j) => {
            dot.addEventListener('click', () => {
                setPanel(j);
                start();
            });
        });

        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', start);
        root.addEventListener('focusin', stop);
        root.addEventListener('focusout', (e) => {
            if (!root.contains(e.relatedTarget)) start();
        });

        setPanel(0);
        start();
    })();

    // ── LinkedIn posts carousel (home) — data from data/linkedin-posts.json ──
    (function initLinkedInPostsCarousel() {
        const root = document.getElementById('linkedin-posts-carousel');
        if (!root) return;

        const track = root.querySelector('.linkedin-posts-track');
        const dotsHost = root.querySelector('.linkedin-posts-dots');
        const prevBtn = root.querySelector('.linkedin-posts-prev');
        const nextBtn = root.querySelector('.linkedin-posts-next');
        const viewport = root.querySelector('.linkedin-posts-viewport');
        if (!track || !dotsHost || !prevBtn || !nextBtn || !viewport) return;

        const grads = [
            'linear-gradient(90deg,var(--teal),var(--green))',
            'linear-gradient(90deg,var(--blue),#8B5CF6)',
            'linear-gradient(90deg,#0EA5E9,var(--blue))',
            'linear-gradient(90deg,var(--blue),#6366F1)',
            'linear-gradient(90deg,#F97316,#EAB308)',
            'linear-gradient(90deg,#EC4899,var(--blue))'
        ];

        let postsRaw = [];
        let appliedChunkSize = -1;
        let pageCount = 0;
        let index = 0;
        let timer = null;
        let touchStartX = null;
        const intervalMs = 8200;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function getChunkSize() {
            return window.matchMedia('(min-width: 960px)').matches ? 3 : 1;
        }

        function chunk(arr, size) {
            const out = [];
            for (let i = 0; i < arr.length; i += size) {
                out.push(arr.slice(i, i + size));
            }
            return out;
        }

        function go(i) {
            if (pageCount < 1) return;
            index = ((i % pageCount) + pageCount) % pageCount;
            track.style.transform = 'translateX(-' + ((100 * index) / pageCount) + '%)';
            dotsHost.querySelectorAll('.linkedin-post-dot').forEach(function (d, j) {
                d.classList.toggle('is-active', j === index);
                d.setAttribute('aria-selected', j === index ? 'true' : 'false');
            });
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        function restart() {
            stop();
            if (!prefersReduced && pageCount > 1) {
                timer = window.setInterval(function () {
                    go(index + 1);
                }, intervalMs);
            }
        }

        function buildCard(p, globalIndex) {
            const wrap = document.createElement('div');
            wrap.className = 'linkedin-post-slide-wrap';

            const a = document.createElement('a');
            a.className = 'linkedin-post-slide insight-card';
            a.href = p.url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.setAttribute('aria-label', (p.title || 'LinkedIn post') + ' — opens in a new tab');

            const ban = document.createElement('div');
            ban.className = 'insight-banner';
            ban.style.background = grads[globalIndex % grads.length];

            const body = document.createElement('div');
            body.className = 'insight-body';

            const cat = document.createElement('div');
            cat.className = 'insight-category';
            cat.textContent = p.tag || 'LinkedIn';

            const tit = document.createElement('div');
            tit.className = 'insight-title';
            tit.textContent = p.title || '';

            const hook = document.createElement('p');
            hook.className = 'insight-excerpt linkedin-post-hook';
            hook.textContent = p.hook || '';

            const meta = document.createElement('div');
            meta.className = 'insight-meta';
            const sp = document.createElement('span');
            sp.innerHTML = '<i class="fab fa-linkedin-in" aria-hidden="true"></i> Opens on LinkedIn';
            meta.appendChild(sp);

            const foot = document.createElement('div');
            foot.className = 'insight-footer';
            const cta = document.createElement('span');
            cta.className = 'btn btn-outline-dark btn-sm';
            cta.innerHTML = 'Read post <i class="fas fa-arrow-right" aria-hidden="true"></i>';
            foot.appendChild(cta);

            body.appendChild(cat);
            body.appendChild(tit);
            body.appendChild(hook);
            body.appendChild(meta);
            a.appendChild(ban);
            a.appendChild(body);
            a.appendChild(foot);
            wrap.appendChild(a);
            return wrap;
        }

        function renderFromRaw() {
            track.innerHTML = '';
            dotsHost.innerHTML = '';
            track.style.removeProperty('transform');
            pageCount = 0;

            if (!postsRaw.length) {
                track.innerHTML = '<p class="linkedin-posts-empty">No posts in data file yet.</p>';
                return;
            }

            const chunkSize = getChunkSize();
            appliedChunkSize = chunkSize;
            const pages = chunk(postsRaw, chunkSize);
            pageCount = pages.length;

            track.style.setProperty('--linkedin-pages', String(pageCount));
            track.style.width = pageCount * 100 + '%';

            let globalIdx = 0;
            pages.forEach(function (pagePosts, pi) {
                const pageEl = document.createElement('div');
                pageEl.className = 'linkedin-posts-page';
                pageEl.setAttribute('role', 'group');
                pageEl.setAttribute('aria-label', 'LinkedIn posts, page ' + (pi + 1) + ' of ' + pageCount);

                pagePosts.forEach(function (p) {
                    pageEl.appendChild(buildCard(p, globalIdx));
                    globalIdx++;
                });
                track.appendChild(pageEl);

                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'linkedin-post-dot' + (pi === 0 ? ' is-active' : '');
                dot.setAttribute('aria-label', 'Show posts page ' + (pi + 1) + ' of ' + pageCount);
                dot.setAttribute('aria-selected', pi === 0 ? 'true' : 'false');
                dot.addEventListener('click', function () {
                    go(pi);
                    restart();
                });
                dotsHost.appendChild(dot);
            });

            index = 0;
            go(0);
            restart();
        }

        function onLayoutMaybeChange() {
            if (!postsRaw.length) return;
            const sz = getChunkSize();
            if (sz !== appliedChunkSize) {
                index = 0;
                renderFromRaw();
            }
        }

        function debounce(fn, ms) {
            let t;
            return function () {
                clearTimeout(t);
                t = setTimeout(fn, ms);
            };
        }

        window.addEventListener('resize', debounce(onLayoutMaybeChange, 200));
        const mqWide = window.matchMedia('(min-width: 960px)');
        if (mqWide.addEventListener) {
            mqWide.addEventListener('change', onLayoutMaybeChange);
        } else if (mqWide.addListener) {
            mqWide.addListener(onLayoutMaybeChange);
        }

        prevBtn.addEventListener('click', function () {
            go(index - 1);
            restart();
        });
        nextBtn.addEventListener('click', function () {
            go(index + 1);
            restart();
        });

        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', restart);
        root.addEventListener('focusin', stop);
        root.addEventListener('focusout', function (e) {
            if (!root.contains(e.relatedTarget)) restart();
        });

        viewport.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        viewport.addEventListener('touchend', function (e) {
            if (touchStartX == null) return;
            const dx = e.changedTouches[0].screenX - touchStartX;
            if (dx < -48) go(index + 1);
            if (dx > 48) go(index - 1);
            touchStartX = null;
            restart();
        }, { passive: true });

        fetch('data/linkedin-posts.json', { cache: 'no-cache' })
            .then(function (r) {
                if (!r.ok) throw new Error('bad status');
                return r.json();
            })
            .then(function (data) {
                if (!Array.isArray(data)) throw new Error('not array');
                postsRaw = data;
                renderFromRaw();
            })
            .catch(function () {
                track.innerHTML = '<p class="linkedin-posts-empty">Could not load <code>data/linkedin-posts.json</code>. Ensure it is deployed next to your site root.</p>';
            });
    })();

    // ── Frieze AI Chatbot (not on Leadership or Case studies pages) ────────
    const path = window.location.pathname || '';
    const isLeadershipPage = /leadership(?:\.html)?$/i.test(path) || path.includes('/leadership');
    const isCaseStudiesPage = /projects(?:\.html)?$/i.test(path) || path.includes('/projects');
    if (!isLeadershipPage && !isCaseStudiesPage) {
    const botHtml = `
    <div id="frieze-bot-container">
        <button id="frieze-bot-toggle" aria-label="Open Frieze AI Chat">
            <i class="fas fa-robot"></i>
        </button>
        <div id="frieze-bot-window" class="hidden">
            <div class="frieze-bot-header">
                <div style="display:flex;align-items:center;gap:10px;">
                    <img src="/images/profile-photo.webp" alt="Frieze" style="width:30px;height:30px;border-radius:50%;object-fit:cover;">
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

    if (botToggle && botWindow && botClose && botInput && botSend && botBody) {
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
        if (q.includes('resume') || q.includes('cv')) return "Use Download CV in the navigation bar to get the PDF in one click.";
        return "For a detailed conversation, use Contact or LinkedIn from the site header.";
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
    }
    }

});
