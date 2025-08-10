from flask import Flask, render_template, send_from_directory, request, abort, jsonify, redirect, url_for, flash, session
from flask_mail import Mail, Message
from flask_sqlalchemy import SQLAlchemy
import os
import secrets
from datetime import datetime
from werkzeug.utils import secure_filename
from config import Config
from models import db, ResumeRequest

app = Flask(__name__)
app.config.from_object(Config)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Initialize extensions
db.init_app(app)
mail = Mail(app)

# Create tables
with app.app_context():
    db.create_all()

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

@app.route('/request-resume', methods=['GET', 'POST'])
def request_resume():
    if request.method == 'POST':
        data = request.get_json()
        
        # Create new resume request
        resume_request = ResumeRequest(
            name=data.get('name'),
            email=data.get('email'),
            company=data.get('company', ''),
            reason=data.get('reason', '')
        )
        
        db.session.add(resume_request)
        db.session.commit()
        
        # Send notification email to admin
        try:
            send_admin_notification(resume_request)
            return jsonify({'success': True, 'message': 'Request submitted successfully. You will receive an email once approved.'})
        except Exception as e:
            return jsonify({'success': False, 'message': 'Request submitted but email notification failed.'})
    
    return render_template('request_resume.html')

@app.route('/download-resume/<token>')
def download_resume(token):
    resume_request = ResumeRequest.query.filter_by(download_token=token, status='approved').first()
    if not resume_request:
        abort(404)
    
    # Increment download count
    resume_request.download_count += 1
    db.session.commit()
    
    filename = 'Frieze_Kere_Wandabwa_CV.pdf'
    if not os.path.exists(os.path.join('static', filename)):
        abort(404)
    return send_from_directory('static', filename, as_attachment=True)

@app.route('/admin')
def admin_login():
    return render_template('admin_login.html')

@app.route('/admin/login', methods=['POST'])
def admin_authenticate():
    email = request.form.get('email')
    password = request.form.get('password')
    
    if email == app.config['ADMIN_EMAIL'] and password == app.config['ADMIN_PASSWORD']:
        session['admin_logged_in'] = True
        return redirect(url_for('admin_dashboard'))
    else:
        flash('Invalid credentials', 'error')
        return redirect(url_for('admin_login'))

@app.route('/admin/dashboard')
def admin_dashboard():
    if not session.get('admin_logged_in'):
        return redirect(url_for('admin_login'))
    
    requests = ResumeRequest.query.order_by(ResumeRequest.requested_at.desc()).all()
    return render_template('admin_dashboard.html', requests=requests)

@app.route('/admin/approve/<int:request_id>')
def approve_request(request_id):
    if not session.get('admin_logged_in'):
        return redirect(url_for('admin_login'))
    
    resume_request = ResumeRequest.query.get_or_404(request_id)
    resume_request.status = 'approved'
    resume_request.approved_at = datetime.utcnow()
    resume_request.download_token = secrets.token_urlsafe(32)
    
    db.session.commit()
    
    # Send approval email
    try:
        send_approval_email(resume_request)
        flash('Request approved and email sent', 'success')
    except Exception as e:
        flash('Request approved but email failed to send', 'warning')
    
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/reject/<int:request_id>')
def reject_request(request_id):
    if not session.get('admin_logged_in'):
        return redirect(url_for('admin_login'))
    
    resume_request = ResumeRequest.query.get_or_404(request_id)
    resume_request.status = 'rejected'
    
    db.session.commit()
    flash('Request rejected', 'info')
    
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/logout')
def admin_logout():
    session.pop('admin_logged_in', None)
    return redirect(url_for('admin_login'))

def send_admin_notification(resume_request):
    msg = Message(
        subject='New Resume Download Request',
        recipients=[app.config['ADMIN_EMAIL']],
        html=f'''
        <h3>New Resume Download Request</h3>
        <p><strong>Name:</strong> {resume_request.name}</p>
        <p><strong>Email:</strong> {resume_request.email}</p>
        <p><strong>Company:</strong> {resume_request.company or 'Not provided'}</p>
        <p><strong>Reason:</strong> {resume_request.reason or 'Not provided'}</p>
        <p><strong>Requested at:</strong> {resume_request.requested_at}</p>
        
        <p><a href="{request.url_root}admin/dashboard" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Review Request</a></p>
        '''
    )
    mail.send(msg)

def send_approval_email(resume_request):
    download_url = url_for('download_resume', token=resume_request.download_token, _external=True)
    
    msg = Message(
        subject='Resume Download Approved - Frieze Kere Wandabwa',
        recipients=[resume_request.email],
        html=f'''
        <h3>Your Resume Download Request has been Approved!</h3>
        <p>Dear {resume_request.name},</p>
        <p>Thank you for your interest in my professional background. Your request to download my resume has been approved.</p>
        
        <p><a href="{download_url}" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Download Resume</a></p>
        
        <p>This download link is unique to you and will track when the resume is downloaded.</p>
        
        <p>Best regards,<br>Frieze Kere Wandabwa<br>Regional IT Leader</p>
        '''
    )
    mail.send(msg)

if __name__ == '__main__':
    # Production settings
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    host = os.environ.get('FLASK_HOST', '127.0.0.1')
    port = int(os.environ.get('FLASK_PORT', 5000))
    
    app.run(debug=debug_mode, host=host, port=port)