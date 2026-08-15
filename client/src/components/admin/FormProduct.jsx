import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import { createProduct, deleteProduct } from "../../api/product";
import { toast } from "react-toastify";
import UpdateFile from "./UpdateFile";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Package, Plus, Search } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getCategory();
    getProduct(100);
  }, []);

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.name === "price" || e.target.name === "quantity"
        ? Number(e.target.value)
        : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      return toast.warning("Please provide a product title.");
    }
    if (!form.categoryId) {
      return toast.warning("Please select a category.");
    }

    setIsSubmitting(true);
    try {
      const res = await createProduct(token, form);
      setForm(initialState);
      getProduct(100);
      toast.success(`Product "${res.data.title}" added to store!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      try {
        await deleteProduct(token, id);
        getProduct(100);
        toast.success(`"${title}" deleted successfully`);
      } catch (err) {
        toast.error("Failed to delete product");
      }
    }
  };

  const filteredProducts = products.filter((p) =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Product Creation Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="pb-6 border-b border-slate-100">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-600" />
            <span>Create New Product</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fill in technical specifications, inventory volume, and upload media assets.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Product Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleOnChange}
                placeholder="e.g. Nova ANC Wireless Headphones"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Category
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleOnChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              >
                <option value="" disabled>
                  Select category
                </option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Full Product Description
            </label>
            <textarea
              rows={3}
              name="description"
              value={form.description}
              onChange={handleOnChange}
              placeholder="Describe key features, battery specifications, and materials..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Price (THB)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleOnChange}
                  min={0}
                  step="any"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Inventory Stock (EA)
              </label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleOnChange}
                min={0}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Image Uploader */}
          <div className="pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Product Images
            </label>
            <UpdateFile form={form} setForm={setForm} />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? "Creating Product..." : "Save Product to Catalog"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Active Inventory ({filteredProducts.length} items)
            </h3>
            <p className="text-xs text-slate-500">Edit stock counts, prices, or remove items.</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search catalog..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 pl-3">Item</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Stock</th>
                <th className="pb-3">Sold</th>
                <th className="pb-3">Last Updated</th>
                <th className="pb-3 pr-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredProducts.map((item) => {
                const imageUrl = item.images && item.images.length > 0
                  ? item.images[0].url
                  : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80";

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 pl-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={imageUrl}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                        />
                        <div className="max-w-[200px]">
                          <span className="font-bold text-slate-900 block truncate">{item.title}</span>
                          <span className="text-[11px] text-slate-400 line-clamp-1">{item.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-semibold">
                        {item.category?.name || "General"}
                      </span>
                    </td>
                    <td className="py-3.5 font-bold text-slate-900">
                      ฿{formatPrice(item.price)}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`font-black ${
                          item.quantity <= 10 ? "text-amber-600" : "text-slate-800"
                        }`}
                      >
                        {item.quantity}
                      </span>
                    </td>
                    <td className="py-3.5 font-semibold text-slate-500">
                      {item.sold || 0}
                    </td>
                    <td className="py-3.5 text-slate-400 text-[11px]">
                      {formatDate(item.updatedAt)}
                    </td>
                    <td className="py-3.5 pr-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/admin/product/${item.id}`}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                          title="Edit product"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FormProduct;
