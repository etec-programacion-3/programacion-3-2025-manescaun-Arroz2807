// Importamos hooks de React
import { useState, useEffect } from "react";
// Importamos el editor de texto enriquecido
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
// Importamos funciones para interactuar con la API
import { createTask, updateTask } from "../services/api";

// Componente TaskForm: formulario para crear o editar tareas
export default function TaskForm({ onTaskSaved, editingTask, cancelEdit, userId }) {
  // Estados del formulario
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState(""); // 🆕 Descripción con Quill

  // Si llega una tarea para editar, completamos el formulario con sus datos
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setDueDate(editingTask.due_date || "");
      setDescription(editingTask.description || "");
    } else {
      setTitle("");
      setDueDate("");
      setDescription("");
    }
  }, [editingTask]);

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita recargar la página

    // Armamos el objeto con los datos
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("👤 Usuario cargado:", user);

    const taskData = {
      title,
      due_date: dueDate,
      description,
      user_id: user?.id, // 👈 usar "id", no "user_id"
    };

    console.log("📤 Enviando tarea al backend:", taskData);


    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const user_id = user?.user_id || user?.id; // compatibilidad por si cambia estructura

      if (!user_id) {
        alert("Error: no se pudo obtener el ID del usuario");
        return;
      }

      if (editingTask) {
        await updateTask(editingTask.task_id, taskData, user_id);
      } else {
        await createTask(taskData, user_id);
      }


      // Notificamos al componente padre
      onTaskSaved();

      // Limpiamos los campos
      setTitle("");
      setDueDate("");
      setDescription("");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Configuración básica del editor Quill
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  return (
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

      {/* 🆕 Campo de descripción con ReactQuill */}
      <label style={styles.label}>Descripción:</label>
      <ReactQuill
        theme="snow"
        value={description}
        onChange={setDescription}
        modules={quillModules}
        style={styles.quill}
        placeholder="Agregá una descripción detallada..."
      />

      <div style={styles.buttonGroup}>
        <button type="submit" style={styles.saveButton}>
          {editingTask ? "Guardar Cambios" : "Crear Tarea"}
        </button>

        {editingTask && (
          <button type="button" onClick={cancelEdit} style={styles.cancelButton}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

// Estilos
const styles = {
  form: {
    backgroundColor: "#464444ff",
    padding: "2.25rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    maxWidth: "600px",
  },
  formTitle: {
    marginBottom: "1rem",
    color: "white",
  },
  label: {
    color: "white",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    display: "block",
  },
  input: {
    display: "block",
    width: "100%",
    marginBottom: "1rem",
    padding: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  quill: {
    marginBottom: "1.5rem",
    backgroundColor: "white",
    borderRadius: "6px",
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
