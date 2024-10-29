//rafce

import React, { useState } from "react";

import { createCategory } from "../../api/Category";

import useEcomStore from "../../store/ecom-store";

import { toast } from 'react-toastify'

const FromCategory = () => {
  const token = useEcomStore((state) => state.token);
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent refresh page when run function handlerSubmit
    if(!name){
        return toast.warning('Please fill data')
    }
    try {
      const res = await createCategory(token, { name });
      toast.success(`Add Catergory ${res.data.name} Success`)
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
