import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import { createProduct, deleteProduct } from "../../api/product";
import { toast } from "react-toastify";
import UpdateFile from "./UpdateFile";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Plus, ShoppingBag } from "lucide-react";
import { formatPrice } from "../../utils/number";
import { formatDate } from "../../utils/datetimeformat";

const initialState = {
  title: "",
  description: "",
  price: 0,
  quantity: 0,
  categoryId: "",
  images: [],
};

const FormProduct = () => {
  const token = useEcomStore((state) => state.token);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);
  const getProduct = useEcomStore((state) => state.getProduct);
  const products = useEcomStore((state) => state.products);
  
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    getCategory();
    getProduct(100);
  }, []);

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createProduct(token, form);
      setForm(initialState);
      getProduct();
      toast.success(`Add ${res.data.title} Qty ${res.data.quantity} success!`);
    } catch (err) {
      console.log(err);
      toast.error("Failed to create product");
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Confirm to delete ${title}`)) {
      try {
        await deleteProduct(token, id);
        getProduct();
        toast.success(`${title} has been deleted!`);
      } catch (err) {
        console.log(err);
        toast.error("Failed to delete product");
      }
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Form Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 flex-none mb-6">
          <Plus size={18} className="text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Add Product details</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Inputs */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Product Title</label>
                <input
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  value={form.description}
                  onChange={handleOnChange}
                  placeholder="Enter details here..."
                  name="description"
                ></textarea>
              </div>
            </div>

            {/* Right Inputs */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Price (THB)</label>
                  <input
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={handleOnChange}
                    placeholder="Enter price"
                    name="price"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Quantity (EA)</label>
                  <input
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    type="number"
                    min="0"
                    value={form.quantity}
                    onChange={handleOnChange}
                    placeholder="Enter quantity"
                    name="quantity"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Category</label>
                <select
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                  name="categoryId"
                  onChange={handleOnChange}
                  value={form.categoryId}
                >
                  <option value="" disabled>
                    Please Select
                  </option>
                  {categories.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <UpdateFile form={form} setForm={setForm} />
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold tracking-wider hover:shadow-lg hover:shadow-indigo-500/10 active:scale-95 transition-all flex items-center gap-2"
            >
              <Plus size={14} />
              <span>Add Product</span>
            </button>
          </div>
        </form>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm overflow-hidden transition-colors duration-200">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 flex-none mb-6">
          <ShoppingBag size={18} className="text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Product Inventory</h2>
        </div>

        <div className="w-full overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800/80">
          <table className="w-full border-collapse min-w-[900px] text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/80">
                <th className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5 px-4 w-12">No.</th>
                <th className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5 px-4 w-28">Picture</th>
                <th className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5 px-4">Product Name</th>
                <th className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5 px-4">Description</th>
                <th className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5 px-4">Price</th>
                <th className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5 px-4">Qty</th>
                <th className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5 px-4">Sold</th>
                <th className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5 px-4">Updated</th>
                <th className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3.5 px-4 w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {products.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 text-slate-700 dark:text-slate-350 transition-colors">
                  <td className="py-4 px-4 text-xs font-bold text-slate-400">{index + 1}</td>
                  <td className="py-4 px-4">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0].url}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl border border-slate-100 dark:border-slate-800 object-cover shadow-sm"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-center text-[10px] text-slate-400">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <div className="truncate w-36" title={item.title}>{item.title}</div>
                  </td>
                  <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400">
                    <div className="line-clamp-2 w-48 leading-relaxed" title={item.description}>{item.description}</div>
                  </td>
                  <td className="py-4 px-4 text-xs font-extrabold text-slate-900 dark:text-slate-100">
                    {formatPrice(item.price)} <span className="text-[9px] font-normal text-slate-400">THB</span>
                  </td>
                  <td className="py-4 px-4 text-xs font-bold">{item.quantity}</td>
                  <td className="py-4 px-4 text-xs font-bold text-slate-400">{item.sold}</td>
                  <td className="py-4 px-4 text-xs font-medium text-slate-400">{formatDate(item.updatedAt)}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link to={"/admin/product/" + item.id} title="Edit product">
                        <button className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-colors">
                          <Pencil size={13} />
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FormProduct;
