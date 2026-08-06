import { Leaf, Minus, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../utils/formatters.js";
import { useCart } from "../../hooks/useCart.js";

export default function CartItemRow({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const { t } = useTranslation();

  return (
    <div className="cart-item">
      <div className="cart-item-thumb" style={{ gridArea: "thumb" }}>
        {item.image ? (
          <img src={item.image} alt={item.name} className="cart-thumb-image" />
        ) : (<Leaf size={24} strokeWidth={1.4} />
        )}
      </div>
      <div className="cart-item-name" style={{ gridArea: "name" }}>
        <div style={{ fontWeight: 700, fontSize: 14.5 }}>{item.name}</div>
        <div className="text-muted" style={{ fontSize: 12.5 }}>
          {formatPrice(item.price)} / {item.unit} · {t("cartItem.soldBy")} {item.farmerName || t("cartItem.aFarmer")}
        </div>
      </div>
      <div className="qty-stepper cart-item-qty" style={{ gridArea: "qty" }}>
        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} aria-label="Decrease quantity">
          <Minus size={13} />
        </button>
        <span>{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          disabled={item.quantity >= item.maxQuantity}
          aria-label="Increase quantity"
        >
          <Plus size={13} />
        </button>
      </div>
      <div className="flex cart-item-price" style={{ gridArea: "price", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <div style={{ fontWeight: 700 }}>{formatPrice(item.price * item.quantity)}</div>
        <button className="btn btn-ghost btn-icon" onClick={() => removeFromCart(item.productId)} aria-label="Remove item">
          <Trash2 size={16} color="var(--danger)" />
        </button>
      </div>
    </div>
  );
}
