import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Accordion from "./Accordion";
import SmallCart from "./SmallCart";
import { useCart } from "../../Context/CartContext";
import createOrder, { paymentProcess } from "../../API/apiService";
import { X, Lock, Loader2 } from "lucide-react";
import Button from "../Button/Button";

function Checkout() {
  const { totalSellingPrice, fetchCart } = useCart();
  const [adressId, setAdressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleAddressChange = (id) => {
    setAdressId(id);
    setErrorMessage("");
  };

  const handlePaymentMethod = (method) => {
    setPaymentMethod(method);
    setErrorMessage("");
  };

  const handleCheckout = async () => {
    if (!adressId) {
      setErrorMessage("Please select or add a shipping address.");
      return;
    }
    if (!paymentMethod) {
      setErrorMessage("Please select a payment method.");
      return;
    }

    try {
      setIsPaymentProcessing(true);
      setErrorMessage("");

      // 1. Create Order
      const orderResponse = await createOrder(adressId);
      const orderId = orderResponse?.order?._id;

      if (!orderId) {
        throw new Error("Failed to initialize order");
      }

      // 2. Process Payment
      await paymentProcess(orderId, paymentMethod);

      // 3. Refresh Cart & Navigate to Order Confirmation
      await fetchCart();
      setTimeout(() => {
        navigate("/ordersummary", { state: { orderId } });
      }, 1200);
    } catch (error) {
      console.error("Checkout failed:", error);
      setErrorMessage("Checkout failed. Please check your network and try again.");
      setIsPaymentProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Lock className="w-6 h-6 text-indigo-600" />
            <span>Secure Checkout</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete your order with encrypted, secure payment processing.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/cart")}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Return to Cart"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Error alert if any */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
          ⚠ {errorMessage}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: Accordion Steps */}
        <div className="lg:col-span-8">
          <Accordion
            adressId={handleAddressChange}
            paymentMethod={handlePaymentMethod}
          />
        </div>

        {/* Right 4 Cols: Order Preview & Pay Action */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6 sticky top-24">
          <SmallCart />

          <div className="pt-4 border-t border-slate-100 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600 text-xs">
              <span>Standard Delivery:</span>
              <span className="text-emerald-600 font-bold">FREE</span>
            </div>
            <div className="flex justify-between items-baseline pt-2">
              <span className="text-sm font-bold text-slate-900">Total Payable:</span>
              <span className="text-2xl font-black text-slate-900">
                ₹{totalSellingPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleCheckout}
            disabled={isPaymentProcessing}
            className="w-full text-center"
          >
            {isPaymentProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Order...</span>
              </span>
            ) : (
              <span>Confirm & Pay Now</span>
            )}
          </Button>

          <p className="text-[11px] text-center text-slate-400 leading-relaxed">
            By clicking "Confirm & Pay Now", you agree to Let's Play terms of purchase and shipping terms.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
