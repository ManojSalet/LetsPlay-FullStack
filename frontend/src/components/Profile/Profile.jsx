import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth/AuthContext";
import {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
} from "../../API/apiService";
import OrderHistory from "../Order History/OrderHistory";
import AddressManager from "./AddressManager";
import {
  User,
  Package,
  Heart,
  MapPin,
  Lock,
  Edit3,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  ChevronRight,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

const Profile = ({ defaultTab = "overview" }) => {
  const { user, setUser, logout } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Active tab state: 'overview' | 'orders' | 'addresses' | 'security'
  const tabFromUrl = searchParams.get("tab") || defaultTab;
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  // Profile data & statistics
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({ ordersCount: 0, wishlistCount: 0, addressesCount: 0 });
  const [loading, setLoading] = useState(true);

  // Edit Profile Form State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editMobile, setEditMobile] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");
  const [profileErrorMsg, setProfileErrorMsg] = useState("");

  // Change Password Form State
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [passSuccessMsg, setPassSuccessMsg] = useState("");
  const [passErrorMsg, setPassErrorMsg] = useState("");

  // Sync tab with URL
  useEffect(() => {
    const current = searchParams.get("tab") || defaultTab;
    setActiveTab(current);
  }, [searchParams, defaultTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getUserProfile();
      if (res?.user) {
        setProfileData(res.user);
        setStats(res.stats || { ordersCount: 0, wishlistCount: 0, addressesCount: 0 });
        setEditUsername(res.user.username || "");
        setEditMobile(res.user.mobile || "");
      }
    } catch (err) {
      console.error("Failed to load user profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileErrorMsg("");
    setProfileSuccessMsg("");

    if (!editUsername.trim()) {
      setProfileErrorMsg("Username cannot be empty");
      return;
    }
    if (!editMobile || editMobile.length < 10) {
      setProfileErrorMsg("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setUpdatingProfile(true);
      const res = await updateUserProfile({
        username: editUsername.trim(),
        mobile: editMobile.trim(),
      });

      if (res?.success) {
        setProfileData(res.user);
        if (setUser) {
          setUser((prev) => ({
            ...prev,
            username: res.user.username,
            mobile: res.user.mobile,
          }));
        }
        setProfileSuccessMsg("Profile details updated successfully!");
        setTimeout(() => {
          setEditModalOpen(false);
          setProfileSuccessMsg("");
        }, 1200);
      }
    } catch (err) {
      setProfileErrorMsg(typeof err === "string" ? err : "Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassErrorMsg("");
    setPassSuccessMsg("");

    if (!currentPassword || !newPassword) {
      setPassErrorMsg("Please fill in both current and new password");
      return;
    }
    if (newPassword.length < 6) {
      setPassErrorMsg("New password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassErrorMsg("New password and confirmation do not match");
      return;
    }

    try {
      setChangingPass(true);
      const res = await changeUserPassword({
        currentPassword,
        newPassword,
      });

      if (res?.success) {
        setPassSuccessMsg("Password changed successfully! Keep it secure.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setPasswordModalOpen(false);
          setPassSuccessMsg("");
        }, 1500);
      }
    } catch (err) {
      setPassErrorMsg(typeof err === "string" ? err : "Failed to change password");
    } finally {
      setChangingPass(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "LP";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const displayUser = profileData || user || {};

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Profile Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Background decorative flare */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            {/* Avatar Circle */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-700 text-white flex items-center justify-center text-xl sm:text-2xl font-black shadow-lg shadow-indigo-500/30 flex-shrink-0 ring-4 ring-white/10">
              {getInitials(displayUser.username)}
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight truncate text-white">
                  {displayUser.username || "Sports Athlete"}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="capitalize">{displayUser.role || "Customer"}</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                <span className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{displayUser.email || "customer@letsplay.com"}</span>
                </span>
                {displayUser.mobile && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>+91 {displayUser.mobile}</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Member since {displayUser.createdAt ? new Date(displayUser.createdAt).getFullYear() : "2026"}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setEditUsername(displayUser.username || "");
                setEditMobile(displayUser.mobile || "");
                setEditModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setPasswordModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Security</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-bold border border-rose-500/30 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tab Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        <button
          type="button"
          onClick={() => handleTabChange("overview")}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "overview"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Account Overview</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("orders")}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "orders"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Orders & Live Tracking ({stats.ordersCount})</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("addresses")}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "addresses"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses ({stats.addressesCount})</span>
        </button>
      </div>

      {/* 3. Tab Contents */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => handleTabChange("orders")}
              className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
            >
              <div>
                <span className="text-slate-400 text-xs font-semibold block uppercase">Total Purchases</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block group-hover:text-indigo-600 transition-colors">
                  {stats.ordersCount} Orders
                </span>
                <span className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1 mt-1">
                  <span>Track Shipments</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>

            <Link
              to="/wishlist"
              className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all group flex items-center justify-between"
            >
              <div>
                <span className="text-slate-400 text-xs font-semibold block uppercase">Saved Wishlist</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block group-hover:text-rose-600 transition-colors">
                  {stats.wishlistCount} Items
                </span>
                <span className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                  <span>View Saved Gear</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all shadow-inner">
                <Heart className="w-6 h-6" />
              </div>
            </Link>

            <div
              onClick={() => handleTabChange("addresses")}
              className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
            >
              <div>
                <span className="text-slate-400 text-xs font-semibold block uppercase">Shipping Hub</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block group-hover:text-indigo-600 transition-colors">
                  {stats.addressesCount} Saved
                </span>
                <span className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1 mt-1">
                  <span>Manage Address Book</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                <MapPin className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Account Details & Quick Help */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Personal Details Card */}
            <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 space-y-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>Personal Details</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(true)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  Edit Information
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Full Name</span>
                  <p className="font-bold text-slate-900 text-sm">{displayUser.username}</p>
                </div>

                <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Email Address</span>
                  <p className="font-bold text-slate-900 text-sm truncate">{displayUser.email}</p>
                </div>

                <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Mobile Number</span>
                  <p className="font-bold text-slate-900 text-sm">
                    {displayUser.mobile ? `+91 ${displayUser.mobile}` : "Not provided"}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Account Security</span>
                  <p className="font-bold text-slate-900 text-sm">••••••••••••</p>
                </div>
              </div>
            </div>

            {/* Support / Quick Help Card */}
            <div className="bg-indigo-50/40 rounded-3xl border border-indigo-100 p-6 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Let's Play Guarantee</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  All equipment carries a 100% manufacturer authenticity certificate, express insured dispatch, and direct warranty coverage.
                </p>
              </div>
              <div className="pt-2 text-xs">
                <span className="text-slate-400 block text-[11px]">Need support with an order?</span>
                <span className="font-bold text-indigo-600">support@letsplay.com</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div>
          <OrderHistory embedded={true} />
        </div>
      )}

      {/* Addresses Tab */}
      {activeTab === "addresses" && (
        <div>
          <AddressManager />
        </div>
      )}

      {/* --- Edit Profile Modal --- */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Edit Account Details</h3>

            {profileErrorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{profileErrorMsg}</span>
              </div>
            )}

            {profileSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name / Username *
                </label>
                <input
                  type="text"
                  required
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mobile Number (10 digits) *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={editMobile}
                  onChange={(e) => setEditMobile(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2"
                >
                  {updatingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Change Password Modal --- */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-100">
            <div className="flex items-center gap-2 text-indigo-600">
              <Lock className="w-5 h-5" />
              <h3 className="font-bold text-slate-900 text-base">Change Password</h3>
            </div>

            {passErrorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{passErrorMsg}</span>
              </div>
            )}

            {passSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{passSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Current Password *
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl pr-9 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  New Password (min 6 characters) *
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl pr-9 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changingPass}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2"
                >
                  {changingPass ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
