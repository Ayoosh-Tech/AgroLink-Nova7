import { useNavigate } from "react-router-dom";
import { Leaf, MapPin } from "lucide-react";
import { formatPrice } from "../../utils/formatters.js";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="product-card card-hover" onClick={() => navigate(`/products/${product.id}`)} style={{ cursor: "pointer" }}>
      <div className="product-card-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Leaf size={38} strokeWidth={1.4} />
        )}
      </div>
      <div className="product-card-body">
        <span className="product-card-category">{product.category}</span>
        <div className="product-card-title">{product.name}</div>
        <div className="product-card-meta flex" style={{ gap: 4 }}>
          <MapPin size={12} /> {product.location || product.farmer?.location || "Location not set"}
        </div>
        <div className="flex-between" style={{ marginTop: 6 }}>
          <span className="product-card-price">
            {formatPrice(product.price)} <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)" }}>/ {product.unit}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
