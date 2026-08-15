import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import { readProduct, updateProduct } from "../../api/product";
import { toast } from "react-toastify";
import UpdateFile from "./UpdateFile";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Package, ArrowLeft, Save } from "lucide-react";

const FormEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useEcomStore((state) => state.token);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    quantity: 0,
    categoryId: "",
    images: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getCategory();
    if (id) {
      setIsLoading(true);
      readProduct(token, id)
        .then((res) => {
          setForm(res.data);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to load product details");
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

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
    setIsSubmitting(true);
    try {
      await updateProduct(token, id, form);
      toast.success(`Updated "${form.title}" successfully!`);
      navigate("/admin/product");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading product editor...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/admin/product"
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Product Catalog</span>
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="pb-6 border-b border-slate-100">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-600" />
            <span>Edit Product: {form.title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Update pricing, inventory volume, or descriptive assets.
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
                value={form.categoryId || ""}
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
              Product Description
            </label>
            <textarea
              rows={4}
              name="description"
              value={form.description}
              onChange={handleOnChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Price (THB)
              </label>
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

            {/* Quantity */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Stock Quantity (EA)
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

          {/* Images */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Product Image Assets
            </label>
            <UpdateFile form={form} setForm={setForm} />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? "Saving Changes..." : "Save Product Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormEditProduct;
