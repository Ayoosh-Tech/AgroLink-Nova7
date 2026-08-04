import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sprout } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();
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
              {t("footer.description")}
            </p>
          </div>
          <div>
            <div className="footer-title">{t("footer.marketplace")}</div>
            <ul className="footer-links">
              <li>
                <NavLink to="/products">{t("footer.browseProducts")}</NavLink>
              </li>
              <li>
                <NavLink to="/register">{t("footer.sellOnAgrolink")}</NavLink>
              </li>
              <li>
                <NavLink to="/about">{t("footer.aboutUs")}</NavLink>
              </li>
            </ul>
          </div>
          <div>
            <div className="footer-title">{t("footer.account")}</div>
            <ul className="footer-links">
              <li>
                <NavLink to="/login">{t("footer.login")}</NavLink>
              </li>
              <li>
                <NavLink to="/register">{t("footer.createAccount")}</NavLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          {t("footer.copyright", { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
