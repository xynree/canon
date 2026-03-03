export interface Room {
  id: string;
  name: string;
  emoji: string;
  created_by: string;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string | null;
  avatar_color: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  room_id: string | null;
  name: string;
  emoji: string;
  created_by: string;
}

export interface Experience {
  id: string;
  room_id: string;
  title: string;
  category_id: string;
  date: string;
  created_by: string;
  created_at: string;
}

export interface Rating {
  id: string;
  experience_id: string;
  user_id: string;
  score: number;
  note: string | null;
  created_at: string;
}
