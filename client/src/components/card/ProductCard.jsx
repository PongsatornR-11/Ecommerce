import React from "react";
import { ShoppingCart, Star } from "lucide-react";
import useEcomStore from "../../store/ecom-store";
import { formatPrice } from "../../utils/number";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const actionAddCart = useEcomStore((state) => state.actionAddCart);
  const isOutOfStock = product.quantity <= 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) {
      toast.warning("Sorry, this item is currently out of stock.");
      return;
    }
    actionAddCart(product);
    toast.success(`Added ${product.title} to your cart!`);
  };

  const imageUrl = product.images && product.images.length > 0
    ? product.images[0].url
    : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col overflow-hidden h-[380px] w-full max-w-[280px]">
      {/* Top Image Container */}
      <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.category && (
            <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase bg-slate-900/80 backdrop-blur-md text-white rounded-full shadow-sm">
              {product.category.name}
            </span>
          )}
          {product.sold && product.sold > 10 && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-amber-500 text-white rounded-full shadow-sm">
              Popular
            </span>
          )}
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center space-x-1 text-amber-400 mb-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
            ))}
            <span className="text-xs text-slate-500 ml-1 font-medium">(4.9)</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors" title={product.title}>
            {product.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-base font-extrabold text-slate-900">
              ฿{formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={`Add ${product.title} to cart`}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
              isOutOfStock
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-indigo-500/20 active:scale-95"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;