import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  WalletCards,
  ArrowLeftRight,
  Users,
  Bell,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

export default function Layout({ children }) {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const links = [
    ["/", "Dashboard", LayoutDashboard],
    ["/transactions", "Transactions", ArrowLeftRight],
    ["/beneficiaries", "Beneficiaries", Users],
    ["/kyc", "KYC Profile", ShieldCheck],
    ["/notifications", "Notifications", Bell],
  ];
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">F</div>
          <div>
            <strong>FinFlow</strong>
            <span>BFSI Platform</span>
          </div>
        </div>
        <nav>
          {links.map(([to, label, Icon]) => (
            <Link
              key={to}
              to={to}
              className={location.pathname === to ? "active" : ""}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link to="/admin">
              <ShieldCheck size={18} />
              Admin Console
            </Link>
          )}
        </nav>
        <button
          className="logout"
          onClick={async () => {
            await logout();
            navigate("/login");
          }}
        >
          <LogOut size={17} />
          Logout
        </button>
      </aside>
      <main className="main">
        <header className="topbar">
          <span className="welcome">
            Welcome back, {user?.name?.split(" ")[0]}
          </span>
          <div className="user-chip">
            <div className="avatar">{user?.name?.charAt(0)}</div>
            <span>{user?.email}</span>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
