import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { productService } from "../services/productService.js";
import ProductFilters from "../components/product/ProductFilters.jsx";
import ProductCard from "../components/product/ProductCard.jsx";
import Loader from "../components/common/Loader.jsx";
import EmptyState from "../components/common/EmptyState.jsx";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const filters = {
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    location: searchParams.get("location") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  };

  function handleFiltersChange(next) {
    const params = {};
    Object.entries(next).forEach(([k, v]) => {
      if (v) params[k] = v;
    });
    setSearchParams(params);
    setPage(1);
  }

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    productService
      .list({ ...filters, page, limit: 12 })
      .then((data) => {
        if (cancelled) return;
        setProducts(data.products);
        setTotal(data.total);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString(), page]);

  const totalPages = Math.max(1, Math.ceil(total / 12));

  return (
    <div className="container">
      <div className="page-header">
        <h1>Browse Products</h1>
        <p>Fresh produce, listed directly by farmers across Nigeria.</p>
      </div>

      <ProductFilters filters={filters} onChange={handleFiltersChange} />

      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <EmptyState title="No products found" message="Try adjusting your filters or search term." />
      ) : (
        <>
          <div className="grid grid-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex" style={{ justifyContent: "center", gap: 8, marginTop: 28 }}>
              <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </button>
              <span className="text-muted" style={{ fontSize: 13.5, alignSelf: "center" }}>
                Page {page} of {totalPages}
              </span>
              <button className="btn btn-outline btn-sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
