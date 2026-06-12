import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../../utils/useTheme";
import { Sun, Moon, Monitor, ChevronDown, Home, ShoppingBag } from "lucide-react";

const HeaderAdmin = () => {
  const location = useLocation();
  const [theme, setTheme] = useTheme();
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path.includes('/admin/manage')) return 'Manage Users';
    if (path.includes('/admin/category')) return 'Manage Categories';
    if (path.includes('/admin/product')) return 'Manage Products';
    if (path.includes('/admin/orders')) return 'Manage Orders';
    return 'Admin Panel';
  };

  return (
    <header className="glass bg-white/75 dark:bg-slate-900/75 border-b border-slate-200/40 dark:border-slate-800/80 backdrop-blur-md h-16 flex items-center justify-between px-6 z-40 transition-colors duration-200">
      {/* Dynamic Title */}
      <h1 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg tracking-tight">
        {getHeaderTitle()}
      </h1>

      {/* Navigation & Theme Toggle */}
      <div className="flex items-center gap-4">
        <nav className="flex items-center gap-2">
          <NavLink
            to={'/'}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all"
          >
            <Home size={14} />
            <span className="hidden sm:inline">Home</span>
          </NavLink>
          <NavLink
            to={'/shop'}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all"
          >
            <ShoppingBag size={14} />
            <span className="hidden sm:inline">Shop</span>
          </NavLink>
        </nav>

        {/* Theme Selector */}
        <div className="relative">
          <button 
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl border border-slate-200/60 dark:border-slate-800 text-slate-650 dark:text-slate-350 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all"
            title="Choose theme"
          >
            {theme === 'light' && <Sun size={15} className="text-amber-500" />}
            {theme === 'dark' && <Moon size={15} className="text-indigo-400" />}
            {theme === 'system' && <Monitor size={15} className="text-slate-500" />}
            <ChevronDown size={11} className={`transition-transform duration-200 ${isThemeOpen ? 'rotate-180' : ''} text-slate-400`} />
          </button>

          {isThemeOpen && (
            <>
              {/* Back drop to close */}
              <div className="fixed inset-0 z-40" onClick={() => setIsThemeOpen(false)} />
              
              <div className="absolute right-0 mt-2 w-32 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-xl p-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <button 
                  onClick={() => { setTheme('light'); setIsThemeOpen(false); }}
                  className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-xs font-semibold rounded-xl transition-colors ${
                    theme === 'light' 
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Sun size={13} className="text-amber-500" />
                  <span>Light</span>
                </button>
                <button 
                  onClick={() => { setTheme('dark'); setIsThemeOpen(false); }}
                  className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-xs font-semibold rounded-xl transition-colors ${
                    theme === 'dark' 
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Moon size={13} className="text-indigo-400" />
                  <span>Dark</span>
                </button>
                <button 
                  onClick={() => { setTheme('system'); setIsThemeOpen(false); }}
                  className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-xs font-semibold rounded-xl transition-colors ${
                    theme === 'system' 
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Monitor size={13} className="text-slate-500" />
                  <span>System</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
