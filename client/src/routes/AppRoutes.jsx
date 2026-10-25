import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Public pages
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Login from "../pages/auth/login";
import Register from "../pages/auth/Register";

// Lazy-loaded pages
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const Category = lazy(() => import("../pages/admin/Category"));
const Product = lazy(() => import("../pages/admin/Product"));
const EditProduct = lazy(() => import("../pages/admin/EditProduct"));
const Manage = lazy(() => import("../pages/admin/Manage"));
const ManageOrder = lazy(() => import("../pages/admin/ManageOrder"));
const HomeUser = lazy(() => import("../pages/user/HomeUser"));
const Payment = lazy(() => import("../pages/user/Payment"));
const History = lazy(() => import("../pages/user/History"));

// Layouts & Guards
import Layout from "../layouts/Layout";
import LayoutAdmin from "../layouts/LayoutAdmin";
import LayoutUser from "../layouts/LayoutUser";
import ProtectRouteUser from "./ProtectRouteUser";
import ProtectRouteAdmin from "./ProtectRouteAdmin";

const Lazy = ({ children }) => (
  <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center text-slate-400">Loading...</div>}>
    {children}
  </Suspense>
);

const router = createBrowserRouter([
  // public path
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "shop", element: <Shop /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },

  // admin path
  {
    path: "/admin",
    element: <ProtectRouteAdmin element={<LayoutAdmin />} />,
    children: [
      { index: true, element: <Lazy><Dashboard /></Lazy> },
      { path: "category", element: <Lazy><Category /></Lazy> },
      { path: "product", element: <Lazy><Product /></Lazy> },
      { path: "product/:id", element: <Lazy><EditProduct /></Lazy> },
      { path: "manage", element: <Lazy><Manage /></Lazy> },
      { path: "orders", element: <Lazy><ManageOrder /></Lazy> },
    ],
  },

  // user path
  {
    path: "/user",
    element: <ProtectRouteUser element={<LayoutUser />} />,
    children: [
      { index: true, element: <Lazy><HomeUser /></Lazy> }, 
      { path: "payment", element: <Lazy><Payment /></Lazy> },
      { path: "history", element: <Lazy><History /></Lazy> },
      { path: "shop", element: <Shop /> },
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
