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
      <header className="notes-header">
        <h1>MyIdeaPad</h1>
        <div className="header-actions">
          <span className="user-email">{user.email}</span>
          <button type="button" className="btn-logout" onClick={handleLogout}>
            Вийти
          </button>
        </div>
      </header>

      <main className="notes-main">
        <section className="notes-form-section">
          <h2>Нова нотатка</h2>
          <NoteForm onSubmit={handleCreate} submitLabel="Додати" />
        </section>

        <section className="notes-list-section">
          <h2>Мої нотатки</h2>
          {loading ? (
            <div className="spinner" aria-label="Завантаження">
              <div className="spinner__circle" />
            </div>
          ) : notes.length === 0 ? (
            <p className="empty-state">У вас ще немає нотаток. Створіть першу!</p>
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
        </section>
      </main>
    </div>
  );
}
