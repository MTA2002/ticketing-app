import Comment from "./commentInterface";

export interface Ticket {
  id?: number;
  title: string;
  description: string;
  category: string;
  priority?: "low" | "medium" | "high";
  supplementary_image?: string;
  created_by?: number;
  assigned_to?: number;
  status?: "open" | "in_progress" | "resolved" | "closed";
  created_at?: string;
  updated_at?: string;
  comments?: Comment[];
}
