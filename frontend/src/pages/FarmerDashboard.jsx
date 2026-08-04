import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Package, ClipboardList, Plus, Pencil, Trash2 } from "lucide-react";
import { productService } from "../services/productService.js";
import { orderService } from "../services/orderService.js";
import { formatDateTime, formatPrice, ORDER_STATUSES } from "../utils/formatters.js";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import Loader from "../components/common/Loader.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import Badge from "../components/common/Badge.jsx";
import Modal from "../components/common/Modal.jsx";
import ProductForm from "../components/product/ProductForm.jsx";

const navItems = [
  { key: "listings", labelKey: "dashboard.farmer.navListings", icon: Package },
  { key: "orders", labelKey: "dashboard.farmer.navOrders", icon: ClipboardList },
];

export default function FarmerDashboard() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("listings");
  const nav = navItems.map((item) => ({ ...item, label: t(item.labelKey) }));

  return (
    <DashboardLayout navItems={nav} activeKey={tab} onChange={setTab}>
      {tab === "listings" ? <ListingsTab /> : <OrdersTab />}
    </DashboardLayout>
  );
}

function ListingsTab() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // product being edited, or null for "create"

  function loadProducts() {
    setLoading(true);
    productService
      .mine()
      .then((data) => setProducts(data.products))
      .finally(() => setLoading(false));
  }

  useEffect(loadProducts, []);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(product) {
    setEditing(product);
    setModalOpen(true);
  }

  async function handleSubmit(values) {
    try {
      if (editing) {
        await productService.update(editing.id, values);
        toast.success(t("dashboard.farmer.listingUpdated"));
      } else {
        await productService.create(values);
        toast.success(t("dashboard.farmer.listingCreated"));
      }
      setModalOpen(false);
      loadProducts();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDelete(product) {
    if (!confirm(t("dashboard.farmer.deleteConfirm", { name: product.name }))) return;
    try {
      await productService.remove(product.id);
      toast.success(t("dashboard.farmer.listingDeleted"));
      loadProducts();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <>
      <div className="flex-between page-header">
        <div>
          <h1>{t("dashboard.farmer.title")}</h1>
          <p>{t("dashboard.farmer.subtitle")}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> {t("dashboard.farmer.newListing")}
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title={t("dashboard.farmer.emptyTitle")}
          message={t("dashboard.farmer.emptyMessage")}
          action={
            <button className="btn btn-primary" onClick={openCreate}>
              <Plus size={16} /> {t("dashboard.farmer.newListing")}
            </button>
          }
        />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t("dashboard.farmer.tableProduct")}</th>
                <th>{t("dashboard.farmer.tableCategory")}</th>
                <th>{t("dashboard.farmer.tablePrice")}</th>
                <th>{t("dashboard.farmer.tableStock")}</th>
                <th>{t("dashboard.farmer.tableStatus")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{t(`categories.${p.category}`, p.category)}</td>
                  <td>
                    {formatPrice(p.price)} / {p.unit}
                  </td>
                  <td>{p.quantity}</td>
                  <td>
                    <Badge value={p.status} />
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(p)} aria-label="Edit">
                        <Pencil size={15} />
                      </button>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleDelete(p)} aria-label="Delete">
                        <Trash2 size={15} color="var(--danger)" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <Modal title={editing ? t("dashboard.farmer.editListing") : t("dashboard.farmer.newListingModal")} onClose={() => setModalOpen(false)}>
          <ProductForm
            initialValues={editing || undefined}
            submitLabel={editing ? t("dashboard.farmer.saveChanges") : t("dashboard.farmer.createListing")}
            onSubmit={handleSubmit}
          />
        </Modal>
      )}
    </>
  );
}

function OrdersTab() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  function loadOrders() {
    setLoading(true);
    orderService
      .farmerOrders()
      .then((data) => setItems(data.items))
      .finally(() => setLoading(false));
  }

  useEffect(loadOrders, []);

  async function handleStatusChange(orderId, status) {
    try {
      await orderService.updateStatus(orderId, status);
      toast.success(t("dashboard.farmer.statusUpdated"));
      loadOrders();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>{t("dashboard.farmer.ordersTitle")}</h1>
        <p>{t("dashboard.farmer.ordersSubtitle")}</p>
      </div>

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <EmptyState icon={ClipboardList} title={t("dashboard.farmer.ordersEmptyTitle")} message={t("dashboard.farmer.ordersEmptyMessage")} />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t("dashboard.farmer.tableBuyer")}</th>
                <th>{t("dashboard.farmer.tableProduct")}</th>
                <th>{t("dashboard.farmer.tableQty")}</th>
                <th>{t("dashboard.farmer.tableSubtotal")}</th>
                <th>{t("dashboard.farmer.tableStatus")}</th>
                <th>{t("dashboard.farmer.tablePlaced")}</th>
                <th>{t("dashboard.farmer.tableUpdate")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.order.buyer?.name}</td>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>{formatPrice(item.subtotal)}</td>
                  <td>
                    <Badge value={item.order.status} />
                  </td>
                  <td className="text-muted">{formatDateTime(item.createdAt)}</td>
                  <td>
                    <select
                      className="form-select"
                      style={{ padding: "6px 8px", fontSize: 12.5 }}
                      value={item.order.status}
                      onChange={(e) => handleStatusChange(item.order.id, e.target.value)}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {t(`statuses.${s}`, s)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
