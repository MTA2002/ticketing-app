"use client";
import React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import User from "@/types/userInterface";
import { userService } from "@/lib/api/userService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

// Define the schema using zod
const addUserSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required." })
    .max(150, { message: "Username must not exceed 150 characters." })
    .regex(/^[\w.@+-]+$/, {
      message: "Username can only contain letters, digits, @/./+/-/_",
    }),
  email: z.string().email({ message: "Invalid email address." }),
  // profile_image: z.string().url({ message: "Invalid URL for profile image." }),
  role: z.enum(["admin", "staff", "student", "technician"], {
    errorMap: () => ({
      message: "Role must be one of admin, staff, student, or technician.",
    }),
  }),
});

// Infer the type from the schema
type AddUserSchemaType = z.infer<typeof addUserSchema>;

const AddUser = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddUserSchemaType>({ resolver: zodResolver(addUserSchema) });
  const notify = (message: string) => toast(message);
  const token = localStorage.getItem("access_token");
  const router = useRouter();

  if (!token) {
    router.push("/auth/login");
    return;
  }

  const onSubmit = handleSubmit(async (formData) => {
    const user: User = {
      role: formData.role,
      email: formData.email,
      username: formData.username,
      profile_image: "",
      password: "A@a23456",
      confirm_password: "A@a23456",
    };

    const response = await userService.createUser(user);

    console.log(response + "mahfouz");
    if (response == "User created successfully") {
      alert(response);
      router.back();
      reset();
    } else {
      alert(response);
    }
  });

  return (
    <div className="flex items-center justify-center py-10 px-7">
      <div className="flex flex-col items-center flex-grow max-w-lg">
        <h1 className="text-[24px] font-medium">Add New User</h1>
        <form className="pt-6 flex flex-col gap-4 w-full" onSubmit={onSubmit}>
          {/* Username */}
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="font-medium">
              Username
            </label>
            <input
              id="username"
              placeholder="Enter username"
              className={`border p-2 rounded focus:outline-none ${
                errors.username && "border-red-400"
              }`}
              {...register("username")}
            />
            {errors.username && (
              <span className="text-red-400">{errors.username.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-medium">
              Email
            </label>
            <input
              id="email"
              placeholder="Enter email"
              className={`border p-2 rounded focus:outline-none ${
                errors.email && "border-red-400"
              }`}
              {...register("email")}
            />
            {errors.email && (
              <span className="text-red-400">{errors.email.message}</span>
            )}
          </div>

          {/* Profile Image */}
          {/* <div className="flex flex-col gap-1">
            <label htmlFor="profile_image" className="font-medium">
              Profile Image URL
            </label>
            <input
              id="profile_image"
              placeholder="Enter profile image URL"
              className={`border p-2 rounded focus:outline-none ${
                errors.profile_image && "border-red-400"
              }`}
              {...register("profile_image")}
            />
            {errors.profile_image && (
              <span className="text-red-400">
                {errors.profile_image.message}
              </span>
            )}
          </div> */}

          {/* Role */}
          <div className="flex flex-col gap-1">
            <label htmlFor="role" className="font-medium">
              Role
            </label>
            <select
              id="role"
              className={`border p-2 rounded focus:outline-none ${
                errors.role && "border-red-400"
              }`}
              {...register("role")}
            >
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="student">Student</option>
              <option value="technician">Technician</option>
            </select>
            {errors.role && (
              <span className="text-red-400">{errors.role.message}</span>
            )}
          </div>

          {/* Password */}
          {/* <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              className={`border p-2 rounded focus:outline-none ${
                errors.password && "border-red-400"
              }`}
              {...register("password")}
            />
            {errors.password && (
              <span className="text-red-400">{errors.password.message}</span>
            )}
          </div> */}

          {/* Confirm Password */}
          {/* <div className="flex flex-col gap-1">
            <label htmlFor="confirm_password" className="font-medium">
              Confirm Password
            </label>
            <input
              id="confirm_password"
              type="password"
              placeholder="Re-enter password"
              className={`border p-2 rounded focus:outline-none ${
                errors.confirm_password && "border-red-400"
              }`}
              {...register("confirm_password")}
            />
            {errors.confirm_password && (
              <span className="text-red-400">
                {errors.confirm_password.message}
              </span>
            )}
          </div> */}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#FF5B5A] py-2 rounded-lg text-white shadow focus:bg-[#e94f57] mt-4"
          >
            Add User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
