"""Input validation utilities"""
import re
from email_validator import validate_email, EmailNotValidError
from markupsafe import escape

def validate_and_sanitize_input(value, field_name, max_length=255, required=True):
    """Validate and sanitize text input"""
    if not value and required:
        raise ValueError(f'{field_name} is required')
    
    if not value:
        return ''
    
    if not isinstance(value, str):
        raise ValueError(f'{field_name} must be a string')
    
    # Remove dangerous characters
    sanitized = re.sub(r'[<>"\'/\\&]', '', value.strip())
    
    if len(sanitized) > max_length:
        raise ValueError(f'{field_name} must be less than {max_length} characters')
    
    return sanitized

def validate_email_input(email):
    """Validate email address"""
    if not email:
        raise ValueError('Email is required')
    
    try:
        # Validate email format
        valid = validate_email(email)
        return valid.email
    except EmailNotValidError:
        raise ValueError('Invalid email address')

def sanitize_html(text):
    """Sanitize HTML content"""
    if not text:
        return ''
    return escape(text)