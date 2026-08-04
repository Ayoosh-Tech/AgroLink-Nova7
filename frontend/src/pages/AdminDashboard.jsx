import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { LayoutGrid, Users, Package, ClipboardList } from "lucide-react";
import { adminService } from "../services/adminService.js";
import { formatDateTime, formatPrice } from "../utils/formatters.js";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import Loader from "../components/common/Loader.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import Badge from "../components/common/Badge.jsx";

const navItems = [
  { key: "overview", labelKey: "dashboard.admin.navOverview", icon: LayoutGrid },
  { key: "users", labelKey: "dashboard.admin.navUsers", icon: Users },
  { key: "listings", labelKey: "dashboard.admin.navListings", icon: Package },
  { key: "orders", labelKey: "dashboard.admin.navOrders", icon: ClipboardList },
];

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("overview");
  const nav = navItems.map((item) => ({ ...item, label: t(item.labelKey) }));

  return (
    <DashboardLayout navItems={nav} activeKey={tab} onChange={setTab}>
      {tab === "overview" && <OverviewTab />}
      {tab === "users" && <UsersTab />}
      {tab === "listings" && <ListingsTab />}
      {tab === "orders" && <OrdersTab />}
    </DashboardLayout>
  );
}

function OverviewTab() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminService.dashboard().then((data) => setStats(data.stats));
  }, []);

  if (!stats) return <Loader />;

  const cards = [
    { label: t("dashboard.admin.totalUsers"), value: stats.totalUsers },
    { label: t("dashboard.admin.farmers"), value: stats.totalFarmers },
    { label: t("dashboard.admin.buyers"), value: stats.totalBuyers },
    { label: t("dashboard.admin.activeListings"), value: stats.totalProducts },
    { label: t("dashboard.admin.totalOrders"), value: stats.totalOrders },
    { label: t("dashboard.admin.pendingOrders"), value: stats.pendingOrders },
    { label: t("dashboard.admin.revenueDelivered"), value: formatPrice(stats.totalRevenue) },
  ];

  return (
    <>
      <div className="page-header">
        <h1>{t("dashboard.admin.overviewTitle")}</h1>
        <p>{t("dashboard.admin.overviewSubtitle")}</p>
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
  const { t } = useTranslation();
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
      toast.success(user.status === "active" ? t("dashboard.admin.userSuspended") : t("dashboard.admin.userReactivated"));
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDelete(user) {
    if (!confirm(t("dashboard.admin.removeUserConfirm", { name: user.name }))) return;
    try {
      await adminService.deleteUser(user.id);
      toast.success(t("dashboard.admin.userRemoved"));
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (loading) return <Loader />;
  if (users.length === 0) return <EmptyState icon={Users} title={t("dashboard.admin.noUsersYet")} />;

  return (
    <>
      <div className="page-header">
        <h1>{t("dashboard.admin.manageUsersTitle")}</h1>
        <p>{t("dashboard.admin.manageUsersSubtitle")}</p>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t("dashboard.admin.tableName")}</th>
              <th>{t("dashboard.admin.tableEmail")}</th>
              <th>{t("dashboard.admin.tableRole")}</th>
              <th>{t("dashboard.admin.tableStatus")}</th>
              <th>{t("dashboard.admin.tableJoined")}</th>
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
                      {u.status === "active" ? t("dashboard.admin.suspend") : t("dashboard.admin.reactivate")}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u)}>
                      {t("dashboard.admin.remove")}
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
  const { t } = useTranslation();
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
    if (!confirm(t("dashboard.admin.removeListingConfirm", { name: product.name }))) return;
    try {
      await adminService.removeProduct(product.id);
      toast.success(t("dashboard.admin.listingRemoved"));
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (loading) return <Loader />;
  if (products.length === 0) return <EmptyState icon={Package} title={t("dashboard.admin.noListingsYet")} />;

  return (
    <>
      <div className="page-header">
        <h1>{t("dashboard.admin.manageListingsTitle")}</h1>
        <p>{t("dashboard.admin.manageListingsSubtitle")}</p>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t("dashboard.farmer.tableProduct")}</th>
              <th>{t("dashboard.admin.tableFarmer")}</th>
              <th>{t("dashboard.farmer.tableCategory")}</th>
              <th>{t("dashboard.farmer.tablePrice")}</th>
              <th>{t("dashboard.farmer.tableStatus")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td className="text-muted">{p.farmer?.name}</td>
                <td>{t(`categories.${p.category}`, p.category)}</td>
                <td>
                  {formatPrice(p.price)} / {p.unit}
                </td>
                <td>
                  <Badge value={p.status} />
                </td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleRemove(p)}>
                    {t("dashboard.admin.remove")}
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
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .listOrders()
      .then((data) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (orders.length === 0) return <EmptyState icon={ClipboardList} title={t("dashboard.admin.noOrdersYet")} />;

  return (
    <>
      <div className="page-header">
        <h1>{t("dashboard.admin.allOrdersTitle")}</h1>
        <p>{t("dashboard.admin.allOrdersSubtitle")}</p>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t("dashboard.admin.tableOrder")}</th>
              <th>{t("dashboard.admin.tableBuyer")}</th>
              <th>{t("dashboard.admin.tableItems")}</th>
              <th>{t("dashboard.admin.tableTotal")}</th>
              <th>{t("dashboard.admin.tableStatus")}</th>
              <th>{t("dashboard.admin.tablePlaced")}</th>
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
