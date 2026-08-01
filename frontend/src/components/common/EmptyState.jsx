import { PackageSearch } from "lucide-react";

export default function EmptyState({ icon: Icon = PackageSearch, title, message, action }) {
  return (
    <div className="empty-state">
      <Icon size={40} strokeWidth={1.5} />
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}
