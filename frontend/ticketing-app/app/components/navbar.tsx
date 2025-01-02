"use client";
import React from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const router = useRouter();

  return (
    <div className="flex items-center py-4 px-6 justify-between w-full sticky top-0 z-10 bg-white shadow">
      <div className="flex items-center">
        <Image
          src={"/Logo (2).svg"}
          alt="logo-image"
          width={35}
          height={35}
        ></Image>
        <p className="pl-2 text-lg font-medium">Help desk</p>
      </div>
      <div className="flex gap-6">
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Image
              src={"/notification.svg"}
              alt="logo-image"
              width={20}
              height={20}
            ></Image>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button>
          <Image
            src={"/settings.svg"}
            alt="logo-image"
            width={20}
            height={20}
          ></Image>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Image
              src={"/avatar.webp"}
              alt="logo-image"
              width={30}
              height={30}
              className="rounded-full"
            ></Image>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Profile</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/auth/change-password">Change Password</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                router.push("/auth/login");
                router.refresh();
              }}
            >
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
