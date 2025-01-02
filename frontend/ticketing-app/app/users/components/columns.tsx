"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AiOutlineEye } from "react-icons/ai";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import User from "@/types/userInterface";

// Define the User type based on the provided schema.

// Define the columns for the user table
export const columns = (): ColumnDef<User>[] => {
  return [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <span>{row.original.id}</span>,
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => <span>{row.original.username}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <span>{row.original.email}</span>,
    },
    // {
    //   accessorKey: "profile_image",
    //   header: "Profile Image",
    //   cell: ({ row }) =>
    //     row.original.profile_image ? (
    //       <Image
    //         src={row.original.profile_image}
    //         alt={`${row.original.username}'s profile`}
    //         className="w-10 h-10 rounded-full"
    //         width={20}
    //         height={20}
    //       />
    //     ) : (
    //       <span>No Image</span>
    //     ),
    // },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <span>{row.original.role || "N/A"}</span>,
    },
    // {
    //   accessorKey: "created_at",
    //   header: "Created At",
    //   cell: ({ row }) => {
    //     const createdAt = row.original.created_at;

    //     return (
    //       <span>
    //         {createdAt
    //           ? format(new Date(createdAt), "MMMM d, yyyy h:mm a")
    //           : "N/A"}
    //       </span>
    //     );
    //   },
    // },
    // {
    //   accessorKey: "updated_at",
    //   header: "Updated At",
    //   cell: ({ row }) => {
    //     const updated_at = row.original.updated_at;

    //     return (
    //       <span>
    //         {updated_at
    //           ? format(new Date(updated_at), "MMMM d, yyyy h:mm a")
    //           : "N/A"}
    //       </span>
    //     );
    //   },
    // },
    {
      id: "actions", // Custom column for actions
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger className="text-green-500 hover:text-green-700">
              <AiOutlineEye size={20} />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
                <div className="text-gray flex flex-col gap-2">
                  <p>
                    <strong>ID:</strong> {row.original.id}
                  </p>
                  <p>
                    <strong>Username:</strong> {row.original.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {row.original.email}
                  </p>
                  {/* {row.original.profile_image && (
                    <p>
                      <strong>Profile Image:</strong>{" "}
                      <Image
                        src={row.original.profile_image}
                        alt={`${row.original.username}'s profile`}
                        className="w-16 h-16 rounded-full mt-2"
                        width={50}
                        height={50}
                      />
                    </p>
                  )} */}
                  <p>
                    <strong>Role:</strong> {row.original.role || "N/A"}
                  </p>
                  <p>
                    <strong>Created At:</strong>{" "}
                    {row.original.created_at
                      ? format(
                          new Date(row.original.created_at),
                          "MMMM d, yyyy h:mm a"
                        )
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Updated At:</strong>{" "}
                    {row.original.updated_at
                      ? format(
                          new Date(row.original.updated_at),
                          "MMMM d, yyyy h:mm a"
                        )
                      : "N/A"}
                  </p>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          {/* 
          <Link
            href={{
              pathname: "/users/edit-user",
              query: { id: row.original.id },
            }}
            onClick={() => console.log("Edit user:", row.original.id)}
            className="text-blue-500 hover:text-blue-700"
          >
            <FiEdit size={20} />
          </Link>
  
          <button
            onClick={() => {
              deleteUser(row.original.id!);
            }}
            className="text-red-500 hover:text-red-700"
          >
            <MdDelete size={20} />
          </button> */}
        </div>
      ),
    },
  ];
};
