// Definimos la URL base del backend
const API_URL = "http://127.0.0.1:5000/api";

// Función auxiliar para manejar respuestas HTTP y errores
const handleResponse = async (response, action) => {
  if (!response.ok) {
    const errorText = await response.text(); // Leemos el texto del error
    throw new Error(`Error al ${action}: ${errorText}`); // Lanzamos excepción
  }
  return response.json(); // Devolvemos el JSON si todo está bien
};


// --- TAREAS ---

// Obtener todas las tareas (GET)
export const getTasks = async () => {
  const response = await fetch(`${API_URL}/tasks`);
  return handleResponse(response, "obtener las tareas");
};

// Crear una nueva tarea (POST)
export const createTask = async (taskData) => {
  // Agregamos user_id fijo temporalmente
  const payload = { ...taskData, user_id: 1 };

  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload), // Convertimos a JSON
  });

  return handleResponse(response, "crear la tarea");
};

// Actualizar una tarea existente (PUT)
export const updateTask = async (id, taskData) => {
  const payload = { ...taskData, user_id: 1 }; // Incluimos el mismo user_id

  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(response, "actualizar la tarea");
};


// --- NOTAS ---

// Obtener todas las notas
export const getNotes = async () => {
  const response = await fetch(`${API_URL}/notes`);
  return handleResponse(response, "obtener las notas");
};

// Crear una nota nueva
export const createNote = async (noteData) => {
  // noteData: { title, content, user_id? }
  const payload = { ...noteData, user_id: 1 }; // user_id temporal
  const response = await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(response, "crear la nota");
};

// Actualizar una nota existente
export const updateNote = async (id, noteData) => {
  const payload = { ...noteData, user_id: 1 };
  const response = await fetch(`${API_URL}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(response, "actualizar la nota");
};

// (Opcional) Eliminar una nota
export const deleteNote = async (id) => {
  const response = await fetch(`${API_URL}/notes/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response, "eliminar la nota");
};