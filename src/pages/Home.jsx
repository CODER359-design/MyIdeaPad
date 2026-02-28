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
        <div className="auth-card auth-card--welcome">
          <h1>MyIdeaPad</h1>
          <p>Ви вже увійшли як {user.email}</p>
          <Link to="/my-notes" className="btn-primary">
            Перейти до моїх нотаток
          </Link>
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
