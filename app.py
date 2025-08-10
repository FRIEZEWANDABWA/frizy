from flask import Flask, render_template, send_from_directory, request, abort, jsonify, redirect, url_for, flash, session
from flask_mail import Mail, Message
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect
from email_validator import validate_email, EmailNotValidError
import os
import secrets
import re
from datetime import datetime, timezone
from werkzeug.utils import secure_filename
from markupsafe import escape
from config import Config
from models import db, ResumeRequest, RequestStatus
from validation import validate_and_sanitize_input, validate_email_input, sanitize_html

app = Flask(__name__)
app.config.from_object(Config)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Validate configuration
try:
    Config.validate_config()
except ValueError as e:
    print(f"Configuration error: {e}")
    exit(1)

# Initialize extensions
db.init_app(app)
mail = Mail(app)
csrf = CSRFProtect(app)

# Create tables
with app.app_context():
    db.create_all()

# Rate limiting storage
request_counts = {}

# Security headers
@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:;"
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
    return response

# Rate limiting decorator
def rate_limit(max_requests=5, window=300):
    def decorator(f):
        def wrapper(*args, **kwargs):
            client_ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
            current_time = datetime.now().timestamp()
            
            if client_ip not in request_counts:
                request_counts[client_ip] = []
            
            # Clean old requests
            request_counts[client_ip] = [req_time for req_time in request_counts[client_ip] if current_time - req_time < window]
            
            if len(request_counts[client_ip]) >= max_requests:
                return jsonify({'success': False, 'message': 'Rate limit exceeded. Please try again later.'}), 429
            
            request_counts[client_ip].append(current_time)
            return f(*args, **kwargs)
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator

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

@app.route('/blog/<article_id>')
def blog_article(article_id):
    articles = {
        'ai-africa-kenya': {
            'title': 'AI in Africa: Kenya Leads the Charge into the Future',
            'excerpt': 'The continent isn\'t just adopting AI; it\'s actively shaping it, and at the epicenter of this rapid evolution stands Kenya.',
            'category': 'AI & AFRICA',
            'date': 'December 2024',
            'read_time': '5 min read',
            'icon': 'fas fa-globe-africa',
            'gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'content': '''
            <p>Africa is experiencing an unprecedented technological renaissance, and artificial intelligence sits at the heart of this transformation. The continent isn't just adopting AI; it's actively shaping it, and at the epicenter of this rapid evolution stands Kenya.</p>
            
            <h3>Kenya's AI Leadership</h3>
            <p>From Nairobi's Silicon Savannah to rural farming communities, AI is revolutionizing how Kenyans work, learn, and live. The country has emerged as a continental leader in AI adoption, with initiatives spanning healthcare, agriculture, finance, and education.</p>
            
            <h3>Real-World Applications</h3>
            <p>In healthcare, AI-powered diagnostic tools are helping doctors in remote areas identify diseases faster and more accurately. Agricultural AI systems are providing farmers with precise weather predictions and crop management advice, increasing yields and reducing waste.</p>
            
            <p>The financial sector has embraced AI for fraud detection and credit scoring, making financial services more accessible to previously underserved populations. Mobile money platforms like M-Pesa are integrating AI to enhance security and user experience.</p>
            
            <h3>The Future is Bright</h3>
            <p>As Kenya continues to invest in AI infrastructure and education, the country is positioning itself as a global AI hub. With a young, tech-savvy population and supportive government policies, Kenya is not just participating in the AI revolution – it's leading it.</p>
            '''
        },
        'personal-ai': {
            'title': 'Beyond the Chatbot: The Rise of Your Personal AI',
            'excerpt': 'We are moving beyond the chatbot and entering the era of the truly personal AI companion.',
            'category': 'AI INNOVATION',
            'date': 'December 2024',
            'read_time': '4 min read',
            'icon': 'fas fa-robot',
            'gradient': 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            'content': '''
            <p>The age of generic chatbots is ending. We are moving beyond simple question-and-answer systems and entering the era of the truly personal AI companion – an intelligent assistant that knows you, understands your preferences, and adapts to your unique needs.</p>
            
            <h3>The Personal Touch</h3>
            <p>Unlike traditional chatbots that provide the same responses to everyone, personal AI systems learn from your interactions, remember your preferences, and develop a deep understanding of your work style, communication patterns, and goals.</p>
            
            <h3>Transforming Productivity</h3>
            <p>Imagine an AI that knows your schedule, understands your priorities, and can proactively suggest optimizations to your workflow. This isn't science fiction – it's happening now. Personal AI assistants are becoming sophisticated enough to handle complex tasks, manage projects, and even make decisions on your behalf.</p>
            
            <h3>The Human-AI Partnership</h3>
            <p>The future isn't about AI replacing humans; it's about creating powerful partnerships where AI amplifies human capabilities. Your personal AI becomes an extension of yourself, handling routine tasks so you can focus on creativity, strategy, and meaningful connections.</p>
            
            <p>As we move forward, the question isn't whether you'll have a personal AI – it's how quickly you'll embrace this transformative technology to unlock your full potential.</p>
            '''
        },
        '5g-africa': {
            'title': '5G Revolution in Africa: Connecting the Unconnected',
            'excerpt': 'How next-generation networks are transforming connectivity across the continent.',
            'category': 'NETWORK TECHNOLOGY',
            'date': 'December 2024',
            'read_time': '6 min read',
            'icon': 'fas fa-signal',
            'gradient': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'content': '''
            <p>The 5G revolution is sweeping across Africa, promising to bridge the digital divide and unlock unprecedented opportunities for economic growth and social development.</p>
            
            <h3>Infrastructure Transformation</h3>
            <p>African countries are investing heavily in 5G infrastructure, with South Africa, Kenya, and Nigeria leading the charge. These networks offer speeds up to 100 times faster than 4G, enabling new applications and services that were previously impossible.</p>
            
            <h3>Economic Impact</h3>
            <p>5G technology is expected to contribute billions to African economies through improved productivity, new business models, and enhanced digital services. From smart cities to precision agriculture, 5G is the foundation for Africa's digital future.</p>
            
            <h3>Challenges and Opportunities</h3>
            <p>While the rollout faces challenges including infrastructure costs and regulatory frameworks, the opportunities far outweigh the obstacles. 5G will enable telemedicine in remote areas, smart farming solutions, and immersive educational experiences.</p>
            '''
        },
        'ai-automation': {
            'title': 'AI Automation in Business: The New Competitive Advantage',
            'excerpt': 'Streamlining operations with intelligent automation solutions.',
            'category': 'BUSINESS AUTOMATION',
            'date': 'December 2024',
            'read_time': '5 min read',
            'icon': 'fas fa-cogs',
            'gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'content': '''
            <p>Artificial Intelligence is revolutionizing business operations through intelligent automation, creating new levels of efficiency and competitive advantage.</p>
            
            <h3>Beyond Simple Automation</h3>
            <p>While traditional automation handles repetitive tasks, AI automation brings intelligence to the process. It can make decisions, adapt to changing conditions, and continuously improve performance.</p>
            
            <h3>Real-World Applications</h3>
            <p>From customer service chatbots that understand context and emotion to supply chain systems that predict and prevent disruptions, AI automation is transforming every aspect of business operations.</p>
            
            <h3>The Strategic Advantage</h3>
            <p>Companies that embrace AI automation gain significant advantages: reduced costs, improved accuracy, faster response times, and the ability to scale operations without proportional increases in staff.</p>
            '''
        },
        'tech-facts': {
            'title': 'Amazing Tech Statistics That Will Blow Your Mind',
            'excerpt': 'Mind-blowing facts about technology and digital transformation.',
            'category': 'TECH FACTS',
            'date': 'December 2024',
            'read_time': '3 min read',
            'icon': 'fas fa-chart-line',
            'gradient': 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            'content': '''
            <p>The world of technology is full of incredible statistics that showcase just how rapidly our digital world is evolving.</p>
            
            <h3>Internet and Connectivity</h3>
            <p>Every minute, over 500 hours of video are uploaded to YouTube, 6 million searches are performed on Google, and 350,000 tweets are sent.</p>
            
            <h3>Mobile Revolution</h3>
            <p>There are more mobile phones than people on Earth, with over 8 billion mobile subscriptions globally.</p>
            
            <h3>Data Explosion</h3>
            <p>We create 2.5 quintillion bytes of data every day. 90% of all data in the world was created in just the last two years.</p>
            '''
        },
        'future-tech': {
            'title': 'Emerging Technologies: AR, VR, and the Metaverse Revolution',
            'excerpt': 'Exploring AR, VR, and the metaverse revolution.',
            'category': 'FUTURE TECH',
            'date': 'December 2024',
            'read_time': '6 min read',
            'icon': 'fas fa-rocket',
            'gradient': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'content': '''
            <p>We stand at the threshold of a new digital frontier where the boundaries between physical and virtual worlds are dissolving.</p>
            
            <h3>The AR Revolution</h3>
            <p>Augmented Reality is transforming industries from retail to healthcare. The AR market is expected to reach $198 billion by 2025.</p>
            
            <h3>VR's Immersive Future</h3>
            <p>Virtual Reality is moving beyond gaming into education, training, and therapy.</p>
            
            <h3>The Metaverse Emergence</h3>
            <p>The metaverse represents a persistent, shared virtual world where people can work, socialize, and create.</p>
            '''
        }
    }
    
    article = articles.get(article_id)
    if not article:
        abort(404)
    
    return render_template('blog_article.html', article=article)

@app.route('/request-resume', methods=['GET', 'POST'])
@rate_limit(max_requests=3, window=3600)  # 3 requests per hour
def request_resume():
    if request.method == 'POST':
        try:
            data = request.get_json()
            
            # Validate input
            name = validate_and_sanitize_input(data.get('name'), 'name', max_length=100)
            email = validate_email_input(data.get('email'))
            company = validate_and_sanitize_input(data.get('company', ''), 'company', max_length=100, required=False)
            reason = validate_and_sanitize_input(data.get('reason', ''), 'reason', max_length=500, required=False)
            
            # Create new resume request
            resume_request = ResumeRequest(
                name=name,
                email=email,
                company=company,
                reason=reason
            )
            
            db.session.add(resume_request)
            db.session.commit()
            
            # Send notification email to admin
            try:
                send_admin_notification(resume_request)
                return jsonify({'success': True, 'message': 'Request submitted successfully. You will receive an email once approved.'})
            except Exception as e:
                app.logger.error(f'Email notification failed: {str(e)}')
                return jsonify({'success': False, 'message': 'Request submitted but email notification failed.'})
                
        except ValueError as e:
            return jsonify({'success': False, 'message': str(e)}), 400
        except Exception as e:
            app.logger.error(f'Request processing failed: {str(e)}')
            return jsonify({'success': False, 'message': 'An error occurred processing your request.'}), 500
    
    return render_template('request_resume.html')

@app.route('/download-resume/<token>')
def download_resume(token):
    # Validate token format
    if not token or not re.match(r'^[a-zA-Z0-9_-]+$', token):
        abort(404)
    
    try:
        resume_request = ResumeRequest.query.filter_by(download_token=token, status=RequestStatus.APPROVED).first()
        if not resume_request:
            abort(404)
        
        # Increment download count
        resume_request.download_count += 1
        db.session.commit()
        
        filename = 'Frieze_Kere_Wandabwa_CV.pdf'
        if not os.path.exists(os.path.join('static', filename)):
            abort(404)
        return send_from_directory('static', filename, as_attachment=True)
    except Exception as e:
        app.logger.error(f'Download failed: {str(e)}')
        abort(500)

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
    
    try:
        resume_request = ResumeRequest.query.get_or_404(request_id)
        resume_request.status = RequestStatus.APPROVED
        resume_request.approved_at = datetime.now(timezone.utc)
        resume_request.download_token = secrets.token_urlsafe(32)
        
        db.session.commit()
        
        # Send approval email
        try:
            send_approval_email(resume_request)
            flash('Request approved and email sent', 'success')
        except Exception as e:
            app.logger.error(f'Approval email failed: {str(e)}')
            flash('Request approved but email failed to send', 'warning')
    except Exception as e:
        app.logger.error(f'Approval failed: {str(e)}')
        flash('Failed to approve request', 'error')
    
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/reject/<int:request_id>')
def reject_request(request_id):
    if not session.get('admin_logged_in'):
        return redirect(url_for('admin_login'))
    
    try:
        resume_request = ResumeRequest.query.get_or_404(request_id)
        resume_request.status = RequestStatus.REJECTED
        
        db.session.commit()
        flash('Request rejected', 'info')
    except Exception as e:
        app.logger.error(f'Rejection failed: {str(e)}')
        flash('Failed to reject request', 'error')
    
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/logout')
def admin_logout():
    session.pop('admin_logged_in', None)
    return redirect(url_for('admin_login'))

def send_admin_notification(resume_request):
    try:
        msg = Message(
            subject='New Resume Download Request',
            recipients=[app.config['ADMIN_EMAIL']],
            html=f'''
            <h3>New Resume Download Request</h3>
            <p><strong>Name:</strong> {escape(resume_request.name)}</p>
            <p><strong>Email:</strong> {escape(resume_request.email)}</p>
            <p><strong>Company:</strong> {escape(resume_request.company or 'Not provided')}</p>
            <p><strong>Reason:</strong> {escape(resume_request.reason or 'Not provided')}</p>
            <p><strong>Requested at:</strong> {resume_request.requested_at}</p>
            
            <p><a href="{request.url_root}admin/dashboard" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Review Request</a></p>
            '''
        )
        mail.send(msg)
    except Exception as e:
        app.logger.error(f'Failed to send admin notification: {str(e)}')
        raise

def send_approval_email(resume_request):
    try:
        download_url = url_for('download_resume', token=resume_request.download_token, _external=True)
        
        msg = Message(
            subject='Resume Download Approved - Frieze Kere Wandabwa',
            recipients=[resume_request.email],
            html=f'''
            <h3>Your Resume Download Request has been Approved!</h3>
            <p>Dear {escape(resume_request.name)},</p>
            <p>Thank you for your interest in my professional background. Your request to download my resume has been approved.</p>
            
            <p><a href="{download_url}" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Download Resume</a></p>
            
            <p>This download link is unique to you and will track when the resume is downloaded.</p>
            
            
            <p>Best regards,<br>Frieze Kere Wandabwa<br>Regional IT Leader</p>
            '''
        )
        mail.send(msg)
    except Exception as e:
        app.logger.error(f'Failed to send approval email: {str(e)}')
        raise

if __name__ == '__main__':
    # Production settings
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    host = os.environ.get('FLASK_HOST', '127.0.0.1')
    port = int(os.environ.get('FLASK_PORT', 5000))
    
    app.run(debug=debug_mode, host=host, port=port)