import { useNavigate } from "react-router-dom";
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

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <span className="hero-eyebrow">🌾 Fresh from the farm, direct to you</span>
            <h1>
              Connecting Farmers Directly With Buyers — <span style={{ color: "var(--primary)" }}>No Middlemen.</span>
            </h1>
            <p className="lede">
              AgroLink is a digital marketplace where farmers list their produce and buyers
              order fresh, trusted agricultural products — simply and transparently.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => navigate("/products")}>
                Browse Products <ArrowRight size={16} />
              </button>
              <button className="btn btn-outline" onClick={() => navigate("/register")}>
                Sell Your Produce
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
            <h2 style={{ fontSize: 26 }}>Shop by Category</h2>
            <p>Everything from fresh vegetables to livestock, sourced from real farmers.</p>
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
                <span style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</span>
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
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>Trusted Farmers</h3>
              <p className="text-muted" style={{ fontSize: 14 }}>
                Every listing is tied to a verified farmer profile you can review.
              </p>
            </div>
            <div className="text-center">
              <Truck size={30} color="var(--primary)" style={{ margin: "0 auto 10px" }} />
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>Order Tracking</h3>
              <p className="text-muted" style={{ fontSize: 14 }}>
                Track every order from pending to accepted to delivered.
              </p>
            </div>
            <div className="text-center">
              <Users size={30} color="var(--primary)" style={{ margin: "0 auto 10px" }} />
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>No Middlemen</h3>
              <p className="text-muted" style={{ fontSize: 14 }}>
                Buy and sell directly — fairer prices for everyone involved.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section text-center">
        <div className="container">
          <h2 style={{ fontSize: 26, marginBottom: 10 }}>Ready to get started?</h2>
          <p className="text-muted" style={{ marginBottom: 22 }}>
            Join AgroLink as a farmer or a buyer — it only takes a minute.
          </p>
          <button className="btn btn-primary" onClick={() => navigate("/register")}>
            Create your free account
          </button>
        </div>
      </section>
    </>
  );
}
