//rafce

import React, { useState } from "react";

import { createCategory } from "../../api/Category";

import useEcomStore from "../../store/ecom-store";

const FromCategory = () => {
  const token = useEcomStore((state) => state.token);
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent refresh page when run function handlerSubmit
    try {
      const res = await createCategory(token, { name });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="container mx-auto p-4 bg-[#ffffff] shadow-md">
      <h1>Category Management</h1>
      <form className="my-4" onSubmit={handleSubmit}>
        <input
          onChange={(e) => setName(e.target.value)}
          className="border"
          type="text"
        />

        <button className="bg-[#00ADB5]">Add Category</button>
      </form>
    </div>
  );
};

export default FromCategory;
