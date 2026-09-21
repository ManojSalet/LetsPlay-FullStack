import React from "react";
import styles from "../main.module.css";
import img1 from "../../../../images/Outdoor 1.png";
import img2 from "../../../../images/Outdoor 1.png";
import chess from "../../../../images/Chess 1.png"


const Indoor = () => {
  return (
    <>
      <div className={`container`}>
        <div className={`row`}>
        <div
            className={`col d-flex align-item-center justify-content-center`}
          >
            <div className={`card m-5 ${styles.CardImg}`}>
              <img src={chess} alt="" />
            </div>
          </div>
          <div className={`col`}>
            <div className={`card ${styles.Card}`}>
              <div className={`card-body ${styles.cardBody}`}>
                <div className={`${styles.Heading}`}>INDOOR SPORTS</div>
                <div className={`container`}>
                  <div className={`row `}>
                  <div className={`col p-1  ${styles.SportsCol}`}>
                      <img src={img1} alt="" />
                    </div>
                    <div className={`col p-1  ${styles.SportsCol}`}>
                      <img src={img1} alt="" />
                    </div>
                  </div>
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
        </div>
      </div>
    </>
  );
};

export default Indoor;
