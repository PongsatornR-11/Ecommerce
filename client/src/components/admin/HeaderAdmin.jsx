import React from "react";
import { NavLink } from "react-router-dom";

const HeaderAdmin = () => {
  return (
    <div>
      <header className="bg-[#00ADB5] h-16 flex items-center justify-between">
        <span className="font-bold px-6 text-2xl">Manage Orders</span>
        <nav className="flex h-full items-center">
          <NavLink
            to={'/'}
            className={`h-full w-20 font-bold flex items-center justify-center hover:bg-[#222831] hover:duration-200 hover:text-[#00ADB5]`}
          >Home</NavLink>
          <NavLink
            to={'/shop'}
            className={`h-full w-20 font-bold flex items-center justify-center hover:bg-[#222831] hover:duration-200 hover:text-[#00ADB5]`}
          >Shop</NavLink>
        </nav>
      </header>
    </div>
  );
};

export default HeaderAdmin;
