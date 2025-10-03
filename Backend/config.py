import os                     # Módulo para interactuar con variables de entorno del sistema
from dotenv import load_dotenv  # Permite cargar variables de entorno desde un archivo .env

load_dotenv()  # Carga las variables de entorno definidas en el archivo .env

class Config:
    # URI de conexión a la base de datos. Si existe DATABASE_URL en .env la usa, si no usa SQLite local.
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///app.db")
    
    # Desactiva el rastreo de modificaciones de objetos en SQLAlchemy (consume recursos si está activado).
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Clave secreta usada por Flask (ejemplo: sesiones, cookies firmadas, CSRF).
    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")