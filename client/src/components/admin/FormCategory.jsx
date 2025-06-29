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
    <div className="container mx-auto p-4 bg-[#ffffff] shadow-md">
      <h1 className="text-xl font-bold">Category Management</h1>
      <form className="my-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <div className="flex flex-col w-1/3"> 
            <label className="text-sm">Category Name</label>
            <input
              onChange={(e) => setCategoryName(e.target.value)}
              className="border p-2 rounded-md shadow-sm"
              type="text"
            />
          </div>
          <button className="bg-[#00ADB5] p-2 rounded-md shadow-sm hover:bg-[#222831] hover:duration-200 hover:text-[#00ADB5]">Add Category</button>
        </div>
      </form>

      <hr />

      <ul className="list-item mt-4">
        {categories.map((item, index) => (
          <li className="flex justify-between my-2 py-1 rounded-md hover:bg-gray-400 hover:duration-100" key={index}>
            <span className="ml-2">{item.name}</span>

            <button
              className="bg-red-300 p-2 rounded-md shadow-sm hover:bg-red-500 hover:duration-200 hover:text-white mr-2"
              onClick={() => handleRemove(item.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FromCategory;
