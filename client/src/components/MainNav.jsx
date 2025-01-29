//rafce

import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useEcomStore from "../store/ecom-store";
import { Github } from 'lucide-react'
import { UserRound, ChevronDown } from 'lucide-react'


const MainNav = () => {

  const carts = useEcomStore((state) => state.carts)
  const user = useEcomStore((state) => state.user)
  const logout = useEcomStore((state) => state.actionLogout)


  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  }
  return (
    <nav className="bg-gray-300 shadow-md">
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
                  ? "bg-gray-400 px-5 h-full flex items-center text-sm font-medium hover:bg-gray-400 transition-all hover:duration-200"
                  : "px-5 h-full flex items-center text-sm font-medium hover:bg-gray-400 transition-all hover:duration-200"
              }
            >
              Home
            </NavLink>

            <NavLink
              to={"shop"}
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-400 px-5 h-full flex items-center text-sm font-medium hover:bg-gray-400 transition-all hover:duration-200"
                  : "px-5 h-full flex items-center text-sm font-medium hover:bg-gray-400 transition-all hover:duration-200"
              }
            >
              Shop
            </NavLink>
            {/* badge */}

            <NavLink
              to={"/cart"}
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-400 px-5 h-full flex items-center text-sm font-medium hover:bg-gray-400 transition-all hover:duration-200 relative"
                  : "px-5 h-full flex items-center text-sm font-medium hover:bg-gray-400 transition-all hover:duration-200 relative"
              }>
              Cart
              {carts.length > 0 && (
                <span className="absolute -top-0 -right-0 bg-red-500 text-white px-2 rounded-full">
                  {carts.length}
                </span>
              )}
            </NavLink>

          </div>

          {
            user
              ? <div className="hover:bg-gray-400 transition-all hover:duration-200">
                <button
                  onClick={toggleDropdown}
                  className="px-3 h-full gap-1 flex items-center font-medium ">
                  <UserRound size={24} />
                  <ChevronDown size={20} />
                </button>

                {
                  isOpen && ( // if isOpen is true, then render the dropdown
                    <div className="absolute mt-2 top-14 bg-gray-300 shadow-md">
                      <Link to={'/user/history'} className="w-18 block text-sm font-medium px-2 py-2 hover:bg-gray-400 transition-all hover:duration-200">
                        History
                      </Link>
                      <button onClick={() => logout()} className="w-18 block text-sm font-medium px-2 py-2 hover:bg-gray-400 transition-all hover:duration-200">
                        Logout
                      </button>
                    </div>
                  )}
              </div>
              : <div className="flex items-center">
                <NavLink
                  to={"/register"}
                  className={({ isActive }) =>
                    isActive
                  ? "bg-gray-400 px-5 h-full flex items-center text-sm font-medium hover:bg-gray-400 transition-all hover:duration-200 relative"
                  : "px-5 h-full flex items-center text-sm font-medium hover:bg-gray-400 transition-all hover:duration-200 relative"
                  }>
                  Register
                </NavLink>
                <NavLink
                  to={"/login"}
                  className={({ isActive }) =>
                    isActive
                  ? "bg-gray-400 px-5 h-full flex items-center text-sm font-medium hover:bg-gray-400 transition-all hover:duration-200 relative"
                  : "px-5 h-full flex items-center text-sm font-medium hover:bg-gray-400 transition-all hover:duration-200 relative"
                }>
                  Login
                </NavLink>
              </div>
          }



        </div>
      </div>
    </nav>
  );
};

export default MainNav;
