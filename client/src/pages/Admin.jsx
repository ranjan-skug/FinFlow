import { useEffect, useState } from "react";
import api from "../lib/api";
import Layout from "../components/Layout";
export default function Admin() {
  const [metrics, setMetrics] = useState({}),
    [users, setUsers] = useState([]),
    [logs, setLogs] = useState([]),
    [q, setQ] = useState("");
  const load = async () => {
    const [m, u, l] = await Promise.all([
      api.get("/admin/dashboard"),
      api.get("/admin/users", { params: q ? { q } : {} }),
      api.get("/admin/audit-logs"),
    ]);
    setMetrics(m.data.metrics);
    setUsers(u.data.users);
    setLogs(l.data.logs);
  };
  useEffect(() => {
    load();
  }, [q]);
  const patch = async (id, status) => {
    await api.patch("/admin/users/" + id + "/status", { status });
    load();
  };
  const kyc = async (id, status) => {
    await api.patch("/admin/users/" + id + "/kyc", { status });
    load();
  };
  return (
    <Layout>
      <div className="page-head">
        <div>
          <p className="eyebrow">ADMIN CONSOLE</p>
          <h1>Risk & operations</h1>
          <p>Monitor users, KYC and platform activity.</p>
        </div>
        <input
          className="search"
          placeholder="Search users…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="stats">
        <div className="stat-card">
          <span>Total users</span>
          <strong>{metrics.users || 0}</strong>
        </div>
        <div className="stat-card">
          <span>Verified KYC</span>
          <strong>{metrics.verifiedKyc || 0}</strong>
        </div>
        <div className="stat-card">
          <span>Transactions</span>
          <strong>{metrics.transactions || 0}</strong>
        </div>
        <div className="stat-card">
          <span>Total volume</span>
          <strong>
            ₹
            {(
              (metrics.totalCredits || 0) + (metrics.totalDebits || 0)
            ).toLocaleString("en-IN")}
          </strong>
        </div>
      </div>
      <div className="card table-wrap">
        <h2>Users</h2>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Status</th>
              <th>KYC</th>
              <th>Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>
                  <strong>{u.name}</strong>
                  <br />
                  <small>{u.email}</small>
                </td>
                <td>{u.status}</td>
                <td>
                  <span className="pill">{u.kycStatus}</span>
                </td>
                <td>₹{u.walletBalance.toLocaleString("en-IN")}</td>
                <td>
                  <div className="row-actions">
                    <button
                      className="secondary"
                      onClick={() =>
                        patch(
                          u._id,
                          u.status === "active" ? "blocked" : "active",
                        )
                      }
                    >
                      {u.status === "active" ? "Block" : "Activate"}
                    </button>
                    <button
                      className="secondary"
                      onClick={() => kyc(u._id, "verified")}
                    >
                      Verify KYC
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card">
        <div className="card-head">
          <div>
            <h2>Audit logs</h2>
            <p>Recent security and workflow events.</p>
          </div>
        </div>
        {logs.slice(0, 12).map((l) => (
          <div className="audit" key={l._id}>
            <span>{new Date(l.createdAt).toLocaleString()}</span>
            <strong>{l.action}</strong>
            <small>{l.actor?.email || "system"}</small>
          </div>
        ))}
      </div>
    </Layout>
  );
}
