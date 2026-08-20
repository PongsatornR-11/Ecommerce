import React, { useState, useEffect } from "react";
import { getOrders, getUserAddresses, addUserAddress, setDefaultAddress, deleteAddress } from "../../api/user";
import useEcomStore from "../../store/ecom-store";
import { formatDate, formatTime } from "../../utils/datetimeformat";
import { formatPrice } from "../../utils/number";
import { Package, Clock, ShoppingBag, CheckCircle, Truck, XCircle, AlertCircle, MapPin, Plus, Trash2, Check, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const HistoryCard = () => {
  const token = useEcomStore((state) => state.token);
  const user = useEcomStore((state) => state.user);

  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Address Modal / Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("Home");
  const [newRecipient, setNewRecipient] = useState(user?.name || "");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [ordersRes, addrRes] = await Promise.all([
        getOrders(),
        getUserAddresses()
      ]);
      setOrders(ordersRes.data.orders || []);
      setAddresses(addrRes.data.addresses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await setDefaultAddress(addressId);
      toast.success("Default address updated!");
      fetchData();
    } catch (err) {
      toast.error("Failed to set default address");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteAddress(addressId);
      toast.success("Address deleted");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete address");
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.trim()) {
      toast.error("Please enter a valid address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addUserAddress({
        title: newTitle,
        recipient: newRecipient,
        phone: newPhone,
        address: newAddress.trim(),
        isDefault
      });
      toast.success("New address added to your account!");
      setShowAddForm(false);
      setNewAddress("");
      setNewTitle("Home");
      fetchData();
    } catch (err) {
      toast.error("Failed to add address");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                My Account Profile
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

      {/* Saved Address Book Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <span>Saved Shipping Addresses</span>
          </h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? "Cancel" : "Add New Address"}</span>
          </button>
        </div>

        {/* Add Address Form */}
        {showAddForm && (
          <form onSubmit={handleAddAddress} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 animate-fadeIn">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">New Address Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Label (e.g. Home, Work)</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  placeholder="Home"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  placeholder="+66 81 234 5678"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Full Street Address *</label>
              <textarea
                rows={3}
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 resize-none"
                placeholder="Street address, sub-district, district, province, postal code"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span>Set as Default Shipping Address</span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
              >
                {isSubmitting ? "Saving..." : "Save Address"}
              </button>
            </div>
          </form>
        )}

        {/* Addresses List */}
        {addresses.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No saved addresses found. Add one above to speed up checkout.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-3 ${
                  addr.isDefault
                    ? "border-indigo-600 bg-indigo-50/20 shadow-sm"
                    : "border-slate-200 bg-slate-50/50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-slate-900">{addr.title || "Address"}</span>
                    {addr.isDefault ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-emerald-600" /> Default
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-[11px] font-semibold text-indigo-600 hover:underline"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                  {addr.recipient && (
                    <p className="text-xs font-semibold text-slate-700">Contact: {addr.recipient} {addr.phone && `(${addr.phone})`}</p>
                  )}
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{addr.address}</p>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-xs text-red-500 hover:text-red-700 flex items-center space-x-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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