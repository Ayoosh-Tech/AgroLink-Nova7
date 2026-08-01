import { Target, Eye, Users2 } from "lucide-react";

export default function About() {
  return (
    <div className="container">
      <div className="page-header">
        <h1>About AgroLink</h1>
        <p>Built by Team Nova7 (NextGen Innovators) as a capstone project.</p>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 10 }}>The Problem</h3>
        <p className="text-muted">
          Many farmers struggle to advertise and sell their produce online, often relying on
          middlemen who reduce their margins. Buyers, meanwhile, struggle to find fresh
          agricultural products from trusted sources at fair prices.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 28 }}>
        <h3 style={{ marginBottom: 10 }}>Our Solution</h3>
        <p className="text-muted">
          AgroLink is an online marketplace that connects farmers directly with buyers.
          Farmers can list their produce in minutes; buyers can search, browse, and place
          orders — all without a middleman in between.
        </p>
      </div>

      <div className="grid grid-3">
        <div className="card text-center">
          <Target size={26} color="var(--primary)" style={{ margin: "0 auto 10px" }} />
          <h3 style={{ fontSize: 15, marginBottom: 6 }}>Our Mission</h3>
          <p className="text-muted" style={{ fontSize: 13.5 }}>
            Make agricultural trade fairer, faster, and more transparent for everyone.
          </p>
        </div>
        <div className="card text-center">
          <Eye size={26} color="var(--primary)" style={{ margin: "0 auto 10px" }} />
          <h3 style={{ fontSize: 15, marginBottom: 6 }}>Our Vision</h3>
          <p className="text-muted" style={{ fontSize: 13.5 }}>
            A future where every farmer has direct digital access to buyers, anywhere.
          </p>
        </div>
        <div className="card text-center">
          <Users2 size={26} color="var(--primary)" style={{ margin: "0 auto 10px" }} />
          <h3 style={{ fontSize: 15, marginBottom: 6 }}>Our Team</h3>
          <p className="text-muted" style={{ fontSize: 13.5 }}>Team Nova7 — NextGen Innovators.</p>
        </div>
      </div>
    </div>
  );
}
