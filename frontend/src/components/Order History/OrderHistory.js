import React, { useEffect, useState } from "react";
import OrderCard from "./OrderCard";
import { getAllOrders } from "../../API/apiService";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  PackageCheck,
  ShoppingBag,
  Search,
  RefreshCw,
  Clock,
  CheckCircle2,
  Ban,
  Package,
} from "lucide-react";
import Button from "../Button/Button";

function OrderHistory({ embedded = false }) {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'active' | 'delivered' | 'cancelled'
  const navigate = useNavigate();

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      const response = await getAllOrders();
      setOrderHistory(response.orders || []);
    } catch (error) {
      console.error("Error fetching order history", error);
      setOrderHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  // Filter orders based on status tab and search term
  const filteredOrders = orderHistory.filter((order) => {
    const rawStatus = (order.status || order.orderStatus || "processing").toLowerCase();

    // 1. Status Filter
    if (statusFilter === "active") {
      if (rawStatus === "delivered" || rawStatus === "cancelled") return false;
    } else if (statusFilter === "delivered") {
      if (rawStatus !== "delivered") return false;
    } else if (statusFilter === "cancelled") {
      if (rawStatus !== "cancelled") return false;
    }

    // 2. Search Term Filter (by Order Number or Product Name)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchOrderNum = order.orderNumber?.toLowerCase().includes(q);
      const matchItem = order.items?.some((i) =>
        i.product?.name?.toLowerCase().includes(q)
      );
      return matchOrderNum || matchItem;
    }

    return true;
  });

  const activeCount = orderHistory.filter(
    (o) =>
      (o.status || o.orderStatus || "").toLowerCase() !== "delivered" &&
      (o.status || o.orderStatus || "").toLowerCase() !== "cancelled"
  ).length;

  const deliveredCount = orderHistory.filter(
    (o) => (o.status || o.orderStatus || "").toLowerCase() === "delivered"
  ).length;

  const cancelledCount = orderHistory.filter(
    (o) => (o.status || o.orderStatus || "").toLowerCase() === "cancelled"
  ).length;

  return (
    <div className={embedded ? "space-y-6" : "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"}>
      {/* Back Link (Only when standalone) */}
      {!embedded && (
        <div className="mb-6">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Profile</span>
          </Link>
        </div>
      )}

      {/* Header (Only when standalone) */}
      {!embedded && (
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <PackageCheck className="w-8 h-8 text-indigo-600" />
              <span>Orders & Live Tracking</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track live shipments, download tax invoices, and inspect order histories.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchOrderHistory}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-indigo-600" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
            }`}
          >
            All Orders ({orderHistory.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("active")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === "active"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>In Progress ({activeCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("delivered")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === "delivered"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered ({deliveredCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("cancelled")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === "cancelled"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-rose-50 text-rose-700 hover:bg-rose-100"
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Cancelled ({cancelledCount})</span>
          </button>
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order # or item..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Orders List / Loader / Empty State */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          <p className="text-xs text-slate-500 font-medium">Fetching orders & tracking status...</p>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <OrderCard key={order._id} order={order} onOrderUpdated={fetchOrderHistory} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center max-w-md mx-auto shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {searchTerm || statusFilter !== "all" ? "No matching orders found" : "No orders yet"}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search keywords or clear your status filters."
              : "You haven't placed any sports orders yet. Explore our tournament equipment and apparel!"}
          </p>
          <div className="pt-2">
            {searchTerm || statusFilter !== "all" ? (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => navigate("/category")}
                label="Explore Sports Catalog"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
