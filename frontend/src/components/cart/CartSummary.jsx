import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../utils/formatters.js";
import { useCart } from "../../hooks/useCart.js";

export default function CartSummary({ showCheckoutButton = true }) {
  const { items, totalItems, totalAmount } = useCart();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="card">
      <h3 style={{ marginBottom: 14 }}>{t("cartSummary.title")}</h3>
      <div className="summary-row">
        <span className="text-muted">{t("cartSummary.items", { count: totalItems })}</span>
        <span>{formatPrice(totalAmount)}</span>
      </div>
      <div className="summary-row">
        <span className="text-muted">{t("cartSummary.delivery")}</span>
        <span className="text-muted">{t("cartSummary.deliveryNote")}</span>
      </div>
      <div className="summary-row total">
        <span>{t("cartSummary.total")}</span>
        <span>{formatPrice(totalAmount)}</span>
      </div>
      {showCheckoutButton && (
        <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} disabled={items.length === 0} onClick={() => navigate("/checkout")}>
          {t("cartSummary.proceedToCheckout")}
        </button>
      )}
    </div>
  );
}
