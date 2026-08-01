import { Search } from "lucide-react";
import { CATEGORIES } from "../../utils/formatters.js";

// Controlled component: `filters` + `onChange` are owned by the Products page,
// so the URL/query-string can stay the single source of truth there.
export default function ProductFilters({ filters, onChange }) {
  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div className="grid grid-4" style={{ alignItems: "end" }}>
        <div className="form-group" style={{ marginBottom: 0, gridColumn: "span 2" }}>
          <label className="form-label">Search</label>
          <div style={{ position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: 13, color: "var(--text-muted)" }} />
            <input
              className="form-input"
              style={{ paddingLeft: 36 }}
              placeholder="Search products..."
              value={filters.search || ""}
              onChange={(e) => set("search", e.target.value)}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Category</label>
          <select className="form-select" value={filters.category || ""} onChange={(e) => set("category", e.target.value)}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Location</label>
          <input
            className="form-input"
            placeholder="e.g. Kano"
            value={filters.location || ""}
            onChange={(e) => set("location", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: 14 }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Min price (₦)</label>
          <input
            className="form-input"
            type="number"
            min="0"
            value={filters.minPrice || ""}
            onChange={(e) => set("minPrice", e.target.value)}
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Max price (₦)</label>
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
