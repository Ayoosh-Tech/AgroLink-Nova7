import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LayoutGrid, Users, Package, ClipboardList } from "lucide-react";
import { adminService } from "../services/adminService.js";
import { formatDateTime, formatPrice } from "../utils/formatters.js";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import Loader from "../components/common/Loader.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import Badge from "../components/common/Badge.jsx";

const navItems = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "users", label: "Users", icon: Users },
  { key: "listings", label: "Listings", icon: Package },
  { key: "orders", label: "Orders", icon: ClipboardList },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState("overview");

  return (
    <DashboardLayout navItems={navItems} activeKey={tab} onChange={setTab}>
      {tab === "overview" && <OverviewTab />}
      {tab === "users" && <UsersTab />}
      {tab === "listings" && <ListingsTab />}
      {tab === "orders" && <OrdersTab />}
    </DashboardLayout>
  );
}

function OverviewTab() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminService.dashboard().then((data) => setStats(data.stats));
  }, []);

  if (!stats) return <Loader />;

  const cards = [
    { label: "Total Users", value: stats.totalUsers },
    { label: "Farmers", value: stats.totalFarmers },
    { label: "Buyers", value: stats.totalBuyers },
    { label: "Active Listings", value: stats.totalProducts },
    { label: "Total Orders", value: stats.totalOrders },
    { label: "Pending Orders", value: stats.pendingOrders },
    { label: "Revenue (Delivered)", value: formatPrice(stats.totalRevenue) },
  ];

  return (
    <>
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p>A snapshot of activity across the AgroLink marketplace.</p>
      </div>
      <div className="grid grid-4">
        {cards.map((c) => (
          <div className="stat-card" key={c.label}>
            <div className="stat-label">{c.label}</div>
            <div className="stat-value">{c.value}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    adminService
      .listUsers()
      .then((data) => setUsers(data.users))
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function toggleSuspend(user) {
    try {
      await adminService.updateUser(user.id, { status: user.status === "active" ? "suspended" : "active" });
      toast.success(`User ${user.status === "active" ? "suspended" : "reactivated"}.`);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDelete(user) {
    if (!confirm(`Remove ${user.name}? This cannot be undone.`)) return;
    try {
      await adminService.deleteUser(user.id);
      toast.success("User removed.");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (loading) return <Loader />;
  if (users.length === 0) return <EmptyState icon={Users} title="No users yet" />;

  return (
    <>
      <div className="page-header">
        <h1>Manage Users</h1>
        <p>Suspend accounts that violate marketplace rules, or remove them entirely.</p>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ fontWeight: 600 }}>{u.name}</td>
                <td className="text-muted">{u.email}</td>
                <td>
                  <Badge value={u.role} />
                </td>
                <td>
                  <Badge value={u.status} />
                </td>
                <td className="text-muted">{formatDateTime(u.createdAt)}</td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => toggleSuspend(u)}>
                      {u.status === "active" ? "Suspend" : "Reactivate"}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u)}>
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ListingsTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    adminService
      .listProducts()
      .then((data) => setProducts(data.products))
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function handleRemove(product) {
    if (!confirm(`Remove listing "${product.name}"?`)) return;
    try {
      await adminService.removeProduct(product.id);
      toast.success("Listing removed.");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (loading) return <Loader />;
  if (products.length === 0) return <EmptyState icon={Package} title="No listings yet" />;

  return (
    <>
      <div className="page-header">
        <h1>Manage Listings</h1>
        <p>Moderate produce listings across the marketplace.</p>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Farmer</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td className="text-muted">{p.farmer?.name}</td>
                <td>{p.category}</td>
                <td>
                  {formatPrice(p.price)} / {p.unit}
                </td>
                <td>
                  <Badge value={p.status} />
                </td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleRemove(p)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .listOrders()
      .then((data) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (orders.length === 0) return <EmptyState icon={ClipboardList} title="No orders yet" />;

  return (
    <>
      <div className="page-header">
        <h1>All Orders</h1>
        <p>Every order placed across the marketplace.</p>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Buyer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Placed</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="text-muted" style={{ fontSize: 12 }}>
                  #{o.id.slice(0, 8)}
                </td>
                <td>{o.buyer?.name}</td>
                <td>{o.items.map((i) => `${i.productName} ×${i.quantity}`).join(", ")}</td>
                <td style={{ fontWeight: 700 }}>{formatPrice(o.totalAmount)}</td>
                <td>
                  <Badge value={o.status} />
                </td>
                <td className="text-muted">{formatDateTime(o.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
