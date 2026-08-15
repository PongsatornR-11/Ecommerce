import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight, ShieldCheck, Tag, Truck } from "lucide-react";
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";
import { createUserCart } from "../../api/user";
import { formatPrice } from "../../utils/number";

const ListCart = () => {
  const cart = useEcomStore((state) => state.carts);
  const actionUpdateQuantity = useEcomStore((state) => state.actionUpdateQuantity);
  const actionRemoveProductOncart = useEcomStore((state) => state.actionRemoveProductOncart);
  const getTotalPrice = useEcomStore((state) => state.getTotalPrice);
  const user = useEcomStore((state) => state.user);
  const token = useEcomStore((state) => state.token);
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getTotalPrice();
  const freeShippingThreshold = 1500;
  const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
  const shippingCost = isFreeShipping ? 0 : 100;
  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "WELCOME10") {
      setDiscountPercent(10);
      toast.success("Coupon WELCOME10 applied! 10% discount added.");
    } else {
      toast.error("Invalid discount coupon code.");
    }
  };

  const handleCheckout = async () => {
    if (!token) {
      toast.info("Please log in to complete your checkout.");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      toast.warning("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createUserCart(token, { cart });
      toast.success("Cart verified! Proceeding to shipping.");
      navigate("/checkout");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to initialize checkout.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Checkout Progress Bar */}
      <div className="max-w-xl mx-auto mb-10">
        <div className="flex items-center justify-between relative">
          <div className="w-full absolute top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0" />
          <div className="w-1/3 absolute top-1/2 -translate-y-1/2 h-1 bg-indigo-600 z-0" />

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
              1
            </div>
            <span className="text-xs font-bold text-indigo-600 mt-2">Shopping Cart</span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-white border-2 border-slate-300 text-slate-500 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <span className="text-xs font-medium text-slate-500 mt-2">Shipping</span>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-white border-2 border-slate-300 text-slate-500 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <span className="text-xs font-medium text-slate-500 mt-2">Payment</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-600" />
                <span>Review Cart Items ({cart.length})</span>
              </h2>
              <Link to="/shop" className="text-xs font-bold text-indigo-600 hover:underline">
                + Continue Shopping
              </Link>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-950 mb-2">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  {isFreeShipping
                    ? "You unlocked FREE Express Shipping!"
                    : `Add ฿${formatPrice(freeShippingThreshold - subtotal)} more for FREE Shipping!`}
                </span>
                <span>{Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%</span>
              </div>
              <div className="w-full bg-indigo-200/60 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>

            {/* Items */}
            {cart.length === 0 ? (
              <div className="text-center py-14 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Your cart is currently empty</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Browse our catalog and discover premium audio, wearables, and minimalist essentials.
                </p>
                <Link
                  to="/shop"
                  className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition-colors"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {cart.map((item) => {
                  const imageUrl = item.images && item.images.length > 0
                    ? item.images[0].url
                    : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80";

                  return (
                    <div key={item.id} className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={imageUrl}
                          alt={item.title}
                          className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">Unit Price: ฿{formatPrice(item.price)}</p>
                          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-1 inline-block">
                            In Stock
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 mt-2 sm:mt-0">
                        {/* Quantity Stepper */}
                        <div className="flex items-center space-x-2 bg-slate-100 rounded-xl p-1 border border-slate-200/70">
                          <button
                            onClick={() => actionUpdateQuantity(item.id, Math.max(1, item.count - 1))}
                            className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-700 hover:bg-slate-50 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold px-2">{item.count}</span>
                          <button
                            onClick={() => actionUpdateQuantity(item.id, item.count + 1)}
                            className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-700 hover:bg-slate-50 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-extrabold text-slate-900 text-base">
                          ฿{formatPrice(item.price * item.count)}
                        </span>

                        {/* Remove */}
                        <button
                          onClick={() => actionRemoveProductOncart(item.id)}
                          className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 text-lg pb-4 border-b border-slate-100">
              Order Summary
            </h3>

            {/* Price Calculations */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">฿{formatPrice(subtotal)}</span>
              </div>

              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Promo Discount ({discountPercent}%)</span>
                  <span>-฿{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-slate-900">
                  {shippingCost === 0 ? <span className="text-emerald-600 uppercase text-xs font-bold">Free</span> : `฿${formatPrice(shippingCost)}`}
                </span>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                <div>
                  <span className="text-xs text-slate-500 block">Total Due</span>
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    ฿{formatPrice(finalTotal)}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium">Includes all taxes</span>
              </div>
            </div>

            {/* Coupon Code Box */}
            <form onSubmit={handleApplyCoupon} className="pt-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code (e.g. WELCOME10)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs uppercase text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </form>

            {/* Checkout Action */}
            {user ? (
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0 || isSubmitting}
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98 cursor-pointer ${
                  cart.length === 0 || isSubmitting
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20"
                }`}
              >
                <span>{isSubmitting ? "Processing..." : "Proceed to Shipping"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <Link
                to="/login"
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md"
              >
                <span>Log In to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            {/* Security Guarantee */}
            <div className="pt-2 flex items-center justify-center space-x-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Guaranteed safe & 256-bit encrypted checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCart;