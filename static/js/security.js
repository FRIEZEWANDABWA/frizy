// Security utilities for input validation and sanitization
class SecurityUtils {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length <= 254;
    }

    static sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        return input.replace(/[<>\"'&\/\\]/g, function(match) {
            const escapeMap = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                '&': '&amp;',
                '/': '&#x2F;',
                '\\': '&#x5C;'
            };
            return escapeMap[match];
        }).trim().substring(0, 1000);
    }

    static validateLength(input, maxLength = 1000) {
        return typeof input === 'string' && input.length <= maxLength;
    }

    static showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `alert alert-${type}`;
        messageDiv.textContent = this.sanitizeInput(message);
        
        const container = document.querySelector('.container') || document.body;
        container.insertBefore(messageDiv, container.firstChild);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Add to global scope
window.SecurityUtils = SecurityUtils;