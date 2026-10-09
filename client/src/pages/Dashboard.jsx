import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Send,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import api from "../lib/api";
import { useAuthStore } from "../store/authStore";
export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const [txs, setTxs] = useState([]);
  const [busy, setBusy] = useState(false);
  const [amount, setAmount] = useState("");
  const [showTopup, setShowTopup] = useState(false);
  const load = async () => {
    const { data } = await api.get("/wallet/transactions");
    setTxs(data.transactions);
  };
  useEffect(() => {
    load();
  }, []);
  const topup = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/wallet/add-money", { amount: Number(amount) });
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Top-up failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <LayoutPage>
      <section className="page-head">
        <div>
          <p className="eyebrow">PERSONAL BANKING</p>
          <h1>Financial overview</h1>
          <p>Monitor your demo wallet, transfers and account security.</p>
        </div>
        <div className="actions">
          <button className="secondary" onClick={() => setShowTopup((v) => !v)}>
            <Plus size={17} />
            Add money
          </button>
          <Link className="primary button" to="/transfer">
            <Send size={17} />
            Send money
          </Link>
        </div>
      </section>
      {showTopup && (
        <form onSubmit={topup} className="inline-form card">
          <input
            placeholder="Amount (₹100 - ₹100000)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            min="100"
          />
          <button className="primary" disabled={busy}>
            {busy ? "Processing…" : "Confirm top-up"}
          </button>
        </form>
      )}
      <div className="stats">
        <div className="stat-card balance">
          <span>Available balance</span>
          <strong>
            ₹
            {Number(user?.walletBalance || 0).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </strong>
          <small>Demo wallet</small>
          <Wallet className="stat-icon" />
        </div>
        <div className="stat-card">
          <span>KYC status</span>
          <strong>{user?.kycStatus?.replace("_", " ")}</strong>
          <small>Keep profile verified</small>
          <ShieldCheck className="stat-icon" />
        </div>
        <div className="stat-card">
          <span>Account</span>
          <strong>{user?.status}</strong>
          <small>{user?.role}</small>
        </div>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-head">
            <div>
              <h2>Recent transactions</h2>
              <p>Your latest wallet activity.</p>
            </div>
            <Link to="/transactions">View all</Link>
          </div>
          {txs.length === 0 ? (
            <div className="empty">No transactions yet.</div>
          ) : (
            <div className="tx-list">
              {txs.slice(0, 7).map((tx) => (
                <div className="tx-row" key={tx._id}>
                  <div className={"tx-icon " + tx.type}>
                    {tx.type === "credit" ? (
                      <ArrowDownLeft size={17} />
                    ) : (
                      <ArrowUpRight size={17} />
                    )}
                  </div>
                  <div>
                    <strong>{tx.description || tx.category}</strong>
                    <span>{new Date(tx.createdAt).toLocaleString()}</span>
                  </div>
                  <b className={tx.type === "credit" ? "credit" : "debit"}>
                    {tx.type === "credit" ? "+" : "-"}₹
                    {tx.amount.toLocaleString("en-IN")}
                  </b>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card">
          <div className="card-head">
            <div>
              <h2>Quick actions</h2>
              <p>Common financial workflows.</p>
            </div>
          </div>
          <div className="quick-grid">
            <Link to="/transfer" className="quick">
              <Send size={20} />
              <strong>Send money</strong>
              <span>Transfer to a user</span>
            </Link>
            <Link to="/beneficiaries" className="quick">
              <ArrowUpRight size={20} />
              <strong>Beneficiaries</strong>
              <span>Manage trusted recipients</span>
            </Link>
            <Link to="/kyc" className="quick">
              <ShieldCheck size={20} />
              <strong>KYC profile</strong>
              <span>Update verification details</span>
            </Link>
          </div>
        </div>
      </div>
    </LayoutPage>
  );
}
function LayoutPage({ children }) {
  return (
    <div>
      {/* imported inline below */}
      <Layout>{children}</Layout>
    </div>
  );
}
import Layout from "../components/Layout";
