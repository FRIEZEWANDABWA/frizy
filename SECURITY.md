# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Features

### Implemented Security Measures

- **Input Validation**: All user inputs are validated and sanitized
- **CSRF Protection**: Cross-Site Request Forgery protection enabled
- **XSS Prevention**: HTML escaping and content sanitization
- **SQL Injection Prevention**: Parameterized queries via SQLAlchemy ORM
- **Secure Headers**: Security headers implemented
- **Email Validation**: Proper email format validation
- **Rate Limiting**: Basic rate limiting on forms
- **Secure Configuration**: No hardcoded credentials

### Environment Variables Required

The following environment variables must be set:

- `SECRET_KEY`: Flask secret key for sessions
- `MAIL_USERNAME`: Email username for notifications
- `MAIL_PASSWORD`: Email password (use app passwords)
- `ADMIN_PASSWORD`: Admin panel password
- `ADMIN_EMAIL`: Admin email address

### Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong passwords** for admin access
3. **Enable HTTPS** in production
4. **Regular security updates** of dependencies
5. **Monitor logs** for suspicious activity

## Reporting a Vulnerability

If you discover a security vulnerability, please send an email to friezekw@gmail.com.

**Please do not report security vulnerabilities through public GitHub issues.**

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution**: Varies based on complexity

## Security Updates

Security updates will be released as patch versions and documented in the changelog.

## Contact

For security-related questions: friezekw@gmail.com