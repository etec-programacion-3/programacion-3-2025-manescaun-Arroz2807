import os   # Módulo para interactuar con variables de entorno del sistema
from dotenv import load_dotenv  # Permite cargar variables de entorno desde un archivo .env

load_dotenv()  # Carga las variables de entorno definidas en el archivo .env

import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # URI de conexión a la base de datos
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///app.db")
    
    # Desactiva el rastreo de modificaciones de objetos en SQLAlchemy
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Clave secreta usada por Flask
    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")
    
    # Configuración del servidor
    FLASK_HOST = os.getenv("FLASK_HOST", "127.0.0.1")
    FLASK_PORT = int(os.getenv("FLASK_PORT", "5000"))
    FLASK_DEBUG = os.getenv("FLASK_DEBUG", "True").lower() == "true"
    
    # Orígenes permitidos para CORS
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")