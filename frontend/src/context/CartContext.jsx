import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const CART_STORAGE_KEY = "agrolink.cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // `product` is a normalized product object from the API (id, name, price,
  // unit, quantity [stock], farmerId, farmer.name).
  function addToCart(product, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        const nextQty = Math.min(existing.quantity + qty, product.quantity);
        return prev.map((i) => (i.productId === product.id ? { ...i, quantity: nextQty } : i));
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: Number(product.price),
          unit: product.unit,
          quantity: Math.min(qty, product.quantity),
          maxQuantity: product.quantity,
          image:
           product.image ||
           product.imageUrl ||
           product.images?.[0] ||
           "",
          farmerId: product.farmerId || product.farmer?.id,
          farmerName: product.farmer?.name || "",
        },
      ];
    });
  }

  function updateQuantity(productId, qty) {
    setItems((prev) => {
      if (qty < 1) return prev.filter((i) => i.productId !== productId);
      return prev.map((i) => (i.productId === productId ? { ...i, quantity: Math.min(qty, i.maxQuantity) } : i));
    });
  }

  function removeFromCart(productId) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const totalAmount = useMemo(() => items.reduce((sum, i) => sum + i.quantity * i.price, 0), [items]);

  const value = { items, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, totalAmount };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext() must be used within a <CartProvider>");
  return ctx;
}
