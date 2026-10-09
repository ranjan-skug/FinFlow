import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import Layout from "../components/Layout";
export default function Transfer() {
  const [form, setForm] = useState({ email: "", amount: "", note: "" });
  const [msg, setMsg] = useState("");
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/wallet/transfer", {
        ...form,
        amount: Number(form.amount),
      });
      setMsg("Transfer completed successfully.");
      setTimeout(() => nav("/"), 700);
    } catch (err) {
      setMsg(err.response?.data?.message || "Transfer failed");
    }
  };
  return (
    <Layout>
      <div className="narrow">
        <p className="eyebrow">PAYMENTS</p>
        <h1>Send money</h1>
        <p>Internal demo transfer between FinFlow users.</p>
        <form className="card form wide" onSubmit={submit}>
          {msg && (
            <div className={msg.includes("success") ? "success" : "error"}>
              {msg}
            </div>
          )}
          <label>
            Recipient email
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              type="email"
              required
            />
          </label>
          <label>
            Amount
            <input
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              type="number"
              min="1"
              required
            />
          </label>
          <label>
            Note
            <input
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              maxLength="160"
            />
          </label>
          <button className="primary">Send transfer</button>
        </form>
      </div>
    </Layout>
  );
}
