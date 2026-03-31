import { useEffect, useState } from "react";
import { getTasks, deleteTask, updateTask } from "../services/api";
import TaskForm from "./TaskForm";
import "../global.css";

export default function TaskList({ user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const [showPending, setShowPending] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);

  const [filterDate, setFilterDate] = useState("");
  const [draggedTask, setDraggedTask] = useState(null);

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

  // ✅ Usa updateTask de api.js en vez de fetch hardcodeado
  const toggleStatus = async (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    try {
      await updateTask(task.task_id, { status: newStatus }, task.user_id);
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

  const getUrgencyColor = (due_date) => {
    if (!due_date) return "#5a5a5a";
    const today = new Date();
    const due = new Date(due_date);
    const diff = (due - today) / (1000 * 60 * 60 * 24);
    if (diff < 0) return "#ff4d4d";
    if (diff <= 2) return "#ff8800";
    if (diff <= 7) return "#ffd93b";
    return "#22c55e";
  };

  const sortByUrgency = (tasksList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return [...tasksList].sort((a, b) => {
      if (!a.due_date && !b.due_date) return 0;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      const dateA = new Date(a.due_date);
      const dateB = new Date(b.due_date);
      dateA.setHours(0, 0, 0, 0);
      dateB.setHours(0, 0, 0, 0);
      const aOverdue = dateA < today;
      const bOverdue = dateB < today;
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      return dateA - dateB;
    });
  };

  useEffect(() => {
    if (user && user.user_id) fetchTasks();
  }, [user]);

  const filteredTasks = tasks.filter((t) => {
    if (!filterDate) return true;
    return t.due_date === filterDate;
  });

  const pendingTasks = sortByUrgency(filteredTasks.filter((t) => t.status !== "completed"));
  const completedTasks = sortByUrgency(filteredTasks.filter((t) => t.status === "completed"));

  const handleDragStart = (task) => setDraggedTask(task);

  // ✅ Usa updateTask de api.js en vez de fetch hardcodeado
  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedTask) return;
    try {
      await updateTask(draggedTask.task_id, { status: targetStatus }, draggedTask.user_id);
      setDraggedTask(null);
      await fetchTasks();
    } catch (err) {
      console.error("Error en drag & drop:", err);
    }
  };

  const renderTask = ({ task_id, title, due_date, description, status, user_id }) => {
    const overdue = isOverdue(due_date);
    const urgencyColor = getUrgencyColor(due_date);
    return (
      <li
        className="task-row"
        key={task_id}
        draggable
        onDragStart={() => handleDragStart({ task_id, title, due_date, description, status, user_id })}
        style={{ display: "flex", alignItems: "center", borderLeft: `6px solid ${urgencyColor}` }}
      >
        <div style={{ width: "30px", display: "flex", justifyContent: "center" }}>
          <input
            type="checkbox"
            checked={status === "completed"}
            onChange={() => toggleStatus({ task_id, title, due_date, description, status, user_id })}
            style={{ transform: "scale(0.9)", cursor: "pointer" }}
          />
        </div>
        <div style={{ flex: 1, padding: "0 10px" }}>
          <strong
            className="task-title"
            style={{
              fontSize: "1.05rem",
              color: overdue ? "#ff6b6b" : "var(--text-color)",
              textDecoration: status === "completed" ? "line-through" : "none",
            }}
          >
            {title}
          </strong>
          <div>
            <span
              className="task-date"
              style={{
                fontSize: "0.85rem",
                color: overdue ? "#ff6b6b" : "var(--muted-text)",
                fontWeight: overdue ? "bold" : "normal",
                textDecoration: status === "completed" ? "line-through" : "none",
              }}
            >
              {due_date || "Sin fecha"}
            </span>
          </div>
          {description && (
            <div className="task-description" dangerouslySetInnerHTML={{ __html: description }} />
          )}
        </div>
        <div className="task-actions" style={{ width: "90px" }}>
          <button
            onClick={() => setEditingTask({ task_id, title, due_date, description, status })}
            className="btn-blue"
          >
            ✏️
          </button>
          <button onClick={() => handleDelete(task_id)} className="btn-red">
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
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          style={{ marginBottom: "1rem" }}
        />
        {loading && <p>Cargando tareas...</p>}
        {error && <p>Error: {error}</p>}
        <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, "pending")}>
          <h3
            style={{ cursor: "pointer", marginTop: "1.2rem", marginBottom: "0.6rem", fontSize: "1.05rem" }}
            onClick={() => setShowPending(!showPending)}
          >
            {showPending ? "▲" : "▼"} Pendientes ({pendingTasks.length})
          </h3>
          <div style={{ maxHeight: showPending ? "1000px" : "0px", overflow: "hidden", transition: "max-height 0.3s ease" }}>
            <ul className="tasks-list-ul">{pendingTasks.map(renderTask)}</ul>
          </div>
        </div>
        <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, "completed")}>
          <h3
            style={{ cursor: "pointer", marginTop: "1.2rem", marginBottom: "0.6rem", fontSize: "1.05rem" }}
            onClick={() => setShowCompleted(!showCompleted)}
          >
            {showCompleted ? "▲" : "▼"} Completadas ({completedTasks.length})
          </h3>
          <div style={{ maxHeight: showCompleted ? "1000px" : "0px", overflow: "hidden", transition: "max-height 0.3s ease" }}>
            <ul className="tasks-list-ul">{completedTasks.map(renderTask)}</ul>
          </div>
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