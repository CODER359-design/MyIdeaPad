import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/my-notes", { replace: true });
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Паролі не збігаються");
      return;
    }

    if (password.length < 6) {
      setError("Пароль має бути не менше 6 символів");
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/my-notes", { replace: true });
    } catch (err) {
      setError(
        err.code === "auth/email-already-in-use"
          ? "Цей email вже зареєстровано"
          : err.message || "Помилка реєстрації"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page page-enter">
      <div className="auth-shell auth-shell--reverse">
        <section className="auth-showcase">
          <div>
            <p className="eyebrow">MyIdeaPad</p>
            <h1>Запаліть нові ідеї й ведіть їх до запуску</h1>
            <p className="auth-showcase__subtitle">
              Персональна платформа для product-профі: прототипуйте, мапте думки та формуйте дорожні карти в одному місці.
            </p>
          </div>

          <div className="auth-showcase__chips">
            <span className="chip chip--accent">AI draft assist</span>
            <span className="chip">Stakeholder mode</span>
            <span className="chip">Private lab</span>
          </div>

          <div className="auth-showcase__stats">
            <div className="auth-stat">
              <strong>7 хв.</strong>
              <span>до першої записаної ідеї</span>
            </div>
            <div className="auth-stat">
              <strong>120+</strong>
              <span>команд щодня створюють продукти</span>
            </div>
            <div className="auth-stat">
              <strong>∞</strong>
              <span>простору для експериментів</span>
            </div>
          </div>

          <div className="auth-showcase__glass">
            <p>“Реєстрація зайняла хвилину, а ми вже ведемо roadmap із миттєвою синхронізацією.”</p>
            <span>— Продакт керівник стартапу</span>
          </div>
        </section>

        <section className="auth-form-card">
          <div className="auth-form-card__header">
            <p className="eyebrow">Реєстрація</p>
            <h2>Створіть профіль творця</h2>
            <p>Заповніть поля нижче, аби зібрати всі прототипи, драфти та брейншторми в одному місці.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="error-msg">{error}</div>}
            <label>
              <span>Email</span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </label>
            <label>
              <span>Пароль (мін. 6 символів)</span>
              <input
                type="password"
                placeholder="Створіть надійний пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </label>
            <label>
              <span>Підтвердіть пароль</span>
              <input
                type="password"
                placeholder="Повторіть пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? "Реєстрація..." : "Зареєструватися"}
            </button>
          </form>

          <div className="form-divider" aria-hidden="true">
            <span>або</span>
          </div>

          <button type="button" className="btn-ghost" disabled>
            Імпорт акаунту (незабаром)
          </button>

          <p className="auth-link">
            Вже є акаунт? <Link to="/login">Увійдіть</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
