import { useEffect, useState } from "react";
import { toast } from "react-toastify";
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
  { key: "listings", label: "My Listings", icon: Package },
  { key: "orders", label: "Orders", icon: ClipboardList },
];

export default function FarmerDashboard() {
  const [tab, setTab] = useState("listings");

  return (
    <DashboardLayout navItems={navItems} activeKey={tab} onChange={setTab}>
      {tab === "listings" ? <ListingsTab /> : <OrdersTab />}
    </DashboardLayout>
  );
}

function ListingsTab() {
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
        toast.success("Listing updated.");
      } else {
        await productService.create(values);
        toast.success("Listing created.");
      }
      setModalOpen(false);
      loadProducts();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await productService.remove(product.id);
      toast.success("Listing deleted.");
      loadProducts();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <>
      <div className="flex-between page-header">
        <div>
          <h1>My Listings</h1>
          <p>Create and manage the produce you have for sale.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> New Listing
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No listings yet"
          message="Create your first listing to start selling on AgroLink."
          action={
            <button className="btn btn-primary" onClick={openCreate}>
              <Plus size={16} /> New Listing
            </button>
          }
        />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{p.category}</td>
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
        <Modal title={editing ? "Edit Listing" : "New Listing"} onClose={() => setModalOpen(false)}>
          <ProductForm
            initialValues={editing || undefined}
            submitLabel={editing ? "Save changes" : "Create listing"}
            onSubmit={handleSubmit}
          />
        </Modal>
      )}
    </>
  );
}

function OrdersTab() {
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
      toast.success("Order status updated.");
      loadOrders();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>Orders</h1>
        <p>Orders that include products you've listed.</p>
      </div>

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No orders yet" message="Orders for your products will appear here." />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Buyer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Subtotal</th>
                <th>Status</th>
                <th>Placed</th>
                <th>Update</th>
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
                          {s}
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
