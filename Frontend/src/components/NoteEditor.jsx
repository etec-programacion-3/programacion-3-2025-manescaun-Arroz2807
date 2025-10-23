// src/components/NoteEditor.jsx
import React, { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { createNote, updateNote } from "../services/api";

const NoteEditor = ({ note, onSaved }) => {
  // Local state para los campos del editor
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Cuando cambia la prop note, actualizamos el estado local
  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setError(null);
  }, [note]);

  // Guardar (crear o actualizar)
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      if (note && note.note_id) {
        await updateNote(note.note_id, { title, content });
      } else {
        await createNote({ title, content });
      }
      if (onSaved) onSaved();
      alert("Nota guardada correctamente");
    } catch (err) {
      setError(err.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.editorContainer}>
      <div style={styles.header}>
        <input
          type="text"
          placeholder="Título de la nota"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.titleInput}
        />

        <div style={styles.headerButtons}>
          <button onClick={handleSave} disabled={saving} style={styles.saveButton}>
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Editor Rich Text que ocupa el resto */}
      <div style={styles.quillWrap}>
        <ReactQuill value={content} onChange={setContent} style={styles.quill} />
      </div>
    </div>
  );
};

const styles = {
  editorContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: "#807c7cff",
    borderRadius: 8,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    padding: "0.75rem 1rem",
    borderBottom: "1px solid #eee",
    background: "#807c7cff",
  },
  titleInput: {
    flex: 1,
    padding: "0.5rem",
    borderRadius: 6,
    border: "1px solid #ddd",
  },
  headerButtons: {
    display: "flex",
    gap: "0.5rem",
  },
  saveButton: {
    background: "#1E3A8A",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: 6,
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: { color: "red", padding: "0.5rem 1rem" },
  quillWrap: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
  },
  quill: {
    height: "100%",
  },
};

export default NoteEditor;
