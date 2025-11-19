from flask import Flask, request, jsonify   # Flask y utilidades para crear la API
from config import Config                   # Configuración central del proyecto
from datetime import datetime               # Para manejar fechas

# Importar extensiones inicializadas en extensions.py (db y migraciones)
from extensions import db, migrate

# Importar modelos para que SQLAlchemy conozca las tablas
from models import User, Task, Note, File, TaskCollaborator, NoteCollaborator

# Importar el servicio de calendario
from services.calendar_service import CalendarService

from flask_cors import CORS
import bcrypt


def create_app():
    app = Flask(__name__)                 # Crea la aplicación Flask
    app.config.from_object(Config)        # Carga la configuración desde config.py

    # Inicializa la base de datos y migraciones con la app
    db.init_app(app)
    migrate.init_app(app, db)

    # Configuración de CORS con orígenes dinámicos desde config
    CORS(app, supports_credentials=True, origins=Config.CORS_ORIGINS)

    @app.route("/")
    def index():
        return "Backend funcionando con SQLAlchemy"


    # ---------------- USERS ----------------
    @app.route("/users/register", methods=["POST"])
    def register_user():
        """
        Crea un nuevo usuario con contraseña hasheada usando bcrypt.
        Recibe JSON: { "name": "...", "email": "...", "password": "..." }
        """
        data = request.get_json()

        # Validaciones básicas
        if not all(k in data for k in ("name", "email", "password")):
            return jsonify({"error": "Faltan campos obligatorios"}), 400

        # Verificar si el correo ya está en uso
        if User.query.filter_by(email=data["email"]).first():
            return jsonify({"error": "El email ya está registrado"}), 400

        # Hashear la contraseña con bcrypt (nativo)
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(data["password"].encode("utf-8"), salt).decode("utf-8")

        # Crear usuario
        user = User(
            name=data["name"],
            email=data["email"],
            password_hash=hashed_password
        )
        db.session.add(user)
        db.session.commit()

        return jsonify({"message": "Usuario registrado con éxito", "user_id": user.user_id}), 201


    @app.route("/users/login", methods=["POST"])
    def login_user():
        """
        Inicia sesión verificando email y contraseña usando bcrypt.
        Recibe JSON: { "email": "...", "password": "..." }
        """
        data = request.get_json()
        if not all(k in data for k in ("email", "password")):
            return jsonify({"error": "Email y contraseña requeridos"}), 400

        user = User.query.filter_by(email=data["email"]).first()
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        # Verificación con bcrypt (nativo)
        if not bcrypt.checkpw(data["password"].encode("utf-8"), user.password_hash.encode("utf-8")):
            return jsonify({"error": "Contraseña incorrecta"}), 401

        return jsonify({
            "message": "Inicio de sesión exitoso",
            "user_id": user.user_id,
            "name": user.name,
            "email": user.email
        }), 200



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


    # ---------------- TASKS (API REST + Calendario) ----------------
    @app.route("/api/tasks", methods=["POST"])
    def api_create_task():
        """Crear una nueva tarea (API REST)."""
        try:
            data = request.get_json(force=True)
            print("📥 Datos recibidos en /api/tasks:", data)

            if not data.get("title"):
                return jsonify({"error": "El título es obligatorio"}), 400

            user_id = data.get("user_id")
            if not user_id:
                return jsonify({"error": "Falta user_id en la solicitud"}), 400

            due_date = None
            if data.get("due_date"):
                try:
                    due_date = datetime.strptime(data["due_date"], "%Y-%m-%d").date()
                except ValueError:
                    return jsonify({"error": "Formato de fecha inválido. Use YYYY-MM-DD"}), 400

            task = Task(
                user_id_FK=user_id,
                title=data["title"],
                description=data.get("description"),
                status=data.get("status", "pending"),
                due_date=due_date
            )
            db.session.add(task)
            db.session.commit()

            if due_date:
                CalendarService.create_event(task.title, due_date)

            return jsonify({"message": "Tarea creada", "task_id": task.task_id}), 201

        except Exception as e:
            print("❌ Error en /api/tasks:", e)
            return jsonify({"error": str(e)}), 500


    @app.route("/api/tasks", methods=["GET"])
    def api_get_tasks():
        """Obtener todas las tareas (API REST)."""
        user_id = request.args.get("user_id", type=int)
        if user_id:
            tasks = Task.query.filter_by(user_id_FK=user_id).all()
        else:
            tasks = Task.query.all()
        return jsonify([{
            "task_id": t.task_id,
            "title": t.title,
            "description": t.description,
            "status": t.status,
            "due_date": t.due_date.isoformat() if t.due_date else None,
            "user_id": t.user_id_FK
        } for t in tasks])


    @app.route("/api/tasks/<int:task_id>", methods=["GET"])
    def api_get_task(task_id):
        """Obtener una tarea específica (API REST)."""
        task = Task.query.get_or_404(task_id)
        return jsonify({
            "task_id": task.task_id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "due_date": task.due_date.isoformat() if task.due_date else None,
            "user_id": task.user_id_FK
        })

    @app.route("/api/tasks/<int:task_id>", methods=["PUT"])
    def api_update_task(task_id):
        """Actualizar una tarea existente (API REST)."""
        task = Task.query.get_or_404(task_id)
        data = request.get_json()

        if "title" in data and not data["title"]:
            return jsonify({"error": "El título no puede estar vacío"}), 400

        old_due_date = task.due_date
        new_due_date = data.get("due_date", None)

        if "title" in data:
            task.title = data["title"]
        if "description" in data:
            task.description = data["description"]
        if "status" in data:
            task.status = data["status"]

        if "due_date" in data:
            if new_due_date:
                try:
                    task.due_date = datetime.strptime(new_due_date, "%Y-%m-%d").date()
                except ValueError:
                    return jsonify({"error": "Formato de fecha inválido. Use YYYY-MM-DD"}), 400
            else:
                task.due_date = None

        db.session.commit()

        # Invocar lógica de calendario
        if task.due_date and (old_due_date != task.due_date):
            CalendarService.update_event(task.title, task.due_date)
        elif old_due_date and not task.due_date:
            CalendarService.delete_event(task.title)

        return jsonify({"message": "Tarea actualizada"})

    @app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
    def api_delete_task(task_id):
        """Eliminar una tarea existente (API REST)."""
        task = Task.query.get_or_404(task_id)
        db.session.delete(task)
        db.session.commit()

        # Eliminar evento del calendario si la tarea tenía fecha
        if task.due_date:
            CalendarService.delete_event(task.title)

        return jsonify({"message": "Tarea eliminada"})

    # ---------------- NOTES (API REST) ----------------
    @app.route("/api/notes", methods=["POST"])
    def api_create_note():
        """
        Crea una nueva nota (API REST).
        Recibe: { "user_id": ..., "title": "...", "content": "..." }
        """
        data = request.get_json(force=True)

        if not data.get("title"):
            return jsonify({"error": "El título es obligatorio"}), 400
        user_id = data.get("user_id")

        if not user_id:
            return jsonify({"error": "Falta user_id en la solicitud"}), 400

        note = Note(
            user_id_FK=user_id,
            title=data["title"],
            content=data.get("content")
        )
        db.session.add(note)
        db.session.commit()
        return jsonify({"message": "Nota creada", "note_id": note.note_id}), 201


    @app.route("/api/notes", methods=["GET"])
    def api_get_notes():
        """Devuelve las notas del usuario autenticado (API REST)."""
        user_id = request.args.get("user_id", type=int)
        if user_id:
            notes = Note.query.filter_by(user_id_FK=user_id).all()
        else:
            notes = Note.query.all()

        return jsonify([{
            "note_id": n.note_id,
            "title": n.title,
            "content": n.content,
            "user_id": n.user_id_FK,
            "created_at": getattr(n, "created_at", None)
        } for n in notes])

    @app.route("/api/notes/<int:note_id>", methods=["GET"])
    def api_get_note(note_id):
        """Devuelve una nota específica por su ID (API REST)."""
        note = Note.query.get_or_404(note_id)
        return jsonify({
            "note_id": note.note_id,
            "title": note.title,
            "content": note.content,
            "user_id": note.user_id_FK
        })

    @app.route("/api/notes/<int:note_id>", methods=["PUT"])
    def api_update_note(note_id):
        """Actualizar una nota existente (API REST)."""
        note = Note.query.get_or_404(note_id)
        data = request.get_json()

        if "title" in data and not data["title"]:
            return jsonify({"error": "El título no puede estar vacío"}), 400

        if "title" in data:
            note.title = data["title"]
        if "content" in data:
            note.content = data["content"]

        db.session.commit()
        return jsonify({"message": "Nota actualizada"})

    @app.route("/api/notes/<int:note_id>", methods=["DELETE"])
    def api_delete_note(note_id):
        """Eliminar una nota existente (API REST)."""
        note = Note.query.get_or_404(note_id)
        db.session.delete(note)
        db.session.commit()
        return jsonify({"message": "Nota eliminada"})

    return app


if __name__ == "__main__":
    app = create_app()       # Crea la app Flask
    app.run(debug=True)      # Levanta el servidor en modo debug
