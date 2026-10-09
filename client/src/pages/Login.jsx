import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
export default function Login() {
  const [email, setEmail] = useState("demo@finflow.demo"),
    [password, setPassword] = useState("Demo@12345"),
    [error, setError] = useState("");
  const login = useAuthStore((s) => s.login);
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password });
      nav("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };
  return (
    <AuthCard
      title="Sign in to FinFlow"
      subtitle="Secure demo banking workspace"
    >
      <form onSubmit={submit} className="form">
        {error && <div className="error">{error}</div>}
        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </label>
        <label>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </label>
        <button className="primary">Sign in</button>
        <p>
          New user? <Link to="/register">Create account</Link>
        </p>
        <small>Demo: demo@finflow.demo / Demo@12345</small>
      </form>
    </AuthCard>
  );
}
function AuthCard({ title, subtitle, children }) {
  return (
    <div className="auth-page">
      <div className="auth-brand">
        FinFlow <span>Digital Finance</span>
      </div>
      <div className="auth-card">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
