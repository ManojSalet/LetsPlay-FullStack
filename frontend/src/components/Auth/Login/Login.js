import React, { useContext, useEffect, useState } from "react";
import styles from "./login.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
// import users from "../../../Static/UserData";

import {loginUser} from "../../../API/apiService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const {login} = useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const handleSubmit = async (e) =>{
    e.preventDefault();

    try {
      const response = await loginUser({email,password});
      if (response) {
        const token = response.data.token; 
        login(token);  // Save user to AuthContext
        alert("Login successful!");
        navigate(from, { replace: true });
      }
      else{
        alert("Login failed");
      }
    } catch (error) {
      alert('invalid credentials');
      setError("Invalid credentials");
      console.log("login failed",error);
    }
  };


  return (
    <div
      className={`container m-3 d-flex justify-content-center ${styles.Container}`}
    >
      <div className={`card d-flex flex-row ${styles.Card}`}>
        <div className={`card-body`}>
          <div className={`fs-3 fw-bold lh-lg text-center`}>LOGIN</div>

          <form className={`p-5`} onSubmit={handleSubmit}>
            <div className={`mb-3 ${styles.Input}`}>
              <div className={`${styles.Icons}`}>
                <i class="bi bi-person-circle"></i>
              </div>
              <input
                type="email"
                className={`form-control ${styles.FormControl}`}
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                id="exampleInputPassword1"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className={`row ${styles.Buttons}`}>
              <button
                type="submit"
                className={`col m-3 rounded-pill btn border`}
              >
                Login
              </button>
              <button
                type="button"
                className={`col m-3 rounded-pill btn border`}
                onClick={() => navigate("/signup")}
              >
               Sign up
              </button>
            </div>

            <div
              className={`mb-3 form-check d-flex justify-content-center gap-1`}
            >
              <input
                type="checkbox"
                className="form-check-input border-2"
                id="exampleCheck1"
              />
              <label className={`form-check-label`} htmlFor="exampleCheck1">
                Remmeber me
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
