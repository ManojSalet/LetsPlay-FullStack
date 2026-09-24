import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Heart, 
  Home, 
  ChevronRight, 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  Tag, 
  CheckCircle2, 
  Package
} from "lucide-react";
import { getWishlist, removeFromWishlist, addToCart } from "../../API/apiService";
import { useCart } from "../../Context/CartContext";
import { AuthContext } from "../Auth/AuthContext";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState({ text: "", type: "" });
  const { fetchCart } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchWishlistData = async () => {
    try {
      setLoading(true);
      const data = await getWishlist();
      if (data && data.wishlist && Array.isArray(data.wishlist.wishlist)) {
        // Backend models wishlist as array of { products: ProductRef }
        const items = data.wishlist.wishlist
          .map((entry) => entry.products)
          .filter((p) => p !== null && p !== undefined);
        setWishlistItems(items);
      } else {
        setWishlistItems([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchWishlistData();
  }, [user]);

  const showMessage = (text, type = "success") => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage({ text: "", type: "" }), 3500);
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
      showMessage("Item removed from your wishlist", "info");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      showMessage("Could not remove item. Please try again.", "error");
    }
  };

  const handleMoveToCart = async (product) => {
    try {
      await addToCart(product._id, 1);
      await fetchCart();
      await removeFromWishlist(product._id);
      setWishlistItems((prev) => prev.filter((item) => item._id !== product._id));
      showMessage(`"${product.name}" moved to your cart!`, "success");
    } catch (error) {
      console.error("Error moving to cart:", error);
      showMessage("Failed to move item to cart", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm font-medium text-slate-500 bg-white px-5 py-3 rounded-xl shadow-xs border border-slate-100">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-slate-600 hover:text-emerald-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
          <span className="text-slate-900 font-semibold">Wishlist</span>
        </nav>

        {/* Action Alert Banner */}
        {actionMessage.text && (
          <div
            className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-sm ${
              actionMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : actionMessage.type === "info"
                ? "bg-indigo-50 text-indigo-800 border border-indigo-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{actionMessage.text}</span>
          </div>
        )}

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-8 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider border border-rose-500/30">
              <Heart className="w-3.5 h-3.5 fill-current" />
              Saved Items
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">My Wishlist</h1>
            <p className="text-slate-300 text-sm">
              Keep track of equipment and gear you want to purchase later.
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold border border-white/20">
              {wishlistItems.length} {wishlistItems.length === 1 ? "Item" : "Items"}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs animate-pulse space-y-4"
              >
                <div className="w-full h-48 bg-slate-200 rounded-xl" />
                <div className="h-5 bg-slate-200 rounded-md w-3/4" />
                <div className="h-4 bg-slate-200 rounded-md w-1/2" />
                <div className="h-10 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && wishlistItems.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-xs space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Your Wishlist is Empty</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Explore our wide selection of sports equipment, apparel, and tournament gear, and save your favorites here.
            </p>
            <div className="pt-2">
              <Link
                to="/category"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-xs"
              >
                <span>Browse Categories</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Wishlist Items Grid */}
        {!loading && wishlistItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((product) => {
              const imageSrc = Array.isArray(product.product_images)
                ? product.product_images[0]
                : product.product_images;
              const price = Number(product.price?.$numberDecimal || product.price || 0);
              const sellingPrice = Number(product.selling_price?.$numberDecimal || product.selling_price || price);
              const hasDiscount = product.discountPer > 0 && price > sellingPrice;
              const inStock = product.qty > 0;

              return (
                <div
                  key={product._id}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={imageSrc || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60"}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60";
                      }}
                    />

                    {/* Discount Badge */}
                    {hasDiscount && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {product.discountPer}% OFF
                      </div>
                    )}

                    {/* Remove Quick Button */}
                    <button
                      type="button"
                      onClick={() => handleRemove(product._id)}
                      title="Remove from wishlist"
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-slate-500 hover:text-rose-600 hover:bg-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded-full ${
                            inStock
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>

                      <Link
                        to={`/productview/${product._id}`}
                        className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1 block text-base"
                      >
                        {product.name}
                      </Link>

                      <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                        {product.description || "Premium athletic gear built for performance."}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-extrabold text-slate-900">
                          ₹{sellingPrice.toLocaleString("en-IN")}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{price.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleMoveToCart(product)}
                        disabled={!inStock}
                        className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs ${
                          inStock
                            ? "bg-slate-900 text-white hover:bg-emerald-600 cursor-pointer"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Move to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
