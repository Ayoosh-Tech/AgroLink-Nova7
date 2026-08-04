import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Leaf, MapPin, Phone, Minus, Plus } from "lucide-react";
import { productService } from "../services/productService.js";
import { formatPrice } from "../utils/formatters.js";
import { useAuth } from "../hooks/useAuth.js";
import { useCart } from "../hooks/useCart.js";
import Loader from "../components/common/Loader.jsx";
import EmptyState from "../components/common/EmptyState.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { t } = useTranslation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setLoading(true);
    productService
      .getById(id)
      .then((data) => setProduct(data.product))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!product) {
    return (
      <div className="container">
        <EmptyState title={t("products.productNotFound")} message={t("products.productRemoved")} />
      </div>
    );
  }

  const canBuy = !isAuthenticated || user.role === "buyer";

  function handleAddToCart() {
    if (!isAuthenticated) {
      toast.info(t("products.loginToBuy"));
      navigate("/login");
      return;
    }
    addToCart(product, qty);
    toast.success(t("products.addedToCart", { name: product.name }));
  }

  return (
    <div className="container">
      <div className="grid grid-2" style={{ gap: 36, alignItems: "start" }}>
        <div className="product-card-image" style={{ borderRadius: "var(--radius-lg)", aspectRatio: "1 / 1" }}>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <Leaf size={80} strokeWidth={1.2} />
          )}
        </div>

        <div>
          <span className="product-card-category">{t(`categories.${product.category}`, product.category)}</span>
          <h1 style={{ margin: "10px 0 6px" }}>{product.name}</h1>
          <div className="text-muted flex" style={{ gap: 5, marginBottom: 16 }}>
            <MapPin size={14} /> {product.location || t("products.locationNotSet")}
          </div>

          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 30, color: "var(--primary)", marginBottom: 6 }}>
            {formatPrice(product.price)} <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-muted)" }}>/ {product.unit}</span>
          </div>
          <div className="text-muted" style={{ marginBottom: 20, fontSize: 13.5 }}>
            {product.quantity > 0
              ? t("products.available", { quantity: product.quantity, unit: product.unit })
              : t("products.outOfStock")}
          </div>

          {product.description && <p style={{ marginBottom: 20 }}>{product.description}</p>}

          {canBuy && product.quantity > 0 && (
            <div className="flex" style={{ gap: 14, marginBottom: 20 }}>
              <div className="qty-stepper">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  <Minus size={13} />
                </button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.quantity, q + 1))} aria-label="Increase quantity">
                  <Plus size={13} />
                </button>
              </div>
              <button className="btn btn-primary" onClick={handleAddToCart}>
                {t("products.addToCart")}
              </button>
            </div>
          )}

          {!canBuy && (
            <p className="text-muted" style={{ fontStyle: "italic", marginBottom: 20 }}>
              {t("products.farmerCantBuy")}
            </p>
          )}

          <div className="card" style={{ background: "var(--surface-alt)" }}>
            <div className="text-muted" style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>
              {t("products.soldBy")}
            </div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{product.farmer?.name}</div>
            {product.farmer?.phone && (
              <div className="text-muted flex" style={{ gap: 5, fontSize: 13.5 }}>
                <Phone size={13} /> {product.farmer.phone}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
