FROM python:3.13-slim

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar primero solo requirements para aprovechar cache de Docker
COPY requirements.txt .

# Instalar dependencias Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el resto del código
COPY . .

# Crear la carpeta donde va a vivir el SQLite
RUN mkdir -p /app/instance

# Exponer el puerto de Flask
EXPOSE 5000

# Dar permisos de ejecución al script
RUN chmod +x entrypoint.sh

CMD ["./entrypoint.sh"]