// ==========================================================
// 🌐 CONFIGURACIÓN GENERAL DE API
// ==========================================================

// Definimos la URL base del backend principal (rutas /api para tareas y notas)
const API_URL = "http://127.0.0.1:5000/api";

// Función auxiliar para manejar respuestas HTTP y errores
const handleResponse = async (response, action) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al ${action}: ${errorText}`);
  }
  return response.json();
};

// ==========================================================
// 👤 SECCIÓN: USUARIOS (REGISTRO E INICIO DE SESIÓN)
// ==========================================================

// Registrar un nuevo usuario
export const registerUser = async (userData) => {
  const response = await fetch("http://127.0.0.1:5000/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return handleResponse(response, "registrar usuario");
};

// Iniciar sesión de usuario
export const loginUser = async (credentials) => {
  const response = await fetch("http://127.0.0.1:5000/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response, "iniciar sesión");
};

// ==========================================================
// 🗒️ SECCIÓN: TAREAS (CRUD API REST)
// ==========================================================

// ==========================================================
// ✅ MODIFICACIÓN FASE 3:
// Ahora `getTasks` recibe el `user_id` como argumento, y lo envía al backend
// mediante un parámetro de consulta (?user_id=), para obtener SOLO las tareas
// pertenecientes al usuario autenticado.
// ==========================================================
export const getTasks = async (user_id) => {
  const response = await fetch(`${API_URL}/tasks?user_id=${user_id}`);
  return handleResponse(response, "obtener las tareas del usuario");
};

// ✅ (Fase 2) Crear una nueva tarea asociada a un usuario
export const createTask = async (taskData, user_id) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...taskData, user_id }), // combinamos datos de tarea + id de usuario
  });
  return handleResponse(response, "crear la tarea");
};

// Actualizar una tarea existente (PUT)
export const updateTask = async (id, taskData, user_id) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...taskData, user_id }),
  });
  return handleResponse(response, "actualizar la tarea");
};

// Eliminar una tarea (DELETE)
export const deleteTask = async (id) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
  return handleResponse(response, "eliminar la tarea");
};

// ==========================================================
// 📘 SECCIÓN: NOTAS (CRUD API REST)
// ==========================================================

// Obtener todas las notas (GET)
export const getNotes = async () => {
  const response = await fetch(`${API_URL}/notes`);
  return handleResponse(response, "obtener las notas");
};

// Crear una nueva nota (POST)
export const createNote = async (noteData, user_id) => {
  const response = await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...noteData, user_id }),
  });
  return handleResponse(response, "crear la nota");
};

// Actualizar una nota (PUT)
export const updateNote = async (id, noteData, user_id) => {
  const response = await fetch(`${API_URL}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...noteData, user_id }),
  });
  return handleResponse(response, "actualizar la nota");
};

// Eliminar una nota (DELETE)
export const deleteNote = async (id) => {
  const response = await fetch(`${API_URL}/notes/${id}`, { method: "DELETE" });
  return handleResponse(response, "eliminar la nota");
};
