// rafce

import React from "react";
import ProductCard from "../components/card/productCard";
import useEcomStore from "../store/ecom-store";

const Shop = () => {

  const token = useEcomStore((state) => state.token)
  const getProduct = useEcomStore((state)=> state.getProduct)
  return (
    <div className="flex">
      {/* Search Bar */}
      <div className="w-1/4 p-4 bg-gray-100 h-screen">Search bar</div>
      {/* product */}
      <div className="w-1/2 p-4 h-screen overflow-y-auto">
        <p className="text-2xl font-bold mb-4">All product</p>
        <div className="flex flex-wrap gap-4">
          <ProductCard />
        </div>
      </div>
      {/* cart */}
      <div className="w-1/4 p-4 bg-gray-100 h-screen overflow-y-auto">Cart</div>
    </div>
  );
};

export default Shop;