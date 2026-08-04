import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../hooks/useCart.js";
import CartItemRow from "../components/cart/CartItemRow.jsx";
import CartSummary from "../components/cart/CartSummary.jsx";
import EmptyState from "../components/common/EmptyState.jsx";

export default function Cart() {
  const { items } = useCart();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="container">
      <div className="page-header">
        <h1>{t("cart.title")}</h1>
        <p>{t("cart.subtitle")}</p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title={t("cart.emptyTitle")}
          message={t("cart.emptyMessage")}
          action={
            <button className="btn btn-primary" onClick={() => navigate("/products")}>
              {t("cart.browseProducts")}
            </button>
          }
        />
      ) : (
        <div className="grid grid-2" style={{ gridTemplateColumns: "2fr 1fr", alignItems: "start" }}>
          <div className="card">
            {items.map((item) => (
              <CartItemRow key={item.productId} item={item} />
            ))}
          </div>
          <CartSummary />
        </div>
      )}
    </div>
  );
}
