import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Set environment variables
os.environ['SECRET_KEY'] = 'dev-secret-key-12345-change-in-production'
os.environ['MAIL_USERNAME'] = 'friezekw@gmail.com'
os.environ['MAIL_PASSWORD'] = 'temp-password-for-dev'
os.environ['ADMIN_PASSWORD'] = 'admin123'
os.environ['JWT_SECRET_KEY'] = 'jwt-secret-dev-key'
os.environ['FLASK_DEBUG'] = 'True'

# Import and run the app
from app import app

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)