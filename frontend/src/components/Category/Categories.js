import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Home, 
  ChevronRight, 
  Search, 
  Trophy, 
  Activity, 
  Layers, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { getAllSports } from "../../API/apiService";

const Categories = () => {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSports = async () => {
      try {
        setLoading(true);
        const data = await getAllSports();
        if (data && Array.isArray(data.sports)) {
          setSports(data.sports);
        } else {
          setSports([]);
        }
      } catch (err) {
        console.error("Error fetching sports:", err);
        setError("Failed to load sports categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSports();
  }, []);

  // Filter sports based on category tab & search query
  const filteredSports = useMemo(() => {
    return sports.filter((sport) => {
      const categoryName = sport.category?.name?.toLowerCase() || "";
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "outdoor" && categoryName.includes("outdoor")) ||
        (activeTab === "indoor" && categoryName.includes("indoor"));

      const matchesSearch =
        sport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sport.description &&
          sport.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesTab && matchesSearch;
    });
  }, [sports, activeTab, searchQuery]);

  const outdoorCount = useMemo(() => {
    return sports.filter((s) => s.category?.name?.toLowerCase().includes("outdoor")).length;
  }, [sports]);

  const indoorCount = useMemo(() => {
    return sports.filter((s) => s.category?.name?.toLowerCase().includes("indoor")).length;
  }, [sports]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-sm font-medium text-slate-500 bg-white px-5 py-3 rounded-xl shadow-xs border border-slate-100">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-slate-600 hover:text-emerald-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
          <span className="text-slate-900 font-semibold">Categories</span>
        </nav>

        {/* Hero / Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-12 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wide uppercase border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Comprehensive Sports Catalog
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Explore All Sports Categories
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Find premium equipment, specialized accessories, and tournament-grade gear curated for athletes across every sporting discipline.
            </p>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-xs border border-slate-100">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>All Sports</span>
              <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-white/20 text-current">
                {sports.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("outdoor")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === "outdoor"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Outdoor Sports</span>
              <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-white/20 text-current">
                {outdoorCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("indoor")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === "indoor"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Indoor Sports</span>
              <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-white/20 text-current">
                {indoorCount}
              </span>
            </button>
          </div>

          {/* Instant Search Bar */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter sports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs animate-pulse p-4 space-y-4"
              >
                <div className="w-full h-48 bg-slate-200 rounded-xl" />
                <div className="h-5 bg-slate-200 rounded-md w-3/4" />
                <div className="h-4 bg-slate-200 rounded-md w-1/2" />
                <div className="h-10 bg-slate-200 rounded-xl w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredSports.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-xs space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Sports Found</h3>
            <p className="text-sm text-slate-500">
              We couldn't find any sports matching your current filter or search criteria.
            </p>
            <button
              onClick={() => {
                setActiveTab("all");
                setSearchQuery("");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Sports Grid */}
        {!loading && !error && filteredSports.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSports.map((sport) => {
              const imageUrl = Array.isArray(sport.sport_image)
                ? sport.sport_image[0]
                : sport.sport_image;
              const isOutdoor = sport.category?.name?.toLowerCase().includes("outdoor");

              return (
                <div
                  key={sport._id}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative overflow-hidden aspect-4/3 bg-slate-100">
                    <img
                      src={imageUrl || "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=60"}
                      alt={sport.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=60";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-md shadow-xs ${
                          isOutdoor
                            ? "bg-emerald-500/90 text-white"
                            : "bg-indigo-500/90 text-white"
                        }`}
                      >
                        {sport.category?.name || "General Sport"}
                      </span>
                    </div>

                    {/* Equipment Count Pill */}
                    {sport.equipment && sport.equipment.length > 0 && (
                      <div className="absolute bottom-3 left-3">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-900/75 text-white backdrop-blur-xs">
                          {sport.equipment.length} {sport.equipment.length === 1 ? "Equipment" : "Equipments"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        {sport.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                        {sport.description || `Browse quality gear, accessories, and professional kits for ${sport.name}.`}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <Link
                        to={`/equipment/${sport._id}`}
                        state={{ sportName: sport.name }}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-xs group-hover:shadow-md"
                      >
                        <span>Explore Equipment</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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

export default Categories;
