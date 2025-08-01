export interface Comment {
  id: string;
  userEmail: string;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  userName?: string;
  userEmail: string;
  likes?: string[];
  comments?: Comment[]; // 💬 New
}
