import { useEffect, useState } from "react";
import { getTasks } from "../services/api";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchTasks();
  }, []);

  if (loading) return <p>Cargando tareas...</p>;
  if (error) return <p>Error: {error}</p>;
  if (tasks.length === 0) return <p>No hay tareas registradas.</p>;

  return (
    <div>
      <h2>Lista de Tareas</h2>
      <ul>
        {tasks.map(({ task_id, title, due_date }) => (
          <li key={task_id}>
            <strong>{title}</strong> — {due_date || "Sin fecha"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
