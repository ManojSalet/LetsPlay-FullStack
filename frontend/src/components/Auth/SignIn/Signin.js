import React, { useEffect, useState } from "react";
import styles from "./signin.module.css";
import { registerUser } from "../../../API/apiService";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [formData, setFromData] = useState({
    username: "",
    mobile: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const { username, mobile, email, password } = formData;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFromData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert("Registration failed");
    }
  };

  return (
    <div
      className={`container m-3 d-flex justify-content-center ${styles.Container}`}
    >
      <div className={`card d-flex flex-row ${styles.Card}`}>
        <div className={`card-body`}>
          <div className={`fs-3 fw-bold lh-lg text-center`}>Register</div>

          <form className={`p-5`} onSubmit={handleSubmit}>
            <div className={`mb-3 ${styles.Input}`}>
              <div className={`${styles.Icons}`}>
                <i class="bi bi-circle position-relative"></i>
                <i className="bi bi-person-fill position-absolute start-50  top-50 fs-2 translate-middle"></i>
              </div>
              <input
                type="text"
                className={`form-control ${styles.FormControl}`}
                id="username"
                name="username"
                value={username}
                onChange={handleChange}
                aria-describedby="usernameHelp"
                placeholder="Enter Username"
                required
              />
            </div>

            <div className={`mb-3 ${styles.Input}`}>
              <div className={`${styles.Icons}`}>
                <i class="bi bi-circle position-relative"></i>
                <i className="bi bi-telephone-fill position-absolute start-50  top-50 fs-2 translate-middle"></i>
              </div>
              <input
                type="text"
                className={`form-control ${styles.FormControl}`}
                id="mobile"
                name="mobile"
                value={mobile}
                onChange={handleChange}
                aria-describedby="monlieHelp"
                placeholder="Enter Mobile Number"
                required
              />
            </div>

            <div className={`mb-3 ${styles.Input}`}>
              <div className={`${styles.Icons}`}>
                <i class="bi bi-circle position-relative"></i>
                <i className="bi bi-envelope-fill position-absolute start-50  top-50 fs-2 translate-middle"></i>
              </div>
              <input
                type="email"
                className={`form-control ${styles.FormControl}`}
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                aria-describedby="emailHelp"
                placeholder="Enter Your Email"
                required
              />
            </div>

            <div className={`mb-3 ${styles.Input}`}>
              <div className={`${styles.Icons}`}>
                <i class="bi bi-circle position-relative"></i>
                <i className="bi bi-person-fill-lock position-absolute start-50  top-50 fs-2 translate-middle"></i>
              </div>
              <input
                type="password"
                className={`form-control ${styles.FormControl}`}
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </div>

            <div className={`row ${styles.Buttons}`}>
              <button
                type="submit"
                className={`col m-3 rounded-pill btn border`}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
