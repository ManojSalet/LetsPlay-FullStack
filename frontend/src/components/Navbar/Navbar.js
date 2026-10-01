import React, { useContext, useState, useRef, useEffect } from "react";
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
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
  UserPlus,
  ShieldCheck,
  ChevronDown,
  PackageCheck,
  MapPin,
  Settings,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartData } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const cartItemCount = Array.isArray(cartData)
    ? cartData.reduce((total, item) => total + (item.quantity || 1), 0)
    : 0;

  // Close dropdown on route change
  useEffect(() => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate("/");
  };

  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
      isActive
        ? "bg-indigo-50 text-indigo-600 font-bold"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
    }`;

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span>Let's Play</span>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/category" className={navLinkClass}>
              <LayoutGrid className="w-4 h-4" />
              <span>Categories</span>
            </NavLink>

            {user ? (
              <>
                {user.role === "admin" && (
                  <NavLink
                    to="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-colors mr-1"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </NavLink>
                )}

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

                {/* User Profile Dropdown Menu */}
                <div className="relative ml-2">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50/60 hover:bg-slate-100 transition-all text-xs font-bold text-slate-800 cursor-pointer shadow-2xs"
                  >
                    <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-black">
                      {getInitials(user.username)}
                    </div>
                    <span className="max-w-[120px] truncate">{user.username || "Account"}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                        userDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu Popup */}
                  {userDropdownOpen && (
                    <>
                      {/* Transparent backdrop to click-dismiss */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserDropdownOpen(false)}
                      />

                      <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-white border border-slate-200/90 shadow-xl z-50 p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                        {/* User Header */}
                        <div className="px-3.5 py-3 border-b border-slate-100 mb-1">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {user.username || "Customer"}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                          <div className="mt-1.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700">
                              <ShieldCheck className="w-3 h-3" />
                              <span className="capitalize">{user.role || "Customer"}</span>
                            </span>
                          </div>
                        </div>

                        {/* Navigation Options */}
                        <Link
                          to="/profile?tab=overview"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>My Profile & Settings</span>
                        </Link>

                        <Link
                          to="/profile?tab=orders"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-colors"
                        >
                          <PackageCheck className="w-4 h-4 text-slate-400" />
                          <span>Orders & Live Tracking</span>
                        </Link>

                        <Link
                          to="/profile?tab=addresses"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-colors"
                        >
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span>Saved Addresses</span>
                        </Link>

                        {user.role === "admin" && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-indigo-700 bg-indigo-50/80 rounded-xl hover:bg-indigo-100 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-indigo-600" />
                            <span>Admin Control Panel</span>
                          </Link>
                        )}

                        <div className="pt-1 border-t border-slate-100 mt-1">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-4">
                {!isLoginPage && (
                  <NavLink
                    to="/login"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </NavLink>
                )}
                {!isSignupPage && (
                  <NavLink
                    to="/signup"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
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
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-5 space-y-1.5 animate-in slide-in-from-top-2 duration-150">
          <NavLink
            to="/category"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <LayoutGrid className="w-5 h-5 text-indigo-600" />
            <span>Categories</span>
          </NavLink>

          {user ? (
            <>
              {user.role === "admin" && (
                <NavLink
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                >
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  <span>Admin Panel</span>
                </NavLink>
              )}

              <NavLink
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Heart className="w-5 h-5 text-rose-500" />
                <span>Wishlist</span>
              </NavLink>

              <NavLink
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
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

              {/* Profile & Orders in Mobile */}
              <NavLink
                to="/profile?tab=overview"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <User className="w-5 h-5 text-indigo-600" />
                <span>My Profile & Settings</span>
              </NavLink>

              <NavLink
                to="/profile?tab=orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <PackageCheck className="w-5 h-5 text-indigo-600" />
                <span>Orders & Tracking</span>
              </NavLink>

              <NavLink
                to="/profile?tab=addresses"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <MapPin className="w-5 h-5 text-indigo-600" />
                <span>Saved Addresses</span>
              </NavLink>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout ({user.username})</span>
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <NavLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </NavLink>
              <NavLink
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
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
