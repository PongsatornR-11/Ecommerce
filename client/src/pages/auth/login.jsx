import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useEcomStore from "../../store/ecom-store";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Lock, Mail, ArrowRight } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const actionLogin = useEcomStore((state) => state.actionLogin);
  const user = useEcomStore((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/shop");
      }
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await actionLogin(data);
      toast.success("Welcome back!");
      const role = res.data.payload.role;
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/shop");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Invalid email or password";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Or{" "}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              create a new account today
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
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
            </div>
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
                Sign in <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
