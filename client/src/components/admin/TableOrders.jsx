import React, { useEffect, useState } from "react";
import { getOrdersAdmin, changeOrderStatus } from "../../api/admin";
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";
import { formatPrice } from "../../utils/number";
import { formatDate, formatTime } from "../../utils/datetimeformat";
import { ShoppingBag, Search, MapPin } from "lucide-react";

const TableOrders = () => {
  const token = useEcomStore((state) => state.token);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      handleGetOrderAdmin(token);
    }
  }, [token]);

  const handleGetOrderAdmin = (jwtToken) => {
    setIsLoading(true);
    getOrdersAdmin(jwtToken)
      .then((res) => {
        setOrders(res.data || []);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  const handleChangeOrderStatus = async (orderId, newStatus) => {
    try {
      await changeOrderStatus(token, orderId, newStatus);
      toast.success(`Order #${orderId} status changed to ${newStatus}`);
      handleGetOrderAdmin(token);
    } catch (err) {
      toast.error("Failed to update order status");
    }
  };

  const filteredOrders = orders.filter((o) => {
    const emailMatch = o.orderedBy?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const idMatch = String(o.id).includes(searchTerm);
    return emailMatch || idMatch;
  });

  const getStatusColorClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Dispatched":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Processing":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-indigo-600" />
            <span>Orders & Dispatch Management</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review customer orders, delivery addresses, and change fulfillment status.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer email or order #..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
              <th className="pb-3 pl-3">ID</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Products</th>
              <th className="pb-3">Delivery Address</th>
              <th className="pb-3">Total</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 pr-3 text-right">Placed On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400">
                  Loading orders...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 pl-3 font-mono font-bold text-slate-900">
                    #{order.id}
                  </td>
                  <td className="py-4">
                    <span className="font-bold text-slate-900 block">
                      {order.orderedBy?.email}
                    </span>
                    <span className="text-[10px] text-slate-400">User ID #{order.orderedById}</span>
                  </td>
                  <td className="py-4 max-w-xs">
                    <ul className="space-y-1">
                      {order.products?.map((p, idx) => (
                        <li key={idx} className="text-slate-800 text-[11px] truncate">
                          • {p.product?.title} <strong className="text-indigo-600">({p.count}x)</strong>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-4 max-w-[200px] text-[11px] text-slate-600">
                    <div className="flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{order.orderedBy?.address || "No address provided"}</span>
                    </div>
                  </td>
                  <td className="py-4 font-black text-slate-900 text-sm">
                    ฿{formatPrice(order.cartTotal)}
                  </td>
                  <td className="py-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleChangeOrderStatus(order.id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${getStatusColorClass(
                        order.orderStatus
                      )}`}
                    >
                      <option value="Not Process">Not Process</option>
                      <option value="Processing">Processing</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="py-4 pr-3 text-right text-slate-400 text-[11px]">
                    <div>{formatDate(order.createdAt)}</div>
                    <div className="text-[10px]">{formatTime(order.createdAt)}</div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableOrders;