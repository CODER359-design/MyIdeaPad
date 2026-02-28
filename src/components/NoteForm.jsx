import { useState } from "react";

export default function NoteForm({ onSubmit, initialData, onCancel, submitLabel = "Зберегти" }) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setError("Текст нотатки не може бути порожнім");
      return;
    }

    onSubmit({ title: trimmedTitle, content: trimmedContent });
    if (!initialData) {
      setTitle("");
      setContent("");
    }
  }

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      {error && <div className="error-msg">{error}</div>}
      <input
        type="text"
        placeholder="Заголовок (необов'язково)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Текст нотатки *"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        required
      />
      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Скасувати
          </button>
        )}
        <button type="submit">{submitLabel}</button>
      </div>
    </form>
  );
}
