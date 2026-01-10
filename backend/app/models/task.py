from sqlalchemy import func
from ..extensions import db

class Task(db.Model):
    __tablename__ = 'tasks'

    task_id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable = False)

    created_at = db.Column(db.TimeDate, server_default = func.now())

    def __repr__(self):
        return f'Task {self.title}'