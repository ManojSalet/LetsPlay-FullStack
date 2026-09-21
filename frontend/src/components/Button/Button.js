import React from "react";
import styles from "./button.module.css";

function Button({type, label, className,size = {width: 'auto', height: 'auto'}, icon, onClick, ...rest}) {
  return (
    <>
      <button
        type={type}
        className={`btn  d-flex justify-content-center align-items-center gap-2 ${className} ${styles.Button}`}
        style={{width: size.width, height: size.height}}
        onClick={onClick}
        {...rest}
      >
        {icon && <i className={icon}></i>}
        {label}
      </button>
    </>
  );
}

export default Button;
