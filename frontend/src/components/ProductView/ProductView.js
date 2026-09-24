import React, { useContext, useEffect, useState } from "react";
import Recommend from "../Home/Recommendation/Recommend";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { 
  getProductById, 
  addToCart, 
  addToWishlist, 
  getProductReviews, 
  addReview 
} from "../../API/apiService";
import { AuthContext } from "../Auth/AuthContext";
import { useCart } from "../../Context/CartContext";
import Button from "../Button/Button";
import {
  Home,
  ChevronRight,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Heart,
  MessageSquare,
  Send,
  CheckCircle2
} from "lucide-react";

function ProductView() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(1);
  const [selectedSize, setSelectedSize] = useState("Standard");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [actionSuccess, setActionSuccess] = useState("");
  const [wishlistSuccess, setWishlistSuccess] = useState("");

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState({ text: "", type: "" });

  const { user } = useContext(AuthContext);
  const { fetchCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const res = await getProductReviews(id);
      if (res && Array.isArray(res.reviews)) {
        setReviews(res.reviews);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    const fetchProduct = async () => {
      try {
        const foundProduct = await getProductById(id);
        if (foundProduct && foundProduct.product) {
          setProduct(foundProduct.product);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleAddToCart = async (redirectCheckout = false) => {
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }

    try {
      await addToCart(product._id, count);
      await fetchCart();
      if (redirectCheckout) {
        navigate("/checkout");
      } else {
        setActionSuccess("Added to cart successfully!");
        setTimeout(() => setActionSuccess(""), 3000);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }
    try {
      await addToWishlist(product._id);
      setWishlistSuccess("Added to your wishlist!");
      setTimeout(() => setWishlistSuccess(""), 3500);
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      setWishlistSuccess(typeof err === "string" ? err : "Item already in wishlist");
      setTimeout(() => setWishlistSuccess(""), 3500);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }
    if (!newComment.trim()) {
      setReviewMsg({ text: "Please enter your review comments", type: "error" });
      return;
    }
    try {
      setSubmittingReview(true);
      await addReview({
        product: product._id,
        rating: newRating,
        comment: newComment.trim(),
      });
      setNewComment("");
      setReviewMsg({ text: "Thank you! Your review has been posted.", type: "success" });
      fetchReviews();
      setTimeout(() => setReviewMsg({ text: "", type: "" }), 4000);
    } catch (err) {
      console.error("Error submitting review:", err);
      setReviewMsg({ text: typeof err === "string" ? err : "Failed to post review", type: "error" });
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatPrice = (priceObj) => {
    if (!priceObj) return "0";
    const num = parseFloat(priceObj.$numberDecimal || priceObj);
    return isNaN(num) ? "0" : num.toLocaleString("en-IN");
  };

  const images = product?.product_images?.length
    ? product.product_images
    : ["https://placehold.co/600x400?text=Sports+Gear"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8">
        <Link to="/" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link to="/category" className="hover:text-indigo-600 transition-colors">
          Catalog
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-800 font-medium truncate max-w-xs">
          {product?.name || "Product"}
        </span>
      </nav>

      {/* Action Notification Toast */}
      {actionSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between text-sm font-medium animate-fadeIn">
          <span>✓ {actionSuccess}</span>
          <Link to="/cart" className="underline font-bold hover:text-emerald-900">
            View Cart →
          </Link>
        </div>
      )}

      {/* Wishlist Notification Toast */}
      {wishlistSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 flex items-center justify-between text-sm font-medium animate-fadeIn">
          <span>♥ {wishlistSuccess}</span>
          <Link to="/wishlist" className="underline font-bold hover:text-indigo-900">
            View Wishlist →
          </Link>
        </div>
      )}

      {loading ? (
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : product ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm h-96 sm:h-[460px] flex items-center justify-center overflow-hidden">
              <img
                src={images[selectedImageIdx] || images[0]}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImageIdx(index)}
                    className={`w-20 h-20 rounded-xl bg-white border-2 p-1.5 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                      selectedImageIdx === index
                        ? "border-indigo-600 shadow-md ring-2 ring-indigo-100"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <img src={img} alt="" className="max-h-full max-w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                Verified Sports Gear
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {product.name}
              </h1>

              {/* Star Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-medium text-slate-500">
                  (4.8 / 5.0 • 42 Verified Reviews)
                </span>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                ₹{formatPrice(product.selling_price || product.price)}
              </span>
              {product.discountPer > 0 && product.price && (
                <>
                  <span className="text-sm text-slate-400 line-through">
                    ₹{formatPrice(product.price)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    <Tag className="w-3 h-3" />
                    Save {product.discountPer}%
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Select Option / Size
              </label>
              <div className="flex flex-wrap gap-2">
                {["Standard", "Pro", "Junior", "Size 4", "Size 5"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      selectedSize === size
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Quantity
              </label>
              <div className="inline-flex items-center border border-slate-200 bg-white rounded-xl shadow-sm">
                <button
                  type="button"
                  onClick={() => count > 1 && setCount(count - 1)}
                  className="p-2.5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  disabled={count <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 text-sm font-bold text-slate-900">{count}</span>
                <button
                  type="button"
                  onClick={() => setCount(count + 1)}
                  className="p-2.5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
              <Button
                type="button"
                variant="primary"
                size="lg"
                icon={ShoppingCart}
                onClick={() => handleAddToCart(false)}
                className="flex-1 w-full"
                label="Add to Cart"
              />
              <Button
                type="button"
                variant="secondary"
                size="lg"
                icon={Zap}
                onClick={() => handleAddToCart(true)}
                className="flex-1 w-full bg-slate-900 hover:bg-slate-800 text-white"
                label="Buy Now"
              />
              <button
                type="button"
                onClick={handleAddToWishlist}
                title="Add to Wishlist"
                className="p-3.5 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-all flex items-center justify-center cursor-pointer shadow-xs w-full sm:w-auto"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Value Guarantees */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-1.5">
                <Truck className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-medium text-slate-700">Fast Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-medium text-slate-700">100% Authentic</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <RotateCcw className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-medium text-slate-700">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-xl font-bold text-slate-800">Product not found</h2>
          <Link to="/" className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:underline">
            Back to Home
          </Link>
        </div>
      )}

      {/* Modern Tabs Section */}
      {product && (
        <div className="mt-16 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <div className="flex border-b border-slate-200 gap-8">
            {[
              { id: "description", label: "Specifications & Details" },
              { id: "size", label: "Size Chart & Fit Guide" },
              { id: "shipping", label: "Shipping & Warranty" },
              { id: "reviews", label: `Customer Reviews (${reviews.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-sm font-semibold transition-colors relative cursor-pointer ${
                  activeTab === tab.id
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="pt-6 text-sm text-slate-600 leading-relaxed">
            {activeTab === "description" && (
              <div className="space-y-4 max-w-3xl">
                <p>{product.description}</p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
                  <div>
                    <span className="font-bold text-slate-800">Material Grade:</span> Professional Competition Standard
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">Suitability:</span> Indoor & Outdoor Play
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">Warranty:</span> 6 Months Manufacturing Warranty
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">Origin:</span> Genuine Certified Product
                  </div>
                </div>
              </div>
            )}

            {activeTab === "size" && (
              <div className="max-w-xl">
                <p className="mb-4">Use the measurements below to select the optimal size for your playing style:</p>
                <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                    <tr>
                      <th className="p-3">Size</th>
                      <th className="p-3">Player Height</th>
                      <th className="p-3">Weight Class</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-semibold">Junior</td>
                      <td className="p-3">4'6" - 5'2"</td>
                      <td className="p-3">Lightweight</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Standard</td>
                      <td className="p-3">5'3" - 5'9"</td>
                      <td className="p-3">Medium</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Pro / Senior</td>
                      <td className="p-3">5'10" and above</td>
                      <td className="p-3">Heavy / Professional</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-3 max-w-2xl">
                <p><strong>Shipping:</strong> Orders are dispatched within 24-48 hours. Standard domestic delivery takes 3-5 business days.</p>
                <p><strong>Returns:</strong> 7-day hassle-free return and replacement policy on unused items with original tags and packaging.</p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6 max-w-2xl">
                {/* Review Message Alert */}
                {reviewMsg.text && (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                      reviewMsg.type === "success"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-rose-50 text-rose-800 border border-rose-200"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{reviewMsg.text}</span>
                  </div>
                )}

                {/* Reviews List */}
                {loadingReviews ? (
                  <div className="py-6 text-center text-slate-400 text-xs">
                    Loading customer reviews...
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-slate-100">
                    No reviews yet. Be the first to leave a review!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((r, i) => (
                      <div
                        key={r._id || i}
                        className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex text-amber-400">
                              {[...Array(5)].map((_, starIdx) => (
                                <Star
                                  key={starIdx}
                                  className={`w-3.5 h-3.5 ${
                                    starIdx < (r.rating || 5)
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-slate-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-bold text-xs text-slate-900">
                              {r.user?.username || "Verified Customer"}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {r.createdAt
                              ? new Date(r.createdAt).toLocaleDateString()
                              : "Verified"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed pt-1">
                          {r.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Review Form */}
                <div className="pt-6 border-t border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm mb-3">
                    Write a Customer Review
                  </h4>
                  {user ? (
                    <form
                      onSubmit={handleReviewSubmit}
                      className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80"
                    >
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Your Rating
                        </label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  star <= newRating
                                    ? "fill-amber-400"
                                    : "text-slate-300"
                                }`}
                              />
                            </button>
                          ))}
                          <span className="text-xs font-semibold text-slate-600 ml-2">
                            {newRating} of 5 Stars
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Your Feedback
                        </label>
                        <textarea
                          rows="3"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Share details about durability, performance, or quality..."
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>
                          {submittingReview ? "Submitting..." : "Submit Review"}
                        </span>
                      </button>
                    </form>
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center justify-between border border-slate-200">
                      <span>Please log in to leave a review for this product.</span>
                      <Link
                        to="/login"
                        state={{ from: location }}
                        className="font-bold text-indigo-600 hover:underline"
                      >
                        Log In →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Recommend />
    </div>
  );
}

export default ProductView;
