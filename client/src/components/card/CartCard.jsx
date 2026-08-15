import React from "react";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import useEcomStore from "../../store/ecom-store";
import { formatPrice } from "../../utils/number";

const CartCard = () => {
  const actionUpdateQuantity = useEcomStore((state) => state.actionUpdateQuantity);
  const actionRemoveProductOncart = useEcomStore((state) => state.actionRemoveProductOncart);
  const getTotalPrice = useEcomStore((state) => state.getTotalPrice);
  const carts = useEcomStore((state) => state.carts);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col h-full max-h-[85vh]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
          <ShoppingBag className="w-4 h-4 text-indigo-600" />
          <span>Your Cart</span>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">
          {carts.reduce((acc, item) => acc + (item.count || 1), 0)} items
        </span>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {carts.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Your cart is empty</p>
            <p className="text-xs text-slate-400">Add items from the store to begin checkout.</p>
          </div>
        ) : (
          carts.map((item) => {
            const imageUrl = item.images && item.images.length > 0
              ? item.images[0].url
              : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80";

            return (
              <div
                key={item.id}
                className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3 flex gap-3 items-center"
              >
                <img
                  src={imageUrl}
                  alt={item.title}
                  className="w-14 h-14 rounded-xl object-cover bg-white shrink-0 border border-slate-100"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate" title={item.title}>
                    {item.title}
                  </h4>
                  <p className="text-xs font-extrabold text-indigo-600 mt-0.5">
                    ฿{formatPrice(item.price * item.count)}
                  </p>

                  {/* Quantity Stepper */}
                  <div className="flex items-center space-x-1.5 mt-2">
                    <button
                      onClick={() => actionUpdateQuantity(item.id, item.count - 1)}
                      className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold px-2 text-slate-800">{item.count}</span>
                    <button
                      onClick={() => actionUpdateQuantity(item.id, item.count + 1)}
                      className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => actionRemoveProductOncart(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Cart Summary & Footer */}
      {carts.length > 0 && (
        <div className="pt-4 border-t border-slate-100 mt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500">Subtotal</span>
            <span className="text-base font-extrabold text-slate-900">
              ฿{formatPrice(getTotalPrice())}
            </span>
          </div>

          <Link
            to="/cart"
            className="w-full flex items-center justify-center space-x-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md hover:shadow-indigo-500/20 active:scale-98 transition-all"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartCard;