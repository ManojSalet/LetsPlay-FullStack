import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import img1 from "../../../../images/Outdoor 1.png";
import img2 from "../../../../images/Outdoor 1.png";
import chess from "../../../../images/Chess 1.png";

const Indoor = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-6 sm:p-8 border border-indigo-100/60 shadow-sm flex flex-col md:flex-row-reverse items-center justify-between gap-8">
        {/* Right Content */}
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold uppercase tracking-wider">
            Arena & Club
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Indoor Sports & Games
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-md">
              Focus, agility, and precision. Badminton, table tennis, squash, chess, and indoor arena equipment.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-xs">
            <div className="bg-white rounded-xl p-2.5 shadow-sm border border-indigo-100 flex items-center justify-center h-24 overflow-hidden">
              <img src={img1} alt="Indoor Game 1" className="h-full object-contain" />
            </div>
            <div className="bg-white rounded-xl p-2.5 shadow-sm border border-indigo-100 flex items-center justify-center h-24 overflow-hidden">
              <img src={img2} alt="Indoor Game 2" className="h-full object-contain" />
            </div>
          </div>

          <div>
            <Link
              to="/category"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <span>Explore All Indoor Gear</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Left Feature Art */}
        <div className="w-64 sm:w-80 flex-shrink-0 flex items-center justify-center">
          <img
            src={chess}
            alt="Indoor Games"
            className="w-full h-auto max-h-72 object-contain drop-shadow-md"
          />
        </div>
      </div>
    </section>
  );
};

export default Indoor;
