import NotesList from "./NotesList";
import NoteEditor from "./NoteEditor";
import { useState } from "react";
import "../global.css";

export default function NotesPage({ user }) {
  const [selectedNote, setSelectedNote] = useState(null);

  return (
    <div className="list-container">
      <h2>Mis apuntes</h2>
      <div style={{ display: "flex", gap: "1rem" }}>
        <NotesList user={user} onSelectNote={setSelectedNote} />
        <NoteEditor user={user} note={selectedNote} onNoteSaved={() => setSelectedNote(null)} />
      </div>
    </div>
  );
}
