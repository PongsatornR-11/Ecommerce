//rafce

import React, { useState, useEffect } from "react";

import { createCategory, removeCategory } from "../../api/Category";

import useEcomStore from "../../store/ecom-store";

import { toast } from "react-toastify";

const FromCategory = () => {
  const token = useEcomStore((state) => state.token);

  // add category
  const [categoryName, setCategoryName] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent refresh page when run function handlerSubmit
    if (!categoryName) {
      return toast.warning("Please fill data");
    }
    try {
      const res = await createCategory(token, { name: categoryName });
      toast.success(`Add Catergory ${res.data.name} Success`);
      getCategory(token);
    } catch (err) {
      console.log(err);
    }
  };

  // list category
  // const [categories, setCategories] = useState([]); // local state

  const categories = useEcomStore((state) => state.categories); //global state to get categories variable
  const getCategory = useEcomStore((state) => state.getCategory); //global state to call function getCategory
  useEffect(() => {
    getCategory(token);
  }, []);

  // remove category
  const handleRemove = async (id) => {
    try {
      const res = await removeCategory(token, id);
      getCategory(token);
      toast.warning(`Category ${res.data.name} Removed `);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm transition-colors duration-200">
      <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
        Category Management
      </h2>
      
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4"> 
          <div className="flex flex-col flex-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Category Name</label>
            <input
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              type="text"
              placeholder="e.g. Mechanical Keyboards"
            />
          </div>
          <button 
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 px-5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 active:scale-97 transition-all duration-200 h-fit"
          >
            Add Category
          </button>
        </div>
      </form>

      <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">Existing Categories</h3>
        
        <ul className="divide-y divide-slate-100 dark:divide-slate-800/40 max-w-md border border-slate-100 dark:border-slate-800/80 rounded-xl overflow-hidden bg-white dark:bg-slate-950 shadow-sm">
          {categories.map((item, index) => (
            <li className="flex justify-between items-center py-3 px-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 text-slate-700 dark:text-slate-300 transition-colors" key={index}>
              <span className="text-xs font-semibold">{item.name}</span>

              <button
                className="bg-rose-50 dark:bg-rose-950/20 border border-rose-250 dark:border-rose-800/40 text-rose-600 dark:text-rose-450 hover:bg-rose-100/65 dark:hover:bg-rose-950/40 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all duration-200"
                onClick={() => handleRemove(item.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FromCategory;
