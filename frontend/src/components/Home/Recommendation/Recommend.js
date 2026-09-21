import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../../../API/apiService";
import { Sparkles, Tag } from "lucide-react";

function Recommend() {
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
        console.error("Error fetching recommended products", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (priceObj) => {
    if (!priceObj) return "0";
    const num = parseFloat(priceObj.$numberDecimal || priceObj);
    return isNaN(num) ? "0" : num.toLocaleString("en-IN");
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
      <div className="flex items-center gap-2 mb-8 justify-center text-center">
        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Recommended For You
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Curated athletic gear popular among players this season
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((item) => (
            <Link
              key={item._id}
              to={`/productview/${item._id}`}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Product Image */}
              <div className="h-48 bg-slate-50 relative flex items-center justify-center p-4 overflow-hidden">
                <img
                  src={
                    Array.isArray(item.product_images)
                      ? item.product_images[0]
                      : item.product_images || ""
                  }
                  alt={item.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                {item.discountPer > 0 && (
                  <div className="absolute top-3 right-3 inline-flex items-center gap-1 bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    <Tag className="w-3 h-3" />
                    <span>{item.discountPer}% OFF</span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 text-sm">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 h-8">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-base font-bold text-slate-900">
                      ₹{formatPrice(item.selling_price || item.price)}
                    </span>
                    {item.discountPer > 0 && item.price && (
                      <span className="ml-2 text-xs text-slate-400 line-through">
                        ₹{formatPrice(item.price)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 group-hover:underline">
                    View →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400 text-sm">
          No recommendations available at this time.
        </div>
      )}
    </section>
  );
}

export default Recommend;
