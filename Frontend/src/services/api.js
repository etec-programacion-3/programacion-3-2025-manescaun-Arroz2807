// ==========================================================
// 🌐 CONFIGURACIÓN GENERAL DE API
// ==========================================================

// Obtener la URL del backend desde variables de entorno
const BACKEND_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
const API_URL = `${BACKEND_URL}/api`;

console.log("🔗 Backend URL configurada:", BACKEND_URL);

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
  const response = await fetch(`${BACKEND_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return handleResponse(response, "registrar usuario");
};

// Iniciar sesión de usuario
export const loginUser = async (credentials) => {
  const response = await fetch(`${BACKEND_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response, "iniciar sesión");
};

// ==========================================================
// 🗒️ SECCIÓN: TAREAS (CRUD API REST)
// ==========================================================

// Listar las tareas
export const getTasks = async (user_id) => {
  const response = await fetch(`${API_URL}/tasks?user_id=${user_id}`);
  return handleResponse(response, "obtener las tareas del usuario");
};

// Crear una tarea
export const createTask = async (taskData, user_id) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...taskData, user_id }),
  });
  return handleResponse(response, "crear la tarea");
};

// Actualizar una tarea
export const updateTask = async (id, taskData, user_id) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...taskData, user_id }),
  });
  return handleResponse(response, "actualizar la tarea");
};

// Eliminar una tarea
export const deleteTask = async (id) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
  return handleResponse(response, "eliminar la tarea");
};

// ==========================================================
// 📘 SECCIÓN: NOTAS (CRUD API REST)
// ==========================================================

// Listar las notas
export const getNotes = async (user_id) => {
  const url = user_id ? `${API_URL}/notes?user_id=${user_id}` : `${API_URL}/notes`;
  const response = await fetch(url);
  return handleResponse(response, "obtener las notas");
};

// Crear una nota
export const createNote = async (noteData, user_id) => {
  const response = await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...noteData, user_id }),
  });
  return handleResponse(response, "crear la nota");
};

// Actualizar una nota
export const updateNote = async (id, noteData, user_id) => {
  const response = await fetch(`${API_URL}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...noteData, user_id }),
  });
  return handleResponse(response, "actualizar la nota");
};

// Eliminar una nota
export const deleteNote = async (id) => {
  const response = await fetch(`${API_URL}/notes/${id}`, { method: "DELETE" });
  return handleResponse(response, "eliminar la nota");
};