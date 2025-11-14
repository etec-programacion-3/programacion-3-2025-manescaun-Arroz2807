import { useEffect, useState } from "react";
import { getTasks, deleteTask } from "../services/api";
import TaskForm from "./TaskForm";
import "../global.css";

export default function TaskList({ user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks(user?.user_id);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta tarea?")) return;
    try {
      await deleteTask(id);
      await fetchTasks();
      if (editingTask && editingTask.task_id === id) setEditingTask(null);
    } catch (err) {
      alert("Error eliminando tarea: " + err.message);
    }
  };

  useEffect(() => {
    if (user && user.user_id) fetchTasks();
  }, [user]);

  return (
    <div className="tasks-fullscreen">
      {/* Panel Izquierdo */}
      <aside className="tasks-list-panel">
        <h2>📋 Mis Tareas</h2>

        {loading && <p>Cargando tareas...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && tasks.length === 0 && <p>No hay tareas registradas.</p>}

        <ul className="tasks-list-ul">
          {tasks.map(({ task_id, title, due_date, description }) => (
            <li className="task-row" key={task_id}>
              <div className="task-main">
                <div className="task-header">
                  <strong className="task-title">{title}</strong>
                  <span className="task-date"> — {due_date || "Sin fecha"}</span>
                </div>
                {description && (
                  <div
                    className="task-description"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                )}
              </div>

              <div className="task-actions">
                <button
                  onClick={() =>
                    setEditingTask({ task_id, title, due_date, description })
                  }
                  title="Editar tarea"
                  className="btn-blue"
                >
                  ✏️
                </button>

                <button
                  onClick={() => handleDelete(task_id)}
                  title="Eliminar tarea"
                  className="btn-red"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Panel Derecho */}
      <main className="tasks-form-panel">
        <TaskForm
          onTaskSaved={fetchTasks}
          editingTask={editingTask}
          cancelEdit={() => setEditingTask(null)}
          userId={user?.user_id}
        />
      </main>
    </div>
  );
}
