import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { loginSchema } from "../utils/validators.js";
import { useAuth } from "../hooks/useAuth.js";

const dashboardPathByRole = { farmer: "/farmer/dashboard", buyer: "/buyer/dashboard", admin: "/admin/dashboard" };

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data) {
    try {
      const user = await login(data.email, data.password);
      toast.success(t("auth.welcomeGreeting", { name: user.name.split(" ")[0] }));
      const redirectTo = location.state?.from || dashboardPathByRole[user.role] || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="container">
      <div className="card auth-card">
        <h1>{t("auth.welcomeBack")}</h1>
        <p className="text-muted" style={{ marginBottom: 22 }}>{t("auth.welcomeBackSubtext")}</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">{t("auth.email")}</label>
            <input className="form-input" type="email" placeholder="you@example.com" {...register("email")} />
            {errors.email && <div className="form-error">{errors.email.message}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">{t("auth.password")}</label>
            <input className="form-input" type="password" placeholder="••••••••" {...register("password")} />
            {errors.password && <div className="form-error">{errors.password.message}</div>}
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("auth.loggingIn") : t("auth.loginButton")}
          </button>
        </form>

        <div className="auth-switch">
          {t("auth.noAccount")} <Link to="/register">{t("auth.createOne")}</Link>
        </div>
      </div>
    </div>
  );
}
