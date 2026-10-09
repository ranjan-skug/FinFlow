import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
export default function Register() {
  const [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
      phone: "",
    }),
    [error, setError] = useState("");
  const register = useAuthStore((s) => s.register);
  const nav = useNavigate();
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      nav("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-brand">
        FinFlow <span>Digital Finance</span>
      </div>
      <div className="auth-card">
        <h1>Create your account</h1>
        <p>Open a secure demo wallet.</p>
        <form onSubmit={submit} className="form">
          {error && <div className="error">{error}</div>}
          <label>
            Full name
            <input name="name" value={form.name} onChange={change} />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={change}
            />
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={change} />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={change}
            />
          </label>
          <button className="primary">Create account</button>
          <p>
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
