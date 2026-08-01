import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/formatters.js";
import { useCart } from "../../hooks/useCart.js";

export default function CartSummary({ showCheckoutButton = true }) {
  const { items, totalItems, totalAmount } = useCart();
  const navigate = useNavigate();

  return (
    <div className="card">
      <h3 style={{ marginBottom: 14 }}>Order Summary</h3>
      <div className="summary-row">
        <span className="text-muted">Items ({totalItems})</span>
        <span>{formatPrice(totalAmount)}</span>
      </div>
      <div className="summary-row">
        <span className="text-muted">Delivery</span>
        <span className="text-muted">Arranged with farmer</span>
      </div>
      <div className="summary-row total">
        <span>Total</span>
        <span>{formatPrice(totalAmount)}</span>
      </div>
      {showCheckoutButton && (
        <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} disabled={items.length === 0} onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </button>
      )}
    </div>
  );
}
