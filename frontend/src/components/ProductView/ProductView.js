import React, { useContext, useEffect, useState } from "react";
import styles from "./productView.module.css";
import Recommend from "../Home/Recommendation/Recommend";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getProductById, addToCart } from "../../API/apiService";
import { AuthContext } from "../Auth/AuthContext";
import Button from "../Button/Button";

function ProductView() {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(1);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    const fetchProduct = async () => {
      try {
        const foundProduct = await getProductById(id);
        if (foundProduct) {
          setProduct(foundProduct.product);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      alert("Please login to add to cart");
      navigate("/login", { state: { from: location } });
    } else {
      addToCart(product._id, count)
        .then((data) => {
          alert("Item added to cart");
        })
        .catch((error) => {
          console.error("Error adding to cart:", error);
          alert("Failed to add item to cart");
        });
    }
  };

  const handlePlusBtn = () => {
    setCount(count + 1);
  };

  const handleMinusBtn = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  return (
    <>
      <div className="container my-1">
        <nav aria-label="breadcrumb ">
          <ol
            className={`breadcrumb p-3 rounded-3 bg-secondary bg-gradient mt-3`}
          >
            <li className="breadcrumb-item ">
              <Link to="/">
                <i class="bi bi-house-door-fill text-light"></i>
                <span className="visually-hidden">Home</span>
              </Link>
            </li>
            <li className="breadcrumb-item"></li>
          </ol>
        </nav>
      </div>

      <div className={`container mt-2`}>
        {loading ? (
          <div className={`text-center`}>
            <div className="spinner-border  m-3  text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : product ? (
          <div className={`row`}>
            <div className={`col-6 d-flex flex-column justify-content-center`}>
              <div className={`row d-flex justify-content-center`}>
                <div className={`card ${styles.ImgCard}`}>
                  <img
                    src={product.product_images[0]}
                    alt=""
                    className={`card-img-top img-fuild`}
                  />
                </div>
              </div>

              <div className={`row  d-flex justify-content-center gap-1`}>
                <div
                  className={`col-2 bg-white border border-dark border-2 m-2`}
                >
                  <img
                    src={product.product_images[0]}
                    className="img-fluid "
                    alt="product.name"
                  />
                </div>
                <div className={`col-2 bg-white m-2`}>
                  <img
                    src={product.product_images[0]}
                    className="img-fluid "
                    alt="product.name"
                  />
                </div>
                <div className={`col-2 bg-white m-2`}>
                  <img
                    src={product.product_images[0]}
                    className="img-fluid "
                    alt="product.name"
                  />
                </div>
                <div className={`col-2 bg-white m-2`}>
                  <img
                    src={product.product_images[0]}
                    className="img-fluid "
                    alt="product.name"
                  />
                </div>
              </div>
            </div>

            <div className={`col-6 d-flex flex-column gap-3`}>
              <div className={``}>
                <h1 className=" fw-bold mt-3">{product.name}</h1>
              </div>
              <span className="d-flex gap-1 ">
                <i class="bi bi-star"></i>
                <i class="bi bi-star"></i>
                <i class="bi bi-star"></i>
                <i class="bi bi-star"></i>
                <i class="bi bi-star"></i>
              </span>

              <div className="d-flex gap-2 align-items-center">
                <span className="fs-4 fw-bold">
                  ₹
                  {Number(product.selling_price.$numberDecimal)
                    .toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })
                    .replace("₹", "")}
                </span>
                <span className="fs-6 text-decoration-line-through">
                  ₹{product.price.$numberDecimal}
                </span>
              </div>

              <span className="fs-5 fw-semibold">Select Size</span>
              <table
                className={`w-50  border border-3 border-dark text-center ${styles.Table}`}
              >
                <tbody>
                  <tr className="">
                    <td className={`border-end border-dark`}>1</td>
                    <td className={`border-end border-dark`}>2</td>
                    <td className={`border-end border-dark`}>3</td>
                    <td className={`border-end border-dark`}>4</td>
                    <td className={`border-end border-dark`}>5</td>
                  </tr>
                </tbody>
              </table>

              <span className="fs-5 fw-semibold">Quentity</span>
              <div
                className={`border border-1 border-dark rounded-pill w-50 d-flex justify-content-around p-1 ${styles.Quent}`}
              >
                <button
                  type="button"
                  className={`border-0 bg-transparent `}
                  onClick={handleMinusBtn}
                >
                  <i class="bi bi-dash fs-5"></i>
                </button>
                <span className="fs-5 fw-medium">{count}</span>
                <button
                  type="button"
                  className={`border-0 bg-transparent `}
                  onClick={handlePlusBtn}
                >
                  <i class="bi bi-plus fs-5"></i>
                </button>
              </div>

              <div className={`d-flex justify-content-around mt-2`}>
                <Button
                  label={"Add to Cart"}
                  icon={"bi bi-cart-plus-fill"}
                  onClick={handleAddToCart}
                  size={{ width: "200px", height: "50px" }}
                />
                <Button
                  label={"Buy Now"}
                  icon={"bi bi-bag-plus-fill"}
                  size={{ width: "200px", height: "50px" }}
                />
              </div>
            </div>
          </div>
        ) : (
          <p>Product not found.</p>
        )}

        <div className="container mt-4">
          {/* Tab Navigation */}
          <ul
            className={`nav nav-tabs justify-content-center gap-4 border-bottom border-dark ${styles.ULTab}`}
            id="myTab"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="home-tab"
                data-bs-toggle="tab"
                data-bs-target="#home"
                type="button"
                role="tab"
                aria-controls="home"
                aria-selected="true"
              >
                Size Chart
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="profile-tab"
                data-bs-toggle="tab"
                data-bs-target="#profile"
                type="button"
                role="tab"
                aria-controls="profile"
                aria-selected="false"
              >
                Review
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="contact-tab"
                data-bs-toggle="tab"
                data-bs-target="#contact"
                type="button"
                role="tab"
                aria-controls="contact"
                aria-selected="false"
              >
                Shhiping Policy
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div
            className="tab-content mt-3 d-flex justify-content-center"
            id="myTabContent"
          >
            <div
              className="tab-pane fade show active"
              id="home"
              role="tabpanel"
              aria-labelledby="home-tab"
            >
              <h4>Size Chart Content</h4>
              <p>This is the content for the Size Chart tab.</p>
            </div>
            <div
              className="tab-pane fade"
              id="profile"
              role="tabpanel"
              aria-labelledby="profile-tab"
            >
              <h4>Review Content</h4>
              <p>This is the content for the Review tab.</p>
            </div>
            <div
              className="tab-pane fade"
              id="contact"
              role="tabpanel"
              aria-labelledby="contact-tab"
            >
              <h4>Shhiping Policy Content</h4>
              <p>This is the content for the Shhiping Policy tab.</p>
            </div>
          </div>
        </div>

        <Recommend />
      </div>
    </>
  );
}

export default ProductView;
