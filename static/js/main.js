// Professional Portfolio JavaScript - Frieze Kere Wandabwa

// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', currentTheme);

// Update theme toggle icon
function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

updateThemeIcon(currentTheme);

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Adjust background overlays for theme
    adjustBackgroundOverlays(newTheme);
});

// Function to adjust background overlays for theme changes
function adjustBackgroundOverlays(theme) {
    const sectionsWithBg = document.querySelectorAll('.section-with-bg');
    const cardsWithBg = document.querySelectorAll('.card-with-bg');
    
    sectionsWithBg.forEach(section => {
        const style = section.getAttribute('style');
        if (style && style.includes('background-image')) {
            let newStyle = style;
            if (theme === 'dark') {
                // Change to dark overlays - more transparent
                newStyle = newStyle.replace(/rgba\(255,\s*255,\s*255,\s*[0-9.]+\)/g, 'rgba(26, 32, 44, 0.6)');
                newStyle = newStyle.replace(/rgba\(247,\s*250,\s*252,\s*[0-9.]+\)/g, 'rgba(26, 32, 44, 0.6)');
                newStyle = newStyle.replace(/rgba\(26,\s*54,\s*93,\s*[0-9.]+\)/g, 'rgba(26, 32, 44, 0.7)');
            } else {
                // Change to light overlays - more transparent
                newStyle = newStyle.replace(/rgba\(26,\s*32,\s*44,\s*[0-9.]+\)/g, 'rgba(255, 255, 255, 0.7)');
            }
            section.setAttribute('style', newStyle);
        }
    });
    
    cardsWithBg.forEach(card => {
        const style = card.getAttribute('style');
        if (style && style.includes('background-image')) {
            let newStyle = style;
            if (theme === 'dark') {
                newStyle = newStyle.replace(/rgba\(255,\s*255,\s*255,\s*[0-9.]+\)/g, 'rgba(26, 32, 44, 0.3)');
            } else {
                newStyle = newStyle.replace(/rgba\(26,\s*32,\s*44,\s*[0-9.]+\)/g, 'rgba(255, 255, 255, 0.7)');
            }
            card.setAttribute('style', newStyle);
        }
    });
}



// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');

if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('show');
        const icon = mobileMenuBtn.querySelector('i');
        if (navMenu.classList.contains('show')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
    
    // Close menu when clicking on a link
    navMenu.addEventListener('click', function(e) {
        if (e.target.classList.contains('nav-link')) {
            navMenu.classList.remove('show');
            mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
        }
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active Navigation Link Highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightActiveSection() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightActiveSection);

// Header Background on Scroll
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        if (body.getAttribute('data-theme') === 'dark') {
            header.style.background = 'rgba(26, 32, 44, 0.98)';
        }
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        if (body.getAttribute('data-theme') === 'dark') {
            header.style.background = 'rgba(26, 32, 44, 0.95)';
        }
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and timeline items
const elementsToObserve = document.querySelectorAll('.card, .timeline-item, .stat-item');
if (elementsToObserve.length > 0) {
    elementsToObserve.forEach(el => observer.observe(el));
}

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.message) {
            this.showMessage('Please fill in all required fields.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            this.showMessage('Thank you for your message! I will get back to you soon.', 'success');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Typing Animation for Hero Text
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation on page load
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }
});

// Stats Counter Animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }
    
    updateCounter();
}

// Initialize counter animations when stats section is visible
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-item h3');
                counters.forEach(counter => {
                    const target = parseInt(counter.textContent);
                    animateCounter(counter, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// Testimonials Slider (if testimonials exist)
const testimonialSlider = document.querySelector('.testimonials-slider');
if (testimonialSlider) {
    let currentSlide = 0;
    const slides = testimonialSlider.querySelectorAll('.testimonial-slide');
    const totalSlides = slides.length;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }
    
    // Initialize slider
    showSlide(0);
    
    // Auto-advance slides
    setInterval(nextSlide, 5000);
    
    // Add navigation buttons if they exist
    const nextBtn = document.querySelector('.testimonial-next');
    const prevBtn = document.querySelector('.testimonial-prev');
    
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
}

// Lazy Loading for Images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// Copy to Clipboard Functionality
function copyToClipboard(text) {
    if (typeof text !== 'string' || text.length > 1000) return;
    
    navigator.clipboard.writeText(text).then(() => {
        // Show success message
        const toast = document.createElement('div');
        toast.textContent = 'Copied to clipboard!';
        toast.className = 'toast-message';
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);
    }).catch(() => {
        console.error('Failed to copy to clipboard');
    });
}

// Add copy functionality to email and phone links
document.querySelectorAll('[data-copy]').forEach(element => {
    element.addEventListener('click', (e) => {
        e.preventDefault();
        copyToClipboard(element.dataset.copy);
    });
});

// Performance Optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
let ticking = false;
function updateOnScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            highlightActiveSection();
            ticking = false;
        });
        ticking = true;
    }
}
window.addEventListener('scroll', updateOnScroll, { passive: true });

// AI Chatbox Functionality
class FriezeAI {
    constructor() {
        this.chatbox = null;
        this.messages = [];
        this.isOpen = false;
        this.autoHideTimer = null;
        this.init();
    }

    init() {
        this.createChatbox();
        this.showChatbox();
        this.startAutoHideTimer();
    }

    createChatbox() {
        const chatboxHTML = `
            <div class="ai-chatbox" id="ai-chatbox">
                <div class="chatbox-header">
                    <div class="chatbox-title">
                        <i class="fas fa-robot"></i> Frieze AI
                    </div>
                    <button class="chatbox-close" id="chatbox-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="chatbox-messages" id="chatbox-messages">
                    <div class="message ai">
                        Hi, how can I help you?
                    </div>
                </div>
                <div class="chatbox-input">
                    <input type="text" id="chatbox-input" placeholder="Type your message..." maxlength="500">
                    <button class="chatbox-send" id="chatbox-send">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatboxHTML);
        this.chatbox = document.getElementById('ai-chatbox');
        this.bindEvents();
    }

    bindEvents() {
        const closeBtn = document.getElementById('chatbox-close');
        const sendBtn = document.getElementById('chatbox-send');
        const input = document.getElementById('chatbox-input');
        const messagesContainer = document.getElementById('chatbox-messages');

        closeBtn.addEventListener('click', () => this.hideChatbox());
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Reset auto-hide timer on interaction
        [input, sendBtn].forEach(element => {
            element.addEventListener('click', () => this.resetAutoHideTimer());
        });

        input.addEventListener('input', () => this.resetAutoHideTimer());
        messagesContainer.addEventListener('scroll', () => this.resetAutoHideTimer());
    }

    showChatbox() {
        setTimeout(() => {
            this.chatbox.classList.add('show');
            this.isOpen = true;
        }, 1000);
    }

    hideChatbox() {
        this.chatbox.classList.remove('show');
        this.chatbox.classList.add('minimized');
        this.isOpen = false;
        this.clearAutoHideTimer();
        this.createMinimizedButton();
    }

    createMinimizedButton() {
        if (document.getElementById('chatbox-minimized')) return;
        
        const minimizedBtn = document.createElement('div');
        minimizedBtn.id = 'chatbox-minimized';
        minimizedBtn.className = 'chatbox-minimized';
        minimizedBtn.innerHTML = '<i class="fas fa-robot"></i>';
        minimizedBtn.addEventListener('click', () => this.showChatboxFromMinimized());
        document.body.appendChild(minimizedBtn);
    }

    showChatboxFromMinimized() {
        const minimizedBtn = document.getElementById('chatbox-minimized');
        if (minimizedBtn) minimizedBtn.remove();
        
        this.chatbox.classList.remove('minimized');
        this.chatbox.classList.add('show');
        this.isOpen = true;
        this.startAutoHideTimer();
    }

    startAutoHideTimer() {
        this.autoHideTimer = setTimeout(() => {
            if (this.isOpen) {
                this.hideChatbox();
            }
        }, 5000);
    }

    resetAutoHideTimer() {
        this.clearAutoHideTimer();
        this.startAutoHideTimer();
    }

    clearAutoHideTimer() {
        if (this.autoHideTimer) {
            clearTimeout(this.autoHideTimer);
            this.autoHideTimer = null;
        }
    }

    sendMessage() {
        const input = document.getElementById('chatbox-input');
        const message = input.value.trim();
        
        if (!message || message.length > 500) return;

        this.addMessage(message, 'user');
        input.value = '';
        
        // Rate limiting
        if (this.messages.length > 50) {
            this.addMessage('Chat limit reached. Please refresh to continue.', 'ai');
            return;
        }

        // Simulate AI response
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.addMessage(response, 'ai');
        }, 1000);

        this.resetAutoHideTimer();
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatbox-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${this.sanitizeClassName(sender)}`;
        messageDiv.textContent = this.sanitizeText(text);
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    sanitizeText(text) {
        if (typeof text !== 'string' || !text) return '';
        return text.replace(/[<>"'&\/]/g, function(match) {
            const escapeMap = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                '&': '&amp;',
                '/': '&#x2F;'
            };
            return escapeMap[match];
        }).substring(0, 500);
    }

    sanitizeClassName(className) {
        return className.replace(/[^a-zA-Z0-9-_]/g, '');
    }

    generateResponse(message) {
        const responses = {
            greeting: [
                "Hello! I'm here to help you learn more about Frieze's experience and expertise.",
                "Hi there! Feel free to ask me about Frieze's background, projects, or skills.",
                "Welcome! I can help you navigate through Frieze's portfolio and achievements."
            ],
            experience: [
                "Frieze has 8+ years of IT leadership experience across Africa, managing enterprise infrastructure for major organizations.",
                "He's worked with prestigious clients including AWS, Gates Foundation, and various multinational corporations.",
                "His expertise spans network infrastructure, AV systems, and team leadership across multiple countries."
            ],
            skills: [
                "Frieze specializes in IT infrastructure management, network design, AV systems integration, and team leadership.",
                "He's proficient in enterprise networking, cloud technologies, and has extensive experience with major tech vendors.",
                "His technical skills include network architecture, system administration, and project management."
            ],
            contact: [
                "You can reach Frieze at friezekw@gmail.com or +254 718 300 236.",
                "Feel free to connect with him on LinkedIn or check out his projects on GitHub.",
                "He's available for global opportunities and consulting engagements."
            ],
            default: [
                "That's an interesting question! You can find more details in the relevant sections of the portfolio.",
                "I'd recommend checking out the Experience or Projects sections for more specific information.",
                "Feel free to contact Frieze directly for detailed discussions about your specific needs."
            ]
        };

        const lowerMessage = message.toLowerCase();
        let category = 'default';

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            category = 'greeting';
        } else if (lowerMessage.includes('experience') || lowerMessage.includes('work') || lowerMessage.includes('background')) {
            category = 'experience';
        } else if (lowerMessage.includes('skill') || lowerMessage.includes('technical') || lowerMessage.includes('expertise')) {
            category = 'skills';
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('email')) {
            category = 'contact';
        }

        const categoryResponses = responses[category];
        return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Apply initial theme to background overlays
    const currentTheme = body.getAttribute('data-theme');
    if (typeof adjustBackgroundOverlays === 'function') {
        adjustBackgroundOverlays(currentTheme);
    }
    
    // Initialize AI Chatbox on all pages (lazy load)
    setTimeout(() => {
        if (typeof FriezeAI !== 'undefined') {
            new FriezeAI();
        }
    }, 1000);
    
    // Preload critical images (lazy)
    setTimeout(() => {
        const criticalImages = [
            'static/images/profile photo.jpg',
            'static/images/about-photo.jpg'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }, 2000);
});