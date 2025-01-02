"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { verifyOtp, resendOtp } from "@/lib/api/authService";

const VerifyEmail = () => {
  const [value, setValue] = useState("");
  const router = useRouter();
  const email = localStorage.getItem("email")!;

  const notify = (message: string) => toast(message);

  const onSubmit = async () => {
    const response = await verifyOtp(email, value);

    if (response != "Invalid or expired refresh token") {
      notify("Authenticated");
      router.push("/dashboard");
      router.refresh();
    }
  };

  const resendOTP = async () => {
    await resendOtp(email);
    notify("OTP sent");
  };

  return (
    <div className="flex items-center justify-between p-4 flex-col">
      <Image
        src={"/login-illustrator.svg"}
        alt="login-image"
        width={232}
        height={332}
        className="hidden md:block"
      ></Image>

      <div className="max-w-xl flex flex-col items-center flex-grow text-center gap-4">
        <h1></h1>
        <h1 className="text-[34px] font-semibold">Verify Your Email Address</h1>
        <p className="text-[#636364]">
          We&apos;ve sent a one time password to {email}. Please enter it below.
        </p>
        <form action="" className="pt-10 flex flex-col gap-10">
          <InputOTP
            maxLength={6}
            value={value}
            onChange={(value) => setValue(value)}
          >
            <InputOTPGroup className="">
              <InputOTPSlot index={0} className="h-12 w-12" />
              <InputOTPSlot index={1} className="h-12 w-12" />
              <InputOTPSlot index={2} className="h-12 w-12" />
              <InputOTPSlot index={3} className="h-12 w-12" />
              <InputOTPSlot index={4} className="h-12 w-12" />
              <InputOTPSlot index={5} className="h-12 w-12" />
            </InputOTPGroup>
          </InputOTP>
          <ToastContainer />
          <div className="flex flex-col gap-4">
            <button
              className="bg-[#FF5B5A] py-2 rounded-lg text-white shadow focus:bg-[#e94f57]"
              onClick={(e) => {
                e.preventDefault();
                onSubmit();
              }}
              type="submit"
            >
              Verify Email
            </button>
            <button
              className="underline"
              onClick={(e) => {
                e.preventDefault();
                resendOTP();
              }}
            >
              Resend Code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
