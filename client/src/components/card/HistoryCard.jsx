import React, { useState, useEffect } from "react";
import { getOrders } from "../../api/user";
import useEcomStore from "../../store/ecom-store";
import { formatDate, formatTime } from "../../utils/datetimeformat";
import { formatPrice } from "../../utils/number";
import { Package, Clock, ShoppingBag, CheckCircle, Truck, XCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const HistoryCard = () => {
  const token = useEcomStore((state) => state.token);
  const user = useEcomStore((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      getOrders(token)
        .then((res) => {
          setOrders(res.data.orders || []);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => setIsLoading(false));
    }
  }, [token]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Completed</span>
          </span>
        );
      case "Dispatched":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold">
            <Truck className="w-3.5 h-3.5" />
            <span>Dispatched</span>
          </span>
        );
      case "Processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>Processing</span>
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-bold">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-bold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Pending</span>
          </span>
        );
    }
  };

  const totalSpent = orders.reduce((acc, o) => acc + (o.cartTotal || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Summary */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Order History & Purchases
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-8">
            <div>
              <span className="text-xs text-slate-400 font-medium">Total Orders</span>
              <p className="text-xl font-black text-slate-900">{orders.length}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Lifetime Spend</span>
              <p className="text-xl font-black text-indigo-600">฿{formatPrice(totalSpent)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Package className="w-5 h-5 text-indigo-600" />
          <span>Past Orders</span>
        </h2>

        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-44 bg-slate-200 rounded-3xl" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">No orders placed yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When you place orders, their real-time delivery status and item receipts will appear here.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition-colors"
            >
              <span>Explore Store</span>
            </Link>
          </div>
        ) : (
          orders.slice().reverse().map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    Order #{order.id}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  {getStatusBadge(order.orderStatus)}
                  <span className="font-black text-slate-900 text-base">
                    ฿{formatPrice(order.cartTotal)}
                  </span>
                </div>
              </div>

              {/* Products within Order */}
              <div className="divide-y divide-slate-100">
                {order.products?.map((item, idx) => {
                  const imageUrl = item.product?.images && item.product.images.length > 0
                    ? item.product.images[0].url
                    : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80";

                  return (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={imageUrl}
                          alt={item.product?.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                            {item.product?.title}
                          </h4>
                          <p className="text-xs text-slate-500">
                            {item.count} unit{item.count > 1 ? "s" : ""} × ฿{formatPrice(item.product?.price)}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs sm:text-sm font-bold text-slate-800 shrink-0">
                        ฿{formatPrice(item.count * item.product?.price)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryCard;