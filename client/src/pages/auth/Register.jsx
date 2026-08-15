import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import zxcvbn from "zxcvbn";
import { registerUser } from "../../api/auth";
import { Lock, Mail, UserPlus } from "lucide-react";

const registerSchema = z
  .object({
    email: z.string().email({ message: "Invalid email format" }),
    password: z.string().min(6, { message: "Password must have at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const passwordVal = watch("password");

  useEffect(() => {
    if (passwordVal) {
      setPasswordScore(zxcvbn(passwordVal).score);
    } else {
      setPasswordScore(0);
    }
  }, [passwordVal]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser({
        email: data.email,
        password: data.password,
      });
      toast.success("Account created successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      const errMsg = err.response?.data?.message || "Registration failed";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    switch (score) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-amber-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-emerald-500";
      default:
        return "bg-slate-200";
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email address
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-5 w-5" />
              </div>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-xl border ${
                  errors.email ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-indigo-500"
                } focus:outline-none focus:ring-2`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-xl border ${
                  errors.password ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-indigo-500"
                } focus:outline-none focus:ring-2`}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}

            {passwordVal && (
              <div className="mt-2 space-y-1">
                <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className={`h-full rounded-full transition-all ${
                        index <= passwordScore ? getScoreColor(passwordScore) : "bg-slate-100"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 text-right">
                  {passwordScore <= 1 ? "Weak" : passwordScore <= 2 ? "Fair" : passwordScore === 3 ? "Good" : "Strong"}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm Password
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="••••••••"
                className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-xl border ${
                  errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-indigo-500"
                } focus:outline-none focus:ring-2`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 transition-colors"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" /> Create Account
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
