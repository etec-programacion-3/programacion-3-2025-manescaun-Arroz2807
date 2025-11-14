// src/components/NotesPage.jsx
import { useState, useEffect } from "react";
import NotesList from "./NotesList";
import NoteEditor from "./NoteEditor";
import { getNotes } from "../services/api";
import "../global.css";

const NotesPage = ({ user }) => {
  // Lista de notas
  const [notes, setNotes] = useState([]);
  // Nota seleccionada para editar/ver en el editor
  const [selectedNote, setSelectedNote] = useState(null);
  // Control si está creando una nueva nota
  const [isCreating, setIsCreating] = useState(false);
  // Control de carga
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar notas desde el backend
  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotes(user?.user_id);
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
    setSelectedNote(null);
    setIsCreating(false);
  };

  // Cuando se hace clic en "Nueva nota"
  const handleCreateNew = () => {
    setSelectedNote(null);
    setIsCreating(true);
  };

  // Cuando se selecciona una nota existente
  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setIsCreating(false);
  };

  // Mostrar el editor solo si está creando o hay una nota seleccionada
  const showEditor = isCreating || selectedNote !== null;

  return (
    <div className="tasks-fullscreen">
      {/* Panel Izquierdo - Lista de notas */}
      <NotesList
        notes={notes}
        loading={loading}
        error={error}
        onSelect={handleSelectNote}
        onCreateNew={handleCreateNew}
        selectedNote={selectedNote}
        refreshNotes={fetchNotes}
        user={user}
      />

      {/* Panel Derecho - Editor de notas (solo si showEditor es true) */}
      {showEditor && (
        <main className="tasks-form-panel">
          <NoteEditor
            note={selectedNote}
            onSaved={handleNoteSaved}
            user={user}
            isCreating={isCreating}
          />
        </main>
      )}
    </div>
  );
};

export default NotesPage;