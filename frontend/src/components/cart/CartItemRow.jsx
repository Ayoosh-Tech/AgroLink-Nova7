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
        <Leaf size={24} strokeWidth={1.4} />
      </div>
      <div style={{ gridArea: "name" }}>
        <div style={{ fontWeight: 700, fontSize: 14.5 }}>{item.name}</div>
        <div className="text-muted" style={{ fontSize: 12.5 }}>
          {formatPrice(item.price)} / {item.unit} · {t("cartItem.soldBy")} {item.farmerName || t("cartItem.aFarmer")}
        </div>
      </div>
      <div className="qty-stepper" style={{ gridArea: "qty" }}>
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
      <div className="flex" style={{ gridArea: "price", gap: 14 }}>
        <div style={{ fontWeight: 700 }}>{formatPrice(item.price * item.quantity)}</div>
        <button className="btn btn-ghost btn-icon" onClick={() => removeFromCart(item.productId)} aria-label="Remove item">
          <Trash2 size={16} color="var(--danger)" />
        </button>
      </div>
    </div>
  );
}
