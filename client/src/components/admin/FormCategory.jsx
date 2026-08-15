import React, { useState, useEffect } from "react";
import { createCategory, removeCategory } from "../../api/Category";
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";
import { Layers, Plus, Trash2 } from "lucide-react";

const FormCategory = () => {
  const token = useEcomStore((state) => state.token);
  const categories = useEcomStore((state) => state.categories);
  const getCategory = useEcomStore((state) => state.getCategory);
  const [categoryName, setCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getCategory(token);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      return toast.warning("Please enter a category title.");
    }
    setIsSubmitting(true);
    try {
      const res = await createCategory(token, { name: categoryName.trim() });
      toast.success(`Category "${res.data.name}" added successfully!`);
      setCategoryName("");
      getCategory(token);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      try {
        await removeCategory(token, id);
        toast.success(`Category "${name}" deleted`);
        getCategory(token);
      } catch (err) {
        toast.error("Failed to delete category");
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-100">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Layers className="w-6 h-6 text-indigo-600" />
          <span>Category Taxonomy</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Add and organize store departments to classify your catalog items.
        </p>
      </div>

      {/* Add Form */}
      <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 max-w-xl space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            New Category Title
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Smart Home, Gaming..."
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isSubmitting || !categoryName.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? "Adding..." : "Add Category"}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Category List */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
          Active Categories ({categories.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                  {item.name[0]}
                </div>
                <span className="font-bold text-slate-900 text-xs sm:text-sm">{item.name}</span>
              </div>

              <button
                onClick={() => handleRemove(item.id, item.name)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                title="Delete category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormCategory;
