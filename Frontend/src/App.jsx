import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import TaskList from "./components/TaskList";
import NotesPlaceholder from "./components/NotesPlaceholder";

export default function App() {
  return (
    <Router>
      <div style={styles.appContainer}>
        {/* --- Contenedor principal en forma de tabla --- */}
        <table style={styles.layoutTable}>
          <thead>
            <tr style={styles.navbarRow}>
              {/* --- Columna 1: Título --- */}
              <th style={styles.navCellLeft}>
                <h1 style={styles.title}>Gestor de Tareas</h1>
              </th>

              {/* --- Columna 2: Espacio central vacío (puede usarse para subtítulos, logo, etc.) --- */}
              <th style={styles.navCellCenter}></th>

              {/* --- Columna 3: Menú de navegación --- */}
              <th style={styles.navCellRight}>
                <ul style={styles.navMenu}>
                  <li>
                    <Link to="/tasks" style={styles.navButton}>
                      🗒️ Tareas
                    </Link>
                  </li>
                  <li>
                    <Link to="/notes" style={styles.navButton}>
                      📘 Apuntes
                    </Link>
                  </li>
                </ul>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan="3" style={styles.mainContent}>
                {/* --- Rutas principales --- */}
                <Routes>
                  <Route path="/" element={<Navigate to="/tasks" />} />
                  <Route path="/tasks" element={<TaskList />} />
                  <Route path="/notes" element={<NotesPlaceholder />} />
                </Routes>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Router>
  );
}

// --- Estilos ---
const styles = {
  appContainer: {
    fontFamily: "Inter, Arial, sans-serif",
    backgroundColor: "#3e3e42ff",
    minHeight: "100vh",
    color: "white",
  },
  layoutTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
  navbarRow: {
    backgroundColor: "#1E3A8A",
    height: "80px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  navCellLeft: {
    textAlign: "left",
    paddingLeft: "2rem",
    width: "50%",
  },
  navCellRight: {
    textAlign: "right",
    paddingRight: "2rem",
    width: "50%",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    margin: 2,
  },
  navMenu: {
    listStyle: "none",
    display: "flex",
    justifyContent: "flex-center",
    gap: "1.25rem",
    margin: 2,
    padding: 2,
  },
  navButton: {
    backgroundColor: "white",
    color: "#1E3A8A",
    padding: "0.75rem 0.75rem",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "600",
    transition: "background-color 0.2s ease, transform 0.1s ease",
  },
  navButtonHover: {
    backgroundColor: "#344ea3ff",
  },
  mainContent: {
    padding: "2rem",
    backgroundColor: "#3e3e42ff",
  },
};
