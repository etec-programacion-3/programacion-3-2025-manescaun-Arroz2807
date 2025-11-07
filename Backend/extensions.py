from flask_sqlalchemy import SQLAlchemy   # ORM de Flask para manejar la BD
from flask_migrate import Migrate         # Extensión para manejar migraciones con Alembic

db = SQLAlchemy()   # Instancia global de SQLAlchemy
migrate = Migrate() # Instancia global de Migrate
