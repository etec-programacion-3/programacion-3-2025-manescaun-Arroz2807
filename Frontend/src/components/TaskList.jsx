// Importamos hooks y funciones del servicio
import { useEffect, useState } from "react";
import { getTasks } from "../services/api";
import TaskForm from "./TaskForm";

// Componente principal que muestra la lista de tareas
const TaskList = () => {
  // Estados locales
  const [tasks, setTasks] = useState([]);        // Lista de tareas
  const [loading, setLoading] = useState(true);  // Estado de carga
  const [error, setError] = useState(null);      // Estado de error
  const [editingTask, setEditingTask] = useState(null); // Tarea en edición

  // Función para obtener tareas desde el backend
  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect: se ejecuta solo una vez al montar el componente
  useEffect(() => {
    fetchTasks();
  }, []);

  // Renderizado condicional según estado
  if (loading) return <p>Cargando tareas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={styles.container}>
      {/* Formulario para crear o editar tareas */}
      <TaskForm
        onTaskSaved={fetchTasks}         // Recarga la lista al guardar
        editingTask={editingTask}         // Pasa tarea seleccionada
        cancelEdit={() => setEditingTask(null)} // Cancela edición
      />

      <h2 style={styles.title}>Lista de Tareas</h2>

      {/* Si no hay tareas, se muestra un mensaje */}
      {tasks.length === 0 ? (
        <p>No hay tareas registradas.</p>
      ) : (
        // Lista de tareas renderizadas
        <ul style={styles.taskList}>
          {tasks.map(({ task_id, title, due_date }) => (
            <li key={task_id} style={styles.taskItem}>
              <div>
                <strong>{title}</strong> — {due_date || "Sin fecha"}
              </div>

              {/* Botón para editar tarea */}
              <div>
                <button
                  onClick={() =>
                    setEditingTask({ task_id, title, due_date })
                  }
                  style={styles.editButton}
                >
                  ✏️ Editar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Estilos visuales
const styles = {
  container: {
    backgroundColor: "#5e5b5bff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    maxWidth: "600px",
    margin: "0 auto",
  },
  title: {
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: "1rem",
  },
  taskList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  taskItem: {
    backgroundColor: "#464444ff",
    marginBottom: "0.75rem",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.2s ease, transform 0.1s ease",
  },
};

export default TaskList;
