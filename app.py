from flask import Flask, render_template, send_from_directory, request, abort
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Security headers
@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'"
    return response

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/experience')
def experience():
    return render_template('experience.html')

@app.route('/achievements')
def achievements():
    return render_template('achievements.html')

@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/resume')
def resume():
    return render_template('resume.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/blog')
def blog():
    return render_template('blog.html')

@app.route('/download-cv')
def download_cv():
    filename = 'Frieze_Kere_Wandabwa_CV.pdf'
    if not os.path.exists(os.path.join('static', filename)):
        abort(404)
    return send_from_directory('static', filename, as_attachment=True)

if __name__ == '__main__':
    # Production settings
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    host = os.environ.get('FLASK_HOST', '127.0.0.1')
    port = int(os.environ.get('FLASK_PORT', 5000))
    
    app.run(debug=debug_mode, host=host, port=port)