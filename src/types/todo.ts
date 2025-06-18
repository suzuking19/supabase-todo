export interface Todo {
  id: string;
  title: string;
  is_completed: boolean;
  user_id: string;
  created_at: string;
}

export interface CreateTodoInput {
  title: string;
  user_id?: string;
}
