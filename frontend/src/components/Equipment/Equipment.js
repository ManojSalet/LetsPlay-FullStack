import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { 
  Home, 
  ChevronRight, 
  Package, 
  ArrowRight, 
  ShoppingBag, 
  Tag, 
  AlertCircle,
  Search,
  CheckCircle2
} from "lucide-react";
import { getEquipmentBySportId, getProductsByEquipment } from "../../API/apiService";

function Equipment() {
  const { id: sportId } = useParams();
  const location = useLocation();
  const sportName = location.state?.sportName || "Sport Equipment";

  const [equipments, setEquipments] = useState([]);
  const [loadingEquipments, setLoadingEquipments] = useState(true);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch equipment by sport ID
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoadingEquipments(true);
        const data = await getEquipmentBySportId(sportId);
        if (data && Array.isArray(data.equipment)) {
          setEquipments(data.equipment);
          if (data.equipment.length > 0) {
            setSelectedEquipment(data.equipment[0]);
          }
        } else {
          setEquipments([]);
        }
      } catch (error) {
        console.error("Error fetching equipment:", error);
        setEquipments([]);
      } finally {
        setLoadingEquipments(false);
      }
    };

    if (sportId) {
      fetchEquipment();
    }
  }, [sportId]);

  // Fetch products whenever selectedEquipment changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedEquipment?._id) return;
      try {
        setLoadingProducts(true);
        const data = await getProductsByEquipment(selectedEquipment._id);
        if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching equipment products:", error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [selectedEquipment]);

  const filteredEquipments = useMemo(() => {
    return equipments.filter((eq) =>
      eq.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [equipments, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
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
          <Link
            to="/category"
            className="text-slate-600 hover:text-emerald-600 transition-colors"
          >
            Categories
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
          <span className="text-slate-900 font-semibold">{sportName}</span>
        </nav>

        {/* Sport Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-500/30">
              <Package className="w-3.5 h-3.5" />
              Equipment Catalog
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {sportName}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base">
              Explore specialized gear and match-grade equipment configured specifically for {sportName}. Select a category below to browse verified products.
            </p>
          </div>
        </div>

        {/* Loading State for Equipment */}
        {loadingEquipments && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs animate-pulse space-y-4"
              >
                <div className="w-full h-44 bg-slate-200 rounded-xl" />
                <div className="h-5 bg-slate-200 rounded-md w-3/4" />
                <div className="h-4 bg-slate-200 rounded-md w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loadingEquipments && equipments.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-xs space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              No Equipment Found
            </h3>
            <p className="text-sm text-slate-500">
              There is currently no equipment listed for this sport category.
            </p>
            <Link
              to="/category"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-xs"
            >
              Browse Other Sports
            </Link>
          </div>
        )}

        {/* Equipment Selector Grid */}
        {!loadingEquipments && equipments.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Select Equipment Category
                </h2>
                <p className="text-sm text-slate-500">
                  Choose an equipment type to view available products in stock
                </p>
              </div>

              {equipments.length > 3 && (
                <div className="relative min-w-[220px]">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search equipment..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-xs"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredEquipments.map((eq) => {
                const isSelected = selectedEquipment?._id === eq._id;
                const imageSrc = Array.isArray(eq.equipment_image)
                  ? eq.equipment_image[0]
                  : eq.equipment_image;

                return (
                  <button
                    key={eq._id}
                    onClick={() => setSelectedEquipment(eq)}
                    className={`group text-left rounded-2xl overflow-hidden border transition-all duration-300 p-4 bg-white flex flex-col justify-between ${
                      isSelected
                        ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                    }`}
                  >
                    <div>
                      <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 mb-4">
                        <img
                          src={imageSrc || "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=60"}
                          alt={eq.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=60";
                          }}
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-emerald-600 text-white rounded-full p-1 shadow-sm">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <h3 className={`font-bold text-base transition-colors ${
                        isSelected ? "text-emerald-700" : "text-slate-900 group-hover:text-emerald-600"
                      }`}>
                        {eq.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                        {eq.description || `Browse specialized ${eq.name} equipment.`}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                      <span className={isSelected ? "text-emerald-600" : "text-slate-600"}>
                        {isSelected ? "Active Selection" : "Click to view products"}
                      </span>
                      <ArrowRight className={`w-3.5 h-3.5 transition-transform ${
                        isSelected ? "translate-x-1 text-emerald-600" : "group-hover:translate-x-1 text-slate-400"
                      }`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Associated Products Section */}
        {selectedEquipment && (
          <div className="mt-12 pt-8 border-t border-slate-200/80 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                  <ShoppingBag className="w-6 h-6 text-emerald-600" />
                  Available {selectedEquipment.name}
                </h2>
                <p className="text-sm text-slate-500">
                  In-stock products categorized under {selectedEquipment.name}
                </p>
              </div>
              <span className="text-xs font-medium px-3 py-1 bg-slate-100 text-slate-700 rounded-full w-fit">
                {products.length} {products.length === 1 ? "Product" : "Products"} Available
              </span>
            </div>

            {/* Products Loading State */}
            {loadingProducts && (
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

            {/* Products Empty State */}
            {!loadingProducts && products.length === 0 && (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 shadow-xs space-y-3 max-w-md mx-auto">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <Package className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-800">
                  No Products in this Category
                </h4>
                <p className="text-xs text-slate-500">
                  We are currently updating our inventory for {selectedEquipment.name}. Please check back shortly.
                </p>
              </div>
            )}

            {/* Products Grid */}
            {!loadingProducts && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => {
                  const productImage = Array.isArray(product.product_images)
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
                          src={productImage || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60"}
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
                          <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                            {product.description || "Premium athletic gear built for performance."}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div>
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
        )}
      </div>
    </div>
  );
}

export default Equipment;
