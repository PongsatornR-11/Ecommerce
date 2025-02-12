import React, { useEffect, useState } from "react";

import useEcomStore from "../../store/ecom-store";
import { createProduct, deleteProduct } from "../../api/product";
import { toast } from "react-toastify";
import UpdateFile from "./UpdateFile";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
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

const FromProduct = () => {
  const token = useEcomStore((state) => state.token);

  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);

  const getProduct = useEcomStore((state) => state.getProduct);
  const products = useEcomStore((state) => state.products);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    quantity: 0,
    categoryId: "",
    images: [],
  });

  useEffect(() => {
    getCategory();
    getProduct(100);
  }, []);

  const handleOnChange = (e) => {
    // console.log(e.target.name, e.target.value)
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);
    try {
      const res = await createProduct(token, form);
      console.log(res);
      setForm(initialState);
      getProduct();
      toast.success(`Add ${res.data.title} Qty ${res.data.quantity} success!`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Confirm to delete ${title}`)) {
      try {
        const res = await deleteProduct(token, id);
        console.log(res);
        getProduct();
        toast.success(`${title} has been deleted!!`);
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <div className="container mx-auto p-4 bg-[#ffffff] shadow-md">
      <form onSubmit={handleSubmit}>
        <h1 className="font-bold text-xl mb-3">Add Product details</h1>
        <div className="flex flex-col space-y-3 items-left">

          <div className="w-80 ">
            <label className="text-sm">Product Title</label>
            <input
              className="border w-full px-3 py-1 rounded-md 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.title}
              onChange={handleOnChange}
              placeholder="Enter product name here"
              name="title"
            />
          </div>
          <div className="flex">
            <div className="w-2/3 ">
              <label className="text-sm">Product Description</label>
              <textarea
                className="block w-64 h-20 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                value={form.description}
                onChange={handleOnChange}
                placeholder="Enter product here"
                name="description"
              ></textarea>
            </div>

            <div>
              <div className=" w-1/3">
                <label className="text-sm">Product Price</label>
                <div className="flex">
                  <input
                    className="border"
                    type="number"
                    value={form.price}
                    onChange={handleOnChange}
                    placeholder="Enter price here"
                    name="price"
                  />
                  <span>THB</span>
                </div>
              </div>

              <div>
                <label className="text-sm">Product Quantity</label>
                <div className="flex">
                  <input
                    className="border"
                    type="number"
                    value={form.quantity}
                    onChange={handleOnChange}
                    placeholder="Enter quantity here"
                    name="quantity"
                  />
                  <span>EA</span>
                </div>
              </div>
            </div>
          </div>


          <p>Category</p>
          <select
            className="border"
            name="categoryId"
            onChange={handleOnChange}
            required
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
        <hr />
        {/* upload file */}

        <UpdateFile form={form} setForm={setForm} />

        <button
          className="
                    bg-blue-400 p-2 rounded-md shadow-md 
                    hover:scale-105 hover:-translate-y-1 hover:duration-200
                "
        >
          Add Product
        </button>

        <hr />
        <br />
        <table className="table w-full border">
          <thead>
            <tr className="bg-gray-400 border">
              <th scope="col">No.</th>
              <th scope="col">Picture</th>
              <th scope="col">Product Name</th>
              <th scope="col">Description</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Sold</th>
              <th scope="col">Update date</th>
              <th scope="col">Manage</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => {
              return (
                <tr key={index} className="hover:bg-gray-100 transition-colors">
                  <th scope="row">{index + 1}</th>

                  <td>
                    {item.images.length > 0 ? (
                      <img
                        src={item.images[0].url}
                        className="w-24 h-24 rounded-lg shadow-sm object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 rounded-sm flex items-center justify-center shadow-sm">
                        No Image
                      </div>
                    )}
                  </td>

                  <td>{item.title.length > 15 ? item.title.substring(0, 15) + "..." : item.title}</td>
                  <td className="text-sm">{item.description.length > 30 ? item.description.substring(0, 30) + "..." : item.description}</td>
                  <td>{formatPrice(item.price)} THB</td>
                  <td>{item.quantity}</td>
                  <td>{item.sold}</td>
                  <td>{formatDate(item.updatedAt)}</td>

                  <td className="flex gap-2">
                    <div className="flex flex-col space-y-2 justify-between">

                      <div>
                        <Link to={"/admin/product/" + item.id}>
                          <p
                            className="cursor-pointer 
                                  hover:scale-105 hover:-translate-y-1 hover:duration-200 
                                  bg-yellow-500 rounded-md p-1 shadow-md "
                          >
                            <Pencil />
                          </p>
                        </Link>
                      </div>
                      <p
                        className="cursor-pointer 
                                hover:scale-105 hover:-translate-y-1 hover:duration-200 
                                bg-red-400 rounded-md p-1 shadow-md flex"
                        onClick={() => handleDelete(item.id, item.title)}
                      >
                        <Trash2 />
                      </p>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default FromProduct;
