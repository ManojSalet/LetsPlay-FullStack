import React, { useState } from "react";
import styles from "./cart.module.css";
import { updateCartQuantity, removeFromCart } from "../../API/apiService";

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity from going below 1

    setQuantity(newQuantity); // Optimistic UI update

    try {
      // Call API to update quantity in backend
      const updatedCart = await updateCartQuantity(
        item.product._id,
        newQuantity
      );
      if (updatedCart && updatedCart.items) {
        onQuantityChange(updatedCart); // Update the cart in the parent component
      }
    } catch (error) {
      console.error("Error updating quantity", error);
    }
  };


  const handleRemove = async () => {
    try {
      await removeFromCart(item.product._id);
      onRemove(item.product._id); // Remove the item from the cart in the parent component
    } catch (error) {
      console.log("Error removing item from cart", error);
    }
  };

  // cart item price with quantity
  const itemPrice = Number(item.product.selling_price.$numberDecimal) * quantity;

  return (
    <div className="row p-2">
      <div
        className={`card border d-flex flex-row align-items-center justify-content-between ${styles.ListCart}`}
      >
        {/* Product Image */}
        <div className="col-3 d-flex justify-content-center align-items-center">
          <div className={`card border-0 ${styles.CartImg}`}>
            <img
              src={item.product.product_images[0]}
              className="img-fluid"
              alt={`${item.product.name}`}
            />
          </div>
        </div>

        {/* Product Title */}
        <div className="col-3 d-flex align-items-center justify-content-center">
          <h6 className="fw-bold text-center">{item.product.name}</h6>
        </div>

        {/* Product Quantity */}
        <div className="col-2 d-flex flex-column align-items-center">
          <div
            className={`w-75 border border-1 border-dark rounded-pill d-flex justify-content-between align-items-center ${styles.Quent}`}
          >
            <button
              type="button"
              className="border-0 bg-transparent"
              onClick={() => handleQuantityChange(quantity - 1)}
            >
              <i className="bi bi-dash fs-5"></i>
            </button>

            <span className="fs-5 fw-medium">{quantity}</span>

            <button
              type="button"
              className="border-0 bg-transparent"
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              <i className="bi bi-plus fs-5"></i>
            </button>
          </div>
        </div>

        {/* Product Price */}
        <div className="col-2 d-flex align-items-center justify-content-center">
          <span className="fs-5 fw-bold">
            ₹ {itemPrice.toFixed(2)}
          </span>
        </div>

        {/* Remove Button */}
        <div className="col-2 d-flex align-items-center justify-content-center">
          <button className="border-0 bg-transparent" onClick={handleRemove}>
            <i className="bi bi-trash-fill text-danger fs-4"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
