# Proyecto Integrador - Programación III

## Datos
- **Nombre del Alumno:** Nicolás Manescau  
- **Curso:** 5to Informática  
- **Ciclo Lectivo:** 2025  
- **Profesor:** Daniel Quinteros  

---

## Cómo levantar el Backend


### 1. Clonar el repositorio
Si aún no tenés el proyecto en tu máquina, clonalo con:

```bash
git clone <URL_DEL_REPO>
cd <NOMBRE_DEL_PROYECTO>
```


### 2. Crear y activar entorno virtual (venv)
```bash
python -m venv venv
```


### 3.  Activar entorno virtual (venv)

**En Linux / MacOS:**
```bash
source venv/bin/activate
```

**En Windows (PowerShell):**
```bash 
venv\Scripts\Activate
```


### 3. Instalar dependencias

Con el entorno virtual activado, instalar las dependencias desde el archivo `requirements.txt`:

```bash
pip install -r requirements.txt
```


### 4. Inicializar la base de datos y migraciones

Ejecutar los siguientes comandos para crear la base de datos y aplicar la primera migración:

```bash
flask db init      # (solo la primera vez)
flask db migrate -m "Initial migration"
flask db upgrade
```


### 5. Levantar el servidor

python app.py

---

