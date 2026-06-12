//rafce

import React, { useState, useEffect } from "react";
import axios from "axios";

import { toast } from "react-toastify";

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'


import zxcvbn from 'zxcvbn' // use .score to check score of password

const registerSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email!' }),
    password: z.string().min(8, { message: 'Password must have at least 8 letters' }),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password is not match',
    path: ["confirmPassword"],
  })

const Register = () => {

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema)
  })

  const [passwordScore, setPasswordScore] = useState(0)

  useEffect(() => {
    setPasswordScore(validatePassword)
  }, [watch().password])

  const validatePassword = () => {
    let password = watch().password
    return zxcvbn(password ? password : '').score
  }


  const onSubmit = async (data) => {
    // console.log(data)
    // const passwordScore = zxcvbn(data.password).score // check password score
    console.log(passwordScore)
    if (passwordScore < 3) {
        toast.warning('Password to weak')
        return
    }
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await axios.post(`${API_BASE_URL}/register`, data);
      toast.success(res.data);
    } catch (err) {
      const errMsg = err.response?.data?.message;
      toast.error(errMsg);
    }
  }

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-8 rounded-2xl shadow-sm space-y-6 transition-colors duration-200">
        <h1 className="text-xl font-extrabold text-center text-slate-800 dark:text-slate-100 uppercase tracking-wider">
          Register
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
                placeholder="Password (min 8 chars)"
                className={`w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                  errors.password ? 'border-rose-500 focus:ring-rose-500' : ''
                }`} 
              />
              {errors.password && (
                <p className="text-rose-500 text-xs font-semibold mt-1 pl-1">
                  {errors.password.message}
                </p>
              )}

              {/* Password Strength Score */}
              {watch().password?.length >= 8 && (
                <div className="pt-1 space-y-1">
                  <div className="flex gap-1 h-1.5 mt-2.5">
                    {Array.from(Array(5).keys()).map((item, index) => (
                      <div className="w-1/5" key={index}>
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            index < passwordScore
                              ? passwordScore <= 2
                                ? 'bg-rose-500'
                                : passwordScore < 4
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              : 'bg-slate-100 dark:bg-slate-800'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className={`text-[10px] font-bold uppercase tracking-wider pl-0.5 mt-1.5 ${
                    passwordScore <= 2
                      ? 'text-rose-500'
                      : passwordScore < 4
                        ? 'text-amber-500'
                        : 'text-emerald-500'
                  }`}>
                    {passwordScore <= 2 ? 'Weak Password' : passwordScore < 4 ? 'Moderate Password' : 'Strong Password'}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1">
              <input 
                {...register('confirmPassword')}
                type="password"
                placeholder="Confirm Password"
                className={`w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                  errors.confirmPassword ? 'border-rose-500 focus:ring-rose-500' : ''
                }`} 
              />
              {errors.confirmPassword && (
                <p className="text-rose-500 text-xs font-semibold mt-1 pl-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 active:scale-98 transition-all duration-200 mt-2"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
