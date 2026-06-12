import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useEcomStore from "../store/ecom-store";
import { Github, UserRound, ChevronDown, ShoppingCart, LogOut, History, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MainNav = () => {
  const carts = useEcomStore((state) => state.carts);
  const user = useEcomStore((state) => state.user);
  const logout = useEcomStore((state) => state.actionLogout);

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="glass sticky top-0 z-50 shadow-sm border-b border-slate-200/40 bg-white/75 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Left section: Logo & Main Navigation */}
          <div className="flex items-center gap-6">
            <Link 
              to={"https://github.com/WomenOnTOP"} 
              className="flex items-center text-slate-700 hover:text-indigo-600 transition-colors p-2 rounded-xl hover:bg-slate-100/50"
            >
              <Github size={26} />
            </Link>

            <div className="flex items-center gap-2">
              <NavLink
                to={"/"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/40"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to={"shop"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/40"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`
                }
              >
                Shop
              </NavLink>
            </div>
          </div>

          {/* Right section: Cart, Admin, User Dropdown */}
          <div className="flex items-center gap-4">
            <NavLink
              to={"/cart"}
              className={({ isActive }) =>
                `p-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 relative border ${
                  isActive
                    ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                    : "border-slate-200/60 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`
              }
            >
              <ShoppingCart size={18} />
              <span className="hidden sm:inline">Cart</span>
              {carts.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                  {carts.length}
                </span>
              )}
            </NavLink>

            {user ? (
              <div className="relative flex items-center gap-2">
                {user.role === 'admin' && (
                  <NavLink 
                    to='/admin' 
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-rose-100 bg-rose-50/50 text-rose-600 hover:bg-rose-50 transition-all"
                  >
                    <ShieldAlert size={16} />
                    <span>Admin</span>
                  </NavLink>
                )}
                
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200/60 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium text-sm transition-all"
                  >
                    <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <UserRound size={14} />
                    </div>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 p-1.5 z-50"
                      >
                        <Link 
                          to={'/user/history'} 
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2.5 w-full rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all"
                        >
                          <History size={16} />
                          <span>History</span>
                        </Link>
                        <hr className="my-1 border-slate-100" />
                        <button 
                          onClick={() => {
                            setIsOpen(false);
                            logout();
                          }} 
                          className="flex items-center gap-2.5 w-full rounded-xl px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all"
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink
                  to={"/register"}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-slate-200 text-slate-900"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`
                  }
                >
                  Register
                </NavLink>
                <NavLink
                  to={"/login"}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                        : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100/70"
                    }`
                  }
                >
                  Login
                </NavLink>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default MainNav;
