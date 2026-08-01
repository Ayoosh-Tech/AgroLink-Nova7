import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import { orderService } from "../services/orderService.js";
import { formatDateTime, formatPrice } from "../utils/formatters.js";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import Loader from "../components/common/Loader.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import Badge from "../components/common/Badge.jsx";

const navItems = [{ key: "orders", label: "My Orders", icon: Package }];

export default function BuyerDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    orderService
      .myOrders()
      .then((data) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout navItems={navItems} activeKey="orders" onChange={() => {}}>
      <div className="page-header">
        <h1>My Orders</h1>
        <p>Track every order you've placed on AgroLink.</p>
      </div>

      {loading ? (
        <Loader />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          message="Once you check out, your orders will show up here."
          action={
            <button className="btn btn-primary" onClick={() => navigate("/products")}>
              Browse Products
            </button>
          }
        />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Placed</th>
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
