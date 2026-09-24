import React, { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
  Search, 
  Home, 
  ChevronRight, 
  ArrowRight, 
  Tag, 
  SlidersHorizontal,
  PackageX
} from "lucide-react";
import { getAllProducts } from "../../API/apiService";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(queryFromUrl);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    setSearchTerm(queryFromUrl);
  }, [queryFromUrl]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ q: searchTerm });
  };

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let result = products;

    if (term) {
      result = result.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(term);
        const descMatch = p.description?.toLowerCase().includes(term);
        const equipMatch = p.equipment?.name?.toLowerCase().includes(term);
        return nameMatch || descMatch || equipMatch;
      });
    }

    // Apply sorting
    if (sortBy === "price_asc") {
      result = [...result].sort((a, b) => {
        const pA = Number(a.selling_price?.$numberDecimal || a.selling_price || a.price || 0);
        const pB = Number(b.selling_price?.$numberDecimal || b.selling_price || b.price || 0);
        return pA - pB;
      });
    } else if (sortBy === "price_desc") {
      result = [...result].sort((a, b) => {
        const pA = Number(a.selling_price?.$numberDecimal || a.selling_price || a.price || 0);
        const pB = Number(b.selling_price?.$numberDecimal || b.selling_price || b.price || 0);
        return pB - pA;
      });
    } else if (sortBy === "discount") {
      result = [...result].sort((a, b) => (b.discountPer || 0) - (a.discountPer || 0));
    }

    return result;
  }, [products, searchTerm, sortBy]);

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
          <span className="text-slate-900 font-semibold">Search Catalog</span>
        </nav>

        {/* Search Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-10 text-white shadow-xl space-y-4">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {queryFromUrl ? `Search Results for "${queryFromUrl}"` : "Search Products"}
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Browse matching equipment, gear, and apparel across our entire collection.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name, equipment, or sport..."
              className="w-full pl-11 pr-24 py-3 bg-white text-slate-900 placeholder-slate-400 rounded-xl text-sm font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* Filter and Sort Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-xs border border-slate-100">
          <div className="text-sm font-semibold text-slate-700">
            {loading ? "Searching..." : `${filteredProducts.length} product(s) found`}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Sort by:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="relevance">Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
            </select>
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
                <div className="h-8 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-xs space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <PackageX className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No Matching Products</h3>
            <p className="text-sm text-slate-500">
              We couldn't find any products matching "{searchTerm}". Try different keywords or browse our categories.
            </p>
            <div className="pt-2">
              <Link
                to="/category"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-xs"
              >
                <span>Browse All Categories</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const imageSrc = Array.isArray(product.product_images)
                ? product.product_images[0]
                : product.product_images;
              const price = Number(product.price?.$numberDecimal || product.price || 0);
              const sellingPrice = Number(product.selling_price?.$numberDecimal || product.selling_price || price);
              const hasDiscount = product.discountPer > 0 && price > sellingPrice;

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
                    {hasDiscount && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {product.discountPer}% OFF
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
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

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-extrabold text-slate-900">
                          ₹{sellingPrice.toLocaleString("en-IN")}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{price.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      <Link
                        to={`/productview/${product._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-emerald-600 transition-colors shadow-xs"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
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

export default SearchResults;
