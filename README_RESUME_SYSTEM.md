# Secure Resume Download System

This system provides secure, controlled access to your resume with email notifications and approval workflow.

## Features

✅ **Secure Access Control**: Resume downloads require approval  
✅ **Email Notifications**: Get notified when someone requests your resume  
✅ **Admin Dashboard**: Approve/reject requests with one click  
✅ **Download Tracking**: Track how many times your resume is downloaded  
✅ **Professional UI**: Clean, responsive interface  
✅ **Working Social Links**: LinkedIn and GitHub links redirect properly  

## Quick Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run Setup Script**
   ```bash
   python setup.py
   ```

3. **Configure Email (Important!)**
   - Open the `.env` file created by setup
   - Add your Gmail credentials:
     ```
     MAIL_USERNAME=your-email@gmail.com
     MAIL_PASSWORD=your-app-password
     ```
   - For Gmail, use an App Password (not your regular password)
   - Change the admin password from default

4. **Start the Application**
   ```bash
   python app.py
   ```

## How It Works

### For Visitors
1. Visit `/resume` page
2. Click "Request Resume Access"
3. Fill out the request form
4. Receive email confirmation when approved
5. Download resume using secure link

### For You (Admin)
1. Receive email notification for new requests
2. Visit `/admin` to login
3. Review requests in the dashboard
4. Approve/reject with one click
5. Track download statistics

## Admin Access

- **URL**: `http://localhost:5000/admin`
- **Default Email**: `friezekw@gmail.com`
- **Default Password**: `admin123` (change this in .env!)

## Email Configuration

### Gmail Setup
1. Enable 2-Factor Authentication
2. Generate App Password:
   - Google Account → Security → App passwords
   - Select "Mail" and generate password
   - Use this password in `.env` file

### Other Email Providers
Update these settings in `config.py`:
```python
MAIL_SERVER = 'your-smtp-server.com'
MAIL_PORT = 587
MAIL_USE_TLS = True
```

## File Structure

```
├── app.py                 # Main Flask application
├── config.py             # Configuration settings
├── models.py             # Database models
├── setup.py              # Setup script
├── templates/
│   ├── request_resume.html    # Resume request form
│   ├── admin_login.html       # Admin login page
│   └── admin_dashboard.html   # Admin dashboard
├── static/
│   └── Frieze_Kere_Wandabwa_CV.pdf  # Your resume file
└── resume_requests.db    # SQLite database (created automatically)
```

## Social Media Links

The system includes properly working social media links:

- **LinkedIn**: https://www.linkedin.com/in/frieze-wandabwa-224383178/
- **GitHub**: https://github.com/FRIEZEWANDABWA

These links are now properly styled and clickable throughout the website.

## Security Features

- **CSRF Protection**: Forms are protected against cross-site request forgery
- **Secure Headers**: Security headers added to all responses
- **Input Validation**: All form inputs are validated
- **Unique Tokens**: Each approved download gets a unique token
- **Session Management**: Admin sessions are properly managed

## Customization

### Change Admin Credentials
Edit `.env` file:
```
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-secure-password
```

### Update Resume File
Replace `static/Frieze_Kere_Wandabwa_CV.pdf` with your resume file.

### Modify Email Templates
Edit the email templates in `app.py`:
- `send_admin_notification()` - Email sent to you
- `send_approval_email()` - Email sent to requester

## Troubleshooting

### Email Not Sending
1. Check Gmail App Password is correct
2. Verify 2FA is enabled on Gmail
3. Check spam folder
4. Try different SMTP settings

### Database Issues
```bash
# Reset database
rm resume_requests.db
python setup.py
```

### Admin Login Issues
1. Check credentials in `.env` file
2. Clear browser cache
3. Try incognito/private mode

## Production Deployment

For production deployment:

1. **Environment Variables**
   ```bash
   export FLASK_ENV=production
   export SECRET_KEY=your-production-secret-key
   ```

2. **Database**
   - Use PostgreSQL instead of SQLite
   - Update `DATABASE_URL` in `.env`

3. **Email**
   - Use professional email service
   - Configure proper SMTP settings

4. **Security**
   - Use HTTPS
   - Set strong admin password
   - Regular security updates

## Support

For issues or questions:
- Email: friezekw@gmail.com
- LinkedIn: https://www.linkedin.com/in/frieze-wandabwa-224383178/
- GitHub: https://github.com/FRIEZEWANDABWA

---

**Note**: Remember to update your email credentials and admin password before using in production!