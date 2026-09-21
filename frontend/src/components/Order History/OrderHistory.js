import React, { useEffect, useState } from "react";
import OrderItems from "./OrderItems";
import { getAllOrders } from "../../API/apiService";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, PackageCheck, ShoppingBag } from "lucide-react";
import Button from "../Button/Button";

function OrderHistory() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <PackageCheck className="w-8 h-8 text-indigo-600" />
            <span>Order History</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track, review, and view details for all your past purchases.
          </p>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : orderHistory.length > 0 ? (
        <div className="space-y-6">
          {orderHistory.map((order, index) => (
            <OrderItems key={order._id || index} order={order} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center max-w-md mx-auto shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">No past orders</h2>
          <p className="text-sm text-slate-500">
            You have not placed any orders yet. Check out our sports equipment collection!
          </p>
          <div className="pt-2">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => navigate("/category")}
              label="Explore Sports Catalog"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
