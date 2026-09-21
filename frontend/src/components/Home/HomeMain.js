import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Carousel from "./Carousel/Carousel";
import AllCatPart from "./AKSpart/AllCatPart";
import Outdoor from "./OutdoorIndoorPart/Outdoor/Outdoor";
import Indoor from "./OutdoorIndoorPart/Indoor/Indoor";
import Recommend from "./Recommendation/Recommend";
import styles2 from "./home.module.css";
import { Link } from "react-router-dom";
import { getAllProducts } from "../../API/apiService";

const HomeMain = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productData = await getAllProducts();

        //access the products array from the response
        if (productData && Array.isArray(productData.products)) {
          setProducts(productData.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.log("Error fetching products", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          fontSize: "30px",
          color: "blue",
          zIndex: "1",
          marginRight: "35px",
        }}
        onClick={onClick}
      >
        <i className="bi bi-arrow-right-circle-fill"></i>
      </div>
    );
  };

  const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          fontSize: "30px",
          color: "blue",
          zIndex: "1",
          marginLeft: "25px",
        }}
        onClick={onClick}
      >
        <i className="bi bi-arrow-left-circle-fill"></i>
      </div>
    );
  };

  // slider Settings
  var ProductViewList = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <>
      <Carousel />
      <AllCatPart />
      <hr />
      <Outdoor />
      <Indoor />

      {/* Product View List */}
      <div className="container mt-3">
        <Slider {...ProductViewList}>
          {/* Ensure products is an array before mapping */}
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className={`d-flex justify-content-center mb-2`}
              >
                <div
                  className={`card border-0 d-flex flex-row justify-content-center align-items-center ${styles2.CartMainBack}`}
                >
                  <Link
                    to={`/productview/${product._id}`}
                    className="text-decoration-none"
                  >
                    <div className={`card m-2 ${styles2.ItemCard}`}>
                      <div className={`${styles2.ItemImg}`}>
                        {/* Access the first image from the product_images array */}
                        <img
                          src={product.product_images[0]}
                          alt={product.name}
                          className={`card-img-top img-fluid`}
                        />
                      </div>
                      <div className={`card-body border rounded-bottom-2`}>
                        <div className={`${styles2.ItemTitle}`}>
                          {product.name}
                        </div>
                        <div className={`${styles2.ItemDesc}`}>
                          {product.description}
                        </div>
                        <span className={`${styles2.ItemPrice}`}>
                          ₹
                          {Number(product.selling_price.$numberDecimal)
                            .toLocaleString("en-IN", {
                              style: "currency",
                              currency: "INR",
                            })
                            .replace("₹", "")}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No products available.</p>
          )}
        </Slider>
      </div>
      <Recommend />
    </>
  );
};

export default HomeMain;
