"use client";
import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipLoader } from "react-spinners";
import { userService } from "@/lib/api/userService";
import User from "@/types/userInterface";

const changePasswordSchema = z
  .object({
    newPassword: z
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
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match.",
  });

type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
  });

  const [loading, setIsLoading] = useState(false);

  const onSubmit = handleSubmit(async (formData) => {
    setIsLoading(true);

    const cur_user = await userService.getCurrentUser(
      localStorage.getItem("email")!
    );

    const updatedUser: User = {
      ...cur_user,
      id: cur_user?.id || 0, // Provide a fallback for required fields
      username: cur_user?.username || "DefaultUsername", // Replace with an appropriate default
      email: cur_user?.email || "default@example.com",
      profile_image: cur_user?.profile_image || "",
      role: cur_user?.role || "user",
      created_at: cur_user?.created_at || new Date(),
      updated_at: cur_user?.updated_at || new Date(),
      created_tickets: cur_user?.created_tickets || [],
      assigned_tickets: cur_user?.assigned_tickets || [],
      password: formData.newPassword,
      confirm_password: formData.confirmNewPassword,
    };

    const response = await userService.updateUser(cur_user!.id!, updatedUser!);
    alert(response);

    setIsLoading(false);
    reset();
  });

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex flex-col items-center flex-grow">
        <div className="w-96">
          <h1 className="text-[34px] font-semibold">Change Password</h1>
          <p className="text-[#636364]">Update your password securely.</p>
          <form className="pt-10 flex flex-col gap-4" onSubmit={onSubmit}>
            <div className="flex flex-col gap-1">
              <label htmlFor="newPassword" className="font-medium">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                placeholder="Enter new password"
                className={`border p-2 rounded-xl focus:outline-none ${
                  errors.newPassword && "border-red-400 border-2"
                }`}
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <span className="text-red-400">
                  {errors.newPassword.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="confirmNewPassword" className="font-medium">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmNewPassword"
                placeholder="Re-enter new password"
                className={`border p-2 rounded-xl focus:outline-none ${
                  errors.confirmNewPassword && "border-red-400 border-2"
                }`}
                {...register("confirmNewPassword")}
              />
              {errors.confirmNewPassword && (
                <span className="text-red-400">
                  {errors.confirmNewPassword.message}
                </span>
              )}
            </div>

            <button
              className="bg-[#FF5B5A] py-2 rounded-lg text-white shadow focus:bg-[#e94f57] mt-10"
              type="submit"
            >
              {loading ? (
                <ClipLoader size={24} color="#000" />
              ) : (
                <p>Change Password</p>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
