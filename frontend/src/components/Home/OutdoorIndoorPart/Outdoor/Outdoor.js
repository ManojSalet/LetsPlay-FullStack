import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import img1 from "../../../../images/Outdoor 1.png";
import img2 from "../../../../images/Outdoor 2.png";
import batsman from "../../../../images/batsman-standing-cricket- 1.png";

const Outdoor = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-6 sm:p-8 border border-emerald-100/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Content */}
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
            Field & Court
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Outdoor Sports Gear
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-md">
              Engineered for endurance, speed, and precision in all weather conditions. Cricket, football, tennis, and more.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-xs">
            <div className="bg-white rounded-xl p-2.5 shadow-sm border border-emerald-100 flex items-center justify-center h-24 overflow-hidden">
              <img src={img1} alt="Cricket" className="h-full object-contain" />
            </div>
            <div className="bg-white rounded-xl p-2.5 shadow-sm border border-emerald-100 flex items-center justify-center h-24 overflow-hidden">
              <img src={img2} alt="Football" className="h-full object-contain" />
            </div>
          </div>

          <div>
            <Link
              to="/category"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <span>Explore All Outdoor Gear</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Feature Art */}
        <div className="w-64 sm:w-80 flex-shrink-0 flex items-center justify-center">
          <img
            src={batsman}
            alt="Outdoor Sports Athlete"
            className="w-full h-auto max-h-72 object-contain drop-shadow-md"
          />
        </div>
      </div>
    </section>
  );
};

export default Outdoor;
