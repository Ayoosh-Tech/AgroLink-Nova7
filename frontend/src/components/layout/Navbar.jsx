import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Sprout, ShoppingCart, Menu, X, User, LogOut, LayoutDashboard, Moon, Sun, Languages } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { useCart } from "../../hooks/useCart.js";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useTranslation } from "react-i18next";

const dashboardPathByRole = { farmer: "/farmer/dashboard", buyer: "/buyer/dashboard", admin: "/admin/dashboard" };

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { totalItems } = useCart();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/");
  }

  function toggleLanguage() {
    const next = i18n.language === "en" ? "ha" : "en";
    i18n.changeLanguage(next);
    localStorage.setItem("agrolink-language", next);
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <span className="mark">
            <Sprout size={19} />
          </span>
          AgroLink
        </NavLink>

        

        <div className="navbar-actions">
          {user?.role !== "farmer" && user?.role !== "admin" && (
            <button className="btn btn-ghost btn-icon" onClick={() => navigate("/cart")} aria-label={t("nav.cart")} style={{ position: "relative" }}>
              <ShoppingCart size={20} />
              
              {totalItems > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    background: "var(--accent)",
                    color: "#21210a",
                    borderRadius: "50%",
                    fontSize: 10.5,
                    fontWeight: 800,
                    width: 17,
                    height: 17,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {totalItems}
                </span>
              )}
            </button>
          )}

        <button className="theme-toggle" onClick={toggleLanguage} aria-label={t("nav.toggleLanguage")}>
              <Languages size={18} />
            </button>

        <button className="theme-toggle" onClick={toggleTheme} aria-label={t("nav.toggleTheme")}>
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

          {isAuthenticated ? (
            <div style={{ position: "relative" }}>
              <button className="btn btn-ghost btn-icon" onClick={() => setMenuOpen((o) => !o)} aria-label="Account menu">
                <User size={20} />
              </button>
              {menuOpen && (
                <div
                  className="card"
                  style={{ position: "absolute", right: 0, top: 46, width: 200, padding: 8, zIndex: 50 }}
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <div style={{ padding: "8px 10px 10px", borderBottom: "1px solid var(--border)", marginBottom: 6 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5 }}>{user.name}</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>
                      {user.email}
                    </div>
                  </div>
                  <button
                    className="dashboard-nav-item"
                    onClick={() => {
                      navigate(dashboardPathByRole[user.role]);
                      setMenuOpen(false);
                    }}
                  >
                    <LayoutDashboard size={16} /> {t("nav.dashboard")}
                  </button>
                  <button
                    className="dashboard-nav-item"
                    onClick={() => {
                      navigate("/profile");
                      setMenuOpen(false);
                    }}
                  >
                    <User size={16} /> {t("nav.profile")}
                  </button>
                  <button className="dashboard-nav-item" onClick={handleLogout} style={{ color: "var(--danger)" }}>
                    <LogOut size={16} /> {t("nav.logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={() => navigate("/login")}>
                {t("nav.login")}
              </button>
              <button className="btn btn-primary" onClick={() => navigate("/register")}>
                {t("nav.signup")}
              </button>
            </>
          )}

          <button className="navbar-toggle" onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <nav className={`navbar-links ${mobileOpen ? "mobile-open" : ""}`}>
          <NavLink to="/" end className="navbar-link" onClick={() => setMobileOpen(false)}>
            {t("nav.home")}
          </NavLink>
          <NavLink to="/products" className="navbar-link" onClick={() => setMobileOpen(false)}>
            {t("nav.products")}
          </NavLink>
          <NavLink to="/about" className="navbar-link" onClick={() => setMobileOpen(false)}>
            {t("nav.about")}
          </NavLink>
          {isAuthenticated && (
            <NavLink to={dashboardPathByRole[user.role]} className="navbar-link" onClick={() => setMobileOpen(false)}>
              {t("nav.dashboard")}
            </NavLink>
          )}

          
{!isAuthenticated && (
  <>
    <button
      className="btn btn-ghost mobile-menu-btn"
      onClick={() => {
        navigate("/login");
        setMobileOpen(false);
      }}
    >
      {t("nav.login")}
    </button>

    <button
      className="btn btn-primary mobile-menu-btn"
      onClick={() => {
        navigate("/register");
        setMobileOpen(false);
      }}
    >
      {t("nav.signup")}
    </button>
  </>
)}

        </nav>
    </header>
  );
}
