//rafce

import React from "react";
import { Link } from "react-router-dom";
import useEcomStore from "../store/ecom-store";

const MainNav = () => {

  const carts = useEcomStore((state) => state.carts)
  return (
    <nav className="bg-gray-300 hover:bg-gray-400 transition-all hover:duration-200">
      <div className="mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-4">
            {/* left */}
            <Link to={"/"} className="text-2xl font-bold">
              LOGO
            </Link>
            <Link to={"/"}>Home</Link>
            <Link to={"shop"}>Shop</Link>
            {/* badge */}

            <Link to={"cart"} className="relative">
              Cart
              {carts.length > 0 && (
                <span className="absolute -top-3 -right-5 bg-red-500 text-white px-2 rounded-full">
                  {carts.length}
                </span>
              )}
            </Link>

          </div>

          <div className="flex items-center gap-4">
            {/* right */}
            <Link to={"register"}>Register</Link>
            <Link to={"login"}>Login</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNav;
