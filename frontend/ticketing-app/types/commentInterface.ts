export default interface Comment {
  id: number;
  ticket_id: number;
  user_id?: number;
  comment_text: string;
  created_at?: string;
  updated_at?: string;
}
