import { Ticket } from "./ticketInterface";

export default interface User {
  id?: number;
  username: string;
  email: string;
  profile_image: string;
  role: string;
  password: string;
  confirm_password: string;
  created_at?: Date;
  updated_at?: Date;
  created_tickets?: Ticket[];
  assigned_tickets?: Ticket[];
}
