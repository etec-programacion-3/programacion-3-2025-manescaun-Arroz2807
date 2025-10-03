from flask import Flask, request, jsonify   # Flask y utilidades para crear la API
from config import Config                   # Configuración central del proyecto

# Importar extensiones inicializadas en extensions.py (db y migraciones)
from extensions import db, migrate

# Importar modelos para que SQLAlchemy conozca las tablas
from models import User, Task, Note, File, TaskCollaborator, NoteCollaborator


def create_app():
    app = Flask(__name__)                 # Crea la aplicación Flask
    app.config.from_object(Config)        # Carga la configuración desde config.py

    # Inicializa la base de datos y migraciones con la app
    db.init_app(app)
    migrate.init_app(app, db)

    @app.route("/")  # Ruta principal de prueba
    def index():
        return "Backend funcionando con SQLAlchemy 🚀"

    # ---------------- USERS ----------------
    @app.route("/users", methods=["POST"])
    def create_user():
        """
        Crea un nuevo usuario en la base de datos.
        Recibe un JSON con: { "name": "...", "email": "...", "password_hash": "..." }
        """
        data = request.get_json()   # Obtiene el JSON del request
        user = User(
            name=data["name"],
            email=data["email"],
            password_hash=data["password_hash"]
        )
        db.session.add(user)        # Añade el usuario a la sesión
        db.session.commit()         # Guarda cambios en la BD
        return jsonify({"message": "Usuario creado", "user_id": user.user_id}), 201

    @app.route("/users", methods=["GET"])
    def get_users():
        """Devuelve todos los usuarios registrados en formato JSON"""
        users = User.query.all()
        return jsonify([{
            "user_id": u.user_id,
            "name": u.name,
            "email": u.email,
            "registration_date": u.registration_date
        } for u in users])

    @app.route("/users/<int:user_id>", methods=["GET"])
    def get_user(user_id):
        """Devuelve un usuario específico por su ID"""
        user = User.query.get_or_404(user_id)
        return jsonify({
            "user_id": user.user_id,
            "name": user.name,
            "email": user.email,
            "registration_date": user.registration_date
        })

    # ---------------- TASKS ----------------
    @app.route("/tasks", methods=["POST"])
    def create_task():
        """
        Crea una nueva tarea para un usuario.
        Recibe: { "user_id": ..., "title": "...", "description": "...", "status": "..." }
        """
        data = request.get_json()
        task = Task(
            user_id_FK=data["user_id"],
            title=data["title"],
            description=data.get("description"),
            status=data.get("status", "pending")   # Por defecto estado = "pending"
        )
        db.session.add(task)
        db.session.commit()
        return jsonify({"message": "Tarea creada", "task_id": task.task_id}), 201

    @app.route("/tasks", methods=["GET"])
    def get_tasks():
        """Devuelve todas las tareas registradas"""
        tasks = Task.query.all()
        return jsonify([{
            "task_id": t.task_id,
            "title": t.title,
            "description": t.description,
            "status": t.status,
            "user_id": t.user_id_FK
        } for t in tasks])

    @app.route("/tasks/<int:task_id>", methods=["GET"])
    def get_task(task_id):
        """Devuelve una tarea específica por su ID"""
        task = Task.query.get_or_404(task_id)
        return jsonify({
            "task_id": task.task_id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "user_id": task.user_id_FK
        })

    # ---------------- NOTES ----------------
    @app.route("/notes", methods=["POST"])
    def create_note():
        """
        Crea una nueva nota para un usuario.
        Recibe: { "user_id": ..., "title": "...", "content": "..." }
        """
        data = request.get_json()
        note = Note(
            user_id_FK=data["user_id"],
            title=data["title"],
            content=data.get("content")
        )
        db.session.add(note)
        db.session.commit()
        return jsonify({"message": "Nota creada", "note_id": note.note_id}), 201

    @app.route("/notes", methods=["GET"])
    def get_notes():
        """Devuelve todas las notas registradas"""
        notes = Note.query.all()
        return jsonify([{
            "note_id": n.note_id,
            "title": n.title,
            "content": n.content,
            "user_id": n.user_id_FK
        } for n in notes])

    @app.route("/notes/<int:note_id>", methods=["GET"])
    def get_note(note_id):
        """Devuelve una nota específica por su ID"""
        note = Note.query.get_or_404(note_id)
        return jsonify({
            "note_id": note.note_id,
            "title": note.title,
            "content": note.content,
            "user_id": note.user_id_FK
        })

    return app


if __name__ == "__main__":
    app = create_app()       # Crea la app Flask
    app.run(debug=True)      # Levanta el servidor en modo debug