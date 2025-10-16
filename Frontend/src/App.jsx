import TaskList from "./components/TaskList";

const App = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Gestor de Tareas</h1>
      <TaskList />
    </div>
  );
};

export default App;