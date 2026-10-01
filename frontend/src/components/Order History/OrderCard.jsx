import React, { useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  ChevronDown,
  ChevronUp,
  Printer,
  Ban,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  Building,
  Phone,
  User,
  ExternalLink,
  Loader2,
  X,
} from "lucide-react";
import { getFullImageUrl, cancelCustomerOrder } from "../../API/apiService";

const OrderCard = ({ order, onOrderUpdated }) => {
  const [timelineExpanded, setTimelineExpanded] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("Changed mind / Ordered by mistake");
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const formatPrice = (val) => {
    if (!val) return "0";
    const num = parseFloat(val?.$numberDecimal || val);
    return isNaN(num) ? "0" : num.toLocaleString("en-IN");
  };

  const status = (order.status || order.orderStatus || "Processing").toLowerCase();
  const isCancelled = status === "cancelled";
  const isDelivered = status === "delivered";
  const isPaid = order.paymentStatus === "Paid" || order.paymentStatus === "Success";

  // Step stages definition: 1: Placed, 2: Processing, 3: Shipped, 4: Delivered
  const getStepStatus = () => {
    switch (status) {
      case "pending":
        return 1;
      case "processing":
        return 2;
      case "shipped":
        return 3;
      case "delivered":
        return 4;
      default:
        return 2;
    }
  };

  const currentStep = getStepStatus();

  const steps = [
    { title: "Order Placed", desc: "Received", icon: Clock },
    { title: "Processing", desc: "Packed & Verified", icon: Package },
    { title: "In Transit", desc: "Shipped", icon: Truck },
    { title: "Delivered", desc: "Arrived", icon: CheckCircle2 },
  ];

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    try {
      setCancelling(true);
      setCancelError("");
      await cancelCustomerOrder(order._id, cancelReason);
      setShowCancelModal(false);
      if (onOrderUpdated) {
        onOrderUpdated();
      }
    } catch (err) {
      console.error("Failed to cancel order:", err);
      setCancelError(typeof err === "string" ? err : "Failed to cancel order. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  const shipping = order.shippingAddress?.details?.[0] || order.shippingAddress;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* 1. Header Bar */}
      <div className="bg-slate-50/80 px-6 py-4.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Order Number
            </span>
            <span className="font-mono text-sm font-black text-indigo-600 tracking-tight">
              {order.orderNumber || `LP-${order._id.substring(order._id.length - 8).toUpperCase()}`}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Order Date
            </span>
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {order.createdAt ? moment(order.createdAt).format("DD MMM YYYY, hh:mm A") : "Recent"}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Total Amount
            </span>
            <span className="text-sm font-black text-slate-900 mt-0.5 block">
              ₹{formatPrice(order.totalPrice)}
            </span>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2.5">
          {/* Payment Status */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              isPaid
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                : "bg-amber-50 text-amber-700 border border-amber-200/60"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{order.paymentMethod || "COD"} · {order.paymentStatus || "Pending"}</span>
          </span>

          {/* Fulfillment Status */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize ${
              isCancelled
                ? "bg-rose-50 text-rose-700 border border-rose-200"
                : isDelivered
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-indigo-50 text-indigo-700 border border-indigo-200"
            }`}
          >
            {isCancelled ? (
              <Ban className="w-3.5 h-3.5" />
            ) : isDelivered ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <Clock className="w-3.5 h-3.5" />
            )}
            <span>{order.status || order.orderStatus || "Processing"}</span>
          </span>
        </div>
      </div>

      {/* 2. Visual Progress Stepper (Hidden if Cancelled) */}
      {!isCancelled ? (
        <div className="px-6 py-6 border-b border-slate-100 bg-slate-50/30">
          <div className="relative">
            {/* Connecting Track Line */}
            <div className="absolute top-5 left-6 right-6 h-1 bg-slate-200 -z-0 rounded-full">
              <div
                className="h-1 bg-emerald-500 rounded-full transition-all duration-500"
                style={{
                  width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Stepper Nodes */}
            <div className="relative z-10 flex items-center justify-between">
              {steps.map((step, idx) => {
                const stepNum = idx + 1;
                const isPassed = stepNum <= currentStep;
                const isCurrent = stepNum === currentStep;
                const StepIcon = step.icon;

                return (
                  <div key={idx} className="flex flex-col items-center text-center">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shadow-xs transition-all ${
                        isPassed
                          ? "bg-emerald-600 text-white ring-4 ring-emerald-50"
                          : "bg-white text-slate-400 border-2 border-slate-200"
                      } ${isCurrent ? "scale-110 shadow-md ring-4 ring-emerald-100" : ""}`}
                    >
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-xs font-bold mt-2.5 ${
                        isPassed ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {step.title}
                    </span>
                    <span className="text-[10px] text-slate-400 hidden sm:block">
                      {step.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6 py-4 bg-rose-50/80 border-b border-rose-100 flex items-center gap-3 text-rose-800">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <div className="text-xs">
            <span className="font-bold">This order was cancelled.</span>{" "}
            {order.statusHistory?.find((h) => h.status === "Cancelled")?.note && (
              <span className="text-rose-600 italic">
                Reason: "{order.statusHistory.find((h) => h.status === "Cancelled").note}"
              </span>
            )}
          </div>
        </div>
      )}

      {/* 3. Items and Shipping Summary */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Purchased Items List */}
        <div className="lg:col-span-2 space-y-3.5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Purchased Gear ({order.items?.length || 0})
          </h4>

          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 overflow-hidden bg-slate-50/20">
            {order.items?.map((item, idx) => {
              const product = item.product || {};
              const imgUrl = product.product_images?.[0]
                ? getFullImageUrl(product.product_images[0])
                : null;

              return (
                <div key={idx} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-1 overflow-hidden flex-shrink-0">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={product.name || "Product"}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=300";
                          }}
                        />
                      ) : (
                        <Package className="w-6 h-6 text-slate-300" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <Link
                        to={product._id ? `/productview/${product._id}` : "#"}
                        className="text-xs sm:text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors block truncate"
                      >
                        {product.name || "Sports Equipment"}
                      </Link>

                      <div className="flex items-center gap-2 mt-1">
                        {product.brand && (
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                            {product.brand}
                          </span>
                        )}
                        {product.sku && (
                          <span className="text-[10px] font-mono text-slate-400">
                            SKU: {product.sku}
                          </span>
                        )}
                      </div>

                      <span className="text-xs text-slate-500 mt-1 block">
                        Qty: {item.quantity} × ₹{formatPrice(item.price)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-black text-slate-900">
                      ₹{formatPrice(parseFloat(item.price?.$numberDecimal || item.price || 0) * (item.quantity || 1))}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shipping Destination & Summary Card */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-3 text-xs">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span>Delivery Address</span>
            </h4>

            {shipping ? (
              <div className="space-y-1 text-slate-600 leading-relaxed">
                <p className="font-bold text-slate-900">{shipping.name || "Customer"}</p>
                <p>{shipping.houseNo}, {shipping.street}</p>
                {shipping.landmark && <p className="text-slate-500">Near: {shipping.landmark}</p>}
                <p>
                  {shipping.district}, {shipping.state} - {shipping.pin}
                </p>
                <p className="font-medium text-slate-700 flex items-center gap-1 pt-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>Contact: {shipping.contact}</span>
                </p>
              </div>
            ) : (
              <p className="text-slate-400 italic">Standard Store Dispatch</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => setShowInvoiceModal(true)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-indigo-600" />
              <span>View & Print Tax Invoice</span>
            </button>

            {/* Cancel Button (Visible only if Pending/Processing and not Delivered) */}
            {!isCancelled && !isDelivered && (
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-rose-200/80 bg-rose-50/50 hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Cancel Order</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Tracking History Audit Trail (Collapsible) */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <div className="border-t border-slate-100 bg-slate-50/30">
          <button
            type="button"
            onClick={() => setTimelineExpanded(!timelineExpanded)}
            className="w-full px-6 py-3 flex items-center justify-between text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Tracking Updates & Audit Trail ({order.statusHistory.length})</span>
            </span>
            {timelineExpanded ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {timelineExpanded && (
            <div className="px-6 pb-5 pt-2">
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {order.statusHistory.map((history, idx) => (
                  <div key={idx} className="relative text-xs">
                    {/* Bullet */}
                    <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="font-bold text-slate-900 capitalize">
                        {history.status}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {moment(history.timestamp).format("DD MMM YYYY, hh:mm A")}
                      </span>
                    </div>
                    {history.note && (
                      <p className="text-slate-500 mt-0.5 leading-relaxed">{history.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- Cancel Order Modal --- */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-base">Cancel Order?</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to cancel order{" "}
              <span className="font-mono font-bold text-slate-800">
                {order.orderNumber}
              </span>
              ? Your items will be released back into inventory.
            </p>

            {cancelError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
                {cancelError}
              </div>
            )}

            <form onSubmit={handleCancelSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Cancellation
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="Changed mind / Ordered by mistake">Changed mind / Ordered by mistake</option>
                  <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                  <option value="Delivery time is too long">Delivery time is too long</option>
                  <option value="Need to change delivery address or items">Need to change delivery address or items</option>
                  <option value="Other reason">Other reason</option>
                </select>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  disabled={cancelling}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  {cancelling ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Cancelling...</span>
                    </>
                  ) : (
                    <span>Confirm Cancellation</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Printable Invoice Modal --- */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6 border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black">
                  LP
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Let's Play Sports Inc.</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Tax Invoice / Bill of Supply</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Invoice Meta */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400 uppercase font-bold text-[10px]">Invoice Number</p>
                <p className="font-mono font-bold text-slate-800 text-sm mt-0.5">{order.orderNumber}</p>
                <p className="text-slate-400 uppercase font-bold text-[10px] mt-2">Date of Issue</p>
                <p className="font-medium text-slate-700">{moment(order.createdAt).format("DD MMMM YYYY")}</p>
              </div>

              <div className="text-right">
                <p className="text-slate-400 uppercase font-bold text-[10px]">Billed To</p>
                <p className="font-bold text-slate-900 mt-0.5">{shipping?.name || "Customer"}</p>
                <p className="text-slate-600">{shipping?.houseNo}, {shipping?.street}</p>
                <p className="text-slate-600">{shipping?.district}, {shipping?.state} - {shipping?.pin}</p>
                <p className="text-slate-500">Contact: {shipping?.contact}</p>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                  <tr>
                    <th className="p-3">Item Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-semibold text-slate-800">{item.product?.name || "Gear"}</td>
                      <td className="p-3 text-center text-slate-600">{item.quantity}</td>
                      <td className="p-3 text-right font-medium text-slate-600">₹{formatPrice(item.price)}</td>
                      <td className="p-3 text-right font-bold text-slate-900">
                        ₹{formatPrice(parseFloat(item.price?.$numberDecimal || item.price || 0) * (item.quantity || 1))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                  <tr>
                    <td colSpan={3} className="p-3 text-right text-slate-700">Grand Total</td>
                    <td className="p-3 text-right font-black text-indigo-600 text-sm">
                      ₹{formatPrice(order.totalPrice)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="text-[11px] text-slate-400 text-center leading-relaxed">
              Thank you for choosing Let's Play Sports! For warranty claims or support, contact support@letsplay.com
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
