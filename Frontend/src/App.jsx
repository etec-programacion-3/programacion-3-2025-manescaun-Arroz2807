// --- Importamos dependencias principales ---
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import "./global.css";

// --- Importamos componentes ---
import TaskList from "./components/TaskList";
import NotesPage from "./components/NotesPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";

// --- Componente principal ---
export default function App() {
  // Estado global para almacenar al usuario logueado
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);

  // --- Función: manejar inicio de sesión ---
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // --- Función: manejar cierre de sesión ---
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // --- Si no hay usuario logueado, mostrar solo login y registro ---
  if (!user) {
    return (
      <Router>
        <Routes>
          {/* Página principal → Login */}
          <Route path="/" element={<LoginPage onLogin={handleLogin} />} />

          {/* Registro de usuario */}
          <Route
            path="/register"
            element={<RegisterPage onRegister={() => (window.location.href = "/")} />}
          />

          {/* Redirección por defecto si intenta ir a otra ruta sin loguearse */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    );
  }

  // --- Si el usuario está logueado, mostramos la app completa ---
  return (
    <Router>
      <div className="app-container">
        {/* --- Barra lateral --- */}
        <nav className="sidebar">
          <Link to="/tasks" title="Tareas">🗒️</Link>
          <Link to="/notes" title="Apuntes">📘</Link>
          <button onClick={handleLogout} className="logout-btn" title="Cerrar sesión">🚪</button>
        </nav>

        {/* --- Contenido principal --- */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/tasks" />} />
            <Route path="/tasks" element={<TaskList user={user} />} />
            <Route path="/notes" element={<NotesPage user={user} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
