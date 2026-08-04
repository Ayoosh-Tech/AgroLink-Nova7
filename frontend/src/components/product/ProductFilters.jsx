import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CATEGORIES } from "../../utils/formatters.js";

// Controlled component: `filters` + `onChange` are owned by the Products page,
// so the URL/query-string can stay the single source of truth there.
export default function ProductFilters({ filters, onChange }) {
  const { t } = useTranslation();
  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div className="grid grid-4" style={{ alignItems: "end" }}>
        <div className="form-group" style={{ marginBottom: 0, gridColumn: "span 2" }}>
          <label className="form-label">{t("products.searchLabel")}</label>
          <div style={{ position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: 13, color: "var(--text-muted)" }} />
            <input
              className="form-input"
              style={{ paddingLeft: 36 }}
              placeholder={t("products.searchPlaceholder")}
              value={filters.search || ""}
              onChange={(e) => set("search", e.target.value)}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">{t("products.categoryLabel")}</label>
          <select className="form-select" value={filters.category || ""} onChange={(e) => set("category", e.target.value)}>
            <option value="">{t("products.allCategories")}</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t(`categories.${c}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">{t("products.locationLabel")}</label>
          <input
            className="form-input"
            placeholder={t("products.locationPlaceholder")}
            value={filters.location || ""}
            onChange={(e) => set("location", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: 14 }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">{t("products.minPriceLabel")}</label>
          <input
            className="form-input"
            type="number"
            min="0"
            value={filters.minPrice || ""}
            onChange={(e) => set("minPrice", e.target.value)}
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">{t("products.maxPriceLabel")}</label>
          <input
            className="form-input"
            type="number"
            min="0"
            value={filters.maxPrice || ""}
            onChange={(e) => set("maxPrice", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
