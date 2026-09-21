import React, { useEffect, useState } from "react";
import styles from "./recom.module.css";
import { Link } from "react-router-dom";
import { getAllProducts } from "../../../API/apiService";

function Recommend() {
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
  return (
    <>
      <div className={`container ${styles.Container}`}>
        <div className={`card border-0 rounded-0 mt-3`}>
          <div className={`card-body text-center`}>
            <h1
              className="text-uppercase fs-3 fw-semibold"
              style={{ color: "var(--main-color)" }}
            >
              Recommended
            </h1>
          </div>

          {products.length > 0 ? (
            <>
              <div className={`row`}>
                {products.slice(0, 8).map((item) => {
                  return (
                    <div
                      key={item.id}
                      className={`col m-3 d-flex justify-content-center`}
                    >
                      <Link
                        to={`/productview/${item._id}`}
                        className="text-decoration-none"
                      >
                        <div className={`card ${styles.ItemCard}`}>
                          <div className={`${styles.ItemImg}`}>
                            <img
                              src={item.product_images}
                              alt={item.name}
                              className={`card-img-top`}
                            />
                          </div>
                          <div className={`card-body border rounded-bottom-2`}>
                            <div className={`${styles.ItemTitle}`}>
                              {item.name}
                            </div>
                            <div className={`${styles.ItemDesc}`}>
                              {item.description}
                            </div>
                            <span className={`${styles.ItemPrice}`}>
                              {item.price?.$numberDecimal}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center text-muted my-5">
              <h5>No products available at the moment</h5>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Recommend;
