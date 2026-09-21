import React, { useEffect, useState } from "react";
import styles from "./ordersummary.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { getOrderById } from "../../API/apiService";
import rightimg from "../../images/rightSymbol.png";
import moment from "moment";
import Button from "../Button/Button";

function OrderSummary() {
  const location = useLocation();
  const { orderId } = location.state || {};
  const [orderData, setOrderData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderResponse = await getOrderById(orderId);
        console.log("Order Response :", orderResponse?.order);
        setOrderData(orderResponse?.order);
        console.log("Order Response :", orderResponse);
      } catch (error) {
        console.log("Error fetching order", error);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleHistoryBtn = () => {
    navigate("/orderhistory");
  };

  const handleBackToShopping = () => {
    navigate("/");
  };

  return (
    <>
      <div className="container mt-3 d-flex justify-content-center align-items-center">
        {Object.keys(orderData).length > 0 ? (
          <div
            className={`card w-50 ${styles.MainCard} d-flex align-items-center p-3`}
          >
            <h2 className="text-center mt-1 fw-bold">
              Your order is confirmed
            </h2>
            <div className={`${styles.rightImage} `}>
              <img src={rightimg} alt="" className={`img-fluid`} />
            </div>
            <div className="container mt-2">
              <div className="row">
                <div className="col-4">Product</div>
                <div className="col-4">Quantity</div>
                <div className="col-4">Price</div>
              </div>
              <hr />
              {orderData?.items.map((item, index) => (
                <div className="row" key={index}>
                  <div className="col-4">{item.product.name}</div>
                  <div className="col-4">{item.quantity}</div>
                  <div className="col-4">{item.price.$numberDecimal}</div>
                </div>
              ))}
            </div>

            <div className="container mt-2">
              <div className="row mt-3">
                <hr />
              </div>

              <div className="row">
                <div className="col-6">Total Amount</div>
                <div className="col-6">
                  {orderData?.totalPrice?.$numberDecimal}
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-6">Payment Status</div>
                <div className="col-6">{orderData?.paymentStatus}</div>
              </div>

              <div className="row mt-2">
                <div className="col-6">Order Status</div>
                <div className="col-6">{orderData?.orderStatus}</div>
              </div>

              <div className="row mt-2">
                <div className="col-6">Order Date</div>
                <div className="col-6">
                  {orderData?.createdAt &&
                    moment(orderData?.createdAt).format("MMMM do, yyyy")}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="">
            <h1>Please put some order</h1>
          </div>
        )}
      </div>
      <div className="container d-flex justify-content-center mt-3 gap-5">
        <Button
          type={"button"}
          label={"Continue Shopping"}
          onClick={handleBackToShopping}
        />
        <Button
          type={"button"}
          label={"Orders History"}
          onClick={handleHistoryBtn}
        />
      </div>
    </>
  );
}

export default OrderSummary;
