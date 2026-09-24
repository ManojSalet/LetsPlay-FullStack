import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertCircle,
  Eye,
  MapPin,
  Calendar,
  CreditCard,
  User,
  X,
  Loader2,
  ChevronRight,
  Send
} from "lucide-react";

const AdminOrders = ({
  orders = [],
  onUpdateOrderStatus,
  selectedOrder,
  setSelectedOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  // Set newStatus when selectedOrder changes
  React.useEffect(() => {
    if (selectedOrder) {
      setNewStatus(selectedOrder.status || "Pending");
      setStatusNote("");
      setUpdateError("");
      setUpdateSuccess("");
    }
  }, [selectedOrder]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o._id?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;

      if (statusFilter !== "all" && o.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [orders, searchTerm, statusFilter]);

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

  const handleStatusChangeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setUpdating(true);
    setUpdateError("");
    setUpdateSuccess("");

    try {
      const updated = await onUpdateOrderStatus(selectedOrder._id, newStatus, statusNote);
      setUpdateSuccess(`Order status successfully updated to ${newStatus}`);
      if (updated && updated.order) {
        setSelectedOrder(updated.order);
      }
    } catch (err) {
      setUpdateError(typeof err === "string" ? err : "Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Orders</h1>
          <p className="text-xs text-slate-500">
            Track transactions, inspect dispatch details, and update shipment progress
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order #, customer name, or email..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline">Status:</span>
          {["all", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                statusFilter === status
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No orders found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search criteria or status filter."
                : "No customer orders have been recorded in the system yet."}
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 pl-6 pr-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Items Count</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 pr-6 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredOrders.map((order) => {
                  const dateStr = order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recent";

                  return (
                    <tr key={order._id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Order Number & Date */}
                      <td className="py-4 pl-6 pr-4">
                        <div className="font-bold text-slate-900">
                          {order.orderNumber || order._id.slice(-8).toUpperCase()}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{dateStr}</span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4 min-w-0 max-w-[180px]">
                        <div className="font-semibold text-slate-900 truncate">
                          {order.user?.username || "Verified Customer"}
                        </div>
                        <div className="text-xs text-slate-400 truncate mt-0.5">
                          {order.user?.email || "N/A"}
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-4 px-4 font-medium text-slate-600">
                        {order.items?.length || 0} product(s)
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 font-bold text-slate-900">
                        ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                      </td>

                      {/* Payment */}
                      <td className="py-4 px-4">
                        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md block w-max">
                          {order.paymentMethod || "COD"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${statusBadge(order.status)}`}>
                          {order.status || "Pending"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 pr-6 pl-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* Order Details & Status Transition Modal */}
      {/* ========================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    Order {selectedOrder.orderNumber || selectedOrder._id}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadge(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Placed on {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : "Recently"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Shipping Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>Customer Info</span>
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {selectedOrder.user?.username || "Guest Customer"}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {selectedOrder.user?.email || "No email available"}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span>Delivery Address</span>
                </div>
                {selectedOrder.shippingAddress ? (
                  <div className="text-xs text-slate-600 space-y-0.5">
                    <p className="font-semibold text-slate-800">
                      {selectedOrder.shippingAddress.name || "Customer"}
                    </p>
                    <p>{selectedOrder.shippingAddress.addressLine1}</p>
                    <p>
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                    </p>
                    <p className="text-slate-400 font-mono">
                      Phone: {selectedOrder.shippingAddress.phone || selectedOrder.shippingAddress.mobileNumber || "N/A"}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No delivery address attached</p>
                )}
              </div>
            </div>

            {/* Order Items Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Order Items ({selectedOrder.items?.length || 0})
              </h4>
              <div className="w-full overflow-x-auto rounded-2xl border border-slate-100">
                <table className="w-full min-w-[500px] text-left border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                    <tr>
                      <th className="py-2.5 pl-4 pr-3">Item</th>
                      <th className="py-2.5 px-3">Price</th>
                      <th className="py-2.5 px-3">Qty</th>
                      <th className="py-2.5 pr-4 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOrder.items?.map((item, idx) => {
                      const unitPrice = Number(item.price) || 0;
                      const itemQty = Number(item.quantity) || 1;
                      const itemSubtotal = unitPrice * itemQty;

                      return (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3 pl-4 pr-3">
                            <span className="font-bold text-slate-900 block truncate max-w-[260px]">
                              {item.product?.name || item.name || "Sporting Product"}
                            </span>
                            <span className="text-[11px] text-slate-400 block font-mono">
                              SKU: {item.product?.sku || item.sku || "LP-ITEM"}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600 font-medium">
                            ₹{unitPrice.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 px-3 text-slate-900 font-bold">
                            {itemQty}
                          </td>
                          <td className="py-3 pr-4 text-right font-black text-slate-900">
                            ₹{itemSubtotal.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50/80 border-t border-slate-200">
                      <td colSpan="3" className="py-3 pl-4 text-right font-bold text-slate-700">
                        Total Order Price:
                      </td>
                      <td className="py-3 pr-4 text-right font-black text-sm text-indigo-700">
                        ₹{Number(selectedOrder.totalPrice || 0).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Status Update Form */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span>Update Delivery & Fulfillment Status</span>
              </h4>

              {updateError && (
                <div className="p-2.5 rounded-lg bg-rose-100 text-rose-800 text-xs font-semibold">
                  {updateError}
                </div>
              )}
              {updateSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-semibold">
                  {updateSuccess}
                </div>
              )}

              <form onSubmit={handleStatusChangeSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      New Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Audit Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="e.g., Dispatched via Bluedart tracking #12345"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={updating || newStatus === selectedOrder.status}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Save Status</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Audit Log / Status History */}
            {Array.isArray(selectedOrder.statusHistory) && selectedOrder.statusHistory.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status History Trail
                </h4>
                <div className="space-y-2 border-l-2 border-slate-100 pl-3 ml-2 text-xs">
                  {selectedOrder.statusHistory.map((history, i) => (
                    <div key={i} className="relative space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{history.status}</span>
                        <span className="text-[11px] text-slate-400">
                          {history.timestamp ? new Date(history.timestamp).toLocaleString() : ""}
                        </span>
                      </div>
                      {history.comment && (
                        <p className="text-slate-500 text-[11px]">{history.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
