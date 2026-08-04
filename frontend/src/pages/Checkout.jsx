import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { checkoutSchema } from "../utils/validators.js";
import { useCart } from "../hooks/useCart.js";
import { useAuth } from "../hooks/useAuth.js";
import { orderService } from "../services/orderService.js";
import { formatPrice } from "../utils/formatters.js";

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { deliveryAddress: user?.location || "", deliveryPhone: user?.phone || "", notes: "" },
  });

  async function onSubmit(data) {
    try {
      await orderService.checkout({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        ...data,
      });
      clearCart();
      toast.success(t("checkout.success"));
      navigate("/buyer/dashboard");
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container">
        <p className="text-muted">{t("checkout.emptyMessage")}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>{t("checkout.title")}</h1>
        <p>{t("checkout.subtitle")}</p>
      </div>

      <div className="grid grid-2" style={{ gridTemplateColumns: "1.4fr 1fr", alignItems: "start" }}>
        <form className="card" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">{t("checkout.deliveryAddress")}</label>
            <input className="form-input" placeholder={t("checkout.deliveryAddressPlaceholder")} {...register("deliveryAddress")} />
            {errors.deliveryAddress && <div className="form-error">{errors.deliveryAddress.message}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">{t("checkout.contactPhone")}</label>
            <input className="form-input" placeholder={t("checkout.phonePlaceholder")} {...register("deliveryPhone")} />
            {errors.deliveryPhone && <div className="form-error">{errors.deliveryPhone.message}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">{t("checkout.notes")}</label>
            <textarea className="form-textarea" placeholder={t("checkout.notesPlaceholder")} {...register("notes")} />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("checkout.placingOrder") : t("checkout.placeOrder", { amount: formatPrice(totalAmount) })}
          </button>
        </form>

        <div className="card">
          <h3 style={{ marginBottom: 14 }}>{t("checkout.itemsTitle")}</h3>
          {items.map((item) => (
            <div key={item.productId} className="summary-row">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="summary-row total">
            <span>{t("checkout.total")}</span>
            <span>{formatPrice(totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
