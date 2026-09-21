import React from "react";
import styles from "./cart.module.css";
import cartImage from "../../images/cartImage.png";

const CheckoutSummary = ({ handleCheckout, totalSellingPrice, totalPrice, totalDiscount, sellingPrice }) => {
  return (
    <div className={`card m-2 p-3 ${styles.MainCheckout}`}>
      <div className="">
        <img src={cartImage} className="img-fluid rounded" alt="" />
      </div>

      <hr />

      <div className="d-flex flex-column gap-2">
        <div className="d-flex justify-content-between">
          <span>Total Price :</span>
          <span> ₹{totalPrice.toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between">
          <span>Total Selling Price :</span>
          <span>₹{sellingPrice.toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between">
          <span>Discount :</span>
          <span>₹{totalDiscount.toFixed(2)}</span>
        </div>
      </div>

      <button
        type="button"
        className={`btn d-flex justify-content-around mt-2 ${styles.CheckBtn}`}
        onClick={handleCheckout}
      >
        <span>₹{totalSellingPrice.toFixed(2)}</span>
        <div className="d-flex align-items-center">
          <span>Checkout</span>
          <i className="bi bi-arrow-right ms-3"></i>
        </div>
      </button>
    </div>
  );
};

export default CheckoutSummary;
