// src/components/TaskForm.jsx
import { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { createTask, updateTask } from "../services/api";
import "../global.css";

export default function TaskForm({ onTaskSaved, editingTask, cancelEdit, userId }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const user_id = userId || storedUser?.user_id || storedUser?.id;

    if (!user_id) {
      alert("Usuario no autenticado");
      return;
    }

    const taskData = { title, due_date: dueDate, description, user_id };

    try {
      if (editingTask) {
        await updateTask(editingTask.task_id, taskData, user_id);
      } else {
        await createTask(taskData, user_id);
      }

      if (typeof onTaskSaved === "function") onTaskSaved();
      setTitle("");
      setDueDate("");
      setDescription("");
    } catch (err) {
      console.error("❌ Error al guardar tarea:", err);
      alert("Error: " + err.message);
    }
  };

  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const quillFormats = ["bold", "italic", "underline", "strike", "list", "bullet", "link"];

  return (
    <form onSubmit={handleSubmit} className="taskform-root">
      <h2 style={{ marginBottom: "1rem" }}>
        {editingTask ? "✏️ Editar Tarea" : "📝 Nueva Tarea"}
      </h2>

      {/* Campo Título con límite y asterisco */}
      <label
        style={{
          color: "var(--text-color)",
          fontWeight: "1000",
          marginBottom: "0.5rem",
        }}
      >
        Título de la tarea <span style={{ color: "var(--error-color)" }}>*</span>
      </label>

      <input
        type="text"
        placeholder="Título de la tarea (máx. 35 caracteres)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        maxLength={35}
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <label
        style={{
          color: "var(--text-color)",
          fontWeight: "500",
          marginTop: "0.5rem",
        }}
      >
        Descripción:
      </label>

      <div className="quill-dark-wrapper">
        <ReactQuill
          theme="snow"
          value={description}
          onChange={setDescription}
          modules={quillModules}
          formats={quillFormats}
          placeholder="Agregá una descripción detallada..."
        />
      </div>

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
        <button type="submit" className="btn-green">
          {editingTask ? "💾 Guardar Cambios" : "➕ Crear Tarea"}
        </button>

        {editingTask && (
          <button type="button" onClick={cancelEdit} className="btn-cancel">
            ❌ Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
