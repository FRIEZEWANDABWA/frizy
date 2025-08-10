from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()

class ResumeRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    company = db.Column(db.String(100))
    reason = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected
    requested_at = db.Column(db.DateTime, default=datetime.utcnow)
    approved_at = db.Column(db.DateTime)
    download_token = db.Column(db.String(100))
    download_count = db.Column(db.Integer, default=0)
    
    def to_dict(self):
        return {
            'id': self.id,
            'request_id': self.request_id,
            'name': self.name,
            'email': self.email,
            'company': self.company,
            'reason': self.reason,
            'status': self.status,
            'requested_at': self.requested_at.isoformat() if self.requested_at else None,
            'approved_at': self.approved_at.isoformat() if self.approved_at else None,
            'download_count': self.download_count
        }