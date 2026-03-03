import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-page page-enter">
        <div className="spinner" aria-label="Завантаження">
          <div className="spinner__circle" />
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="auth-page page-enter">
        <div className="auth-shell auth-shell--welcome">
          <section className="auth-showcase">
            <div>
              <p className="eyebrow">MyIdeaPad</p>
              <h1>Продовжуйте дизайнити ідеї без зайвих кроків</h1>
              <p className="auth-showcase__subtitle">
                Усі ваші концепти, дослідження та роадмапи вже синхронізовані. Просто натисніть
                кнопку нижче, щоб повернутися до стрічки нотаток.
              </p>
            </div>

            <div className="auth-showcase__chips">
              <span className="chip chip--accent">Realtime sync</span>
              <span className="chip">Private vault</span>
              <span className="chip">Idea radar</span>
            </div>

            <div className="auth-showcase__stats">
              <div className="auth-stat">
                <strong>+12%</strong>
                <span>більше зафіксованих інсайтів</span>
              </div>
              <div className="auth-stat">
                <strong>0 затримок</strong>
                <span>миттєве повернення до нотаток</span>
              </div>
              <div className="auth-stat">
                <strong>∞</strong>
                <span>місця для прототипів</span>
              </div>
            </div>
          </section>

          <section className="auth-welcome-card">
            <p className="eyebrow">Повернення</p>
            <h2>Привіт, {user.email}</h2>
            <p>
              Ваш робочий простір уже оновлено. Продовжуйте редагувати останні нотатки або створіть
              нову ідею за секунди.
            </p>

            <div className="welcome-actions">
              <Link to="/my-notes" className="btn-gradient">
                Перейти до нотаток
              </Link>
              <Link to="/my-notes" className="btn-ghost" aria-disabled="true">
                Скоро: простір команди
              </Link>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page page-enter">
      <div className="auth-card auth-card--welcome">
        <h1>MyIdeaPad</h1>
        <p>Міні-блог особистих нотаток</p>
        <div className="auth-buttons">
          <Link to="/login" className="btn-primary">
            Увійти
          </Link>
          <Link to="/register" className="btn-secondary">
            Зареєструватися
          </Link>
        </div>
      </div>
    </div>
  );
}
