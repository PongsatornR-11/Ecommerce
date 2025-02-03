//rafce

import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useEcomStore from "../store/ecom-store";
import { Github, UserRound, ChevronDown } from 'lucide-react'


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
            <Link to={"https://github.com/WomenOnTOP"} className="h-full items-center text-2xl font-bold w-20 flex justify-center hover:text-white hover:bg-gray-500 transition-all hover:duration-200">
              <Github size={32} />
            </Link>

            <NavLink
              to={"/"}
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-500 w-20 h-full justify-center flex items-center text-sm font-medium hover:text-white hover:bg-gray-500 transition-all hover:duration-200"
                  : "w-20 h-full flex justify-center items-center text-sm font-medium hover:text-white hover:bg-gray-500 transition-all hover:duration-200"
              }
            >
              Home
            </NavLink>

            <NavLink
              to={"shop"}
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-500 w-20 justify-center h-full flex items-center text-sm font-medium hover:text-white hover:bg-gray-500 transition-all hover:duration-200"
                  : "w-20 justify-center h-full flex items-center text-sm font-medium hover:text-white hover:bg-gray-500 transition-all hover:duration-200"
              }
            >
              Shop
            </NavLink>
            {/* badge */}

            <NavLink
              to={"/cart"}
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-500 text-white w-20 justify-center h-full flex items-center text-sm font-medium hover:text-white hover:bg-gray-500 transition-all hover:duration-200 relative"
                  : "w-20 justify-center h-full flex items-center text-sm font-medium hover:text-white hover:bg-gray-500 transition-all hover:duration-200 relative"
              }>
              Cart
              {carts.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white px-2 rounded-full">
                  {carts.length}
                </span>
              )}
            </NavLink>
          </div>

          {
            user
              ? <div className="relative flex">
                {
                  user.role == 'admin'
                    ? <NavLink to='/admin' className="flex items-center justify-center w-20 h-full text-sm font-medium hover:text-white hover:bg-gray-500 transition-all hover:duration-200">
                      Admin
                    </NavLink>
                    : ''
                }
                <button
                  onClick={() => toggleDropdown()}
                  className="hover:bg-gray-500 transition-all w-20 hover:duration-200 px-3 h-full gap-1 flex justify-center items-center font-medium hover:text-white">
                  <UserRound size={24} />
                  <ChevronDown size={20} />
                </button>

                {
                  isOpen && ( // if isOpen is true, then render the dropdown
                    <div className="absolute mt-2 right-0 top-14 bg-gray-300 shadow-md z-50 w-20">
                      <Link to={'/user/history'} className="w-full text-center hover:text-white block text-sm font-medium px-2 py-2 hover:bg-gray-500 transition-all hover:duration-200">
                        History
                      </Link>
                      <button onClick={() => logout()} className="w-full block hover:text-white text-sm font-medium px-2 py-2 hover:bg-gray-500 transition-all hover:duration-200">
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
