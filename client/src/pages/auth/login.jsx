//rafce

import React, { useState } from "react";

// import redirect module
import { useNavigate } from "react-router-dom";

// for handle with back end
import axios from "axios";

// for handle error , alart
import { toast } from "react-toastify";

// Zustand State Management (global state)
import useEcomStore from "../../store/ecom-store";

const Login = () => {
  const navigate = useNavigate();

  // from store folder use zustand
  const actionLogin = useEcomStore((state) => state.actionLogin);
  // const user = useEcomStore((state) => state.user);

  // handle change receive value form user on website
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

  //if user press Submit or login run this code.
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      //from Zustand
      const res = await actionLogin(form);
      console.log("res", res);

      const role = res.data.payload.role;
      console.log("role", role);

      // roleRedirect
      const roleRedirect = (role) => {
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      };

      roleRedirect(role);

      toast.success(`${res.data.payload.email} log in Success`);
    } catch (err) {
      const errMsg = err.response?.data?.message;
      toast.error(errMsg);
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
