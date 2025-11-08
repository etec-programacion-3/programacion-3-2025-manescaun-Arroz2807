// src/components/NotesList.jsx
import React from "react";
import { deleteNote, createNote } from "../services/api";

/*
Props esperados:
- notes: array de notas
- loading: boolean
- error: string | null
- onSelect(note): función para seleccionar una nota
- selectedNote: nota seleccionada actualmente
- refreshNotes(): función para refrescar después de cambios
*/
const NotesList = ({ notes, loading, error, onSelect, selectedNote, refreshNotes, user }) => {
  // Crear una nota vacía rápida
  const handleCreateEmpty = async () => {
    try {
      // Creamos nota con título por defecto y contenido vacío
      if (!user || !user.user_id) throw new Error("Usuario no autenticado");
      await createNote({ title: "Nueva nota", content: "" }, user.user_id);
      await refreshNotes();
    } catch (err) {
      alert("Error creando nota: " + (err.message || err));
    }
  };

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

  if (loading) return <div style={styles.empty}>Cargando notas...</div>;
  if (error) return <div style={styles.empty}>Error: {error}</div>;
  if (!notes.length) {
    return (
      <div style={styles.wrapEmpty}>
        <button style={styles.newButton} onClick={handleCreateEmpty}>+ Nueva nota</button>
        <div style={styles.empty}>No hay notas aún.</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={{ margin: 0 }}>Apuntes</h3>
        <button style={styles.newButton} onClick={handleCreateEmpty}>+ Nuevo</button>
      </div>
      <ul style={styles.list}>
        {notes.map((n) => (
          <li
            key={n.note_id}
            style={{
              ...styles.item,
              ...(selectedNote && selectedNote.note_id === n.note_id ? styles.itemSelected : {}),
            }}
          >
            <div style={styles.itemContent} onClick={() => onSelect(n)}>
              <strong style={styles.itemTitle}>{n.title || "Sin título"}</strong>
              <div style={styles.itemMeta}>{n.created_at ? new Date(n.created_at).toLocaleString() : ""}</div>
            </div>

            <div>
              <button style={styles.smallButton} onClick={() => onSelect(n)}>Abrir</button>
              <button style={styles.deleteButton} onClick={() => handleDelete(n.note_id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    background: "#5e5b5bff",
    padding: "1rem",
    borderRadius: 8,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  newButton: {
    background: "#1E3A8A",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: 6,
    fontWeight: "bold",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    gap: "0.5rem",
    padding: "0.6rem",
    marginBottom: "0.5rem",
    borderRadius: 6,
    background: "#464444ff",
    alignItems: "center",
  },
  itemSelected: {
    outline: "2px solid #DDE6FF",
  },
  itemContent: { cursor: "pointer", flex: 1 },
  itemTitle: { fontSize: "0.95rem" },
  itemMeta: { fontSize: "0.75rem", color: "#666" },
  smallButton: {
    background: "#2563eb",
    border: "none",
    padding: "0.4rem 0.8rem",
    borderRadius: 6,
    marginRight: 6,
    fontWeight: "bold",
    cursor: "pointer",
  },
  deleteButton: {
    background: "#ff6b6b",
    color: "white",
    border: "none",
    padding: "0.4rem 0.8rem",
    borderRadius: 6,
    fontWeight: "bold",
    cursor: "pointer",
  },
  empty: { padding: "1rem", color: "#666" },
  wrapEmpty: { padding: "1rem" },
};

export default NotesList;
