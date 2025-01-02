"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import ActivityLog from "@/types/activityLogInterface";

// Define the User type based on the provided schema.

// Define the columns for the user table
export const columns = (): ColumnDef<ActivityLog>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span>{row.original.id}</span>,
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => <span>{row.original.username || "User"}</span>,
  },
  {
    accessorKey: "ip_address",
    header: "Ip Address",
    cell: ({ row }) => <span>{row.original.ip_address}</span>,
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => <span>{row.original.action}</span>,
  },
  {
    accessorKey: "timestamp",
    header: "TimeStamp",
    cell: ({ row }) => {
      const timestamp = row.original.timestamp;

      return (
        <span>
          {timestamp
            ? format(new Date(timestamp), "MMMM d, yyyy h:mm a")
            : "N/A"}
        </span>
      );
    },
  },
];
