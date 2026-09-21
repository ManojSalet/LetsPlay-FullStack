import React, { useState } from "react";
import { Plus, Minus, Trash2 } from "lucide-react";

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleMinus = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      onQuantityChange(item.product?._id, newQty);
    }
  };

  const handlePlus = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    onQuantityChange(item.product?._id, newQty);
  };

  const handleRemove = () => {
    onRemove(item.product?._id);
  };

  const unitPrice = parseFloat(
    item.product?.selling_price?.$numberDecimal ||
      item.product?.selling_price ||
      item.product?.price?.$numberDecimal ||
      item.product?.price ||
      0
  );
  const totalPrice = unitPrice * quantity;

  return (
    <div className="py-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Image & Title */}
      <div className="flex items-center gap-4 w-full sm:w-1/2">
        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-xl p-2 flex items-center justify-center flex-shrink-0">
          <img
            src={item.product?.product_images?.[0] || ""}
            alt={item.product?.name || "Product"}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-slate-800 line-clamp-1">
            {item.product?.name || "Product Name"}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Unit: ₹{unitPrice.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Quantity Stepper */}
      <div className="flex items-center gap-6 justify-between w-full sm:w-auto">
        <div className="inline-flex items-center border border-slate-200 rounded-lg bg-white shadow-sm">
          <button
            type="button"
            onClick={handleMinus}
            disabled={quantity <= 1}
            className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 text-xs font-bold text-slate-900">{quantity}</span>
          <button
            type="button"
            onClick={handlePlus}
            className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Item Total Price */}
        <div className="w-24 text-right">
          <span className="text-sm font-black text-slate-900">
            ₹{totalPrice.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Delete Button */}
        <button
          type="button"
          onClick={handleRemove}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          title="Remove from cart"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
