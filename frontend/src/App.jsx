import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  CarFront,
  LayoutDashboard,
  Boxes,
  Plus,
  PackagePlus,
  Search,
  Pencil,
  Trash2,
  Minus,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowLeft,
  Save,
  Menu,
  ChevronRight,
  PackageOpen,
} from "lucide-react";

import api, { errorText } from "./api";

const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(n || 0));

const fmtDate = (d) =>
  d
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(d))
    : "—";

export default function App() {
  const [toast, setToast] = useState(null),
    [mobile, setMobile] = useState(false);

  const notify = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  }, []);


  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {mobile && (
        <button
          aria-label="Close navigation overlay"
          onClick={() => setMobile(false)}
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#111827]
             text-white transition-transform lg:translate-x-0
              ${mobile ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div
          className="flex h-20 items-center gap-3 border-b
             border-white/10 px-5"
        >
          <span
            className="grid h-11 w-11 place-items-center 
            rounded-xl bg-blue-600"
          >
            <CarFront size={25} />
          </span>
          <div>
            <b className="block text-sm">Janta Auto Parts</b>
            <span
              className="text-[10px] uppercase tracking-widest
             text-slate-400"
            >
              Inventory system
            </span>
          </div>
          <button
            onClick={() => setMobile(false)}
            className="ml-auto lg:hidden"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-4 pt-7">
          <p
            className="px-3 pb-3 text-[10px] font-bold 
            uppercase tracking-widest text-slate-500"
          >
            Workspace
          </p>
          <nav className="space-y-1">
            {[
              ["/", "Overview", LayoutDashboard, true],
              ["/products", "Products", Boxes, false],
              ["/products/new", "Add product", PackagePlus, false],
            ].map(([to, label, Icon, end]) => (
              <NavLink
                key={to}
                end={end}
                to={to}
                onClick={() => setMobile(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm 
              font-semibold ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <div className="rounded-xl border border-white/10 bg-white/[.04] p-4">
            <p className="text-xs font-semibold text-slate-200">
              
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
             
            </p>
          </div>
          <p className="mt-4 px-2 text-[11px] text-slate-500">
            Owner access · Local use
          </p>
        </div>
      </aside>
      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3">
            <button
              aria-label="Open navigation"
              onClick={() => setMobile(true)}
              className="rounded-lg border p-2 lg:hidden"
            >
              <Menu size={18} />
            </button>
            <div>
              <p className="text-xs text-slate-400">
                Janta Auto Parts / Inventory
              </p>
              <p className="mt-1 font-bold text-slate-900">Stock overview</p>
            </div>
          </div>
          <Link
            to="/products/new"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={17} />
            <span className="hidden sm:inline">Add product</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </header>
        <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-9">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products notify={notify} />} />
            <Route
              path="/products/new"
              element={<ProductForm notify={notify} />}
            />
            <Route
              path="/products/:id/edit"
              element={<ProductForm notify={notify} />}
            />
            <Route path="*" element={<Dashboard />} />
          </Routes>
          <footer className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row sm:justify-between">
            <span>© {new Date().getFullYear()} Janta Auto Parts</span>
            <span>Inventory management · Private local workspace</span>
          </footer>
        </main>
      </div>
      {toast && (
        <div
          role="status"
          className={`fixed right-4 top-4 z-[70] flex max-w-sm items-start gap-3 rounded-xl border bg-white p-4 shadow-xl ${toast.type === "error" ? "border-red-200" : "border-emerald-200"}`}
        >
          {toast.type === "error" ? (
            <AlertCircle className="text-red-600" />
          ) : (
            <CheckCircle2 className="text-emerald-600" />
          )}
          <p className="flex-1 text-sm font-medium text-slate-700">
            {toast.message}
          </p>
          <button aria-label="Dismiss" onClick={() => setToast(null)}>
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const [products, setProducts] = useState([]),
    [err, setErr] = useState(""),
    [loading, setLoading] = useState(true),
    [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    api
      .get("/products")
      .then(({ data }) => {
        if (active) {
          setProducts(data.products || []);
          setErr("");
        }
      })
      .catch((e) => active && setErr(errorText(e)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [retry]);
  const stats = useMemo(
    () => ({
      items: products.length,
      units: products.reduce((s, p) => s + p.stockQuantity, 0),
      low: products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= 5)
        .length,
      out: products.filter((p) => p.stockQuantity === 0).length,
    }),
    [products],
  );
  const cards = [
    ["Total products", stats.items, Boxes, "bg-blue-50 text-blue-600"],
    [
      "Units in stock",
      stats.units,
      PackageOpen,
      "bg-violet-50 text-violet-600",
    ],
    ["Low stock", stats.low, Search, "bg-amber-50 text-amber-700"],
    ["Out of stock", stats.out, LayoutDashboard, "bg-red-50 text-red-600"],
  ];
  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.15em] text-blue-600">
            Shop overview
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Good to see you.
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Here’s what’s happening with your inventory at Janta Auto Parts.
          </p>
        </div>
        <Link
          to="/products/new"
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <PackagePlus size={18} /> Add a product
        </Link>
      </div>
      {err && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p>{err}</p>
          <button
            className="mt-2 font-bold underline"
            onClick={() => {
              setLoading(true);
              setRetry((x) => x + 1);
            }}
          >
            Retry
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {cards.map(([label, value, Icon, color]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-3 text-3xl font-extrabold text-slate-900">
                  {loading ? "—" : value}
                </p>
              </div>
              <span
                className={`grid h-11 w-11 place-items-center rounded-xl ${color}`}
              >
                <Icon size={21} />
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-bold">Recently added</h2>
              <p className="mt-1 text-xs text-slate-500">
                Newest inventory entries
              </p>
            </div>
            <Link
              to="/products"
              className="text-sm font-semibold text-blue-600"
            >
              View all
            </Link>
          </div>
          {loading ? (
            <p className="p-8 text-sm text-slate-400">Loading…</p>
          ) : (
            products.slice(0, 5).map((p) => (
              <div
                key={p._id}
                className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {p.productName}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-400">
                    {p.supplierName}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold">
                    {money(p.finalSellingPrice)}
                  </p>
                  <p
                    className={`mt-1 text-xs ${p.stockQuantity === 0 ? "text-red-600" : p.stockQuantity <= 5 ? "text-amber-600" : "text-emerald-600"}`}
                  >
                    {p.stockQuantity} units
                  </p>
                </div>
              </div>
            ))
          )}
          {!loading && !products.length && (
            <div className="p-10 text-center">
              <Boxes size={28} className="mx-auto text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">
                No products yet. Add your first item.
              </p>
            </div>
          )}
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold">Quick actions</h2>
          <p className="mt-1 text-xs text-slate-500">Common inventory tasks</p>
          <div className="mt-5 space-y-3">
            <Quick
              to="/products/new"
              icon={PackagePlus}
              title="Add a new product"
              desc="Enter supplier and pricing details"
            />
            <Quick
              to="/products"
              icon={Boxes}
              title="Manage inventory"
              desc="Search, edit or adjust stock"
            />
            <Quick
              to="/products"
              icon={Search}
              title="Find a product"
              desc="Search product or supplier name"
            />
          </div>
          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Pricing reminder
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Enter a discount to calculate the final price automatically, or
              leave it blank to enter a selling price manually.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
function Quick({ to, icon: Icon, title, desc }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:border-blue-200 hover:bg-blue-50/50"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600">
        <Icon size={19} />
      </span>
      <span className="min-w-0 flex-1">
        <b className="block text-sm">{title}</b>
        <small className="mt-1 block text-xs text-slate-500">{desc}</small>
      </span>
      <ChevronRight size={17} className="text-slate-300" />
    </Link>
  );
}

function Products({ notify }) {
  const [products, setProducts] = useState([]),
    [search, setSearch] = useState(""),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [del, setDel] = useState(null),
    [busy, setBusy] = useState(""),
    [deleting, setDeleting] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products", {
        params: search.trim() ? { search: search.trim() } : {},
      });
      setProducts(data.products || []);
      setError("");
    } catch (e) {
      setError(errorText(e));
    } finally {
      setLoading(false);
    }
  }, [search]);
  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);
  const stat = [
    ["Products shown", products.length],
    ["Total units", products.reduce((s, p) => s + p.stockQuantity, 0)],
    [
      "Low stock",
      products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= 5)
        .length,
    ],
    ["Out of stock", products.filter((p) => p.stockQuantity === 0).length],
  ];
  async function adjust(p, up) {
    setBusy(p._id);
    try {
      const { data } = await api.patch(
        `/products/${p._id}/${up ? "increase-stock" : "decrease-stock"}`,
      );
      setProducts((old) =>
        old.map((x) => (x._id === p._id ? data.product : x)),
      );
      notify(
        up ? "Stock increased successfully." : "Stock decreased successfully.",
      );
    } catch (e) {
      notify(errorText(e), "error");
      load();
    } finally {
      setBusy("");
    }
  }
  async function remove() {
    setDeleting(true);
    try {
      await api.delete(`/products/${del._id}`);
      setProducts((old) => old.filter((p) => p._id !== del._id));
      notify("Product deleted successfully.");
      setDel(null);
    } catch (e) {
      notify(errorText(e), "error");
    } finally {
      setDeleting(false);
    }
  }
  const btn =
    "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700";
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.15em] text-blue-600">
            Inventory
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage parts, suppliers, prices and stock levels.
          </p>
        </div>
        <Link
          to="/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={18} /> Add product
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stat.map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-xs text-slate-500 sm:text-sm">{label}</p>
            <p className="mt-3 text-2xl font-extrabold">{value}</p>
          </div>
        ))}
      </div>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="font-bold">Product inventory</h2>
            <p className="mt-1 text-xs text-slate-500">
              Sorted by newest first
            </p>
          </div>
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product or supplier…"
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        {error && (
          <div className="m-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
            <button onClick={load} className="ml-2 underline">
              Retry
            </button>
          </div>
        )}
        {loading ? (
          <p className="p-12 text-center text-sm text-slate-500">
            Loading inventory…
          </p>
        ) : !products.length ? (
          <div className="p-14 text-center">
            <PackageOpen size={28} className="mx-auto text-slate-300" />
            <h3 className="mt-3 font-bold">
              {search ? "No matching products" : "Your inventory is empty"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {search
                ? "Try another product or supplier."
                : "Add your first auto part to get started."}
            </p>
            {!search && (
              <Link
                to="/products/new"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
              >
                <Plus size={16} /> Add product
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  {[
                    "Product name",
                    "Supplier",
                    "MRP",
                    "Discount %",
                    "Selling price",
                    "Stock quantity",
                    "Created date",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3.5 font-semibold first:pl-5"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-4 pl-5">
                      <b>{p.productName}</b>
                      <p className="mt-1 text-xs text-slate-400">
                        Updated {fmtDate(p.updatedAt)}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {p.supplierName}
                    </td>
                    <td className="px-4 py-4">{money(p.mrp)}</td>
                    <td className="px-4 py-4">
                      {p.discountPercentage == null
                        ? "—"
                        : `${p.discountPercentage}%`}
                    </td>
                    <td className="px-4 py-4 font-bold">
                      {money(p.finalSellingPrice)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className={btn}
                          disabled={busy === p._id}
                          onClick={() => adjust(p, false)}
                          aria-label={`Decrease ${p.productName} stock`}
                        >
                          <Minus size={14} />
                        </button>
                        <b
                          className={`min-w-5 text-center ${p.stockQuantity === 0 ? "text-red-600" : p.stockQuantity <= 5 ? "text-amber-600" : "text-slate-800"}`}
                        >
                          {p.stockQuantity}
                        </b>
                        <button
                          className={btn}
                          disabled={busy === p._id}
                          onClick={() => adjust(p, true)}
                          aria-label={`Increase ${p.productName} stock`}
                        >
                          <Plus size={14} />
                        </button>
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-bold ${p.stockQuantity === 0 ? "bg-red-50 text-red-700" : p.stockQuantity <= 5 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}
                        >
                          {p.stockQuantity === 0
                            ? "Out"
                            : p.stockQuantity <= 5
                              ? "Low"
                              : "In stock"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      {fmtDate(p.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <Link
                          title="Edit product"
                          to={`/products/${p._id}/edit`}
                          className={btn}
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          title="Delete product"
                          onClick={() => setDel(p)}
                          className={`${btn} hover:border-red-200 hover:bg-red-50 hover:text-red-600`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
          {products.length} product{products.length === 1 ? "" : "s"} · Stock
          updates save immediately.
        </div>
      </section>
      {del && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"
          onMouseDown={(e) =>
            e.target === e.currentTarget && !deleting && setDel(null)
          }
        >
          <section
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-red-50 text-red-600">
                <Trash2 />
              </span>
              <button onClick={() => setDel(null)} aria-label="Close">
                <X size={19} />
              </button>
            </div>
            <h2 className="text-lg font-bold">Delete product?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete this product?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                disabled={deleting}
                onClick={() => setDel(null)}
                className="rounded-lg border px-4 py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={deleting}
                onClick={remove}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function ProductForm({ notify }) {
  const { id } = useParams(),
    editing = Boolean(id),
    navigate = useNavigate();
  const [form, setForm] = useState({
      productName: "",
      supplierName: "",
      mrp: "",
      discountPercentage: "",
      finalSellingPrice: "",
      stockQuantity: "0",
    }),
    [loading, setLoading] = useState(editing),
    [saving, setSaving] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    if (!editing) return;
    let active = true;
    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        if (!active) return;
        const p = data.product;
        setForm({
          productName: p.productName,
          supplierName: p.supplierName,
          mrp: String(p.mrp),
          discountPercentage:
            p.discountPercentage == null ? "" : String(p.discountPercentage),
          finalSellingPrice: String(p.finalSellingPrice),
          stockQuantity: String(p.stockQuantity),
        });
      })
      .catch((e) => setError(errorText(e)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [editing, id]);
  const calculated = useMemo(() => {
    if (form.discountPercentage === "" || form.mrp === "") return "";
    const m = Number(form.mrp),
      d = Number(form.discountPercentage);
    if (!Number.isFinite(m) || !Number.isFinite(d) || m < 0 || d < 0 || d > 100)
      return "";
    return (
      Math.round((m * (1 - d / 100) + Number.EPSILON) * 100) / 100
    ).toFixed(2);
  }, [form.mrp, form.discountPercentage]);
  useEffect(() => {
    if (form.discountPercentage !== "" && calculated !== "")
      setForm((f) =>
        f.finalSellingPrice === calculated
          ? f
          : { ...f, finalSellingPrice: calculated },
      );
  }, [calculated, form.discountPercentage]);
  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setError("");
  };
  async function submit(e) {
    e.preventDefault();
    const mrp = Number(form.mrp),
      stock = Number(form.stockQuantity),
      discount =
        form.discountPercentage === ""
          ? undefined
          : Number(form.discountPercentage),
      price = Number(form.finalSellingPrice);
    if (!form.productName.trim() || !form.supplierName.trim())
      return setError("Product name and supplier name are required.");
    if (form.mrp === "" || !Number.isFinite(mrp) || mrp < 0)
      return setError("Enter a valid non-negative MRP.");
    if (
      discount !== undefined &&
      (!Number.isFinite(discount) || discount < 0 || discount > 100)
    )
      return setError("Discount must be between 0 and 100.");
    if (form.finalSellingPrice === "" || !Number.isFinite(price) || price < 0)
      return setError("Enter a valid non-negative selling price.");
    if (form.stockQuantity === "" || !Number.isInteger(stock) || stock < 0)
      return setError("Stock must be a whole number and cannot be negative.");
    setSaving(true);
    try {
      const payload = {
        productName: form.productName.trim(),
        supplierName: form.supplierName.trim(),
        mrp,
        discountPercentage: discount,
        finalSellingPrice: price,
        stockQuantity: stock,
      };
      if (editing) {
        await api.put(`/products/${id}`, payload);
        notify("Product updated successfully.");
      } else {
        await api.post("/products", payload);
        notify("Product created successfully.");
      }
      navigate("/products");
    } catch (e) {
      setError(errorText(e));
    } finally {
      setSaving(false);
    }
  }
  const input =
      "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
    label = "block text-sm font-semibold text-slate-700";
  if (loading)
    return <div className="rounded-xl bg-white p-8">Loading product…</div>;
  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/products"
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft size={17} /> Back to products
      </Link>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            {editing ? "Update inventory" : "Inventory entry"}
          </p>
          <h1 className="mt-2 text-2xl font-bold">
            {editing ? "Edit product" : "Add new product"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Enter the product and pricing details.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-6 p-5 sm:p-8">
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={label}>
              Product name *
              <input
                className={input}
                value={form.productName}
                onChange={(e) => set("productName", e.target.value)}
                maxLength={120}
                placeholder="e.g. Brake Pad Set"
                required
              />
            </label>
            <label className={label}>
              Supplier name *
              <input
                className={input}
                value={form.supplierName}
                onChange={(e) => set("supplierName", e.target.value)}
                maxLength={120}
                placeholder="e.g. Sharma Auto Supplies"
                required
              />
            </label>
            <label className={label}>
              MRP (₹) *
              <input
                className={input}
                type="number"
                min="0"
                step="0.01"
                value={form.mrp}
                onChange={(e) => set("mrp", e.target.value)}
                placeholder="0.00"
                required
              />
            </label>
            <label className={label}>
              Discount percentage{" "}
              <span className="font-normal text-slate-400">(optional)</span>
              <div className="relative">
                <input
                  className={`${input} pr-9`}
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.discountPercentage}
                  onChange={(e) => set("discountPercentage", e.target.value)}
                  placeholder="Leave empty for manual price"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  %
                </span>
              </div>
            </label>
            <label className={label}>
              Final selling price (₹) *
              <input
                className={`${input} ${form.discountPercentage !== "" && calculated !== "" ? "bg-slate-50 text-slate-500" : ""}`}
                type="number"
                min="0"
                step="0.01"
                value={form.finalSellingPrice}
                onChange={(e) => set("finalSellingPrice", e.target.value)}
                readOnly={form.discountPercentage !== "" && calculated !== ""}
                placeholder="Enter final price"
                required
              />
              <span className="mt-1 block text-xs text-slate-400">
                {form.discountPercentage !== "" && calculated !== ""
                  ? "Calculated automatically from MRP and discount."
                  : "Enter manually when discount is empty."}
              </span>
            </label>
            <label className={label}>
              Stock quantity *
              <input
                className={input}
                type="number"
                min="0"
                step="1"
                value={form.stockQuantity}
                onChange={(e) => set("stockQuantity", e.target.value)}
                required
              />
            </label>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">MRP</span>
              <b>{form.mrp === "" ? "—" : money(form.mrp)}</b>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-slate-500">Discount</span>
              <b>
                {form.discountPercentage === ""
                  ? "Not applied"
                  : `${form.discountPercentage}%`}
              </b>
            </div>
            <div className="mt-2 flex justify-between border-t border-slate-200 pt-2">
              <span className="font-semibold">Final selling price</span>
              <b className="text-lg">
                {form.finalSellingPrice === ""
                  ? "—"
                  : money(form.finalSellingPrice)}
              </b>
            </div>
          </div>
          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <Link
              to="/products"
              className="rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold"
            >
              Cancel
            </Link>
            <button
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Save size={17} />
              {saving ? "Saving…" : editing ? "Save changes" : "Create product"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
