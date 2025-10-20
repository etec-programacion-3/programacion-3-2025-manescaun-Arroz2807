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
