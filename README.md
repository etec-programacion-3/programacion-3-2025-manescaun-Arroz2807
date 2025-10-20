# Proyecto Integrador - Programación III

## Datos
- **Nombre del Alumno:** Nicolás Manescau  
- **Curso:** 5to Informática  
- **Ciclo Lectivo:** 2025  
- **Profesor:** Daniel Quinteros  


---


## Cómo descargar el proyecto y crear el entrono virtual


### 1. Clonar el repositorio
Si aún no tenés el proyecto en tu máquina, clonalo con:

```bash
git clone git@github.com:etec-programacion-3/programacion-3-2025-manescaun-Arroz2807.git
cd programacion-3-2025-manescaun-Arroz2807
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


---


## Cómo levantar el Backend


### 1. Cambiar al directorio del Backend

```bash
cd Backend
```


### 2. Instalar dependencias

Con el entorno virtual activado, instalar las dependencias desde el archivo `requirements.txt`:

```bash
pip install -r requirements.txt
```


### 3. Inicializar la base de datos y migraciones

Ejecutar los siguientes comandos para crear la base de datos y aplicar la primera migración:

```bash
flask db init      # (solo la primera vez)
flask db migrate -m "Initial migration"
flask db upgrade
```


### 4. Levantar el servicio

```bash
python app.py
```

Para detenerlo: 

```bash
Ctrl + C
```


---


## Cómo levantar el Frontend


### 1. Cambiar al directorio del Frontend

```bash
cd Frontend
```


### 2. Instalar las dependencias

Con el entorno virtual activado y antes de ejecutar el proyecto, es necesario instalar todas las dependencias listadas en el archivo package.json:

```bash
npm install
```


### 3. Levantar el servicio

```bash
npm run dev
```

Para detenerlo: 

```bash
Ctrl + C
```