import { useState } from "react";
import NoteForm from "./NoteForm";
import { formatTimeAgo } from "../utils/time";

export default function NoteCard({ note, index = 0, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);

  function handleUpdate(data) {
    onUpdate(note.id, data);
    setEditing(false);
  }

  function handleDelete() {
    if (window.confirm("Ви впевнені, що хочете видалити цю нотатку?")) {
      onDelete(note.id);
    }
  }

  const displayTime = note.updatedAt?.toDate
    ? formatTimeAgo(note.updatedAt)
    : note.createdAt?.toDate
    ? formatTimeAgo(note.createdAt)
    : "";

  if (editing) {
    return (
      <article
        className="note-card note-card--editing"
        style={{ animationDelay: `${index * 0.06}s` }}
      >
        <NoteForm
          initialData={{ title: note.title, content: note.content }}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
          submitLabel="Зберегти зміни"
        />
      </article>
    );
  }

  return (
    <article
      className="note-card"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className="note-card__header">
        {note.title && <h3>{note.title}</h3>}
        {displayTime && <span className="note-card__time">{displayTime}</span>}
      </div>
      <p className="note-card__content">{note.content}</p>
      <div className="note-card__actions">
        <button
          type="button"
          className="btn-icon"
          onClick={() => setEditing(true)}
          title="Редагувати"
        >
          ✏️
        </button>
        <button
          type="button"
          className="btn-icon btn-icon--danger"
          onClick={handleDelete}
          title="Видалити"
        >
          🗑️
        </button>
      </div>
    </article>
  );
}
