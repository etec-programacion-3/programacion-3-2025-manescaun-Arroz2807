import { useEffect, useState } from "react";
import { getTasks, deleteTask } from "../services/api";
import TaskForm from "./TaskForm";
import "../global.css";

export default function TaskList({ user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

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

  const isOverdue = (due_date) => {
    if (!due_date) return false;
    const today = new Date();
    const due = new Date(due_date);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    return due < today;
  };

  useEffect(() => {
    if (user && user.user_id) fetchTasks();
  }, [user]);

  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  const renderTask = ({ task_id, title, due_date, description, status }) => {
    const overdue = isOverdue(due_date);

    return (
      <li
        className="task-row"
        key={task_id}
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* IZQUIERDA - CHECKBOX */}
        <div style={{ width: "30px", display: "flex", justifyContent: "center" }}>
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
            style={{
              transform: "scale(0.9)",
              cursor: "pointer",
            }}
          />
        </div>

        {/* CENTRO - CONTENIDO */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start", // 👈 importante (no centrado de texto)
            padding: "0 10px",
          }}
        >
          {/* TÍTULO */}
          <strong
            className="task-title"
            style={{
              color: overdue ? "#ff6b6b" : "var(--text-color)",
              textDecoration:
                status === "completed" ? "line-through" : "none",
              wordBreak: "break-word",
            }}
          >
            {title}
          </strong>

          {/* FECHA */}
          <span
            className="task-date"
            style={{
              color: overdue ? "#ff6b6b" : "var(--muted-text)",
              fontWeight: overdue ? "bold" : "normal",
              textDecoration:
                status === "completed" ? "line-through" : "none",
              marginTop: "2px",
            }}
          >
            {due_date || "Sin fecha"}
          </span>

          {/* DESCRIPCIÓN */}
          {description && (
            <div
              className="task-description"
              dangerouslySetInnerHTML={{ __html: description }}
              style={{ marginTop: "0.4rem" }}
            />
          )}
        </div>

        {/* DERECHA - BOTONES */}
        <div
          className="task-actions"
          style={{
            width: "90px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "6px",
          }}
        >
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
  };

  return (
    <div className="tasks-fullscreen">
      <aside className="tasks-list-panel">
        <h2>📋 Mis Tareas</h2>

        {loading && <p>Cargando tareas...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && tasks.length === 0 && <p>No hay tareas registradas.</p>}

        {/* PENDIENTES */}
        <div>
          <h3
            style={{
              cursor: "pointer",
              fontSize: "0.9rem",
              marginBottom: "0.4rem",
            }}
            onClick={() => setShowPending(!showPending)}
          >
            {showPending ? "▲" : "▼"} Pendientes ({pendingTasks.length})
          </h3>

          {showPending && (
            <ul className="tasks-list-ul">
              {pendingTasks.map(renderTask)}
            </ul>
          )}
        </div>

        {/* COMPLETADAS */}
        <div style={{ marginTop: "1rem" }}>
          <h3
            style={{
              cursor: "pointer",
              fontSize: "0.9rem",
              marginBottom: "0.4rem",
            }}
            onClick={() => setShowCompleted(!showCompleted)}
          >
            {showCompleted ? "▲" : "▼"} Completadas ({completedTasks.length})
          </h3>

          {showCompleted && (
            <ul className="tasks-list-ul">
              {completedTasks.map(renderTask)}
            </ul>
          )}
        </div>
      </aside>

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