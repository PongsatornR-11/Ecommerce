import React from "react";
import { Link } from "react-router-dom";
import useEcomStore from "../../store/ecom-store";
import { useCurrentTime } from "../../utils/datetimeformat";
import { ExternalLink, ShieldCheck } from "lucide-react";

const HeaderAdmin = () => {
  const user = useEcomStore((state) => state.user);
  const currentTime = useCurrentTime();

  return (
    <header className="bg-white h-16 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs">
      {/* Left: Role / Context */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>System Role: Administrator</span>
        </div>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          Server Clock: {currentTime}
        </span>
      </div>

      {/* Right: Actions & User Avatar */}
      <div className="flex items-center space-x-4">
        <Link
          to="/shop"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <span>Live Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
            {user?.email?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-bold text-slate-800 block truncate max-w-[140px]">
              {user?.email || "admin@shopsphere.com"}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider block">
              Active
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
