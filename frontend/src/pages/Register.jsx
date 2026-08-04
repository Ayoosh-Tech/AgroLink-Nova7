import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { registerSchema } from "../utils/validators.js";
import { useAuth } from "../hooks/useAuth.js";

const dashboardPathByRole = { farmer: "/farmer/dashboard", buyer: "/buyer/dashboard" };

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("buyer");
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema), defaultValues: { role: "buyer" } });

  function chooseRole(nextRole) {
    setRole(nextRole);
    setValue("role", nextRole);
  }

  async function onSubmit(data) {
    try {
      const { confirmPassword, ...payload } = data;
      const user = await registerUser(payload);
      toast.success(t("auth.welcomeRegister", { name: user.name.split(" ")[0] }));
      navigate(dashboardPathByRole[user.role] || "/", { replace: true });
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="container">
      <div className="card auth-card">
        <h1>{t("auth.joinAgrolink")}</h1>
        <p className="text-muted" style={{ marginBottom: 22 }}>{t("auth.joinSubtext")}</p>

        <div className="role-toggle">
          <button type="button" className={role === "buyer" ? "active" : ""} onClick={() => chooseRole("buyer")}>
            {t("auth.buyer")}
          </button>
          <button type="button" className={role === "farmer" ? "active" : ""} onClick={() => chooseRole("farmer")}>
            {t("auth.farmer")}
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("role")} value={role} />

          <div className="form-group">
            <label className="form-label">{t("auth.fullName")}</label>
            <input className="form-input" placeholder={t("auth.fullNamePlaceholder")} {...register("name")} />
            {errors.name && <div className="form-error">{errors.name.message}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">{t("auth.email")}</label>
            <input className="form-input" type="email" placeholder="you@example.com" {...register("email")} />
            {errors.email && <div className="form-error">{errors.email.message}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t("auth.phone")}</label>
              <input className="form-input" placeholder={t("auth.phonePlaceholder")} {...register("phone")} />
            </div>
            <div className="form-group">
              <label className="form-label">{t("auth.location")}</label>
              <input className="form-input" placeholder={t("auth.locationPlaceholder")} {...register("location")} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t("auth.password")}</label>
              <input className="form-input" type="password" placeholder="••••••••" {...register("password")} />
              {errors.password && <div className="form-error">{errors.password.message}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">{t("auth.confirmPassword")}</label>
              <input className="form-input" type="password" placeholder="••••••••" {...register("confirmPassword")} />
              {errors.confirmPassword && <div className="form-error">{errors.confirmPassword.message}</div>}
            </div>
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? t("auth.creatingAccount")
              : t("auth.createRoleAccount", { role: t(`roles.${role}`) })}
          </button>
        </form>

        <div className="auth-switch">
          {t("auth.alreadyHaveAccount")} <Link to="/login">{t("auth.loginButton")}</Link>
        </div>
      </div>
    </div>
  );
}
