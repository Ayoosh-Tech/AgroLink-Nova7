// Renders a colored pill for order statuses, user roles, or listing status.
// The class names (badge-pending, badge-farmer, etc.) are defined in
// styles/components.css.
import { useTranslation } from "react-i18next";

export default function Badge({ value }) {
  const { t } = useTranslation();
  const label = t(`statuses.${value}`, t(`roles.${value}`, value));
  return <span className={`badge badge-${value}`}>{label}</span>;
}
