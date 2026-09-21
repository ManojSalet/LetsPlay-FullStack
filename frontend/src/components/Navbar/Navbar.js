import React, { useContext } from "react";
import styles from "./navbar.module.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/Auth/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavLinkClick = (path) => {
    // Store the last location before navigating to a new path
    localStorage.setItem("lastLocation", location.pathname);
    navigate(path); // Navigate to the new path
  };

  const handleLogout = () => {
    alert("You have been logged out");
    logout();
  };

  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";

  const NavItem = ({ to, icon, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `nav-link ${styles.navLink} ${isActive ? "active" : ""}`
      }
      aria-label={label}
      onClick={() => {
        handleNavLinkClick(to);
        if (label === "Logout") {
          handleLogout();
        }
      }}
    >
      <i className={`${icon} ${styles.navIcon}`} aria-hidden="true"></i>
      {label}
    </NavLink>
  );

  return (
    <div className={styles.Navbar}>
      <nav className={`navbar ${styles.Navbar} navbar-expand-lg fixed-top`}>
        <div className={`container-fluid ${styles.containerFluid}`}>
          <NavLink to="/" className={`navbar-brand ${styles.navbarBrand}`}>
            Let's Play
          </NavLink>
          <button
            className={`navbar-toggler ${styles.navbarToggler}`}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className={`navbar-toggler-icon`} aria-hidden="true"></span>
          </button>
          <div
            className={`collapse navbar-collapse justify-content-end border-top border-white`}
            id="navbarNavAltMarkup"
          >
            <div className={`navbar-nav ${styles.navbarNav}`}>
              <NavItem
                to="/category"
                icon="bi bi-shop-window"
                label="Category"
              />
              {user ? (
                <>
                  <NavItem to="/wishlist" icon="bi bi-heart" label="Wishlist" />
                  <NavItem to="/cart" icon="bi bi-cart" label="Cart" />
                  <NavItem
                    to="/"
                    icon="bi bi-person-circle"
                    label="Logout"
                    onClick={handleLogout}
                  />
                </>
              ) : (
                <>
                  {!isLoginPage && (
                    <NavItem
                      to="/login"
                      icon="bi bi-person-circle"
                      label="Login"
                    />
                  )}
                  {!isSignupPage && (
                    <NavItem
                      to="/signup"
                      icon="bi bi-person-circle"
                      label="Signup"
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
