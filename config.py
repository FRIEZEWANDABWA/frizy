import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    
    # Email configuration
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_USERNAME')
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///resume_requests.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Admin credentials
    ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL') or 'friezekw@gmail.com'
    ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD')
    
    @classmethod
    def validate_config(cls):
        required_vars = ['SECRET_KEY', 'MAIL_USERNAME', 'MAIL_PASSWORD', 'ADMIN_PASSWORD']
        missing = [var for var in required_vars if not os.environ.get(var)]
        if missing:
            raise ValueError(f'Missing required environment variables: {", ".join(missing)}')
    
    # JWT settings
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-string'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)