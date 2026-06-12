import React from "react";
import { NavLink } from "react-router-dom";
import useEcomStore from "../../store/ecom-store";
import {
  LayoutDashboard,
  Bolt,
  ChartColumnStacked,
  PackageSearch,
  ShoppingBasket,
  LogOut,
  ShieldAlert
} from "lucide-react";

const SidebarAdmin = () => {
  const logout = useEcomStore((state) => state.actionLogout);

  return (
    <div className="bg-slate-900 border-r border-slate-800 text-slate-200 w-64 flex flex-col h-screen flex-none">
      {/* Header Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-2.5">
        <div className="bg-indigo-600/10 text-indigo-500 p-1.5 rounded-lg border border-indigo-500/25">
          <ShieldAlert size={18} />
        </div>
        <span className="font-extrabold text-sm text-slate-50 uppercase tracking-wider">
          Admin Portal
        </span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <NavLink
          to={"/admin"}
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`
          }
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to={"manage"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`
          }
        >
          <Bolt size={18} />
          <span>Manage Users</span>
        </NavLink>
        <NavLink
          to={"category"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`
          }
        >
          <ChartColumnStacked size={18} />
          <span>Manage Categories</span>
        </NavLink>
        <NavLink
          to={"product"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`
          }
        >
          <ShoppingBasket size={18} />
          <span>Manage Products</span>
        </NavLink>
        <NavLink
          to={"orders"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`
          }
        >
          <PackageSearch size={18} />
          <span>Manage Orders</span>
        </NavLink>
      </nav>

      {/* Footer logout */}
      <div className="p-4 border-t border-slate-800">
        <NavLink
          to={"/"}
          onClick={() => logout()}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </NavLink>
      </div>
    </div>
  );
};

export default SidebarAdmin;
