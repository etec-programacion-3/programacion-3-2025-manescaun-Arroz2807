const API_URL = "http://localhost:5000/api";

export const getTasks = async () => {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    if (!response.ok) {
      throw new Error("Error al obtener las tareas");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en getTasks:", error);
    throw error;
  }
};
