import React, { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { createNote, updateNote } from "../services/api";
import "../global.css";

const NoteEditor = ({ note, onSaved, user, isCreating }) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setError(null);
  }, [note]);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!user || !user.user_id) {
      setError("Usuario no autenticado");
      return;
    }

    const finalTitle = title.trim() || "Nueva nota";

    setSaving(true);
    setError(null);
    try {
      if (note && note.note_id) {
        await updateNote(note.note_id, { title: finalTitle, content }, user.user_id);
      } else {
        await createNote({ title: finalTitle, content }, user.user_id);
      }
      if (onSaved) onSaved();
      setTitle("");
      setContent("");
    } catch (err) {
      setError(err.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    if (onSaved) onSaved();
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }], // encabezados h1, h2, h3 y normal
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
  ];

  return (
    <form onSubmit={handleSave} style={styles.editorContainer}>
      <h2 style={{ marginBottom: "1rem", color: "var(--text-color)" }}>
        {note ? "✏️ Editar Nota" : "📝 Nueva Nota"}
      </h2>

      <label style={{ color: "var(--text-color)", fontWeight: "1000", marginBottom: "0.5rem" }}>
        Título de la nota
      </label>
      <input
        type="text"
        placeholder="Título de la nota"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.titleInput}
      />

      {error && <div style={styles.error}>{error}</div>}

      <label style={{ color: "var(--text-color)", fontWeight: "500", marginTop: "0.5rem" }}>
        Contenido:
      </label>

      <div className="quill-dark-wrapper">
        <ReactQuill
          ref={editorRef}
          theme="snow"
          value={content}
          onChange={setContent}
          modules={quillModules}
          formats={quillFormats}
          placeholder="Escribe el contenido de tu nota..."
        />
      </div>

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
        <button
          type="submit"
          className="btn-green"
          disabled={saving}
          title={saving ? "Guardando..." : "Guardar nota"}
        >
          {saving ? "💾 Guardando..." : note ? "💾 Guardar Cambios" : "➕ Crear Nota"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="btn-cancel"
          title="Cancelar edición"
        >
          ❌ Cancelar
        </button>
      </div>
    </form>
  );
};

const styles = {
  editorContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: "2rem",
    background: "var(--gray-bg)",
  },
  titleInput: {
    padding: "0.6rem",
    border: "1px solid var(--gray-lighter)",
    borderRadius: "6px",
    backgroundColor: "var(--gray-light)",
    color: "white",
    width: "100%",
  },
  error: {
    color: "var(--error-color)",
    padding: "0.5rem 0",
    fontWeight: "500",
  },
};

export default NoteEditor;
