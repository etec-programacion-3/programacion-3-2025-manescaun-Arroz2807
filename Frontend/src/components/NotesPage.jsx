// src/components/NotesPage.jsx
import { useState, useEffect } from "react";
import NotesList from "./NotesList";
import NoteEditor from "./NoteEditor";
import { getNotes } from "../services/api";

const NotesPage = ({ user }) => {
  // Lista de notas
  const [notes, setNotes] = useState([]);
  // Nota seleccionada para editar/ver en el editor
  const [selectedNote, setSelectedNote] = useState(null);
  // Control de carga
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar notas desde el backend
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const data = await getNotes(user?.user_id); // <-- filtramos por user_id
      setNotes(data);
    } catch (err) {
      setError(err.message || "Error al cargar notas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.user_id) fetchNotes();
  }, [user]);

  // Cuando se guarde/actualice una nota en el editor, refrescamos la lista
  const handleNoteSaved = async () => {
    await fetchNotes();
  };

  return (
    <div style={styles.page}>
      {/* Columna izquierda: lista/menú (mismo ancho que el formulario de tareas) */}
      <aside style={styles.sidebar}>
        <NotesList
          notes={notes}
          loading={loading}
          error={error}
          onSelect={setSelectedNote}
          selectedNote={selectedNote}
          refreshNotes={fetchNotes}
          user={user}               // <-- paso user
        />
      </aside>


      {/* Columna derecha: editor (ocupa el resto del ancho) */}
      <section style={styles.editorWrap}>
        <NoteEditor
          note={selectedNote}
          onSaved={handleNoteSaved}
          user={user}               // <-- paso user
        />
      </section>
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    gap: "1rem",
    alignItems: "stretch",
    minHeight: "70vh",
  },
  // Sidebar ancho similar a TaskForm: maxWidth ~ 400px
  sidebar: {
    width: "380px",
    flex: "0 0 380px", // ancho fijo
    maxHeight: "calc(100vh - 200px)",
    overflowY: "auto",
  },
  // Editor ocupa el resto
  editorWrap: {
    flex: "1 1 auto",
    minHeight: "60vh",
  },
};

export default NotesPage;
