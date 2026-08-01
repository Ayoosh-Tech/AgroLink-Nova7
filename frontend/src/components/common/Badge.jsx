// Renders a colored pill for order statuses, user roles, or listing status.
// The class names (badge-pending, badge-farmer, etc.) are defined in
// styles/components.css.
export default function Badge({ value }) {
  return <span className={`badge badge-${value}`}>{value}</span>;
}
