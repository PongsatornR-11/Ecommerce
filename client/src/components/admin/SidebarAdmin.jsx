import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import useEcomStore from "../../store/ecom-store";
import {
  LayoutDashboard,
  Users,
  Layers,
  Package,
  ShoppingBag,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-toastify";

const SidebarAdmin = () => {
  const logout = useEcomStore((state) => state.actionLogout);
  const user = useEcomStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info("Logged out from admin panel");
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
    { label: "Products", to: "/admin/product", icon: Package },
    { label: "Categories", to: "/admin/category", icon: Layers },
    { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
    { label: "Users & Access", to: "/admin/manage", icon: Users },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen border-r border-slate-800 shrink-0">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800 bg-slate-950/40">
        <Link to="/admin" className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black shadow-md">
            S
          </div>
          <div>
            <h1 className="font-extrabold text-white text-sm tracking-tight">ShopSphere</h1>
            <span className="text-[10px] font-semibold tracking-wider text-indigo-400 uppercase">
              Admin Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Management
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* User Info & Footer Actions */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/30 space-y-2">
        <Link
          to="/"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Store</span>
          </span>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">⌘S</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
