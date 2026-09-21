import React from "react";
import { useCart } from "../../Context/CartContext";
import { ShoppingBag } from "lucide-react";

function SmallCart() {
  const { cartData } = useCart();
  const itemCount = Array.isArray(cartData) ? cartData.length : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Items in Order</span>
        </span>
        <span className="px-2 py-0.5 text-xs font-bold text-indigo-700 bg-indigo-50 rounded-full">
          {itemCount}
        </span>
      </div>

      <div className="max-h-60 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-50">
        {cartData.map((item, index) => {
          const price = parseFloat(
            item.product?.selling_price?.$numberDecimal ||
              item.product?.selling_price ||
              item.product?.price?.$numberDecimal ||
              item.product?.price ||
              0
          );
          return (
            <div
              key={index}
              className="pt-2 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2 max-w-[70%]">
                <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-700 flex-shrink-0">
                  {item.quantity}x
                </span>
                <span className="font-medium text-slate-800 truncate">
                  {item.product?.name || "Product"}
                </span>
              </div>
              <span className="font-bold text-slate-900">
                ₹{(price * (item.quantity || 1)).toLocaleString("en-IN")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SmallCart;
