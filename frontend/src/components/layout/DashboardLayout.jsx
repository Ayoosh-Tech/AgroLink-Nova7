import { useAuth } from "../../hooks/useAuth.js";
import { initials } from "../../utils/formatters.js";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";

// A generic dashboard shell: left sidebar with a user summary + tab nav,
// right side renders whatever the page passes as children. Each dashboard
// page (Buyer/Farmer/Admin) owns its own tab state and just tells this
// component which tabs exist and which one is active.
export default function DashboardLayout({ navItems, activeKey, onChange, children }) {
  const { theme, toggleTheme } = useTheme();
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
            {/*<button className="btn btn-ghost btn-sm" onClick={toggleTheme} style={{ marginTop: "8px", width: "70%" }}>
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
              <span style={{ marginLeft: 6 }}>{theme === "light" ? "Dark mode" : "Light mode"}</span>
            </button> */}
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
