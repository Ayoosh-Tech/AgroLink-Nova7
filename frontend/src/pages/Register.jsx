import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { registerSchema } from "../utils/validators.js";
import { useAuth } from "../hooks/useAuth.js";

const dashboardPathByRole = { farmer: "/farmer/dashboard", buyer: "/buyer/dashboard" };

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("buyer");

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
      toast.success(`Welcome to AgroLink, ${user.name.split(" ")[0]}!`);
      navigate(dashboardPathByRole[user.role] || "/", { replace: true });
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="container">
      <div className="card auth-card">
        <h1>Join AgroLink</h1>
        <p className="text-muted" style={{ marginBottom: 22 }}>Create an account to start buying or selling.</p>

        <div className="role-toggle">
          <button type="button" className={role === "buyer" ? "active" : ""} onClick={() => chooseRole("buyer")}>
            I'm a Buyer
          </button>
          <button type="button" className={role === "farmer" ? "active" : ""} onClick={() => chooseRole("farmer")}>
            I'm a Farmer
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("role")} value={role} />

          <div className="form-group">
            <label className="form-label">Full name</label>
            <input className="form-input" placeholder="Your full name" {...register("name")} />
            {errors.name && <div className="form-error">{errors.name.message}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Email address</label>
            <input className="form-input" type="email" placeholder="you@example.com" {...register("email")} />
            {errors.email && <div className="form-error">{errors.email.message}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone (optional)</label>
              <input className="form-input" placeholder="+234..." {...register("phone")} />
            </div>
            <div className="form-group">
              <label className="form-label">Location (optional)</label>
              <input className="form-input" placeholder="City, State" {...register("location")} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" {...register("password")} />
              {errors.password && <div className="form-error">{errors.password.message}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm password</label>
              <input className="form-input" type="password" placeholder="••••••••" {...register("confirmPassword")} />
              {errors.confirmPassword && <div className="form-error">{errors.confirmPassword.message}</div>}
            </div>
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : `Create ${role} account`}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}
