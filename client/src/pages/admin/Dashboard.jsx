import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useEcomStore from "../../store/ecom-store";
import { getOrdersAdmin, getListAllUsers } from "../../api/admin";
import { formatPrice } from "../../utils/number";
import { formatDate } from "../../utils/datetimeformat";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Layers,
  ArrowRight,
} from "lucide-react";

const Dashboard = () => {
  const token = useEcomStore((state) => state.token);
  const products = useEcomStore((state) => state.products);
  const getProduct = useEcomStore((state) => state.getProduct);
  const categories = useEcomStore((state) => state.categories);
  const getCategory = useEcomStore((state) => state.getCategory);

  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProduct();
    getCategory();
    if (token) {
      setIsLoading(true);
      Promise.all([getOrdersAdmin(token), getListAllUsers(token)])
        .then(([orderRes, userRes]) => {
          setOrders(orderRes.data || []);
          setUsers(userRes.data || []);
        })
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false));
    }
  }, [token]);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.cartTotal || 0), 0);
  const lowStockProducts = products.filter((p) => p.quantity <= 25);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Executive Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time analytics and inventory management metrics.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/product"
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Package className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Revenue
            </span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              ฿{formatPrice(totalRevenue)}
            </h3>
            <div className="flex items-center space-x-1 text-xs text-emerald-600 font-bold mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Live Synced</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Orders
            </span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              {orders.length}
            </h3>
            <div className="flex items-center space-x-1 text-xs text-indigo-600 font-bold mt-2">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{orders.filter((o) => o.orderStatus === "Completed").length} Completed</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Products
            </span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              {products.length}
            </h3>
            <div className="flex items-center space-x-1 text-xs text-slate-500 font-medium mt-2">
              <span>Across {categories.length} Categories</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Users */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Registered Users
            </span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              {users.length}
            </h3>
            <div className="flex items-center space-x-1 text-xs text-indigo-600 font-bold mt-2">
              <span>{users.filter((u) => u.role === "admin").length} Admins</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Stock Watch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Customer Orders</h3>
              <p className="text-xs text-slate-500">Live order stream and fulfillment statuses.</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No customer orders placed yet.
                    </td>
                  </tr>
                ) : (
                  orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 pl-2 font-mono font-bold text-slate-900">
                        #{order.id}
                      </td>
                      <td className="py-3 truncate max-w-[160px]">
                        {order.orderedBy?.email || "Guest"}
                      </td>
                      <td className="py-3 font-extrabold text-slate-900">
                        ฿{formatPrice(order.cartTotal)}
                      </td>
                      <td className="py-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700">
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 pr-2 text-slate-400">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Low Stock Alert & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Low Stock Alert */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 text-amber-600 font-bold text-sm pb-3 border-b border-slate-100">
              <AlertTriangle className="w-4 h-4" />
              <span>Inventory Stock Watch</span>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {lowStockProducts.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  All inventory stock levels healthy.
                </p>
              ) : (
                lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div className="truncate max-w-[150px]">
                      <span className="font-bold text-slate-900 block truncate">{p.title}</span>
                      <span className="text-slate-400 text-[10px]">SKU #{p.id}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg font-black bg-amber-100 text-amber-800 text-xs">
                      {p.quantity} left
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md space-y-4">
            <h4 className="font-bold text-sm">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/admin/product"
                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-center text-xs font-semibold backdrop-blur-md transition-colors"
              >
                Products
              </Link>
              <Link
                to="/admin/category"
                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-center text-xs font-semibold backdrop-blur-md transition-colors"
              >
                Categories
              </Link>
              <Link
                to="/admin/orders"
                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-center text-xs font-semibold backdrop-blur-md transition-colors"
              >
                Orders
              </Link>
              <Link
                to="/admin/manage"
                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-center text-xs font-semibold backdrop-blur-md transition-colors"
              >
                Users
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
