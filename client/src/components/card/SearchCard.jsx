import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { formatPrice } from "../../utils/number";
import { Search, RotateCcw, Filter, Check } from "lucide-react";

const SearchCard = ({ onReset }) => {
  const getProduct = useEcomStore((state) => state.getProduct);
  const actionSearchFilter = useEcomStore((state) => state.actionSearchFilter);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);

  const [text, setText] = useState("");
  const [categoryChecked, setCategoryChecked] = useState([]);
  const [price, setPrice] = useState([0, 10000]);

  useEffect(() => {
    getCategory();
  }, []);

  // Combined Search and Filter with Debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      const filters = {};
      if (text.trim()) {
        filters.query = text.trim();
      }
      if (categoryChecked.length > 0) {
        filters.category = categoryChecked.map(Number);
      }
      if (price) {
        filters.price = price;
      }

      actionSearchFilter(filters);
    }, 300);

    return () => clearTimeout(delay);
  }, [text, categoryChecked, price]);

  const handleCheckbox = (id) => {
    const nextChecked = categoryChecked.includes(id)
      ? categoryChecked.filter((c) => c !== id)
      : [...categoryChecked, id];
    setCategoryChecked(nextChecked);
  };

  const handleResetFilters = () => {
    setText("");
    setCategoryChecked([]);
    setPrice([0, 10000]);
    getProduct();
    if (onReset) onReset();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span>Filter Products</span>
        </div>
        <button
          onClick={handleResetFilters}
          className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center space-x-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Search Keyword
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search audio, watches..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Categories
        </label>
        <div className="space-y-2">
          {categories.map((item) => {
            const isChecked = categoryChecked.includes(String(item.id));
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => handleCheckbox(String(item.id))}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  isChecked
                    ? "bg-indigo-50 border-indigo-200 text-indigo-900 font-semibold shadow-xs"
                    : "bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{item.name}</span>
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                    isChecked
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Price Range
          </label>
          <span className="text-xs font-bold text-indigo-600">
            ฿{formatPrice(price[0])} - ฿{formatPrice(price[1])}
          </span>
        </div>
        <div className="px-2 pt-1 pb-2">
          <Slider
            range
            min={0}
            max={10000}
            step={100}
            value={price}
            onChange={(val) => setPrice(val)}
            trackStyle={[{ backgroundColor: "#4f46e5", height: 6 }]}
            handleStyle={[
              { borderColor: "#4f46e5", height: 18, width: 18, marginTop: -6, backgroundColor: "#ffffff", boxShadow: "0 2px 4px rgba(0,0,0,0.15)" },
              { borderColor: "#4f46e5", height: 18, width: 18, marginTop: -6, backgroundColor: "#ffffff", boxShadow: "0 2px 4px rgba(0,0,0,0.15)" },
            ]}
            railStyle={{ backgroundColor: "#e2e8f0", height: 6 }}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchCard;