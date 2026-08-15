import React, { useEffect, useState } from "react";
import ProductCard from "../components/card/ProductCard";
import useEcomStore from "../store/ecom-store";
import SearchCard from "../components/card/SearchCard";
import CartCard from "../components/card/CartCard";
import { SlidersHorizontal, ShoppingBag } from "lucide-react";

const Shop = () => {
  const getProduct = useEcomStore((state) => state.getProduct);
  const products = useEcomStore((state) => state.products);
  const carts = useEcomStore((state) => state.carts);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Shop Catalog
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Showing <strong className="text-slate-800">{products.length}</strong> items available in store.
          </p>
        </div>

        {/* Mobile Filter & Cart Toggles */}
        <div className="flex items-center space-x-3 lg:hidden">
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-xs active:bg-slate-50"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>Filters</span>
          </button>

          <button
            onClick={() => setShowMobileCart(!showMobileCart)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-sm active:bg-indigo-700"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Cart ({carts.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Sidebar (Desktop) */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24">
          <SearchCard />
        </div>

        {/* Mobile Filter Modal / Drawer */}
        {showMobileFilter && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden flex justify-end">
            <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-900 text-base">Filter Products</h3>
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="text-xs font-bold text-slate-500 p-1 hover:text-slate-800"
                >
                  ✕ Close
                </button>
              </div>
              <SearchCard onReset={() => setShowMobileFilter(false)} />
            </div>
          </div>
        )}

        {/* Mobile Cart Modal / Drawer */}
        {showMobileCart && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden flex justify-end">
            <div className="w-full max-w-sm bg-white h-full p-6 overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-900 text-base">Your Cart</h3>
                <button
                  onClick={() => setShowMobileCart(false)}
                  className="text-xs font-bold text-slate-500 p-1 hover:text-slate-800"
                >
                  ✕ Close
                </button>
              </div>
              <CartCard />
            </div>
          </div>
        )}

        {/* Center: Product Grid */}
        <div className="lg:col-span-6">
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">No Matching Products</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find any products matching your search criteria. Try adjusting or resetting the filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Right: Cart Summary Sidebar (Desktop) */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24">
          <CartCard />
        </div>
      </div>
    </div>
  );
};

export default Shop;