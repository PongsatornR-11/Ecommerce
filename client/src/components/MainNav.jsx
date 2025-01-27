//rafce

import React from "react";
import { Link, NavLink } from "react-router-dom";
import useEcomStore from "../store/ecom-store";
import { Github } from 'lucide-react'
import { UserRound } from 'lucide-react'


const MainNav = () => {

  const carts = useEcomStore((state) => state.carts)
  return (
    <nav className="bg-gray-300 shadow-md hover:bg-gray-400 transition-all hover:duration-200">
      <div className="mx-auto">
        <div className="flex justify-between h-16">
          <div className="flex items-center">

            {/* left */}
            <Link to={"https://github.com/WomenOnTOP"} className="text-2xl font-bold px-8">
              <Github size={32} />
            </Link>

            <NavLink
              to={"/"}
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-400 px-5 h-full flex items-center text-sm font-medium hover:bg-gray-300 transition-all hover:duration-200"
                  : "px-5 h-full flex items-center text-sm font-medium hover:bg-gray-300 transition-all hover:duration-200"
              }
            >
              Home
            </NavLink>

            <NavLink
              to={"shop"}
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-400 px-5 h-full flex items-center text-sm font-medium hover:bg-gray-300 transition-all hover:duration-200"
                  : "px-5 h-full flex items-center text-sm font-medium hover:bg-gray-300 transition-all hover:duration-200"
              }
            >
              Shop
            </NavLink>
            {/* badge */}

            <NavLink
              to={"/cart"}
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-400 px-5 h-full flex items-center text-sm font-medium hover:bg-gray-300 transition-all hover:duration-200 relative"
                  : "px-5 h-full flex items-center text-sm font-medium hover:bg-gray-300 transition-all hover:duration-200 relative"
              }>
              Cart
              {carts.length > 0 && (
                <span className="absolute -top-0 -right-0 bg-red-500 text-white px-2 rounded-full">
                  {carts.length}
                </span>
              )}
            </NavLink>

          </div>


          <div className="flex items-center gap-4">
            <button
              className="px-5 h-full flex items-center text-sm font-medium hover:bg-gray-200 transition-all hover:duration-200">
              <UserRound size={32} />
            </button>
          </div>


          {/* <div className="flex items-center">
            <NavLink
              to={"/register"}
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-400 px-5 h-full flex items-center text-sm font-medium hover:bg-gray-300 transition-all hover:duration-200 relative"
                  : "px-5 h-full flex items-center text-sm font-medium hover:bg-gray-300 transition-all hover:duration-200 relative"
              }>
              Register
            </NavLink>
            <NavLink
              to={"/login"}
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-400 px-5 h-full flex items-center text-sm font-medium hover:bg-gray-300 transition-all hover:duration-200 relative"
                  : "px-5 h-full flex items-center text-sm font-medium hover:bg-gray-300 transition-all hover:duration-200 relative"
              }
            >
              Login
            </NavLink>
          </div> */}
        </div>
      </div>
    </nav>
  );
};

export default MainNav;
