import { useAuth } from "../../hooks/useAuth.js";
import { initials } from "../../utils/formatters.js";

// A generic dashboard shell: left sidebar with a user summary + tab nav,
// right side renders whatever the page passes as children. Each dashboard
// page (Buyer/Farmer/Admin) owns its own tab state and just tells this
// component which tabs exist and which one is active.
export default function DashboardLayout({ navItems, activeKey, onChange, children }) {
  const { user } = useAuth();

  return (
    <div className="container">
      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="user-summary">
            <div className="avatar">{initials(user?.name)}</div>
            <div style={{ fontWeight: 700, fontSize: 14.5 }}>{user?.name}</div>
            <div className="text-muted" style={{ fontSize: 12.5, textTransform: "capitalize" }}>
              {user?.role} account
            </div>
          </div>
          <ul>
            {navItems.map((item) => (
              <li key={item.key}>
                <button
                  className={`dashboard-nav-item ${activeKey === item.key ? "active" : ""}`}
                  onClick={() => onChange(item.key)}
                >
                  <item.icon size={17} />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
