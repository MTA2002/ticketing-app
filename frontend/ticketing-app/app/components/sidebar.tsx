"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { MdDashboard } from "react-icons/md"; // Material Design icon
import { FaUsers } from "react-icons/fa"; // Font Awesome icon
import { IoTicket } from "react-icons/io5"; // Ionicons icon
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaHistory } from "react-icons/fa";
import User from "@/types/userInterface";
import { userService } from "@/lib/api/userService";

const SideBarItem = ({
  isActive,
  icon,
  text,
  linkUrl,
}: {
  isActive: boolean;
  icon: ReactNode;
  text: string;
  linkUrl: string;
}) => {
  return (
    <Link href={linkUrl} className="flex">
      <div className={` ${isActive ? "bg-[#fe5c59]" : ""} w-2`}></div>
      <div
        className={` ${
          isActive && "bg-[#fff3f2] text-[#FF5B5A]"
        }  w-full py-3 pl-5 flex items-center gap-2`}
      >
        {icon}

        <p>{text}</p>
      </div>
    </Link>
  );
};

const sideBarLinks = [
  {
    url: "/dashboard",
    text: "Dashboard",
    iconUrl: <MdDashboard />,
  },
  {
    url: "/users",
    text: "Users",
    iconUrl: <FaUsers />,
  },
  {
    url: "/tickets",
    text: "Tickets",
    iconUrl: <IoTicket />,
  },
  {
    url: "/activity-logs",
    text: "Activity Logs",
    iconUrl: <FaHistory />,
  },
];

const AppSideBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPath = usePathname();
  const [user, setUser] = useState<User>();

  const getCurrentUser = async () => {
    const cur_user = await userService.getCurrentUser(
      localStorage.getItem("email")!
    );
    setUser(cur_user!);
  };

  useEffect(() => {
    if (currentPath.includes("users")) {
      setCurrentIndex(1);
    } else if (currentPath.includes("tickets")) {
      setCurrentIndex(2);
    } else if (currentPath.includes("activity")) {
      setCurrentIndex(3);
    } else {
      setCurrentIndex(0);
    }
    getCurrentUser();
  }, [currentPath]);

  return (
    <div className="min-h-[100dvh] h-full min-w-56 border-r shadow py-5 flex flex-col justify-between sticky top-16 z-10">
      <div className="flex flex-col gap-5">
        {sideBarLinks.map((link, index) => {
          if (user?.role != "admin" || user == null) {
            if (index == 0 || index == 2) {
              return (
                <div
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                  }}
                >
                  <SideBarItem
                    isActive={currentIndex == index}
                    icon={link.iconUrl}
                    text={link.text}
                    linkUrl={link.url}
                  />
                </div>
              );
            }
          } else {
            return (
              <div
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                }}
              >
                <SideBarItem
                  isActive={currentIndex == index}
                  icon={link.iconUrl}
                  text={link.text}
                  linkUrl={link.url}
                />
              </div>
            );
          }
        })}
      </div>
      <Image src={"/Bg.svg"} alt="image" height={230} width={230}></Image>
    </div>
  );
};

export default AppSideBar;
