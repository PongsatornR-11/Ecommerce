//rafce

import React, { useState } from "react";

const Register = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleOnchange = (event) => {
    console.log(event.target.name, event.target.value);
    setForm({});
  };

  return (
    <div>
      Register
      <form>
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
          type="password"
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
