// Importamos las herramientas de enrutamiento desde React Router
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

// Importamos los componentes de la aplicación
import TaskList from "./components/TaskList";
import NotesPlaceholder from "./components/NotesPlaceholder";

// Componente principal de la aplicación
export default function App() {
  return (
    // Envolvemos toda la app en un Router para habilitar la navegación entre rutas
    <Router>
      <div style={styles.appContainer}>
        {/* --- Estructura general en forma de tabla --- */}
        <table style={styles.layoutTable}>
          <thead>
            <tr style={styles.navbarRow}>
              {/* --- Columna izquierda: título principal --- */}
              <th style={styles.navCellLeft}>
                <h1 style={styles.title}>Gestor de Tareas</h1>
              </th>

              {/* --- Columna central vacía (espaciado o futuro contenido) --- */}
              <th style={styles.navCellCenter}></th>

              {/* --- Columna derecha: menú de navegación --- */}
              <th style={styles.navCellRight}>
                <ul style={styles.navMenu}>
                  {/* Botón para ir a la vista de tareas */}
                  <li>
                    <Link to="/tasks" style={styles.navButton}>
                      🗒️ Tareas
                    </Link>
                  </li>
                  {/* Botón para ir a la vista de apuntes */}
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
              {/* --- Contenido principal (ocupa las 3 columnas) --- */}
              <td colSpan="3" style={styles.mainContent}>
                <Routes>
                  {/* Redirección automática al iniciar en "/" hacia "/tasks" */}
                  <Route path="/" element={<Navigate to="/tasks" />} />
                  {/* Página de lista de tareas */}
                  <Route path="/tasks" element={<TaskList />} />
                  {/* Página de apuntes (placeholder por ahora) */}
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

// --- Estilos CSS en formato objeto ---
const styles = {
  appContainer: {
    fontFamily: "Inter, Arial, sans-serif", // Fuente general
    backgroundColor: "#3e3e42ff",           // Fondo gris oscuro
    minHeight: "100vh",                     // Ocupa toda la pantalla
    color: "white",                         // Texto blanco
  },
  layoutTable: {
    width: "110%",                          // Ancho de la tabla
    borderCollapse: "collapse",             // Sin separación entre celdas
  },
  navbarRow: {
    backgroundColor: "#1E3A8A",             // Azul del encabezado
    height: "80px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)", // Sombra inferior
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
    margin: 4,
  },
  navMenu: {
    listStyle: "none",          // Quita los puntos de lista
    display: "flex",            // Los botones se alinean en fila
    justifyContent: "flex-center",
    gap: "1.25rem",             // Espaciado entre botones
    margin: 2,
    padding: 2,
  },
  navButton: {
    backgroundColor: "#5e5b5bff",           // Fondo gris medio
    color: "#ffffffff",                     // Texto blanco
    padding: "0.75rem 0.75rem",
    borderRadius: "10px",                   // Bordes redondeados
    textDecoration: "none",                 // Sin subrayado
    fontWeight: "600",                      // Texto en negrita
    transition: "background-color 0.2s ease, transform 0.1s ease",
  },
  mainContent: {
    padding: "2rem",                        // Espaciado interno
    backgroundColor: "#3e3e42ff",           // Fondo del cuerpo
  },
};
