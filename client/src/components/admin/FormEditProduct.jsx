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
    getCategory(token);
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
    <div className="container mx-auto p-4 bg-[#ffffff] shadow-md">
      <form onSubmit={handleSubmit}>
        <h1>Add Product details</h1>
        <input
          className="border"
          value={form.title}
          onChange={handleOnChange}
          placeholder="Enter product name here"
          name="title"
        />
        <input
          className="border"
          value={form.description}
          onChange={handleOnChange}
          placeholder="Enter product here"
          name="description"
        />
        <input
          className="border"
          type="number"
          value={form.price}
          onChange={handleOnChange}
          placeholder="Enter price here"
          name="price"
        />
        <input
          className="border"
          type="number"
          value={form.quantity}
          onChange={handleOnChange}
          placeholder="Enter quantity here"
          name="quantity"
        />
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
        <hr />
        {/* upload file */}

        <UpdateFile form={form} setForm={setForm} />

        <button className="bg-blue-400">Edit Product</button>

        <hr />
        <br />
      </form>
    </div>
  );
};

export default FromEditProduct;
