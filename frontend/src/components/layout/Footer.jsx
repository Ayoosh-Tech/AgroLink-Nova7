import { NavLink } from "react-router-dom";
import { Sprout } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="navbar-brand" style={{ marginBottom: 10 }}>
              <span className="mark">
                <Sprout size={19} />
              </span>
              AgroLink
            </div>
            <p className="text-muted" style={{ maxWidth: 320, fontSize: 14 }}>
              A digital marketplace connecting farmers directly with buyers — fresher
              produce, fairer prices, no middlemen.
            </p>
          </div>
          <div>
            <div className="footer-title">Marketplace</div>
            <ul className="footer-links">
              <li>
                <NavLink to="/products">Browse Products</NavLink>
              </li>
              <li>
                <NavLink to="/register">Sell on AgroLink</NavLink>
              </li>
              <li>
                <NavLink to="/about">About Us</NavLink>
              </li>
            </ul>
          </div>
          <div>
            <div className="footer-title">Account</div>
            <ul className="footer-links">
              <li>
                <NavLink to="/login">Log in</NavLink>
              </li>
              <li>
                <NavLink to="/register">Create account</NavLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} AgroLink — Built by Team Nova7 (NextGen Innovators).
        </div>
      </div>
    </footer>
  );
}
