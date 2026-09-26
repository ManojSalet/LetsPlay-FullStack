import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth/AuthContext";
import {
  getAllProducts,
  getAdminOrders,
  getAllCategories,
  getAllSports,
  getAllEquipment,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
  updateOrderStatus,
  createCategory,
  updateCategory,
  deleteCategory,
  createSport,
  updateSport,
  deleteSport,
  createEquipment,
  updateEquipment,
  deleteEquipment
} from "../../API/apiService";
import {
  ShieldCheck,
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  ArrowLeft,
  LogOut,
  Menu,
  X,
  Loader2,
  RefreshCw,
  Bell
} from "lucide-react";
import AdminOverview from "./AdminOverview";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminCatalog from "./AdminCatalog";

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Navigation tab: 'overview' | 'products' | 'orders' | 'catalog'
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Global Data State
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sports, setSports] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);

  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Shared Modals state
  const [productModalState, setProductModalState] = useState({ isOpen: false, mode: "create", product: null });
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch all administrative data
  const fetchData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const [prodsRes, ordersRes, catsRes, sportsRes, equipRes] = await Promise.all([
        getAllProducts({ includeArchived: "true" }).catch(() => ({ products: [] })),
        getAdminOrders().catch(() => ({ orders: [] })),
        getAllCategories().catch(() => ({ categories: [] })),
        getAllSports().catch(() => ({ sports: [] })),
        getAllEquipment().catch(() => ({ equipment: [] })),
      ]);

      setProducts(Array.isArray(prodsRes.products) ? prodsRes.products : []);
      setOrders(Array.isArray(ordersRes.orders) ? ordersRes.orders : []);
      setCategories(Array.isArray(catsRes.categories) ? catsRes.categories : []);
      setSports(Array.isArray(sportsRes.sports) ? sportsRes.sports : []);
      setEquipmentList(Array.isArray(equipRes.equipment) ? equipRes.equipment : []);
    } catch (err) {
      console.error("Error loading admin data:", err);
      setError("Failed to load store data. Please ensure the server is active.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Product Operations
  const handleSaveProduct = async (payload, mode, productId) => {
    if (mode === "edit") {
      const res = await updateProduct(productId, payload);
      if (res && res.product) {
        setProducts((prev) => prev.map((p) => (p._id === productId ? res.product : p)));
      }
    } else {
      const res = await createProduct(payload);
      if (res && res.product) {
        setProducts((prev) => [res.product, ...prev]);
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    const res = await deleteProduct(productId);
    if (res && res.product) {
      setProducts((prev) => prev.map((p) => (p._id === productId ? res.product : p)));
    } else {
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? { ...p, isDeleted: true, isActive: false } : p))
      );
    }
  };

  const handleRestoreProduct = async (productId) => {
    const res = await restoreProduct(productId);
    if (res && res.product) {
      setProducts((prev) => prev.map((p) => (p._id === productId ? res.product : p)));
    }
  };

  // Order Operations
  const handleUpdateOrderStatus = async (orderId, status, note) => {
    const res = await updateOrderStatus(orderId, status, note);
    if (res && res.order) {
      setOrders((prev) => prev.map((o) => (o._id === orderId ? res.order : o)));
    }
    return res;
  };

  // Category Operations
  const handleSaveCategory = async (payload, mode, categoryId) => {
    if (mode === "edit") {
      const res = await updateCategory(categoryId, payload);
      if (res && res.category) {
        setCategories((prev) => prev.map((c) => (c._id === categoryId ? res.category : c)));
      }
    } else {
      const res = await createCategory(payload);
      if (res && res.category) {
        setCategories((prev) => [...prev, res.category]);
      }
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    await deleteCategory(categoryId);
    setCategories((prev) => prev.filter((c) => c._id !== categoryId));
  };

  // Sport Operations
  const handleSaveSport = async (payload, mode, sportId) => {
    if (mode === "edit") {
      const res = await updateSport(sportId, payload);
      if (res && res.sport) {
        setSports((prev) => prev.map((s) => (s._id === sportId ? res.sport : s)));
      }
    } else {
      const res = await createSport(payload);
      if (res && res.sport) {
        setSports((prev) => [...prev, res.sport]);
      }
    }
  };

  const handleDeleteSport = async (sportId) => {
    await deleteSport(sportId);
    setSports((prev) => prev.filter((s) => s._id !== sportId));
  };

  // Equipment Operations
  const handleSaveEquipment = async (payload, mode, equipmentId) => {
    if (mode === "edit") {
      const res = await updateEquipment(equipmentId, payload);
      if (res && res.equipment) {
        setEquipmentList((prev) => prev.map((e) => (e._id === equipmentId ? res.equipment : e)));
      }
    } else {
      const res = await createEquipment(payload);
      if (res && res.equipment) {
        setEquipmentList((prev) => [...prev, res.equipment]);
      }
    }
  };

  const handleDeleteEquipment = async (equipmentId) => {
    await deleteEquipment(equipmentId);
    setEquipmentList((prev) => prev.filter((e) => e._id !== equipmentId));
  };

  const navItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products Catalog", icon: Package, badge: products.length },
    { id: "orders", label: "Customer Orders", icon: ShoppingBag, badge: orders.filter((o) => o.status === "Pending").length },
    { id: "catalog", label: "Catalog Taxonomy", icon: FolderTree },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Mobile hamburger & Logo Badge */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                aria-label="Toggle Navigation"
              >
                {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="leading-tight">
                  <span className="font-black text-slate-900 tracking-tight text-base sm:text-lg block">
                    Admin Panel
                  </span>
                  <span className="text-[11px] font-semibold text-indigo-600 block">
                    Let's Play E-Commerce
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quick Store Return, Refresh, and User Pill */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => fetchData(true)}
                disabled={refreshing}
                title="Refresh Store Data"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-indigo-600" : ""}`} />
              </button>

              <Link
                to="/"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Customer Store</span>
              </Link>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                  {(user?.username || user?.email || "A").charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-slate-700 hidden md:inline truncate max-w-[120px]">
                  {user?.username || user?.email || "Admin"}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm space-y-1">
            <span className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Navigation
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-colors cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isActive ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Helper Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-slate-100 rounded-3xl p-5 border border-indigo-100/60 space-y-2">
            <h4 className="text-xs font-bold text-indigo-900">Administrator Role</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Full mutation access is enabled for your verified admin account. Changes are reflected in real time across the customer catalog.
            </p>
          </div>
        </aside>

        {/* Mobile Slide-Out Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-72 bg-white h-full p-5 space-y-5 shadow-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    <span className="font-bold text-slate-900 text-sm">Admin Navigation</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-colors ${
                          isActive
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              isActive ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-700"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <Link
                  to="/"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Customer Store</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {loading ? (
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <p className="text-sm font-medium text-slate-500">Loading store management records...</p>
            </div>
          ) : error ? (
            <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-800 space-y-3">
              <h3 className="font-bold text-base">Error Loading Admin Data</h3>
              <p className="text-xs leading-relaxed">{error}</p>
              <button
                type="button"
                onClick={() => fetchData(true)}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-xs hover:bg-rose-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {activeTab === "overview" && (
                <AdminOverview
                  orders={orders}
                  products={products}
                  categories={categories}
                  sports={sports}
                  setActiveTab={setActiveTab}
                  onOpenProductModal={() => {
                    setActiveTab("products");
                    setProductModalState({ isOpen: true, mode: "create", product: null });
                  }}
                  onSelectOrder={(order) => {
                    setSelectedOrder(order);
                    setActiveTab("orders");
                  }}
                />
              )}

              {activeTab === "products" && (
                <AdminProducts
                  products={products}
                  categories={categories}
                  sports={sports}
                  equipmentList={equipmentList}
                  onSaveProduct={handleSaveProduct}
                  onDeleteProduct={handleDeleteProduct}
                  onRestoreProduct={handleRestoreProduct}
                  modalState={productModalState}
                  setModalState={setProductModalState}
                />
              )}

              {activeTab === "orders" && (
                <AdminOrders
                  orders={orders}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  selectedOrder={selectedOrder}
                  setSelectedOrder={setSelectedOrder}
                />
              )}

              {activeTab === "catalog" && (
                <AdminCatalog
                  categories={categories}
                  sports={sports}
                  equipmentList={equipmentList}
                  onSaveCategory={handleSaveCategory}
                  onDeleteCategory={handleDeleteCategory}
                  onSaveSport={handleSaveSport}
                  onDeleteSport={handleDeleteSport}
                  onSaveEquipment={handleSaveEquipment}
                  onDeleteEquipment={handleDeleteEquipment}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
