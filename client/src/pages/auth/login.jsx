//rafce

import React, { useState } from "react";

// for handle with back end 
import axios from "axios";

// for handle error , alart
import { toast } from "react-toastify";

// Zustand State Management (global state)
import useEcomStore from "../../store/ecom-store";

const Login = () => {

  // from store folder user zustand 
  const actionLogin = useEcomStore((state) => state.actionLogin)


  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleOnchange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try{
      //from Zustand 
      const res = await actionLogin(form)
      toast.success(`${res.data.payload.email} log in Success`)
    }catch(err){
      const errMsg = err.response?.data?.message
      toast.error(errMsg)
    }
  };

  return (
    <div>
      Login
      <form onSubmit={handleSubmit}>
        Email
        <input
          onChange={handleOnchange}
          className="border"
          name="email"
          type="email"
          placeholder="Enter Email here"
        />
        Password
        <input
          onChange={handleOnchange}
          className="border"
          name="password"
          type="text"
        />
        <button className="bg-blue-400 rounded-md">Login</button>
      </form>
    </div>
  );
};

export default Login;
