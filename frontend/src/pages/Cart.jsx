import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../hooks/useCart.js";
import CartItemRow from "../components/cart/CartItemRow.jsx";
import CartSummary from "../components/cart/CartSummary.jsx";
import EmptyState from "../components/common/EmptyState.jsx";

export default function Cart() {
  const { items } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="page-header">
        <h1>Your Cart</h1>
        <p>Review your items before checking out.</p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          message="Browse the marketplace to find fresh produce."
          action={
            <button className="btn btn-primary" onClick={() => navigate("/products")}>
              Browse Products
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
