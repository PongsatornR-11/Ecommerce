import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useEcomStore from "../store/ecom-store";
import {
  ShoppingBag,
  UserRound,
  ChevronDown,
  LogOut,
  Package,
  ShieldCheck,
  Menu,
  X,
  Search,
  Sparkles,
  Layers,
  Truck
} from "lucide-react";

const MainNav = () => {
  const carts = useEcomStore((state) => state.carts);
  const user = useEcomStore((state) => state.user);
  const categories = useEcomStore((state) => state.categories);
  const getCategory = useEcomStore((state) => state.getCategory);
  const logout = useEcomStore((state) => state.actionLogout);
  const searchQuery = useEcomStore((state) => state.searchQuery);
  const setSearchQuery = useEcomStore((state) => state.setSearchQuery);
  const setIsCartOpen = useEcomStore((state) => state.setIsCartOpen);

  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery || "");

  useEffect(() => {
    getCategory();
  }, []);

  const totalCartCount = carts.reduce((sum, item) => sum + (item.count || 1), 0);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    navigate(`/shop?text=${encodeURIComponent(searchInput)}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-xl">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-700 to-purple-900 text-indigo-100 text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center space-x-2 border-b border-indigo-700/50">
        <Truck className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
        <span>Free express delivery on orders over $50 | Use code <span className="text-amber-300 font-bold">FREESHIP</span></span>
      </div>

      {/* Main Navbar */}
      <nav className="bg-slate-900/95 backdrop-blur-md text-slate-100 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center space-x-4">
            
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2.5 text-xl font-extrabold tracking-tight text-white hover:opacity-90 transition-opacity flex-shrink-0"
            >
              <div className="bg-gradient-to-tr from-indigo-600 to-purple-500 text-white p-2 rounded-xl shadow-md shadow-indigo-500/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                ShopSphere
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-slate-800 text-indigo-400 font-semibold"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-slate-800 text-indigo-400 font-semibold"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`
                }
              >
                Shop
              </NavLink>

              {/* Category Dropdown */}
              {categories && categories.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                    onBlur={() => setTimeout(() => setCategoryMenuOpen(false), 200)}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all"
                  >
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>Categories</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoryMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {categoryMenuOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-lg border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setCategoryMenuOpen(false);
                            navigate(`/shop?category=${cat.id}`);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors"
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-sm relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="w-full bg-slate-800/90 text-slate-100 text-xs rounded-full pl-9 pr-4 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </form>

            {/* Right Action Icons & Profile */}
            <div className="hidden sm:flex items-center space-x-3">
              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center space-x-1"
                title="View Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {totalCartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-extrabold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-pulse shadow-md">
                      {totalCartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium pl-1">Cart</span>
              </button>

              {/* User Account / Auth Buttons */}
              {user ? (
                <div className="relative">
                  <div className="flex items-center space-x-2">
                    {user.role === "admin" && (
                      <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                          `flex items-center space-x-1 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg border transition-all ${
                            isActive
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              : "border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                          }`
                        }
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>Admin</span>
                      </NavLink>
                    )}

                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
                        {(user.email || user.name || "U")[0].toUpperCase()}
                      </div>
                      <span className="max-w-[100px] truncate text-slate-200">{user.email || user.name}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                    </button>
                  </div>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl py-1.5 z-50 text-xs">
                      <div className="px-4 py-2 border-b border-slate-700/50">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">Signed in as</p>
                        <p className="font-bold text-slate-200 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/user/history"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-slate-200 hover:bg-slate-700/80 transition-colors"
                      >
                        <Package className="w-4 h-4 text-indigo-400" />
                        <span>Order History</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2.5 w-full text-left px-4 py-2.5 text-red-400 hover:bg-slate-700/80 transition-colors"
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
                    className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    Log In
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="px-3.5 py-1.5 text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition-all shadow-md shadow-indigo-600/20"
                  >
                    Register
                  </NavLink>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-slate-300 hover:text-white"
              >
                <ShoppingBag className="w-6 h-6" />
                {totalCartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {totalCartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-5 space-y-3">
            {/* Search form in mobile drawer */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl pl-9 pr-4 py-2.5 border border-slate-700 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </form>

            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Shop
            </NavLink>

            {user ? (
              <div className="pt-2 border-t border-slate-800 space-y-1">
                {user.role === "admin" && (
                  <NavLink
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-amber-400 hover:bg-slate-800"
                  >
                    Admin Dashboard
                  </NavLink>
                )}
                <NavLink
                  to="/user/history"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Order History
                </NavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-slate-800"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="pt-2 grid grid-cols-2 gap-2 border-t border-slate-800">
                <NavLink
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 border border-slate-700"
                >
                  Log In
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default MainNav;
