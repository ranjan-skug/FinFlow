import { useEffect, useState } from "react";
import api from "../lib/api";
import Layout from "../components/Layout";
export default function Beneficiaries() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    nickname: "",
    email: "",
    accountLast4: "",
    bankName: "",
  });
  const load = () =>
    api.get("/beneficiaries").then((r) => setItems(r.data.beneficiaries));
  useEffect(load, []);
  const add = async (e) => {
    e.preventDefault();
    await api.post("/beneficiaries", form);
    setForm({ nickname: "", email: "", accountLast4: "", bankName: "" });
    load();
  };
  const remove = async (id) => {
    await api.delete("/beneficiaries/" + id);
    load();
  };
  return (
    <Layout>
      <div className="page-head">
        <div>
          <p className="eyebrow">RECIPIENTS</p>
          <h1>Beneficiaries</h1>
          <p>Manage trusted recipients for future transfers.</p>
        </div>
      </div>
      <div className="grid-2">
        <form className="card form" onSubmit={add}>
          <h2>Add beneficiary</h2>
          <label>
            Nickname
            <input
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <label>
            Bank name
            <input
              value={form.bankName}
              onChange={(e) => setForm({ ...form, bankName: e.target.value })}
              required
            />
          </label>
          <label>
            Account last 4 digits
            <input
              maxLength="4"
              value={form.accountLast4}
              onChange={(e) =>
                setForm({ ...form, accountLast4: e.target.value })
              }
              required
            />
          </label>
          <button className="primary">Save beneficiary</button>
        </form>
        <div className="card">
          <h2>Saved beneficiaries</h2>
          {items.length === 0 ? (
            <div className="empty">No beneficiaries added.</div>
          ) : (
            items.map((i) => (
              <div className="beneficiary" key={i._id}>
                <div>
                  <strong>{i.nickname}</strong>
                  <span>
                    {i.email} · {i.bankName} · ****{i.accountLast4}
                  </span>
                </div>
                <button className="danger" onClick={() => remove(i._id)}>
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
