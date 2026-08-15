import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import { listUserCart, saveAddress } from "../../api/user";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { formatPrice } from "../../utils/number";
import { MapPin, CheckCircle, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";

const SummaryCard = () => {
  const token = useEcomStore((state) => state.token);
  const [products, setProducts] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      handleListUserCart(token);
    }
  }, [token]);

  const handleListUserCart = (jwtToken) => {
    setIsLoading(true);
    listUserCart(jwtToken)
      .then((res) => {
        setProducts(res.data.products || []);
        setCartTotal(res.data.cartTotal || 0);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error("Please enter a valid delivery address.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await saveAddress(token, address);
      toast.success(res.data.message || "Shipping address saved!");
      setAddressSaved(true);
    } catch (err) {
      toast.error("Failed to save delivery address.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleProceedToPayment = () => {
    if (!addressSaved && !address.trim()) {
      toast.warning("Please save your delivery address before proceeding.");
      return;
    }
    navigate("/user/payment");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Checkout Progress Bar */}
      <div className="max-w-xl mx-auto mb-10">
        <div className="flex items-center justify-between relative">
          <div className="w-full absolute top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0" />
          <div className="w-2/3 absolute top-1/2 -translate-y-1/2 h-1 bg-indigo-600 z-0" />

          {/* Step 1 */}
          <Link to="/cart" className="relative z-10 flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
              ✓
            </div>
            <span className="text-xs font-semibold text-slate-600 mt-2">Shopping Cart</span>
          </Link>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
              2
            </div>
            <span className="text-xs font-bold text-indigo-600 mt-2">Shipping</span>
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
        {/* Left: Shipping Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 mb-6">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Delivery Address</h2>
                <p className="text-xs text-slate-500">Provide the recipient destination for your parcel.</p>
              </div>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Full Street Address & Landmark
                </label>
                <textarea
                  rows={4}
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setAddressSaved(false);
                  }}
                  placeholder="e.g. Apartment 4B, 54 Sukhumvit Road, Khlong Toei, Bangkok 10110"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  disabled={isSaving || !address.trim()}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer ${
                    addressSaved
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                  }`}
                >
                  {addressSaved ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Address Saved</span>
                    </>
                  ) : (
                    <span>{isSaving ? "Saving..." : "Save Address"}</span>
                  )}
                </button>

                <span className="text-xs text-slate-400">
                  {addressSaved ? "Ready for checkout" : "Required for dispatch"}
                </span>
              </div>
            </form>
          </div>

          <Link
            to="/cart"
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Shopping Cart</span>
          </Link>
        </div>

        {/* Right: Order Preview Summary */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 text-lg pb-4 border-b border-slate-100">
              Order Breakdown
            </h3>

            {/* Products List */}
            <div className="max-h-64 overflow-y-auto space-y-3 pr-1 divide-y divide-slate-100">
              {isLoading ? (
                <div className="py-6 text-center text-xs text-slate-400">Loading order items...</div>
              ) : products.map((item, idx) => {
                const imageUrl = item.product?.images && item.product.images.length > 0
                  ? item.product.images[0].url
                  : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80";

                return (
                  <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={imageUrl}
                        alt={item.product?.title}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {item.product?.title}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {item.count} × ฿{formatPrice(item.product?.price)}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-extrabold text-slate-900 shrink-0">
                      ฿{formatPrice(item.count * item.price)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900">฿{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Express Courier</span>
                <span className="font-semibold text-emerald-600 uppercase font-bold">Free</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-end">
                <div>
                  <span className="text-xs text-slate-500 block">Total Due</span>
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    ฿{formatPrice(cartTotal)}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium">THB (฿)</span>
              </div>
            </div>

            {/* Action */}
            <button
              onClick={handleProceedToPayment}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-indigo-500/20 active:scale-98 transition-all cursor-pointer"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-1 flex items-center justify-center space-x-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Stripe Secured Payment Gateway</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;