import { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import "../global.css";

export default function TaskList({ user }) {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/tasks?user_id=${user.user_id}`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error al cargar tareas:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://127.0.0.1:5000/api/tasks/${id}`, { method: "DELETE" });
      fetchTasks();
    } catch (err) {
      console.error("Error al eliminar tarea:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="list-container">
      <h2>Mis tareas</h2>
      <TaskForm user={user} onTaskAdded={fetchTasks} />
      <ul>
        {tasks.length === 0 && <p>No hay tareas aún.</p>}
        {tasks.map((task) => (
          <li key={task.id} style={{ marginBottom: "0.75rem" }}>
            <strong>{task.title}</strong> – {task.due_date ? `Vence: ${task.due_date}` : "Sin fecha"}
            <div dangerouslySetInnerHTML={{ __html: task.description }} />
            <button onClick={() => handleDelete(task.id)} title="Eliminar tarea">🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
