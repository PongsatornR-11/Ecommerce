import React, { useEffect } from "react";
import ProductCard from "../components/card/ProductCard";
import useEcomStore from "../store/ecom-store";
import SearchCard from "../components/card/SearchCard";
import CartCard from "../components/card/CartCard";

const Shop = () => {
  const getProduct = useEcomStore((state) => state.getProduct)
  const products = useEcomStore((state) => state.products)

  useEffect(() => {
    getProduct()
  }, [])

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)] overflow-hidden">
        
        {/* Search Bar (Left Sidebar) */}
        <div className="w-full lg:w-[260px] flex-none h-full overflow-y-auto pr-1">
          <SearchCard />
        </div>
        
        {/* Product Grid (Center Content) */}
        <div className="flex-1 h-full overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 p-5 h-full flex flex-col shadow-sm transition-colors duration-200">
            <div className="flex items-center justify-between mb-4 flex-none">
              <div>
                <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">All Products</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">{products.length} products found</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1">
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-6 justify-items-center">
                  {products.map((product, index) => (
                    <ProductCard key={index} product={product} />
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
                  <p className="text-xs font-medium">No products found matching filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Cart Preview (Right Sidebar) */}
        <div className="w-full lg:w-[320px] flex-none h-full overflow-y-auto pl-1">
          <CartCard />
        </div>
      </div>
    </div>
  );
};

export default Shop;
