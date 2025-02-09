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
      const res = await axios.post("http://localhost:5000/api/register", data);
      toast.success(res.data);
    } catch (err) {
      const errMsg = err.response?.data?.message;
      toast.error(errMsg);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="w-full shadow-md px-8 max-w-md bg-gray-200 rounded-md">
        <h1 className="text-2xl text-center my-3 font-bold text-gray-600">
          Register
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
              {errors.password &&
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              }

              {
                watch().password?.length >= 8 &&
                <div>
                  <div className="flex mt-2">
                    {
                      Array.from(Array(passwordScore).keys()).map((item, index) => {
                        return (
                          <div className="w-1/5 px-1" key={index}>
                            <div className={`h-2 rounded-md
                                ${passwordScore <= 2
                                ? 'bg-red-500'
                                : passwordScore < 4
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                              }`
                            }
                            >
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                  <div className={`text-sm  
                    ${passwordScore <= 2
                      ? 'text-red-600'
                      : passwordScore < 4
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}>
                    {passwordScore <= 2 ? 'Password is too weak' : passwordScore < 4 ? 'Password is fine ' : 'Password is strong'}
                  </div>
                </div>
              }
            </div>

            <div>
              <input {...register('confirmPassword')}
                type="password"
                placeholder="Confirm password"
                className={`border w-full px-3 py-2 rounded-md 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            ${errors.confirmPassword && 'border-red-500'}`} />
              {errors.confirmPassword &&
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
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

export default Register;
