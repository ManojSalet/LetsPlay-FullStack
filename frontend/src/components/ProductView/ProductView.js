import React, { useContext, useEffect, useState } from "react";
import Recommend from "../Home/Recommendation/Recommend";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getProductById, addToCart } from "../../API/apiService";
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
  Tag
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
  const { user } = useContext(AuthContext);
  const { fetchCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

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
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="primary"
                size="lg"
                icon={ShoppingCart}
                onClick={() => handleAddToCart(false)}
                className="flex-1"
                label="Add to Cart"
              />
              <Button
                type="button"
                variant="secondary"
                size="lg"
                icon={Zap}
                onClick={() => handleAddToCart(true)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
                label="Buy Now"
              />
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
              { id: "reviews", label: "Customer Reviews (42)" },
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
              <div className="space-y-4 max-w-2xl">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-xs text-slate-900">Rohit S.</span>
                    <span className="text-[11px] text-slate-400">• Verified Buyer</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    "Exceptional quality gear! Perfect weight balance and premium finish. Arrived in sturdy packaging."
                  </p>
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
