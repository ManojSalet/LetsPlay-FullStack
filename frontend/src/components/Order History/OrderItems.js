import React from "react";

function OrderItems({ order }) {
  return (
    <div className="row mb-3 text-center align-items-center">
      {/* Product Names */}
      <div className="col-3 border-end">
        {order.items.map((item, index) => (
          <div key={index} className="mb-2">
            {item.product?.name}
          </div>
        ))}
      </div>

      {/* Quantities */}
      <div className="col-2 border-end">
        {order.items.map((item, index) => (
          <div key={index} className="mb-2">
            {item.quantity}
          </div>
        ))}
      </div>

      {/* Total Price */}
      <div className="col-2 border-end">
        ₹
        {Number(order.totalPrice.$numberDecimal)
          .toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
          })
          .replace("₹", "")}
      </div>

      {/* Payment Status */}
      <div className="col-2 border-end">{order.paymentStatus}</div>

      {/* Order Status */}
      <div className="col-3">{order.orderStatus}</div>
    </div>
  );
}

export default OrderItems;
