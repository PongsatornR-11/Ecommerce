import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useEcomStore from "../store/ecom-store";
import { ShoppingBag, UserRound, ChevronDown, LogOut, Package, ShieldCheck, Menu, X } from "lucide-react";

const MainNav = () => {
  const carts = useEcomStore((state) => state.carts);
  const user = useEcomStore((state) => state.user);
  const logout = useEcomStore((state) => state.actionLogout);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = carts.reduce((sum, item) => sum + (item.count || 1), 0);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-slate-900 text-slate-100 shadow-lg sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Main Nav */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-xl font-extrabold tracking-tight text-white hover:text-indigo-400 transition-colors">
              <span className="bg-indigo-600 text-white p-1.5 rounded-lg">
                <ShoppingBag className="w-5 h-5" />
              </span>
              <span>ShopSphere</span>
            </Link>

            <div className="hidden md:flex space-x-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-slate-800 text-indigo-400"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-slate-800 text-indigo-400"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                Shop
              </NavLink>
            </div>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Link */}
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative p-2 rounded-lg transition-colors flex items-center space-x-1 ${
                  isActive
                    ? "bg-slate-800 text-indigo-400"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-sm font-medium">Cart</span>
              {totalCartCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1 -translate-y-1 bg-indigo-600 rounded-full animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </NavLink>

            {user ? (
              <div className="relative">
                <div className="flex items-center space-x-2">
                  {user.role === "admin" && (
                    <NavLink
                      to="/admin"
                      className={({ isActive }) =>
                        `flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md border ${
                          isActive
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : "border-slate-700 text-slate-300 hover:bg-slate-800"
                        }`
                      }
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>Admin</span>
                    </NavLink>
                  )}

                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <UserRound className="w-4 h-4 text-indigo-400" />
                    <span className="max-w-[120px] truncate">{user.email || user.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                </div>

                {/* User Dropdown */}
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1 z-50 text-sm">
                    <Link
                      to="/user/history"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2.5 text-slate-200 hover:bg-slate-700 transition-colors"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      <span>Order History</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2.5 text-red-400 hover:bg-slate-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <NavLink
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-sm"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center space-x-2">
            <NavLink to="/cart" className="relative p-2 text-slate-300">
              <ShoppingBag className="w-6 h-6" />
              {totalCartCount > 0 && (
                <span className="absolute top-1 right-1 bg-indigo-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {totalCartCount}
                </span>
              )}
            </NavLink>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Home
          </NavLink>
          <NavLink
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Shop
          </NavLink>
          {user ? (
            <>
              {user.role === "admin" && (
                <NavLink
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-amber-400 hover:bg-slate-800"
                >
                  Admin Dashboard
                </NavLink>
              )}
              <NavLink
                to="/user/history"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Order History
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-slate-800"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="pt-2 space-y-2 border-t border-slate-800">
              <NavLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 font-medium"
              >
                Log In
              </NavLink>
              <NavLink
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
              >
                Register
              </NavLink>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default MainNav;
