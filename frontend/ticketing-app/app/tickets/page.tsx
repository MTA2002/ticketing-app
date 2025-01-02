"use client";
import { Ticket } from "@/types/ticketInterface";
import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

const TicketCard = ({ ticket }: { ticket: Ticket }) => {
  return (
    <div className="shadow py-10 px-5 min-w-[380px] border-2 rounded-lg flex flex-col mb-3">
      <div className="flex items-end justify-end mb-2">
        <p className="bg-red-300 w-fit px-2 py-1 rounded-xl self-end">
          {ticket.status}
        </p>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <Image
          src={"/Icon.svg"}
          alt="ticket-icon"
          width={30}
          height={30}
        ></Image>
        <p className="font-medium">{ticket.title}</p>
      </div>
      <hr className="mb-4" />
      <div className="flex justify-between">
        <div className="flex justify-between flex-col gap-3">
          <div>
            <p className="text-[#7E92A2]">User</p>
            <p className="font-medium">{ticket.created_by}</p>
          </div>
          <div>
            <p className="text-[#7E92A2]">Priority</p>
            <p className="font-medium">{ticket.created_by}</p>
          </div>
        </div>
        <div className="flex justify-between flex-col gap-3">
          <div>
            <p className="text-[#7E92A2]">Submitted</p>
            <p className="font-medium">
              {format(new Date(ticket.created_at!), "MMMM d, yyyy h:mm a")}
            </p>
          </div>
          <div>
            <p className="text-[#7E92A2]">Ticket ID</p>
            <p className="font-medium">{ticket.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Tickets = () => {
  const token = localStorage.getItem("access_token");

  const router = useRouter();

  if (!token) {
    router.push("/auth/login");
    return;
  }

  const tickets: Ticket[] = [
    {
      id: 1,
      title: "Login Issue",
      description: "Unable to log in with correct credentials.",
      category: "Authentication",
      priority: "high",
      supplementary_image: "https://via.placeholder.com/150",
      created_by: 101,
      assigned_to: 201,
      status: "open",
      created_at: "2024-01-01T08:30:00Z",
      updated_at: "2024-01-02T10:15:00Z",
      comments: [],
    },
    {
      id: 2,
      title: "Page Load Timeout",
      description: "Dashboard page takes too long to load.",
      category: "Performance",
      priority: "medium",
      created_by: 102,
      assigned_to: 202,
      status: "in_progress",
      created_at: "2024-01-02T09:00:00Z",
      updated_at: "2024-01-03T11:00:00Z",
      comments: [],
    },
    {
      id: 3,
      title: "Broken Link",
      description: "The 'Help' page link is broken.",
      category: "Bug",
      priority: "low",
      created_by: 103,
      assigned_to: 203,
      status: "resolved",
      created_at: "2024-01-03T12:00:00Z",
      updated_at: "2024-01-04T14:00:00Z",
      comments: [],
    },
    {
      id: 4,
      title: "UI Overlap",
      description: "Elements overlap on smaller screens.",
      category: "UI/UX",
      priority: "medium",
      created_by: 104,
      assigned_to: 204,
      status: "in_progress",
      created_at: "2024-01-04T14:30:00Z",
      updated_at: "2024-01-05T15:45:00Z",
      comments: [],
    },
    {
      id: 5,
      title: "Error 500",
      description: "Internal server error on the profile page.",
      category: "Backend",
      priority: "high",
      created_by: 105,
      assigned_to: 205,
      status: "open",
      created_at: "2024-01-05T16:00:00Z",
      updated_at: "2024-01-06T17:00:00Z",
      comments: [],
    },
    {
      id: 6,
      title: "Data Sync Issue",
      description: "Data not syncing between devices.",
      category: "Synchronization",
      priority: "high",
      created_by: 106,
      assigned_to: 206,
      status: "open",
      created_at: "2024-01-06T09:30:00Z",
      updated_at: "2024-01-07T10:30:00Z",
      comments: [],
    },
    {
      id: 7,
      title: "Typography Issue",
      description: "Font size too small for headers.",
      category: "UI/UX",
      priority: "low",
      created_by: 107,
      assigned_to: 207,
      status: "resolved",
      created_at: "2024-01-07T11:45:00Z",
      updated_at: "2024-01-08T13:30:00Z",
      comments: [],
    },
    {
      id: 8,
      title: "Feature Request: Dark Mode",
      description: "Users requesting dark mode support.",
      category: "Feature Request",
      priority: "medium",
      created_by: 108,
      assigned_to: 208,
      status: "in_progress",
      created_at: "2024-01-08T13:00:00Z",
      updated_at: "2024-01-09T15:00:00Z",
      comments: [],
    },
    {
      id: 9,
      title: "Notifications Not Working",
      description: "Push notifications are not being sent.",
      category: "Notification",
      priority: "high",
      created_by: 109,
      assigned_to: 209,
      status: "open",
      created_at: "2024-01-09T14:00:00Z",
      updated_at: "2024-01-10T16:30:00Z",
      comments: [],
    },
    {
      id: 10,
      title: "Session Expiry",
      description: "User session expires too quickly.",
      category: "Authentication",
      priority: "medium",
      created_by: 110,
      assigned_to: 210,
      status: "closed",
      created_at: "2024-01-10T15:30:00Z",
      updated_at: "2024-01-11T17:00:00Z",
      comments: [],
    },
    {
      id: 11,
      title: "Profile Image Upload Issue",
      description: "Unable to upload profile pictures.",
      category: "File Upload",
      priority: "medium",
      created_by: 111,
      assigned_to: 211,
      status: "open",
      created_at: "2024-01-11T08:30:00Z",
      updated_at: "2024-01-12T10:00:00Z",
      comments: [],
    },
    {
      id: 12,
      title: "Search Not Returning Results",
      description: "Search functionality not working.",
      category: "Search",
      priority: "high",
      created_by: 112,
      assigned_to: 212,
      status: "in_progress",
      created_at: "2024-01-12T11:00:00Z",
      updated_at: "2024-01-13T12:45:00Z",
      comments: [],
    },
    {
      id: 13,
      title: "Email Not Sent",
      description: "Forgot password email not sent.",
      category: "Email",
      priority: "high",
      created_by: 113,
      assigned_to: 213,
      status: "resolved",
      created_at: "2024-01-13T13:15:00Z",
      updated_at: "2024-01-14T14:30:00Z",
      comments: [],
    },
    {
      id: 14,
      title: "Broken Dropdown Menu",
      description: "Dropdown not expanding on click.",
      category: "UI/UX",
      priority: "low",
      created_by: 114,
      assigned_to: 214,
      status: "closed",
      created_at: "2024-01-14T15:00:00Z",
      updated_at: "2024-01-15T16:15:00Z",
      comments: [],
    },
    {
      id: 15,
      title: "Crash on Logout",
      description: "App crashes when logging out.",
      category: "Bug",
      priority: "high",
      created_by: 115,
      assigned_to: 215,
      status: "open",
      created_at: "2024-01-15T17:30:00Z",
      updated_at: "2024-01-16T18:45:00Z",
      comments: [],
    },
    {
      id: 16,
      title: "API Response Delay",
      description: "API responses are delayed significantly.",
      category: "Backend",
      priority: "medium",
      created_by: 116,
      assigned_to: 216,
      status: "in_progress",
      created_at: "2024-01-16T08:45:00Z",
      updated_at: "2024-01-17T10:00:00Z",
      comments: [],
    },
    {
      id: 17,
      title: "UI Scaling Issue",
      description: "UI elements not scaling properly on tablets.",
      category: "UI/UX",
      priority: "medium",
      created_by: 117,
      assigned_to: 217,
      status: "resolved",
      created_at: "2024-01-17T11:15:00Z",
      updated_at: "2024-01-18T13:30:00Z",
      comments: [],
    },
    {
      id: 18,
      title: "Feature Request: Export Data",
      description: "Users requesting the ability to export data.",
      category: "Feature Request",
      priority: "medium",
      created_by: 118,
      assigned_to: 218,
      status: "open",
      created_at: "2024-01-18T14:00:00Z",
      updated_at: "2024-01-19T15:45:00Z",
      comments: [],
    },
    {
      id: 19,
      title: "Audio Playback Issue",
      description: "Audio stops playing unexpectedly.",
      category: "Multimedia",
      priority: "high",
      created_by: 119,
      assigned_to: 219,
      status: "in_progress",
      created_at: "2024-01-19T16:30:00Z",
      updated_at: "2024-01-20T18:00:00Z",
      comments: [],
    },
    {
      id: 20,
      title: "Password Complexity Error",
      description: "Error message shown for valid passwords.",
      category: "Authentication",
      priority: "low",
      created_by: 120,
      assigned_to: 220,
      status: "resolved",
      created_at: "2024-01-20T08:15:00Z",
      updated_at: "2024-01-21T09:30:00Z",
      comments: [],
    },
  ];

  return (
    <div className="py-10 px-7">
      <div className="flex justify-between mb-5">
        <p className="text-lg">
          Total: <span className="font-medium">1234 Tickets</span>
        </p>
        <div className="flex items-center gap-3">
          <label htmlFor="role" className="font-medium">
            Status
          </label>
          <select
            id="role"
            className={`border p-2 rounded focus:outline-none `}
          >
            <option value="open">Open</option>
            <option value="in_progress">Closed</option>
            <option value="student">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap justify-between">
        {tickets.map((ticket, index) => {
          return <TicketCard ticket={ticket} key={index}></TicketCard>;
        })}
      </div>
    </div>
  );
};

export default Tickets;
