import React from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Button from "../Button/Button";

const CheckoutSummary = ({
  handleCheckout,
  totalSellingPrice = 0,
  totalPrice = 0,
  totalDiscount = 0,
  itemCount = 0,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
      <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
        Order Summary
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Items Subtotal:</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>

        {totalDiscount > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>Special Discount:</span>
            <span>-₹{totalDiscount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-slate-600">
          <span>Shipping & Handling:</span>
          <span className="text-emerald-600 font-medium">FREE</span>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
          <span className="text-base font-bold text-slate-900">Total:</span>
          <span className="text-2xl font-black text-slate-900">
            ₹{totalSellingPrice.toFixed(2)}
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="primary"
        size="lg"
        icon={ArrowRight}
        onClick={handleCheckout}
        className="w-full justify-between"
        label="Proceed to Checkout"
      />

      <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Secure 256-Bit SSL Checkout</span>
      </div>
    </div>
  );
};

export default CheckoutSummary;
