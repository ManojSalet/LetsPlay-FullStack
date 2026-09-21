import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import CartItem from "./CartItem";
import CheckoutSummary from "./CheckoutSummary";
import { useCart } from "../../Context/CartContext";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Button from "../Button/Button";

function Cart() {
  const navigate = useNavigate();
  const {
    cartData,
    isLoading,
    totalPrice,
    sellingPrice,
    totalSellingPrice,
    totalDiscount,
    handleRemove,
    handleQuantityChange,
    fetchCart,
  } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  const handleCheckout = () => {
    if (cartData.length > 0) {
      navigate("/checkout");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const hasItems = Array.isArray(cartData) && cartData.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Your Shopping Cart
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {hasItems
            ? `Review your ${cartData.length} selected item(s) before checkout`
            : "Your cart is currently empty"}
        </p>
      </div>

      {hasItems ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm divide-y divide-slate-100">
            {cartData.map((item, index) => (
              <CartItem
                key={item.product?._id || index}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            ))}
          </div>

          {/* Checkout Summary Card */}
          <div className="lg:col-span-4 sticky top-24">
            <CheckoutSummary
              sellingPrice={sellingPrice}
              totalSellingPrice={totalSellingPrice}
              totalPrice={totalPrice}
              totalDiscount={totalDiscount}
              handleCheckout={handleCheckout}
            />
          </div>
        </div>
      ) : (
        /* Empty Cart State */
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center max-w-lg mx-auto shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Your cart is empty</h2>
          <p className="text-sm text-slate-500">
            Looks like you haven't added any sports gear or equipment to your cart yet.
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

export default Cart;
