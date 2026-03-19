import { useEffect, useState } from "react";
import { getTasks, deleteTask } from "../services/api";
import TaskForm from "./TaskForm";
import "../global.css";

export default function TaskList({ user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  // 🔽 NUEVO: control de desplegables
  const [showPending, setShowPending] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);

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

  // 🔽 NUEVO: cambiar estado
  const toggleStatus = async (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";

    try {
      await fetch(`http://127.0.0.1:5000/api/tasks/${task.task_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      await fetchTasks();
    } catch (err) {
      console.error("Error actualizando estado:", err);
    }
  };

  // 🔽 NUEVO: detectar vencidas
  const isOverdue = (due_date) => {
    if (!due_date) return false;
    const today = new Date();
    const due = new Date(due_date);

    today.setHours(0,0,0,0);
    due.setHours(0,0,0,0);

    return due < today;
  };

  useEffect(() => {
    if (user && user.user_id) fetchTasks();
  }, [user]);

  // 🔽 NUEVO: separar tareas
  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  // 🔽 Render reutilizable (NO rompe nada)
  const renderTask = ({ task_id, title, due_date, description, status }) => (
    <li className="task-row" key={task_id}>
      {/* ✅ NUEVO: checkbox */}
      <input
        type="checkbox"
        checked={status === "completed"}
        onChange={() =>
          toggleStatus({ task_id, title, due_date, description, status })
        }
        title={
          status === "completed"
            ? "Marcar como pendiente"
            : "Marcar como completada"
        }
      />

      <div className="task-main" style={{ flex: 1 }}>
        <div className="task-header">
          <strong
            className="task-title"
            style={{
              color: isOverdue(due_date) ? "#ff6b6b" : "var(--text-color)",
              textDecoration:
                status === "completed" ? "line-through" : "none",
            }}
          >
            {title}
          </strong>

          <span className="task-date">
            {" "}
            — {due_date || "Sin fecha"}
          </span>
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
            setEditingTask({ task_id, title, due_date, description, status })
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
  );

  return (
    <div className="tasks-fullscreen">
      {/* Panel Izquierdo */}
      <aside className="tasks-list-panel">
        <h2>📋 Mis Tareas</h2>

        {loading && <p>Cargando tareas...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && tasks.length === 0 && <p>No hay tareas registradas.</p>}

        {/* 🔽 PENDIENTES */}
        <div>
          <h3
            style={{ cursor: "pointer" }}
            onClick={() => setShowPending(!showPending)}
            title="Mostrar/Ocultar tareas pendientes"
          >
            {showPending ? "🔽" : "▶"} Pendientes ({pendingTasks.length})
          </h3>

          {showPending && (
            <ul className="tasks-list-ul">
              {pendingTasks.map(renderTask)}
            </ul>
          )}
        </div>

        {/* 🔽 COMPLETADAS */}
        <div style={{ marginTop: "1rem" }}>
          <h3
            style={{ cursor: "pointer" }}
            onClick={() => setShowCompleted(!showCompleted)}
            title="Mostrar/Ocultar tareas completadas"
          >
            {showCompleted ? "🔽" : "▶"} Completadas ({completedTasks.length})
          </h3>

          {showCompleted && (
            <ul className="tasks-list-ul">
              {completedTasks.map(renderTask)}
            </ul>
          )}
        </div>
      </aside>

      {/* Panel Derecho (NO TOCADO) */}
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