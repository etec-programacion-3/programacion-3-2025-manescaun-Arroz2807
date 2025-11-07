// --- Importamos dependencias principales ---
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState } from "react";

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
    setUser(userData); // Guardamos datos del usuario en memoria
    localStorage.setItem("user", JSON.stringify(userData)); // También en almacenamiento local
  };

  // --- Función: manejar cierre de sesión ---
  const handleLogout = () => {
    setUser(null); // Borramos el usuario del estado
    localStorage.removeItem("user"); // Eliminamos del localStorage
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
      <div style={styles.appContainer}>
        {/* --- Barra de navegación --- */}
        <div style={styles.navbar}>
          <h1>Gestor de Tareas</h1>
          <div>
            {/* Enlaces de navegación */}
            <Link to="/tasks" style={styles.navButton}>🗒️ Tareas</Link>
            <Link to="/notes" style={styles.navButton}>📘 Apuntes</Link>

            {/* Botón para cerrar sesión */}
            <button onClick={handleLogout} style={styles.logoutButton}>🚪 Salir</button>
          </div>
        </div>

        {/* --- Rutas internas (solo disponibles logueado) --- */}
        <Routes>
          <Route path="/" element={<Navigate to="/tasks" />} />
          <Route path="/tasks" element={<TaskList user={user} />} />
          <Route path="/notes" element={<NotesPage user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

// --- Estilos globales ---
const styles = {
  appContainer: {
    backgroundColor: "#3e3e42ff",  // Fondo gris oscuro
    minHeight: "100vh",            // Pantalla completa
    color: "white",                // Texto blanco
  },
  navbar: {
    backgroundColor: "#1E3A8A",    // Azul principal
    padding: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navButton: {
    background: "#5e5b5bff",       // Fondo gris
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    textDecoration: "none",
    marginRight: "0.5rem",
  },
  logoutButton: {
    background: "#ff6b6b",         // Rojo para "Salir"
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
