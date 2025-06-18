export interface Todo {
  id: string;
  title: string;
  is_completed: boolean;
  user_id: string;
  created_at: string;
}

export interface CreateTodo {
  title: string;
  user_id?: string;
  is_completed: boolean;
}
