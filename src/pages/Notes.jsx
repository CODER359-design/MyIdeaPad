import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import NoteForm from "../components/NoteForm";
import NoteCard from "../components/NoteCard";

export default function Notes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const noteCount = notes.length;

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notes"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(items);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  async function handleCreate(data) {
    if (!user) return;
    await addDoc(collection(db, "notes"), {
      title: data.title,
      content: data.content,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async function handleUpdate(noteId, data) {
    await updateDoc(doc(db, "notes", noteId), {
      title: data.title,
      content: data.content,
      updatedAt: serverTimestamp(),
    });
  }

  async function handleDelete(noteId) {
    await deleteDoc(doc(db, "notes", noteId));
  }

  async function handleLogout() {
    await signOut(auth);
    navigate("/login", { replace: true });
  }

  if (!user) return null;

  return (
    <div className="notes-page">
      <header className="notes-hero">
        <div className="notes-hero__text">
          <p className="eyebrow">Осмислені нотатки без шуму</p>
          <h1>Захоплюй ідеї, як у топ-додатках</h1>
          <p className="notes-hero__subtitle">
            Моментальне збереження, приватність та витончена типографіка, щоби кожна думка
            відчувалася як концепт продукту.
          </p>
          <div className="hero-chips">
            <span className="chip chip--accent">Realtime sync</span>
            <span className="chip">End-to-end privacy</span>
            <span className="chip">Inspiration radar</span>
          </div>
        </div>
        <div className="notes-hero__panel">
          <div className="metric-card">
            <span className="metric-card__label">Активні нотатки</span>
            <strong className="metric-card__value">{noteCount}</strong>
            <span className="metric-card__hint">оновлюються миттєво</span>
          </div>
          <div className="metric-card metric-card--user">
            <span className="metric-card__label">Акаунт</span>
            <strong className="metric-card__value metric-card__value--email">{user.email}</strong>
            <button type="button" className="btn-logout" onClick={handleLogout}>
              Вийти
            </button>
          </div>
        </div>
      </header>

      <main className="notes-shell">
        <aside className="notes-panel">
          <div className="notes-panel__card">
            <div className="panel-heading">
              <p className="eyebrow">Швидкий запис</p>
              <h2>Збережіть натхнення</h2>
              <p className="panel-heading__hint">Використовуйте enter + shift, щоб додати абзац</p>
            </div>
            <NoteForm onSubmit={handleCreate} submitLabel="Додати" />
          </div>
        </aside>

        <section className="notes-feed">
          <div className="feed-toolbar">
            <div>
              <p className="eyebrow">Мої нотатки</p>
              <h2>Стрічка ідей</h2>
            </div>
            <div className="feed-toolbar__actions">
              <button className="chip-button chip-button--active" type="button">
                Усі
              </button>
              <button className="chip-button" type="button" disabled>
                Фокус
              </button>
              <button className="chip-button" type="button" disabled>
                Драфти
              </button>
            </div>
          </div>

          <div className="notes-feed__body">
            {loading ? (
              <div className="spinner" aria-label="Завантаження">
                <div className="spinner__circle" />
              </div>
            ) : noteCount === 0 ? (
              <p className="empty-state">
                У вас ще немає нотаток. Почніть із однієї думки — вона задасть ритм усій стрічці.
              </p>
            ) : (
              <div className="notes-grid">
                {notes.map((note, index) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    index={index}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
