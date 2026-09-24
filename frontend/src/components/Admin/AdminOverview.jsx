import React from "react";
import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Plus
} from "lucide-react";

const AdminOverview = ({
  orders = [],
  products = [],
  categories = [],
  sports = [],
  setActiveTab,
  onOpenProductModal,
  onSelectOrder
}) => {
  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0);
  const lowStockProducts = products.filter((p) => Number(p.qty) <= 5);
  const pendingOrders = orders.filter((o) => o.status === "Pending");
  const completedOrders = orders.filter((o) => o.status === "Delivered");

  const statusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Shipped":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Processing":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-indigo-200 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Live Store Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white truncate">
            Welcome to Store Command Center
          </h1>
          <p className="text-sm text-indigo-200 max-w-xl">
            Monitor real-time transactions, track inventory levels, and manage your sports catalog efficiently.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenProductModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 text-sm font-bold shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Add Product</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold backdrop-blur-sm transition-colors cursor-pointer"
          >
            <span>View Orders</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Live
            </span>
          </div>
          <p className="text-xs text-slate-400">Total gross value of placed orders</p>
        </div>

        {/* Card 2: Orders */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {orders.length}
            </span>
            <span className="text-xs font-semibold text-indigo-600">
              {pendingOrders.length} Pending
            </span>
          </div>
          <p className="text-xs text-slate-400">{completedOrders.length} successfully delivered</p>
        </div>

        {/* Card 3: Products */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Catalog
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {products.length}
            </span>
            <span className="text-xs font-semibold text-purple-600">
              {categories.length} Categories
            </span>
          </div>
          <p className="text-xs text-slate-400">Across {sports.length} different sports</p>
        </div>

        {/* Card 4: Low Stock Alert */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Stock Warnings
            </span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              lowStockProducts.length > 0 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {lowStockProducts.length}
            </span>
            <span className={`text-xs font-semibold ${
              lowStockProducts.length > 0 ? "text-amber-600" : "text-emerald-600"
            }`}>
              {lowStockProducts.length > 0 ? "Needs Restock" : "Optimal"}
            </span>
          </div>
          <p className="text-xs text-slate-400">Products with 5 or fewer items remaining</p>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Stock Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recent Orders</h2>
              <p className="text-xs text-slate-500">Latest customer purchases</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No orders have been placed yet.
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[500px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pr-4">Order ID</th>
                    <th className="pb-3 px-4">Customer</th>
                    <th className="pb-3 px-4">Items</th>
                    <th className="pb-3 px-4">Amount</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 pl-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 pr-4 font-semibold text-slate-900 truncate max-w-[130px]">
                        {order.orderNumber || order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 truncate max-w-[140px]">
                        {order.user?.username || order.user?.email || "Guest Customer"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {order.items?.length || 0} pcs
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge(order.status)}`}>
                          {order.status || "Pending"}
                        </span>
                      </td>
                      <td className="py-3.5 pl-4 text-right">
                        <button
                          type="button"
                          onClick={() => onSelectOrder(order)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Low Stock Alerts */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Low Stock Alerts</h2>
              <p className="text-xs text-slate-500">Restock priority list</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-slate-800">Inventory Healthy</p>
              <p className="text-xs text-slate-400">All products have sufficient stock levels.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.slice(0, 5).map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/50 border border-amber-100 gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      SKU: {product.sku || "N/A"}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-black whitespace-nowrap ${
                    Number(product.qty) === 0
                      ? "bg-rose-100 text-rose-700"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {Number(product.qty) === 0 ? "Out of Stock" : `${product.qty} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
