import { useState } from "react";
import "../global.css";

export default function TaskForm({ user, onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.user_id) return alert("Usuario no autenticado.");

    const taskData = {
      title,
      due_date: dueDate,
      description,
      user_id: user.user_id,
    };

    console.log("Enviando tarea al backend:", taskData);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      if (!res.ok) throw new Error("Error al crear la tarea");
      onTaskAdded();
      setTitle("");
      setDueDate("");
      setDescription("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <textarea placeholder="Descripción (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} />
      <button type="submit" title="Agregar tarea">➕</button>
    </form>
  );
}
