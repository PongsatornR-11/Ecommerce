//rafce

import React, { useState } from "react";

// import redirect module
import { useNavigate } from "react-router-dom";

// for handle with back end
import axios from "axios";

// Zustand State Management (global state)
import useEcomStore from "../../store/ecom-store";

import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email!' }),
    password: z.string()
  })

const Login = () => {
  const navigate = useNavigate();

  // check invalid password
  const [Invalid, setInvalid] = useState(false);
  // from store folder use zustand
  const actionLogin = useEcomStore((state) => state.actionLogin);
  const user = useEcomStore((state) => state.user);

  // Redirect to '/shop' if user is already logged in
  if (user) {
    navigate('/shop');
  }
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data) => {

    try {
      const res = await actionLogin(data)
      const role = res.data.payload.role
      const roleRedirect = (role) => {
        if (role === "admin") {
          navigate('/admin');
        } else {
          navigate(-1);
        }
      }
      roleRedirect(role)
    } catch (err) {
      const errMsg = err.response?.data?.message;
      setInvalid(true)

    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="w-full shadow-md px-8 max-w-md bg-gray-200 rounded-md">
        <h1 className="text-2xl text-center my-3 font-bold text-gray-600">
          login
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-3 my-5 rounded-md">
            <div>
              <input {...register('email')}
                placeholder="Email"
                className={`border w-full px-3 py-2 rounded-md 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            ${errors.email && 'border-red-500'}`} />
              {errors.email &&
                <p className="text-red-500 text-sm">
                  {errors.email.message}
                </p>
              }
            </div>

            <div>
              <input {...register('password')}
                type="password"
                placeholder="Password"
                className={`border w-full px-3 py-2 rounded-md 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            ${errors.password && 'border-red-500'}`} />
              {Invalid &&
                <p className="text-red-500 text-sm">
                  Password is incorrect !
                </p>
              }

            </div>

            <button className="bg-blue-400 rounded-md w-full my-2 text-white py-2 shadow-md hover:bg-cyan-600 hover:duration-200">
              Register
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Login;
