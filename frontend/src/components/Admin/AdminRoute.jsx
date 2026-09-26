import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../Auth/AuthContext";
import { jwtDecode } from "jwt-decode";
import { ShieldAlert, ArrowLeft, Loader2 } from "lucide-react";

const AdminRoute = ({ element }) => {
  const { user, setUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // If context user is not set yet, check sessionStorage for admin_token first
    if (!user) {
      const adminToken = sessionStorage.getItem("admin_token");
      if (adminToken) {
        try {
          const decoded = jwtDecode(adminToken);
          if (decoded && decoded.role === "admin" && (!decoded.exp || decoded.exp * 1000 > Date.now())) {
            setUser(decoded);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          sessionStorage.removeItem("admin_token");
        }
      }

      const customerToken = localStorage.getItem("customer_token") || localStorage.getItem("token");
      if (!adminToken && !customerToken) {
        setIsLoading(false);
        return;
      }
    }
    setIsLoading(false);
  }, [user, setUser]);


  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Verifying administrator access...</p>
      </div>
    );
  }

  // Not logged in -> Redirect to login with return path
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Logged in but not an admin -> Show Access Denied UI
  if (user.role !== "admin") {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 p-8 sm:p-10 shadow-sm text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Access Restricted</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              This area requires administrator privileges. Your current account (<span className="font-semibold text-slate-700">{user.email || user.username}</span>) does not have access.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </Link>
            <Link
              to="/login"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-colors"
            >
              <span>Switch Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return element;
};

export default AdminRoute;
