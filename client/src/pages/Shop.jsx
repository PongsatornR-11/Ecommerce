// rafce

import React, { useEffect } from "react";
import ProductCard from "../components/card/productCard";
import useEcomStore from "../store/ecom-store";
import SearchCard from "../components/card/SearchCard";

const Shop = () => {

  const getProduct = useEcomStore((state) => state.getProduct)
  const products = useEcomStore((state) => state.products)

  useEffect(() => {
    getProduct(10)
  }, [])

  return (
    <div className="flex">
      {/* Search Bar */}
      <div className="w-1/4 p-4 bg-gray-100 h-screen"><SearchCard /></div>
      {/* product */}
      <div className="w-1/2 p-4 h-screen overflow-y-auto">
        <p className="text-2xl font-bold mb-4">All product</p>
        <div className="flex flex-wrap gap-4">
          {
            products.map((product, index) =>
              <ProductCard key={index} product={product} />
            )
          }
        </div>
      </div>
      {/* cart */}
      <div className="w-1/4 p-4 bg-gray-100 h-screen overflow-y-auto">Cart</div>
    </div>
  );
};

export default Shop;