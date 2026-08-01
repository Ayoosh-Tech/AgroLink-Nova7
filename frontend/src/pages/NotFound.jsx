import { useNavigate } from "react-router-dom";
import { Sprout } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="container text-center" style={{ padding: "80px 0" }}>
      <Sprout size={44} color="var(--secondary)" style={{ margin: "0 auto 16px" }} />
      <h1 style={{ fontSize: 60, color: "var(--primary)", marginBottom: 8 }}>404</h1>
      <p className="text-muted" style={{ marginBottom: 22 }}>
        This page took a wrong turn somewhere in the field.
      </p>
      <button className="btn btn-primary" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
}
