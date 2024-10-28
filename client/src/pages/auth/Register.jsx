//rafce

import React, { useState } from "react";
import axios from "axios";

import { toast } from "react-toastify";

const Register = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleOnchange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      return alert("Password is not match!!");
    }
    // send to back end.
    try {
      const res = await axios.post("http://localhost:5000/api/register", form);
      toast.success(res.data);
    } catch (err) {
      const errMsg = err.response?.data?.message;
      toast.error(errMsg);
    }
  };

  return (
    <div>
      Register
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
        Confirm Password
        <input
          onChange={handleOnchange}
          className="border"
          name="confirmPassword"
          type="text"
        />
        <button className="bg-blue-400 rounded-md">Register</button>
      </form>
    </div>
  );
};

export default Register;
