import React from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Bolt,
  ChartColumnStacked,
  PackageSearch,
  LogOut,
} from "lucide-react";

const SidebarAdmin = () => {
  return (
    <div
      className="bg-[#393E46] text-[#EEEEEE] 
    w-64 flex flex-col h-screen"
    >
      <div
        className="h-24 bg-[#222831] 
        flex items-center justify-center text-2xl font-bold"
      >
        Admin Panel
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        <NavLink
          to={"/admin"}
          end
          className={({ isActive }) =>
            isActive
              ? "bg-[#222831] rounded-md px-4 py-2 text-white flex items-center"
              : "text-gray-300 px-4 py-2 hover:bg-gray-500 hover:text-white rounded flex items-center"
          }
        >
          <LayoutDashboard className="mr-2" />
          Dashboard
        </NavLink>
        <NavLink
          to={"manage"}
          className={({ isActive }) =>
            isActive
              ? "bg-[#222831] rounded-md px-4 py-2 text-white flex items-center"
              : "text-gray-300 px-4 py-2 hover:bg-gray-500 hover:text-white rounded flex items-center"
          }
        >
          <Bolt className="mr-2" />
          Manage
        </NavLink>
        <NavLink
          to={"category"}
          className={({ isActive }) =>
            isActive
              ? "bg-[#222831] rounded-md px-4 py-2 text-white flex items-center"
              : "text-gray-300 px-4 py-2 hover:bg-gray-500 hover:text-white rounded flex items-center"
          }
        >
          <ChartColumnStacked className="mr-2" />
          Category
        </NavLink>
        <NavLink
          to={"product"}
          className={({ isActive }) =>
            isActive
              ? "bg-[#222831] rounded-md px-4 py-2 text-white flex items-center"
              : "text-gray-300 px-4 py-2 hover:bg-gray-500 hover:text-white rounded flex items-center"
          }
        >
          <PackageSearch className="mr-2" />
          Product
        </NavLink>
      </nav>

      <div>
        <NavLink
          // to={''}  // wait path
          className={({ isActive }) =>
            isActive
              ? "bg-[#222831] rounded-md px-4 py-2 text-white flex items-center"
              : "text-gray-300 px-4 py-2 hover:bg-gray-500 hover:text-white rounded flex items-center"
          }
        >
          <LogOut className="mr-2" />
          Logout
        </NavLink>
      </div>
    </div>
  );
};

export default SidebarAdmin;
