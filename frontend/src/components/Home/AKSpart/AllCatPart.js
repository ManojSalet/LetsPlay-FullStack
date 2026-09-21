import React from "react";
import style from "./allCatParts.module.css";
import kidsImg from "../../../images/kids.jpeg";
import allsportImg from "../../../images/all sports.jpeg";
import menImg from "../../../images/women.jpeg";
const AllCatPart = () => {
  return (
    <>
      <div className={`container ${style.Container}`}>
        <div className={`row m-0`}>
          <div className={`col p-0 ${style.allCol}`}>
            <div className={`card ${style.KidsCard} ${style.allCard}`}>
              <img
                src={kidsImg}
                alt="Kids"
                className={`${style.kidsImg} ${style.allImg} img-fluid`}
              />
              <div className={`${style.CardBody}`}>Kids</div>
            </div>
          </div>

          <div className={`col p-0 ${style.allCol}`}>
            <div className={`card ${style.allText}`}>
              <div className={`card-body `}>Dream Big</div>
            </div>
          </div>

          <div className={`col p-0 ${style.allCol}`}>
            <div className={`card ${style.AllSportsCard} ${style.allCard}`}>
              <img
                src={allsportImg}
                alt="Kids"
                className={`${style.allsportImg} ${style.allImg} img-fluid`}
              />
              <div className={`${style.CardBody}`}>All Sports</div>
            </div>
          </div>
        </div>

        <div className={`row mt-1`}>
          <div className={`col ${style.allCol}`}>
            <div className={`card ${style.allText}`}>
              <div className={`card-body`}>Run Fast</div>
            </div>
          </div>

          <div className={`col ${style.allCol}`}>
            <div className={`card ${style.AdultsCard} ${style.allCard}`}>
              <img
                src={menImg}
                alt="Kids"
                className={`${style.AdultsImg} ${style.allImg} img-fluid`}
              />
              <div className={`${style.CardBody}`}>Adults</div>
            </div>
          </div>

          <div className={`col ${style.allCol}`}>
            <div className={`card ${style.allText}`}>
              <div className={`card-body`}>Achieve more</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllCatPart;
