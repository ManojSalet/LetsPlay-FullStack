import React, { useEffect, useState } from "react";
import styles from "./orderhistory.module.css";
import OrderItems from "./OrderItems";
import { getAllOrders } from "../../API/apiService";
import { useNavigate } from "react-router-dom";

function OrderHistory() {
  const [orderHistory, setOrderHistory] = useState([]); // Initialize as an array
  const navigate = useNavigate();

  const fetchOrderHistory = async () => {
    try {
      const response = await getAllOrders();
      console.log("Order History Response:", response);
      setOrderHistory(response.orders || []); // Set orders array or empty array if undefined
    } catch (error) {
      console.error("Error fetching order history", error);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const handleCloseButton = () => {
    navigate("/");
  };

  return (
    <div className="container mt-4 position-relative">
      {/* Close Button */}
      <button
        className="btn position-absolute"
        style={{ top: "5px", right: "10px", zIndex: 1 }}
        onClick={handleCloseButton}
      >
        <i className="bi bi-x-circle fs-4"></i>
      </button>

      <div className={`card ${styles.MainCard}`}>
        {/* Header Row */}
        <div
          className="row m-2 mb-0 fw-bold text-center align-items-center"
          style={{ backgroundColor: "#f8f9fa", padding: "10px" }}
        >
          <div className="col-3">Product Name</div>
          <div className="col-2">Quantity</div>
          <div className="col-2">Price</div>
          <div className="col-2">Payment Status</div>
          <div className="col-3">Order Status</div>
        </div>
        <hr className="mt-0 mb-2" />

        {/* Order Items */}
        <div className={`${styles.OrderHistoryContainer} p-3`}>
          {orderHistory.length > 0 ? (
            orderHistory.map((order, index) => (
              <OrderItems key={index} order={order} /> // Render each order
            ))
          ) : (
            <div className="text-center text-muted">No orders found</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderHistory;
