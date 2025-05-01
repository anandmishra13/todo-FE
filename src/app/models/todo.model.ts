export interface Todo {
  id?: number;
  title: string;
  description: string;
  completed?: boolean;
  created_at?: Date;
  updated_at?: Date;
  username?: string;
}

export interface Todos {
  todos: Todo[]
}
