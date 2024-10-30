//rafce

import React, { useState, useEffect } from "react";

import { createCategory, listCategory, removeCategory } from "../../api/Category";

import useEcomStore from "../../store/ecom-store";

import { toast } from 'react-toastify'

const FromCategory = () => {

  const token = useEcomStore((state) => state.token);

  // add category
  const [categoryName, setCategoryName] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent refresh page when run function handlerSubmit
    if (!categoryName) {
      return toast.warning('Please fill data')
    }
    try {
      const res = await createCategory(token, { name: categoryName });
      toast.success(`Add Catergory ${res.data.name} Success`)
      getCategory(token)
    } catch (err) {
      console.log(err);
    }
  };


  // list category 
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    getCategory(token)
  }, [])

  async function getCategory(token) {
    try {
      const res = await listCategory(token);
      // console.log(res)
      setCategories(res.data)
    } catch (err) {
      console.log(err);
      const errMsg = err.response?.data?.message;
      toast.error(errMsg);
    }
  }

  // remove category
  const handleRemove = async(id)=>{
    try{
      const res = await removeCategory(token,id)
      getCategory(token)
      toast.warning(`Removed ${res.data.name} `)
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className="container mx-auto p-4 bg-[#ffffff] shadow-md">
      <h1>Category Management</h1>
      <form className="my-4" onSubmit={handleSubmit}>
        <input
          onChange={(e) => setCategoryName(e.target.value)}
          className="border"
          type="text"
        />

        <button className="bg-[#00ADB5]">Add Category</button>
      </form>

      <hr />

      <ul className="list-none">

        {
          categories.map((item, index) =>
            <li 
              className="flex justify-between my-2"
              key={index}
              >
              <span>
                {item.name}
              </span>
              
              <button 
                className="bg-red-400"
                onClick={()=>handleRemove(item.id)}
              >
                Delete
              </button>
            </li>
          )
        }

      </ul>

    </div>
  );
};

export default FromCategory;
