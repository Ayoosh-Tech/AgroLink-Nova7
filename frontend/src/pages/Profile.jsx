import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { profileSchema, passwordChangeSchema } from "../utils/validators.js";
import { userService } from "../services/userService.js";
import { useAuth } from "../hooks/useAuth.js";
import { initials } from "../utils/formatters.js";

export default function Profile() {
  const { user, updateUserLocally } = useAuth();

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || "", phone: user?.phone || "", location: user?.location || "" },
  });

  const passwordForm = useForm({ resolver: zodResolver(passwordChangeSchema) });

  async function onSaveProfile(data) {
    try {
      const result = await userService.updateProfile(data);
      updateUserLocally(result.user);
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function onChangePassword(data) {
    try {
      await userService.changePassword(data);
      passwordForm.reset();
      toast.success("Password changed.");
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your account details.</p>
      </div>

      <div className="grid grid-2" style={{ alignItems: "start" }}>
        <div className="card">
          <div className="flex" style={{ gap: 14, marginBottom: 20 }}>
            <div className="dashboard-sidebar" style={{ border: "none", padding: 0 }}>
              <div className="avatar" style={{ width: 52, height: 52, fontSize: 18 }}>
                {initials(user?.name)}
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{user?.name}</div>
              <div className="text-muted" style={{ fontSize: 13 }}>
                {user?.email}
              </div>
            </div>
          </div>

          <form onSubmit={profileForm.handleSubmit(onSaveProfile)}>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input className="form-input" {...profileForm.register("name")} />
              {profileForm.formState.errors.name && (
                <div className="form-error">{profileForm.formState.errors.name.message}</div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" {...profileForm.register("phone")} />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" {...profileForm.register("location")} />
            </div>
            <button className="btn btn-primary" type="submit" disabled={profileForm.formState.isSubmitting}>
              Save changes
            </button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Change Password</h3>
          <form onSubmit={passwordForm.handleSubmit(onChangePassword)}>
            <div className="form-group">
              <label className="form-label">Current password</label>
              <input className="form-input" type="password" {...passwordForm.register("currentPassword")} />
              {passwordForm.formState.errors.currentPassword && (
                <div className="form-error">{passwordForm.formState.errors.currentPassword.message}</div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">New password</label>
              <input className="form-input" type="password" {...passwordForm.register("newPassword")} />
              {passwordForm.formState.errors.newPassword && (
                <div className="form-error">{passwordForm.formState.errors.newPassword.message}</div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm new password</label>
              <input className="form-input" type="password" {...passwordForm.register("confirmPassword")} />
              {passwordForm.formState.errors.confirmPassword && (
                <div className="form-error">{passwordForm.formState.errors.confirmPassword.message}</div>
              )}
            </div>
            <button className="btn btn-outline" type="submit" disabled={passwordForm.formState.isSubmitting}>
              Update password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
