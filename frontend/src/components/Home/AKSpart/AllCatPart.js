import React from "react";
import { Link } from "react-router-dom";
import kidsImg from "../../../images/kids.jpeg";
import allsportImg from "../../../images/all sports.jpeg";
import menImg from "../../../images/women.jpeg";

const AllCatPart = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Kids Card */}
        <Link
          to="/category"
          className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 bg-white border border-slate-100 flex flex-col justify-between"
        >
          <div className="h-56 overflow-hidden">
            <img
              src={kidsImg}
              alt="Kids Sports"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Kids Collection
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Dream Big, Start Young</p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
              Explore →
            </span>
          </div>
        </Link>

        {/* All Sports Card */}
        <Link
          to="/category"
          className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 bg-white border border-slate-100 flex flex-col justify-between"
        >
          <div className="h-56 overflow-hidden">
            <img
              src={allsportImg}
              alt="All Sports Gear"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                All Sports Equipment
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Run Fast, Achieve More</p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
              Explore →
            </span>
          </div>
        </Link>

        {/* Adults Card */}
        <Link
          to="/category"
          className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 bg-white border border-slate-100 flex flex-col justify-between"
        >
          <div className="h-56 overflow-hidden">
            <img
              src={menImg}
              alt="Adult Performance Gear"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Pro & Adults Series
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Built for Peak Performance</p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
              Explore →
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default AllCatPart;
