import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { loginSchema } from "../utils/validators.js";
import { useAuth } from "../hooks/useAuth.js";

const dashboardPathByRole = { farmer: "/farmer/dashboard", buyer: "/buyer/dashboard", admin: "/admin/dashboard" };

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data) {
    try {
      const user = await login(data.email, data.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      const redirectTo = location.state?.from || dashboardPathByRole[user.role] || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="container">
      <div className="card auth-card">
        <h1>Welcome back</h1>
        <p className="text-muted" style={{ marginBottom: 22 }}>Log in to your AgroLink account.</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input className="form-input" type="email" placeholder="you@example.com" {...register("email")} />
            {errors.email && <div className="form-error">{errors.email.message}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" {...register("password")} />
            {errors.password && <div className="form-error">{errors.password.message}</div>}
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="auth-switch">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}
