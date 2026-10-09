import { useEffect, useState } from "react";
import api from "../lib/api";
import Layout from "../components/Layout";
export default function Notifications() {
  const [items, setItems] = useState([]);
  const load = () =>
    api.get("/notifications").then((r) => setItems(r.data.notifications));
  useEffect(load, []);
  const read = async (id) => {
    await api.patch("/notifications/" + id + "/read");
    load();
  };
  return (
    <Layout>
      <div className="page-head">
        <div>
          <p className="eyebrow">ALERTS</p>
          <h1>Notifications</h1>
          <p>Security, payment and account updates.</p>
        </div>
      </div>
      <div className="card">
        {items.length === 0 ? (
          <div className="empty">No notifications.</div>
        ) : (
          items.map((n) => (
            <div className={"notice " + (n.read ? "read" : "")} key={n._id}>
              <div>
                <strong>{n.title}</strong>
                <span>{n.message}</span>
                <small>{new Date(n.createdAt).toLocaleString()}</small>
              </div>
              {!n.read && (
                <button className="secondary" onClick={() => read(n._id)}>
                  Mark read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
