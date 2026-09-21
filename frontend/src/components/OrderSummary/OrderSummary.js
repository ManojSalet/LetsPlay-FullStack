import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { getOrderById } from "../../API/apiService";
import moment from "moment";
import Button from "../Button/Button";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";

function OrderSummary() {
  const location = useLocation();
  const { orderId } = location.state || {};
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderResponse = await getOrderById(orderId);
        setOrderData(orderResponse?.order || null);
      } catch (error) {
        console.error("Error fetching order", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const formatPrice = (priceObj) => {
    if (!priceObj) return "0";
    const num = parseFloat(priceObj.$numberDecimal || priceObj);
    return isNaN(num) ? "0" : num.toLocaleString("en-IN");
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {orderData ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6 text-center">
          {/* Success Checkmark */}
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Order Confirmed!
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Thank you for your purchase. We're getting your athletic gear ready for shipment.
            </p>
            <span className="inline-block mt-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-mono text-slate-600">
              Order ID: #{orderData._id?.slice(-8).toUpperCase()}
            </span>
          </div>

          {/* Items List */}
          <div className="text-left border border-slate-100 rounded-2xl p-4 bg-slate-50 space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2">
              Purchased Items
            </div>
            <div className="divide-y divide-slate-200 text-xs">
              {orderData.items?.map((item, index) => (
                <div key={index} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2 max-w-[60%]">
                    <span className="w-5 h-5 rounded bg-white font-bold text-slate-700 flex items-center justify-center text-[10px] shadow-sm">
                      {item.quantity}x
                    </span>
                    <span className="font-semibold text-slate-800 truncate">
                      {item.product?.name || "Sports Equipment"}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900">
                    ₹{formatPrice(item.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Details Meta */}
          <div className="text-xs text-slate-600 divide-y divide-slate-100 pt-2 text-left">
            <div className="py-2 flex justify-between">
              <span>Total Amount:</span>
              <span className="font-bold text-slate-900 text-base">
                ₹{formatPrice(orderData.totalPrice)}
              </span>
            </div>
            <div className="py-2 flex justify-between items-center">
              <span>Payment Status:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                {orderData.paymentStatus}
              </span>
            </div>
            <div className="py-2 flex justify-between items-center">
              <span>Fulfillment Status:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                {orderData.orderStatus}
              </span>
            </div>
            <div className="py-2 flex justify-between">
              <span>Order Placed:</span>
              <span className="text-slate-700 font-medium">
                {orderData.createdAt && moment(orderData.createdAt).format("MMMM Do YYYY, h:mm a")}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => navigate("/")}
              label="Continue Shopping"
              className="flex-1"
            />
            <Button
              type="button"
              variant="primary"
              size="md"
              icon={ArrowRight}
              onClick={() => navigate("/orderhistory")}
              label="View All Orders"
              className="flex-1"
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">No recent order found</h2>
          <p className="text-sm text-slate-500">
            You can browse your complete past purchase history or explore our equipment catalog.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate("/orderhistory")}
              label="Order History"
            />
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => navigate("/")}
              label="Shop Now"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderSummary;
