import React from "react";
import moment from "moment";
import { Package, Calendar, CheckCircle, Clock } from "lucide-react";

function OrderItems({ order }) {
  const formatPrice = (priceObj) => {
    if (!priceObj) return "0";
    const num = parseFloat(priceObj.$numberDecimal || priceObj);
    return isNaN(num) ? "0" : num.toLocaleString("en-IN");
  };

  const isPaid = order.paymentStatus === "Paid" || order.paymentStatus === "Success";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
      {/* Order Card Header */}
      <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-slate-400 block uppercase font-semibold text-[10px]">
              Order Placed
            </span>
            <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {order.createdAt ? moment(order.createdAt).format("DD MMM YYYY") : "Recent"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase font-semibold text-[10px]">
              Total Amount
            </span>
            <span className="font-black text-slate-900 text-sm mt-0.5 block">
              ₹{formatPrice(order.totalPrice)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isPaid
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {isPaid ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            <span>{order.paymentStatus || "Pending"}</span>
          </span>

          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
            {order.orderStatus || "Processing"}
          </span>
        </div>
      </div>

      {/* Purchased Items in this Order */}
      <div className="p-6 divide-y divide-slate-100">
        {order.items?.map((item, index) => (
          <div key={index} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs flex-shrink-0">
                <Package className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-slate-900">
                  {item.product?.name || "Sports Equipment"}
                </h5>
                <span className="text-xs text-slate-400">
                  Qty: {item.quantity} × ₹{formatPrice(item.price)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm font-bold text-slate-900">
                ₹{formatPrice(parseFloat(item.price?.$numberDecimal || item.price || 0) * (item.quantity || 1))}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderItems;
