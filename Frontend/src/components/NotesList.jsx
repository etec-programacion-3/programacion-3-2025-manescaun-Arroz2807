// src/components/NotesList.jsx
import React from "react";
import { deleteNote } from "../services/api";
import "../global.css";

/*
Props esperados:
- notes: array de notas
- loading: boolean
- error: string | null
- onSelect(note): función para seleccionar una nota
- onCreateNew(): función para crear nueva nota vacía
- selectedNote: nota seleccionada actualmente
- refreshNotes(): función para refrescar después de cambios
- user: objeto con user_id
*/
const NotesList = ({ notes, loading, error, onSelect, onCreateNew, selectedNote, refreshNotes, user }) => {
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta nota?")) return;
    try {
      await deleteNote(id);
      await refreshNotes();
      // si la nota borrada era la seleccionada, limpiamos selección
      if (selectedNote && selectedNote.note_id === id) onSelect(null);
    } catch (err) {
      alert("Error eliminando nota: " + err.message);
    }
  };

  return (
    <div className="tasks-list-panel">
      <h2>📓 Mis Apuntes</h2>

      <div style={{ marginBottom: "1rem" }}>
        <button 
          className="btn-green"
          onClick={onCreateNew}
          title="Crear nueva nota"
          style={{ width: "100%" }}
        >
          ➕ Nueva nota
        </button>
      </div>

      {loading && <p>Cargando notas...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && notes.length === 0 && (
        <div style={{ textAlign: "center", padding: "1rem" }}>
          <p style={{ marginBottom: "1rem" }}>No hay notas aún.</p>
        </div>
      )}

      {!loading && !error && notes.length > 0 && (
        <ul className="tasks-list-ul">
          {notes.map((n) => (
            <li
              key={n.note_id}
              className="task-row"
              style={{
                cursor: "pointer",
                ...(selectedNote && selectedNote.note_id === n.note_id 
                  ? { outline: "2px solid #60a5fa", backgroundColor: "#424242" } 
                  : {}),
              }}
            >
              <div 
                className="task-main"
                onClick={() => onSelect(n)}
                style={{ flex: 1 }}
              >
                <div className="task-header">
                  <strong className="task-title">{n.title || "Sin título"}</strong>
                  <span className="task-date">
                    {n.created_at ? ` — ${new Date(n.created_at).toLocaleDateString()}` : ""}
                  </span>
                </div>
                {n.content && (
                  <div 
                    className="task-description"
                    style={{
                      maxHeight: "3rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    dangerouslySetInnerHTML={{ 
                      __html: n.content.substring(0, 100) + (n.content.length > 100 ? "..." : "") 
                    }}
                  />
                )}
              </div>

              <div className="task-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(n);
                  }}
                  title="Editar nota"
                  className="btn-blue"
                >
                  ✏️
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(n.note_id);
                  }}
                  title="Eliminar nota"
                  className="btn-red"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotesList;