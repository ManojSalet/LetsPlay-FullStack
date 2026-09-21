import React, { useEffect, useState } from "react";
import styles from "./category.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { getAllSports } from "../../API/apiService";

const Category = () => {
  const [allSports, setAllSports] = useState([]);
  const [firstHalfSports, setFirstHalfSports] = useState([]);
  const [secondHalfSports, setSecondHalfSports] = useState([]);

  useEffect(() => {
    const fetchAllSports = async () => {
      try {
        const sportData = await getAllSports();
        if (sportData && Array.isArray(sportData.sports)) {
          setAllSports(sportData.sports);

          // Divide data into two halves
          const midpoint = Math.ceil(sportData.sports.length / 2);
          setFirstHalfSports(sportData.sports.slice(0, midpoint));
          setSecondHalfSports(sportData.sports.slice(midpoint));
        }
      } catch (error) {
        console.log("Error fetching sports", error);
        setAllSports([]);
      }
    };

    fetchAllSports();
  }, []);

  // Custom Arrow Components
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
          marginRight: "10px",
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
        }}
        onClick={onClick}
      >
        <i className="bi bi-arrow-left-circle-fill"></i>
      </div>
    );
  };

  // Slider Settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <>
      <div className="container my-1" style={{ overflow: "hidden" }}>
        <nav aria-label="breadcrumb">
          <ol
            className={`breadcrumb p-3 bg-body-tertiary rounded-3 ${styles.BC}`}
          >
            <li className="breadcrumb-item">
              <a className="link-body-emphasis" href="/">
                <i className="bi bi-house-door-fill"></i>
                <span className="visually-hidden">Home</span>
              </a>
            </li>
            <li className="breadcrumb-item">Category</li>
          </ol>
        </nav>
      </div>

      <div className="container text-center">
        <div className="headingText fs-3 fw-bold text-decoration-underline">
          OUTDOOR SPORTS
        </div>
      </div>

      <hr />

      <div className="d-flex ms-2">
        <div className="container">
          {/* First Slider: First Half of Data */}
          <div className={`row p-3 ${styles.SliderRow}`}>
            <Slider {...sliderSettings}>
              {firstHalfSports.length > 0 ? (
                firstHalfSports.map((img, index) => (
                  <Link
                    to={`/equipment/${img._id}`}
                    state={{ sportName: img.name }}
                    key={index}
                  >
                    <div>
                      <img
                        src={img?.sport_image}
                        alt={img.name}
                        className="img-fluid rounded"
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center">No sports found</div>
              )}
            </Slider>
          </div>

          {/* Second Slider: Second Half of Data */}
          <div className={`row p-3 ${styles.SliderRow}`}>
            <Slider {...sliderSettings}>
              {secondHalfSports.length > 0 ? (
                secondHalfSports.map((img, index) => (
                  <Link
                    to={`/equipment/${img._id}`}
                    state={{ sportName: img.name }}
                    key={index}
                  >
                    <div>
                      <img
                        src={img?.sport_image}
                        alt={img.name}
                        className="img-fluid rounded"
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center">No sports found</div>
              )}
            </Slider>
          </div>
        </div>
      </div>

      <div className="container text-center mt-2">
        <div className="headingText fs-3 fw-bold text-decoration-underline">
          INDOOR SPORTS
        </div>
      </div>

      <hr />
    </>
  );
};

export default Category;
