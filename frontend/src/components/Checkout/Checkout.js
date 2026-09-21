import React, { useState } from "react";
import styles from "./checkout.module.css";
import { useNavigate } from "react-router-dom";
import Accordion from "./Accordion";
import SmallCart from "./SmallCart";
import { useCart } from "../../Context/CartContext";
import createOrder, { paymentProcess } from "../../API/apiService";

function Checkout() {
  const { totalSellingPrice } = useCart();
  const [adressId, setAdressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const navigate = useNavigate();

  const handleAddressChange = (id) => {
    setAdressId(id);
  };

  const handlePaymentMethod = (method) => {
    setPaymentMethod(method);
  };

  const handleCloseBtn = () => {
    // Navigate back to cart
    navigate("/cart");
  };

  const handleCheckout = async () => {
    if (!adressId) {
      console.error("Please select an address");
      alert("Please select an address");
      return;
    }
    if (!paymentMethod) {
      console.error("Please select Payment Method");
      alert("Please select Payment Method");
      return;
    }
    try {
      let orderId = null;
      //create Order
      const orderResponse = await createOrder(adressId);
      if (orderResponse) {
        console.log(orderResponse?.order?._id);
        orderId = orderResponse?.order?._id;
        console.log("Order ID in checkout :", orderId);
        if (!orderId) {
          console.error("Failed to create order");
          return;
        }
      }

      //payment Process
      if (orderId) {
        console.log("Order ID in payment :", orderId);
        const paymentResponse = await paymentProcess(orderId, paymentMethod);
        console.log("paymentResponse", paymentResponse);
        if (paymentResponse) {
          console.log("Payment Successfull");
        } else {
          console.error("Failed to process payment");
        }
      }

      setIsPaymentProcessing(true);

      setTimeout(() => {
        navigate("/ordersummary", { state: { orderId } });
      }, 2000);
      //navigate to order summary page
    } catch (error) {
      console.error("Checkout process failed:", error);
      alert("Checkout process failed, please try again.");
    }
  };

  return (
    <div className={`container ${styles.checkoutContainer} mt-3`}>
      {/* Page Title */}
      <div className="row">
        <div className="col-md-12 d-flex justify-content-between m-1">
          <h2 className={`ms-2 ${styles.checkoutTitle}`}>Checkout</h2>
          <button
            type="button"
            className="btn border-0"
            onClick={handleCloseBtn}
          >
            <i className="bi bi-x-circle fs-4 me-1"></i>
          </button>
        </div>
      </div>

      {/* Divider */}
      <hr className="mt-0" />

      {/* Checkout Form */}
      <div className="row">
        {/* Shipping Information */}
        <div className="col-md-8">
          <Accordion
            adressId={handleAddressChange}
            paymentMethod={handlePaymentMethod}
          />
        </div>

        {/* Order Summary */}
        <div className="col-md-4">
          <ul className="list-group mb-3 border p-2">
            <div className={`${styles.ProductViewScroll}`}>
              <SmallCart />
            </div>
            <li className="list-group-item d-flex justify-content-between mt-2">
              <span>Total</span>
              <strong className={styles.totalPrice}>
                ₹{totalSellingPrice.toFixed(2)}
              </strong>
            </li>
          </ul>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        className={`btn ${styles.checkoutButton}`}
        onClick={handleCheckout}
      >
        {isPaymentProcessing ? "Payment Proceesing......" : "checkout"}
      </button>
    </div>
  );
}

export default Checkout;
