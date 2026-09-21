import React from "react";
import styles from "../main.module.css";
import img1 from "../../../../images/Outdoor 1.png";
import img2 from "../../../../images/Outdoor 2.png";
import batsman from "../../../../images/batsman-standing-cricket- 1.png";

const Outdoor = () => {
  return (
    <>
      <div className={`container `}>
        <div className={`row`}>
          <div className={`col`}>
            <div className={`card ${styles.Card}`}>
              <div className={`card-body ${styles.cardBody}`}>
                <div className={`${styles.Heading}`}>OUTDOOR SPORTS</div>
                <div className={`container`}>
                  <div className={`row `}>
                    <div className={`col p-1  ${styles.SportsCol}`}>
                      <img src={img1} alt="" />
                    </div>
                    <div className={`col p-1  ${styles.SportsCol}`}>
                      <img src={img1} alt="" />
                    </div>
                  </div>
                  <hr className="m-0 p-0" />
                  <div className={`row`}>
                    <div className={`col p-1  ${styles.SportsCol}`}>
                      <img src={img2} alt="" />
                    </div>
                    <div className={`col p-1  ${styles.SportsCol}`}>
                      <img src={img2} alt="" />
                    </div>
                  </div>
                </div>
                <div className={`${styles.Footer}`}>More{` >>>`}</div>
              </div>
            </div>
          </div>
          <div
            className={`col d-flex align-item-center justify-content-center`}
          >
            <div className={`card m-5 ${styles.CardImg}`}>
              <img src={batsman} alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Outdoor;
