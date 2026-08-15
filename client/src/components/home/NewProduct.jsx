import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listProductBy } from "../../api/product";
import ProductCard from "../card/ProductCard";
import SwiperShowProduct from "../../utils/SwiperShowProduct";
import { SwiperSlide } from "swiper/react";
import { Sparkles, ArrowRight } from "lucide-react";

const NewProduct = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const res = await listProductBy("createdAt", "desc", 8);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Fresh Drops</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            New Arrivals & Releases
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Discover the latest innovative tech and minimalist essentials.
          </p>
        </div>

        <Link
          to="/shop"
          className="mt-4 sm:mt-0 inline-flex items-center space-x-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors group"
        >
          <span>Shop New Drops</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Products Carousel */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <SwiperShowProduct>
          {products.map((product) => (
            <SwiperSlide key={product.id} className="flex justify-center">
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </SwiperShowProduct>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-sm">No new products available.</p>
        </div>
      )}
    </section>
  );
};

export default NewProduct;