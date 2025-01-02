"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "../users/components/data-table";
import { userService } from "@/lib/api/userService";
import { columns } from "./components/columns";
import ActivityLog from "@/types/activityLogInterface";
import { useRouter } from "next/navigation";

const ActivityLogs = () => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const token = localStorage.getItem("access_token");
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedLogs = await userService.getActivityLogs();
      setActivityLogs(fetchedLogs);
    };

    fetchUsers();
  }, []);

  if (!token) {
    router.push("/auth/login");
    return;
  }

  return (
    <div className="py-10 px-7">
      <p className="font-medium text-lg mb-5">Activity Logs</p>

      <DataTable columns={columns()} data={activityLogs} />
    </div>
  );
};

export default ActivityLogs;
