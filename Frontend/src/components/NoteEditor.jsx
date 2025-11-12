import { useState, useEffect } from "react";
import "../global.css";

export default function NoteEditor({ user, note, onNoteSaved }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [note]);

  const handleSave = async () => {
    if (!title.trim()) return alert("El título no puede estar vacío");
    const noteData = { title, content, user_id: user.user_id };

    try {
      if (note?.id) {
        await fetch(`http://127.0.0.1:5000/api/notes/${note.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noteData),
        });
      } else {
        await fetch("http://127.0.0.1:5000/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noteData),
        });
      }

      onNoteSaved();
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Error al guardar nota:", err);
    }
  };

  return (
    <div style={{ flex: 2 }}>
      <input type="text" placeholder="Título de la nota" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Contenido de la nota..." rows="8" value={content} onChange={(e) => setContent(e.target.value)} />
      <div style={{ marginTop: "0.5rem" }}>
        <button onClick={handleSave} title="Guardar nota">💾</button>
        {note && <button onClick={() => onNoteSaved()} title="Cancelar edición">❌</button>}
      </div>
    </div>
  );
}
