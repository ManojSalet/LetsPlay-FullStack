import React, { useEffect } from "react";
import styles from "./cart.module.css";
import { useNavigate } from "react-router-dom";
import CartItem from "./CartItem";
import CheckoutSummary from "./CheckoutSummary";
import useBackNavigation from "../../hooks/useBackNavigation";
import { useCart } from "../../Context/CartContext";

function Cart() {
  const navigate = useNavigate();
  const { goBack } = useBackNavigation();
  const {
    cartData,
    isLoading,
    totalPrice,
    sellingPrice,
    totalSellingPrice,
    totalDiscount,
    handleRemove,
    handleQuantityChange,
    fetchCart, // Ensure fetchCart is available
  } = useCart();

  useEffect(() => {
    fetchCart(); // Fetch cart data when component mounts
  }, []);

  const handleCheckout = () => {
    // if (cartData.length > 0 && !isLoading) {
    //   navigate("/checkout");
    // } else {
    //   alert("Cart is empty");
    // }
    navigate("/checkout");
  };

  if (isLoading) {
    return <div>Loading cart data...</div>; // Show loading indicator
  }

  return (
    <div className={`container ${styles.MainContainer}`}>
      <div className="row m-1 rounded-2 bg-white">
        <div className="col-8">
          <div className="container m-2">
            <div className="d-flex gap-2 align-items-center">
              <i
                className="bi bi-arrow-left fs-5 text-dark"
                onClick={goBack}
              ></i>
              <div className="fs-5 fw-semibold">Continue Shopping</div>
            </div>
            <hr className="mt-2" />

            <div className="row text-center fw-bold">
              <div className="col-3">Image</div>
              <div className="col-3">Name</div>
              <div className="col-2">Quantity</div>
              <div className="col-2">Price</div>
              <div className="col-2">Remove</div>
            </div>
            <hr
              className="mt-2"
              style={{ border: "2px dotted black", width: "100%" }}
            />

            <div className={`${styles.CartScrollContainer} p-3 rounded-2`}>
              {Array.isArray(cartData) && cartData.length > 0 ? (
                cartData.map((item, index) => (
                  <CartItem
                    key={index}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemove}
                  />
                ))
              ) : (
                <div>No items in the cart</div> // Show when cart is empty
              )}
            </div>
          </div>
        </div>

        <div className="col-4">
          {/* Show checkout summary */}
          <CheckoutSummary
            sellingPrice={sellingPrice}
            totalSellingPrice={totalSellingPrice}
            totalPrice={totalPrice}
            totalDiscount={totalDiscount}
            handleCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}

export default Cart;
