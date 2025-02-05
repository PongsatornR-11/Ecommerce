//rafce

import React, { useState } from "react";
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

    // new
    const onSubmit = async (data) => {
        console.log(data)
        const passwordScore = zxcvbn(data.password).score // check password score
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
        <div>
            Register
            <form onSubmit={handleSubmit(onSubmit)}>
                Email
                <input {...register('email')} className="border" />
                {errors.email &&
                    <p className="text-red-500 text-sm">
                        {errors.email.message}
                    </p>
                }

                Password
                <input {...register('password')} className="border" />
                {errors.password &&
                    <p className="text-red-500 text-sm">
                        {errors.password.message}
                    </p>
                }
                Confirm Password
                <input {...register('confirmPassword')} className="border" />
                {errors.confirmPassword &&
                    <p className="text-red-500 text-sm">
                        {errors.confirmPassword.message}
                    </p>
                }
                <button className="bg-blue-400 rounded-md">Register</button>
            </form>
        </div>
    );
};

export default Register;
