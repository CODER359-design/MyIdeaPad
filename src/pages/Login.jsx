import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/my-notes", { replace: true });
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/my-notes", { replace: true });
    } catch (err) {
      setError(err.code === "auth/invalid-credential" 
        ? "Невірний email або пароль" 
        : err.message || "Помилка входу");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page page-enter">
      <div className="auth-shell">
        <section className="auth-showcase">
          <div>
            <p className="eyebrow">MyIdeaPad</p>
            <h1>Професійний нотатник для тих, хто мислить продуктами</h1>
            <p className="auth-showcase__subtitle">
              Поверніться до гайдів, концептів і нотаток з будь-якого пристрою. Захищена синхронізація,
              інтуїтивний редактор і тонни натхнення.
            </p>
          </div>

          <div className="auth-showcase__chips">
            <span className="chip chip--accent">Realtime sync</span>
            <span className="chip">Focus mode</span>
            <span className="chip">Encrypted drafts</span>
          </div>

          <div className="auth-showcase__stats">
            <div className="auth-stat">
              <strong>48K+</strong>
              <span>впорядкованих ідей</span>
            </div>
            <div className="auth-stat">
              <strong>3.5x</strong>
              <span>швидше знаходите інсайти</span>
            </div>
            <div className="auth-stat">
              <strong>99.9%</strong>
              <span>uptime & приватність</span>
            </div>
          </div>

          <div className="auth-showcase__glass">
            <p>“Я більше не гублю своїх брейнштормів. MyIdeaPad став моїм особистим радаром ідей.”</p>
            <span>— СЕО студії концептів</span>
          </div>
        </section>

        <section className="auth-form-card">
          <div className="auth-form-card__header">
            <p className="eyebrow">Вхід</p>
            <h2>Поверніться до своїх ідей</h2>
            <p>Введіть email і пароль, аби негайно продовжити з місця зупинки.</p>
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
              <span>Пароль</span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? "Вхід..." : "Увійти"}
            </button>
          </form>

          <div className="form-divider" aria-hidden="true">
            <span>або</span>
          </div>

          <button type="button" className="btn-ghost" disabled>
            Magic link (скоро)
          </button>

          <p className="auth-link">
            Немає акаунту? <Link to="/register">Зареєструйтеся</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
