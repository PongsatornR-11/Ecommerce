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

  const actionLogin = useEcomStore((state) => state.actionLogin);
  const user = useEcomStore((state) => state.user);


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data) => {
    console.log(data)
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
      console.log(errMsg)
      setInvalid(true)
    }
  }


  // Redirect to '/shop' if user is already logged in
  if (user) {
    navigate('/shop');
  }

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-8 rounded-2xl shadow-sm space-y-6 transition-colors duration-200">
        <h1 className="text-xl font-extrabold text-center text-slate-800 dark:text-slate-100 uppercase tracking-wider">
          Login
        </h1>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            
            {/* Email Input */}
            <div className="space-y-1">
              <input 
                {...register('email')}
                placeholder="Email Address"
                className={`w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                  errors.email ? 'border-rose-500 focus:ring-rose-500' : ''
                }`} 
              />
              {errors.email && (
                <p className="text-rose-500 text-xs font-semibold mt-1 pl-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <input 
                {...register('password')}
                type="password"
                placeholder="Password"
                className={`w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                  Invalid ? 'border-rose-500 focus:ring-rose-500' : ''
                }`} 
                onInput={() => setInvalid(false)} 
              />
              {Invalid && (
                <p className="text-rose-500 text-xs font-semibold mt-1 pl-1">
                  Password is incorrect!
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 active:scale-98 transition-all duration-200 mt-2"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
