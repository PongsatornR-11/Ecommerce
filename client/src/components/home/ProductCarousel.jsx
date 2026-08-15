import React from "react";
import { Link } from "react-router-dom";
import useEcomStore from "../../store/ecom-store";
import ProductCard from "../card/ProductCard";
import { Headphones, Watch, Laptop, Sparkles, Tag, ArrowRight } from "lucide-react";

const CategoryShowcase = () => {
  const products = useEcomStore((state) => state.products);
  const categories = useEcomStore((state) => state.categories);

  const categoryCards = [
    {
      name: "Smart Audio",
      tagline: "Studio ANC & Spatial Audio",
      icon: Headphones,
      bg: "from-blue-600 to-indigo-900",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    },
    {
      name: "Wearable Tech",
      tagline: "ECG, AMOLED & GPS Fitness",
      icon: Watch,
      bg: "from-emerald-600 to-teal-900",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    },
    {
      name: "Workspace & Desk",
      tagline: "Mechanical & High-Precision Tools",
      icon: Laptop,
      bg: "from-amber-600 to-orange-950",
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    },
    {
      name: "Minimalist Essentials",
      tagline: "Insulated Drinkware & Leather",
      icon: Sparkles,
      bg: "from-slate-700 to-slate-950",
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      {/* Category Spotlight Grid */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Collections
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Curated For Every Lifestyle
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Browse high-performance devices engineered with premium materials.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryCards.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                to="/shop"
                className="group relative h-72 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Background Image */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

                {/* Card Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">{cat.tagline}</p>
                    <span className="inline-flex items-center text-xs font-bold text-white mt-3 group-hover:underline">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-indigo-500/20">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-bold">
            <Tag className="w-3.5 h-3.5" />
            <span>Limited Time Offer</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Get 10% Off Your First Order
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Join thousands of satisfied shoppers. Use promotional code <strong className="text-white bg-indigo-600/60 px-2 py-0.5 rounded font-mono">WELCOME10</strong> at checkout.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 bg-white text-slate-950 hover:bg-indigo-50 px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <span>Shop All Items</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Catalog Grid Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Full Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Explore All Gear
            </h2>
          </div>
          <Link
            to="/shop"
            className="mt-2 sm:mt-0 text-sm font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center group"
          >
            <span>Open Shop Page</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {products?.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryShowcase;