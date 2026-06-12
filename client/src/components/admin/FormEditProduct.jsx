import React, { useEffect, useState } from "react";

import useEcomStore from "../../store/ecom-store";
import {
  createProduct,
  readProduct,
  listProduct,
  updateProduct,
} from "../../api/product";
import { toast } from "react-toastify";
import UpdateFile from "./UpdateFile";
import { useParams, useNavigate } from "react-router-dom";

const initialState = {
  title: "Core i5 14500",
  description: "description about i5",
  price: 599,
  quantity: 13,
  categoryId: "",
  images: [],
};

const FromEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useEcomStore((state) => state.token);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);

  const [form, setForm] = useState(initialState);

  const fetchProduct = async (token, id, form) => {
    try {
      const res = await readProduct(token, id, form);
      // console.log('res from back end', res)
      setForm(res.data);
    } catch (err) {
      console.log("Error fetch data", err);
    }
  };

  useEffect(() => {
    getCategory();
    fetchProduct(token, id, form);
  }, []);

  const handleOnChange = (e) => {
    console.log(e.target.name, e.target.value);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);
    try {
      const res = await updateProduct(token, id, form);
      console.log(res);
      toast.success(`Add ${res.data.title} Qty ${res.data.quantity} success!`);
      navigate("/admin/product");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm transition-colors duration-200">
      <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 flex-none mb-6">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Edit Product Details</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Inputs */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Product Title</label>
              <input
                required
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={form.title}
                onChange={handleOnChange}
                placeholder="Enter product name here"
                name="title"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Product Description</label>
              <textarea
                required
                rows="4"
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                value={form.description}
                onChange={handleOnChange}
                placeholder="Enter product description here"
                name="description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Price (THB)</label>
                <input
                  required
                  type="number"
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={form.price}
                  onChange={handleOnChange}
                  placeholder="0"
                  name="price"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Quantity</label>
                <input
                  required
                  type="number"
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={form.quantity}
                  onChange={handleOnChange}
                  placeholder="0"
                  name="quantity"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Category</label>
              <select
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-855 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                name="categoryId"
                onChange={handleOnChange}
                required
                value={form.categoryId}
              >
                <option value="" disabled>
                  Select category
                </option>
                {categories.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Inputs - Upload File */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Upload Images</label>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-950/20">
                <UpdateFile form={form} setForm={setForm} />
              </div>
            </div>

            <div className="flex gap-3 pt-6 sm:justify-end">
              <button 
                type="button"
                onClick={() => navigate('/admin/product')}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-all duration-200"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 px-6 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 active:scale-97 transition-all duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};

export default FromEditProduct;
