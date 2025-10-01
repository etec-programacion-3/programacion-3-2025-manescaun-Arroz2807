from extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)

    tasks = db.relationship("Task", backref="user", lazy=True, cascade="all, delete-orphan")
    notes = db.relationship("Note", backref="user", lazy=True, cascade="all, delete-orphan")
    files = db.relationship("File", backref="user", lazy=True, cascade="all, delete-orphan")


class Task(db.Model):
    __tablename__ = "tasks"

    task_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id_FK = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    due_date = db.Column(db.Date)
    status = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    collaborators = db.relationship("TaskCollaborator", backref="task", lazy=True, cascade="all, delete-orphan")


class Note(db.Model):
    __tablename__ = "notes"

    note_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id_FK = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    collaborators = db.relationship("NoteCollaborator", backref="note", lazy=True, cascade="all, delete-orphan")


class File(db.Model):
    __tablename__ = "files"

    file_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id_FK = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    file_name = db.Column(db.String(255), nullable=False)
    path = db.Column(db.String(255))
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)


class TaskCollaborator(db.Model):
    __tablename__ = "task_collaborators"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    task_id_FK = db.Column(db.Integer, db.ForeignKey("tasks.task_id"), nullable=False)
    collaborator_id_FK = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)


class NoteCollaborator(db.Model):
    __tablename__ = "note_collaborators"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    note_id_FK = db.Column(db.Integer, db.ForeignKey("notes.note_id"), nullable=False)
    collaborator_id_FK = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)
