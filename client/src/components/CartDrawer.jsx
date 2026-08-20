import React from "react";
import { Link } from "react-router-dom";
import useEcomStore from "../store/ecom-store";
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight } from "lucide-react";

const CartDrawer = () => {
  const carts = useEcomStore((state) => state.carts);
  const isCartOpen = useEcomStore((state) => state.isCartOpen);
  const setIsCartOpen = useEcomStore((state) => state.setIsCartOpen);
  const actionUpdateQuantity = useEcomStore((state) => state.actionUpdateQuantity);
  const actionRemoveProductOncart = useEcomStore((state) => state.actionRemoveProductOncart);
  const getTotalPrice = useEcomStore((state) => state.getTotalPrice);

  if (!isCartOpen) return null;

  const total = getTotalPrice();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 text-slate-100 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold">Shopping Cart ({carts.length})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body - Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {carts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-4">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="font-medium text-slate-300">Your cart is currently empty</p>
                <Link
                  to="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              carts.map((item) => {
                const imageUrl = item.images && item.images.length > 0 ? item.images[0].url : "https://via.placeholder.com/150";
                return (
                  <div key={item.id} className="flex items-center space-x-4 bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                    <img
                      src={imageUrl}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg bg-slate-800 border border-slate-700"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">{item.title}</h4>
                      <p className="text-xs text-indigo-400 font-bold mt-0.5">
                        ${Number(item.price).toLocaleString()}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => actionUpdateQuantity(item.id, item.count - 1)}
                          className="p-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold text-slate-200 px-1">{item.count}</span>
                        <button
                          onClick={() => actionUpdateQuantity(item.id, item.count + 1)}
                          className="p-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => actionRemoveProductOncart(item.id)}
                      className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          {carts.length > 0 && (
            <div className="p-6 border-t border-slate-800 space-y-4 bg-slate-900/80">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-medium">Subtotal</span>
                <span className="text-xl font-extrabold text-white">${total.toLocaleString()}</span>
              </div>
              <p className="text-xs text-slate-400">Shipping and taxes calculated at checkout.</p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-colors border border-slate-700"
                >
                  View Cart
                </Link>
                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center space-x-1 shadow-lg shadow-indigo-600/30"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
