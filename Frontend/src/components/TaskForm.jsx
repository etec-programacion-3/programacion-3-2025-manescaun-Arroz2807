// Importamos hooks de React
import { useState, useEffect } from "react";
// Importamos funciones para interactuar con la API
import { createTask, updateTask } from "../services/api";

// Componente TaskForm: formulario para crear o editar tareas
export default function TaskForm({ onTaskSaved, editingTask, cancelEdit }) {
  // Estados del formulario
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Si llega una tarea para editar, completamos el formulario con sus datos
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setDueDate(editingTask.due_date || "");
    }
  }, [editingTask]);

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita recargar la página

    // Armamos el objeto con los datos
    const taskData = { title, due_date: dueDate };

    try {
      // Si hay una tarea en edición, actualizamos (PUT)
      if (editingTask) {
        await updateTask(editingTask.task_id, taskData);
      } else {
        // Si no, creamos una nueva (POST)
        await createTask(taskData);
      }

      // Notificamos al componente padre para actualizar la lista
      onTaskSaved();

      // Limpiamos los campos del formulario
      setTitle("");
      setDueDate("");
    } catch (err) {
      // Mostramos error si algo falla
      alert("Error: " + err.message);
    }
  };

  return (
    // Estructura del formulario
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={styles.formTitle}>
        {editingTask ? "✏️ Editar Tarea" : "📝 Nueva Tarea"}
      </h3>

      {/* Campo de texto para el título */}
      <input
        type="text"
        placeholder="Título de la tarea"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={styles.input}
      />

      {/* Campo de fecha */}
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        style={styles.input}
      />

      {/* Botones de acción */}
      <div style={styles.buttonGroup}>
        <button type="submit" style={styles.saveButton}>
          {editingTask ? "Guardar Cambios" : "Crear Tarea"}
        </button>

        {/* Botón para cancelar la edición */}
        {editingTask && (
          <button type="button" onClick={cancelEdit} style={styles.cancelButton}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

// Estilos del formulario
const styles = {
  form: {
    backgroundColor: "#464444ff",
    padding: "2.25rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    maxWidth: "400px",
  },
  formTitle: {
    marginBottom: "1rem",
  },
  input: {
    display: "block",
    width: "100%",
    marginBottom: "1rem",
    padding: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  buttonGroup: {
    display: "flex",
    gap: "0.5rem",
  },
  saveButton: {
    backgroundColor: "#1E3A8A",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "grey",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
