import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import { listUserCart, saveAddress, getUserAddresses, addUserAddress } from "../../api/user";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { formatPrice } from "../../utils/number";
import { MapPin, CheckCircle, ShieldCheck, ArrowRight, ArrowLeft, PlusCircle, Home, Briefcase, Check } from "lucide-react";

const SummaryCard = () => {
  const token = useEcomStore((state) => state.token);
  const user = useEcomStore((state) => state.user);

  const [products, setProducts] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  // Address state
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null); // id or 'custom'
  const [customAddress, setCustomAddress] = useState("");
  const [customTitle, setCustomTitle] = useState("Other");
  const [customRecipient, setCustomRecipient] = useState(user?.name || "");
  const [customPhone, setCustomPhone] = useState("");
  const [saveToAccount, setSaveToAccount] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      handleListUserCart();
      handleFetchAddresses();
    }
  }, [token]);

  const handleListUserCart = () => {
    setIsLoading(true);
    listUserCart()
      .then((res) => {
        setProducts(res.data.products || []);
        setCartTotal(res.data.cartTotal || 0);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  };

  const handleFetchAddresses = () => {
    getUserAddresses()
      .then((res) => {
        const list = res.data.addresses || [];
        setSavedAddresses(list);
        
        // Auto-select default address if available
        if (list.length > 0) {
          const defaultAddr = list.find((a) => a.isDefault) || list[0];
          setSelectedAddressId(defaultAddr.id);
        } else if (user?.address) {
          setCustomAddress(user.address);
          setSelectedAddressId("custom");
        } else {
          setSelectedAddressId("custom");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user addresses", err);
        if (user?.address) {
          setCustomAddress(user.address);
          setSelectedAddressId("custom");
        }
      });
  };

  const getActiveShippingAddress = () => {
    if (selectedAddressId === "custom") {
      return customAddress.trim();
    }
    const found = savedAddresses.find((a) => a.id === selectedAddressId);
    return found ? found.address : "";
  };

  const handleProceedToPayment = async () => {
    const finalAddress = getActiveShippingAddress();
    if (!finalAddress) {
      toast.warning("Please select or enter a valid shipping address.");
      return;
    }

    setIsSaving(true);
    try {
      // If using custom address and user opted to save it to account
      if (selectedAddressId === "custom" && saveToAccount && customAddress.trim()) {
        await addUserAddress({
          title: customTitle || "Other",
          address: customAddress.trim(),
          recipient: customRecipient,
          phone: customPhone,
          isDefault: savedAddresses.length === 0
        });
        toast.success("New address saved to your account!");
      } else if (selectedAddressId !== "custom") {
        // Ensure default address is saved to backend profile
        await saveAddress(finalAddress);
      }

      navigate("/user/payment");
    } catch (err) {
      toast.error("Failed to save delivery address.");
    } finally {
      setIsSaving(false);
    }
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
        {/* Left: Shipping Address Selection */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Select Delivery Address</h2>
                <p className="text-xs text-slate-500">Choose a saved address or enter a new recipient location.</p>
              </div>
            </div>

            {/* Saved Addresses Radio Cards */}
            {savedAddresses.length > 0 && (
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Saved Account Addresses
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {savedAddresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/40 shadow-sm"
                            : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-400"
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-slate-900">{addr.title || "Shipping Address"}</span>
                              {addr.isDefault && (
                                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-700 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            {addr.recipient && (
                              <p className="text-xs font-semibold text-slate-700 mt-1">Recipient: {addr.recipient} {addr.phone && `(${addr.phone})`}</p>
                            )}
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{addr.address}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Custom / New Address Radio Option */}
            <div className="pt-2">
              <div
                onClick={() => setSelectedAddressId("custom")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center space-x-3 ${
                  selectedAddressId === "custom"
                    ? "border-indigo-600 bg-indigo-50/40"
                    : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedAddressId === "custom" ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-400"
                }`}>
                  {selectedAddressId === "custom" && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div className="flex items-center space-x-2">
                  <PlusCircle className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-900">
                    {savedAddresses.length > 0 ? "Deliver to a different / new address" : "Enter Delivery Address"}
                  </span>
                </div>
              </div>

              {/* Form expansion when 'custom' selected */}
              {selectedAddressId === "custom" && (
                <div className="mt-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Address Label</label>
                      <input
                        type="text"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        placeholder="e.g. Office, Vacation Home"
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Recipient Name</label>
                      <input
                        type="text"
                        value={customRecipient}
                        onChange={(e) => setCustomRecipient(e.target.value)}
                        placeholder="Full Name"
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Full Street Address & Landmark *</label>
                    <textarea
                      rows={3}
                      value={customAddress}
                      onChange={(e) => setCustomAddress(e.target.value)}
                      placeholder="e.g. Apartment 4B, 54 Sukhumvit Road, Khlong Toei, Bangkok 10110"
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="saveToAccountCheck"
                      checked={saveToAccount}
                      onChange={(e) => setSaveToAccount(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <label htmlFor="saveToAccountCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                      Save this address to my account for future orders
                    </label>
                  </div>
                </div>
              )}
            </div>
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

            {/* Selected Address Summary */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 text-xs space-y-1">
              <span className="font-bold text-slate-700 block">Deliver to:</span>
              <p className="text-slate-600 line-clamp-2">
                {getActiveShippingAddress() || <span className="text-red-500 italic">No address selected yet</span>}
              </p>
            </div>

            {/* Price Calculations */}
            <div className="pt-2 space-y-2.5 text-xs">
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

            {/* Action Button */}
            <button
              onClick={handleProceedToPayment}
              disabled={isSaving || !getActiveShippingAddress()}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer ${
                isSaving || !getActiveShippingAddress()
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20 active:scale-98"
              }`}
            >
              <span>{isSaving ? "Saving Address..." : "Continue to Payment"}</span>
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