"use client";
import React, { useState } from "react";
import Image from "next/image";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api/authService";
import { ClipLoader } from "react-spinners";

const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(20, { message: "Password must not exceed 20 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/\d/, { message: "Password must contain at least one number." })
    .regex(/[@$!%*?&]/, {
      message:
        "Password must contain at least one special character (@$!%*?&).",
    }),
});

type loginSchemaType = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<loginSchemaType>({ resolver: zodResolver(loginSchema) });

  const router = useRouter();
  const [loading, setIsLoading] = useState(false);

  const onSubmit = handleSubmit(async (formData) => {
    setIsLoading(true);
    await loginUser(formData.email, formData.password);
    setIsLoading(false);
    localStorage.setItem("email", formData.email);
    router.push("/auth/verify-email");

    reset();
  });

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex flex-col items-center flex-grow">
        <div className="w-96">
          <h1 className="text-[34px] font-semibold">Welcome back</h1>
          <p className="text-[#636364]">
            Welcome back! Please enter your details.
          </p>
          <form
            action=""
            className="pt-10 flex flex-col gap-4"
            onSubmit={onSubmit}
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="font-medium">
                Email
              </label>
              <input
                type="text"
                id="email"
                placeholder="Enter your email"
                className={`border p-2 rounded-xl focus:outline-none ${
                  errors.email && "border-red-400 border-2"
                }`}
                {...register("email")}
              />
              {errors.email && (
                <span className="text-red-400">{errors.email.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                className={`border p-2 rounded-xl focus:outline-none ${
                  errors.password && "border-red-400 border-2"
                }`}
                placeholder="Enter your password"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-red-400 max-w-[380px] h-7 ">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* <div className="flex justify-between pb-10 pt-2">
              <div>
                <input type="checkbox" name="" id="rememberme" />
                <label htmlFor="rememberme" className="pl-1">
                  Remember me
                </label>
              </div>
              <button>Forgot password</button>
            </div> */}
            <button
              className="bg-[#FF5B5A] py-2 rounded-lg text-white shadow focus:bg-[#e94f57] mt-10"
              type="submit"
            >
              {loading ? <ClipLoader size={24} color="#000" /> : <p>Sign in</p>}
            </button>
          </form>
        </div>
      </div>

      <Image
        src={"/login-illustrator.svg"}
        alt="login-image"
        width={732}
        height={732}
        className="hidden md:block"
      ></Image>
    </div>
  );
};

export default LoginPage;
