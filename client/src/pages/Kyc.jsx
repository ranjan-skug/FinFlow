import { useState } from "react";
import api from "../lib/api";
import { useAuthStore } from "../store/authStore";
import Layout from "../components/Layout";
export default function Kyc() {
  const user = useAuthStore((s) => s.user);
  const [form, setForm] = useState({
    phone: user?.phone || "",
    address: { line1: "", city: "", state: "", postalCode: "" },
  });
  const [msg, setMsg] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users/kyc", form);
      setMsg("KYC submitted for admin review.");
    } catch (err) {
      setMsg(err.response?.data?.message || "Could not submit");
    }
  };
  return (
    <Layout>
      <div className="narrow">
        <p className="eyebrow">COMPLIANCE</p>
        <h1>KYC profile</h1>
        <p>Keep your demo verification profile up to date.</p>
        <div className="status-banner">
          Current status: <strong>{user?.kycStatus}</strong>
        </div>
        <form className="card form wide" onSubmit={submit}>
          {msg && <div className="success">{msg}</div>}
          <label>
            Phone
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </label>
          <label>
            Address
            <input
              value={form.address.line1}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, line1: e.target.value },
                })
              }
            />
          </label>
          <div className="two">
            <label>
              City
              <input
                value={form.address.city}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address: { ...form.address, city: e.target.value },
                  })
                }
              />
            </label>
            <label>
              State
              <input
                value={form.address.state}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address: { ...form.address, state: e.target.value },
                  })
                }
              />
            </label>
          </div>
          <label>
            Postal code
            <input
              value={form.address.postalCode}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, postalCode: e.target.value },
                })
              }
            />
          </label>
          <button className="primary">Submit for review</button>
        </form>
      </div>
    </Layout>
  );
}
