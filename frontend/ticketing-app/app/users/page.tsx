"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import Link from "next/link";
import { userService } from "@/lib/api/userService";
import User from "@/types/userInterface";
import { useRouter } from "next/navigation";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await userService.listUsers();
      setUsers(fetchedUsers);
    };

    fetchUsers();
  }, []);

  const data = users.filter((cur_user) => {
    return (
      cur_user.id!.toString() == searchTerm ||
      cur_user.username.includes(searchTerm) ||
      cur_user.email.includes(searchTerm) ||
      cur_user.role!.includes(searchTerm)
    );
  });

  const deleteUser = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmed) {
      const newUsers = users.filter((cur_user) => cur_user.id !== id);
      setUsers(newUsers);
    }
  };

  const token = localStorage.getItem("access_token");
  const router = useRouter();

  if (!token) {
    router.push("/auth/login");
    return;
  }

  return (
    <div className="py-10 px-7">
      <p className="text-lg font-medium">Users</p>
      <div className="flex justify-between items-center py-6">
        <input
          placeholder="Search users..."
          className="border outline-none py-2 px-3 rounded min-w-80"
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />

        <Link
          href={"/users/add-user"}
          className="bg-[#FF5B5A] py-2 px-3 rounded text-white hover:bg-[#dd5e5e]"
        >
          + Add User
        </Link>
      </div>

      <DataTable columns={columns()} data={data} />
    </div>
  );
};

export default Users;
