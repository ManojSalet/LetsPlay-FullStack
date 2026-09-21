import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Carousel from "./Carousel/Carousel";
import AllCatPart from "./AKSpart/AllCatPart";
import Outdoor from "./OutdoorIndoorPart/Outdoor/Outdoor";
import Indoor from "./OutdoorIndoorPart/Indoor/Indoor";
import Recommend from "./Recommendation/Recommend";
import { Link } from "react-router-dom";
import { getAllProducts } from "../../API/apiService";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";

const HomeMain = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productData = await getAllProducts();
        if (productData && Array.isArray(productData.products)) {
          setProducts(productData.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const NextArrow = ({ onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md hover:shadow-lg border border-slate-100 transition-all cursor-pointer"
      aria-label="Next"
    >
      <ChevronRight className="w-5 h-5" />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md hover:shadow-lg border border-slate-100 transition-all cursor-pointer"
      aria-label="Previous"
    >
      <ChevronLeft className="w-5 h-5" />
    </button>
  );

  const sliderSettings = {
    dots: false,
    infinite: products.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  const formatPrice = (priceObj) => {
    if (!priceObj) return "0";
    const num = parseFloat(priceObj.$numberDecimal || priceObj);
    return isNaN(num) ? "0" : num.toLocaleString("en-IN");
  };

  return (
    <div className="space-y-12">
      <Carousel />
      <AllCatPart />

      {/* Featured Products Slider Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Featured Gear & Equipment
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Top-rated sports essentials handpicked for tournament and training use.
            </p>
          </div>
          <Link
            to="/category"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="relative px-6">
            <Slider {...sliderSettings}>
              {products.map((product) => (
                <div key={product._id} className="p-3">
                  <Link
                    to={`/productview/${product._id}`}
                    className="group block bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Product Image */}
                    <div className="h-56 bg-slate-50 relative flex items-center justify-center p-4 overflow-hidden">
                      <img
                        src={product.product_images?.[0] || ""}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.discountPer > 0 && (
                        <div className="absolute top-3 right-3 inline-flex items-center gap-1 bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                          <Tag className="w-3 h-3" />
                          <span>{product.discountPer}% OFF</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 h-8">
                        {product.description}
                      </p>

                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-lg font-black text-slate-900">
                          ₹{formatPrice(product.selling_price)}
                        </span>
                        {product.discountPer > 0 && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </Slider>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-sm">
            No products available at the moment.
          </div>
        )}
      </section>

      <Outdoor />
      <Indoor />
      <Recommend />
    </div>
  );
};

export default HomeMain;
