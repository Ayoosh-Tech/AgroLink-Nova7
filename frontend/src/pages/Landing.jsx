import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Wheat, Apple, Carrot, Beef, Sprout, ArrowRight, ShieldCheck, Truck, Users } from "lucide-react";

const categories = [
  { name: "Vegetables", icon: Carrot },
  { name: "Grains", icon: Wheat },
  { name: "Fruits", icon: Apple },
  { name: "Livestock", icon: Beef },
  { name: "Tubers", icon: Sprout },
];

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <span className="hero-eyebrow">{t("landing.eyebrow")}</span>
            <h1>
              {t("landing.headline")} <span style={{ color: "var(--primary)" }}>{t("landing.headlineAccent")}</span>
            </h1>
            <p className="lede">{t("landing.description")}</p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => navigate("/products")}>
                {t("landing.browseProducts")} <ArrowRight size={16} />
              </button>
              <button className="btn btn-outline" onClick={() => navigate("/register")}>
                {t("landing.sellProduce")}
              </button>
            </div>
          </div>
          <div className="hero-art">
            <Sprout size={96} strokeWidth={1} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="page-header text-center">
            <h2 style={{ fontSize: 26 }}>{t("landing.shopByCategory")}</h2>
            <p>{t("landing.categoryDescription")}</p>
          </div>
          <div className="grid grid-4">
            {categories.map((c) => (
              <button
                key={c.name}
                className="category-chip"
                onClick={() => navigate(`/products?category=${encodeURIComponent(c.name)}`)}
              >
                <span className="icon-wrap">
                  <c.icon size={22} />
                </span>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{t(`categories.${c.name}`)}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--surface-alt)" }}>
        <div className="container">
          <div className="grid grid-3">
            <div className="text-center">
              <ShieldCheck size={30} color="var(--primary)" style={{ margin: "0 auto 10px" }} />
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>{t("landing.trustedFarmersTitle")}</h3>
              <p className="text-muted" style={{ fontSize: 14 }}>
                {t("landing.trustedFarmersText")}
              </p>
            </div>
            <div className="text-center">
              <Truck size={30} color="var(--primary)" style={{ margin: "0 auto 10px" }} />
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>{t("landing.trackingTitle")}</h3>
              <p className="text-muted" style={{ fontSize: 14 }}>
                {t("landing.trackingText")}
              </p>
            </div>
            <div className="text-center">
              <Users size={30} color="var(--primary)" style={{ margin: "0 auto 10px" }} />
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>{t("landing.noMiddlemenTitle")}</h3>
              <p className="text-muted" style={{ fontSize: 14 }}>
                {t("landing.noMiddlemenText")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section text-center">
        <div className="container">
          <h2 style={{ fontSize: 26, marginBottom: 10 }}>{t("landing.readyTitle")}</h2>
          <p className="text-muted" style={{ marginBottom: 22 }}>
            {t("landing.readyText")}
          </p>
          <button className="btn btn-primary" onClick={() => navigate("/register")}>
            {t("landing.createAccount")}
          </button>
        </div>
      </section>
    </>
  );
}
