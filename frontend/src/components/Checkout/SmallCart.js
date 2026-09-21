import React from "react";
import styles from "./checkout.module.css";
import { useCart } from "../../Context/CartContext";

function SmallCart() {
  const { cartData } = useCart();

  const itemCount = cartData.length;
  return (
    <>
      <h4 className="d-flex justify-content-between align-items-center mb-2">
        <span className="text-muted">Your cart</span>
        <span className="badge bg-secondary rounded-pill">{itemCount}</span>
      </h4>

      {cartData.map((item, index) => (
        <li
          className={`list-group-item d-flex justify-content-between lh-sm ${styles.productItem}`}
          key={index}
        >
          <div>
            <h6 className="my-0">{item.product.name} </h6>
          </div>
          <span className="text-muted">
            {item.quantity}
          </span>
        </li>
      ))}
    </>
  );
}

export default SmallCart;
