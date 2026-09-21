import React, { useState } from "react";
import styles from "./searchbar.module.css";


const Searchbar = () => {
  const [inputStyle, setInputStyle] = useState();

  const handlarFocus = () =>{
    setInputStyle({
      borderLeft: '1px solid black',
  })
  };

    
  return (
    <div className={`container searchbar d-flex justify-content-center`}>
      <div className={`card my-2 ${styles.Card} `}>
        <div className={`card-body ${styles.CardBody} row`}>
          <div className={`col-4`}>
            <button className={`btn ${styles.searchBtn}`}>Search</button>
          </div>
          <div className={`col-6`}>
            <input
              type="text"
              className={`form-control ${styles.searchInput}`}
              placeholder="Search for products, brands and more"
              style={inputStyle}
              onFocus={handlarFocus}
              onBlur={(e)=>{
                e.target.value = '';
                setInputStyle({
                  borderLeft: 'none',
                })
              }}
            />
          </div>
          <div className={`col-2 d-flex justify-content-center`}>
            <i className={`bi bi-search ${styles.searchIcon}`}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
