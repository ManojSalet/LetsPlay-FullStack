import React, { useContext, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/Auth/AuthContext";
import { useCart } from "../../Context/CartContext";
import {
  ShoppingBag,
  LayoutGrid,
  Heart,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  LogIn,
  UserPlus
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartData } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemCount = Array.isArray(cartData)
    ? cartData.reduce((total, item) => total + (item.quantity || 1), 0)
    : 0;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-indigo-50 text-indigo-600 font-semibold"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span>Let's Play</span>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/category" className={navLinkClass}>
              <LayoutGrid className="w-4 h-4" />
              <span>Categories</span>
            </NavLink>

            {user ? (
              <>
                <NavLink to="/wishlist" className={navLinkClass}>
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Wishlist</span>
                </NavLink>

                <NavLink to="/cart" className={`${navLinkClass} relative`}>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Cart</span>
                  {cartItemCount > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </NavLink>

                <NavLink to="/orderhistory" className={navLinkClass}>
                  <User className="w-4 h-4" />
                  <span>Orders</span>
                </NavLink>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 ml-2 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-4">
                {!isLoginPage && (
                  <NavLink
                    to="/login"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </NavLink>
                )}
                {!isSignupPage && (
                  <NavLink
                    to="/signup"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </NavLink>
                )}
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <NavLink
            to="/category"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            <LayoutGrid className="w-5 h-5 text-indigo-600" />
            <span>Categories</span>
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                <Heart className="w-5 h-5 text-rose-500" />
                <span>Wishlist</span>
              </NavLink>

              <NavLink
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-indigo-600" />
                  <span>Cart</span>
                </div>
                {cartItemCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold text-white bg-indigo-600 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/orderhistory"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                <User className="w-5 h-5 text-indigo-600" />
                <span>Order History</span>
              </NavLink>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <NavLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </NavLink>
              <NavLink
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </NavLink>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
