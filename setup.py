#!/usr/bin/env python3
"""
Setup script for the secure resume download system
"""

import os
import secrets
from flask import Flask
from models import db

def generate_secret_key():
    """Generate a secure secret key"""
    return secrets.token_urlsafe(32)

def create_env_file():
    """Create .env file from .env.example if it doesn't exist"""
    if not os.path.exists('.env'):
        if os.path.exists('.env.example'):
            with open('.env.example', 'r') as example:
                content = example.read()
            
            # Replace placeholder values
            content = content.replace('your-secret-key-here', generate_secret_key())
            content = content.replace('your-jwt-secret-key', generate_secret_key())
            content = content.replace('your-secure-admin-password', 'admin123')  # Change this!
            
            with open('.env', 'w') as env_file:
                env_file.write(content)
            
            print("✅ Created .env file from .env.example")
            print("⚠️  Please update the email credentials and admin password in .env file")
        else:
            print("❌ .env.example file not found")
    else:
        print("ℹ️  .env file already exists")

def setup_database():
    """Initialize the database"""
    from config import Config
    
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
        print("✅ Database tables created successfully")

def main():
    print("🚀 Setting up Secure Resume Download System...")
    print("=" * 50)
    
    # Create environment file
    create_env_file()
    
    # Setup database
    setup_database()
    
    print("\n✅ Setup completed!")
    print("\n📋 Next steps:")
    print("1. Update your email credentials in the .env file")
    print("2. Change the admin password in the .env file")
    print("3. Run: python app.py")
    print("4. Visit: http://localhost:5000/admin to manage resume requests")
    print("\n🔗 Social Media Links:")
    print("- LinkedIn: https://www.linkedin.com/in/frieze-wandabwa-224383178/")
    print("- GitHub: https://github.com/FRIEZEWANDABWA")

if __name__ == "__main__":
    main()