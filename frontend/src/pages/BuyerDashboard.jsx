import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Package } from "lucide-react";
import { orderService } from "../services/orderService.js";
import { formatDateTime, formatPrice } from "../utils/formatters.js";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import Loader from "../components/common/Loader.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import Badge from "../components/common/Badge.jsx";

const navItems = [{ key: "orders", labelKey: "dashboard.buyer.title", icon: Package }];

export default function BuyerDashboard() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const nav = navItems.map((item) => ({ ...item, label: t(item.labelKey) }));

  useEffect(() => {
    orderService
      .myOrders()
      .then((data) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout navItems={nav} activeKey="orders" onChange={() => {}}>
      <div className="page-header">
        <h1>{t("dashboard.buyer.title")}</h1>
        <p>{t("dashboard.buyer.subtitle")}</p>
      </div>

      {loading ? (
        <Loader />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title={t("dashboard.buyer.emptyTitle")}
          message={t("dashboard.buyer.emptyMessage")}
          action={
            <button className="btn btn-primary" onClick={() => navigate("/products")}>
              {t("cart.browseProducts")}
            </button>
          }
        />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t("dashboard.buyer.tableOrder")}</th>
                <th>{t("dashboard.buyer.tableItems")}</th>
                <th>{t("dashboard.buyer.tableTotal")}</th>
                <th>{t("dashboard.buyer.tableStatus")}</th>
                <th>{t("dashboard.buyer.tablePlaced")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="text-muted" style={{ fontSize: 12 }}>
                    #{order.id.slice(0, 8)}
                  </td>
                  <td>{order.items.map((i) => `${i.productName} ×${i.quantity}`).join(", ")}</td>
                  <td style={{ fontWeight: 700 }}>{formatPrice(order.totalAmount)}</td>
                  <td>
                    <Badge value={order.status} />
                  </td>
                  <td className="text-muted">{formatDateTime(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
