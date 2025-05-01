import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Todo, Todos } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://127.0.0.1:8000/'; // Replace with your API URL

  // Dummy data for testing
  private dummyTodos: Todo[] = [
    {
      id: 1,
      title: 'Complete Angular project',
      description: 'Finish the Todo app with authentication',
      completed: false,
      created_at: new Date('2025-04-28')
    },
    {
      id: 2,
      title: 'Learn RxJS',
      description: 'Study observables and operators',
      completed: true,
      created_at: new Date('2025-04-25')
    },
    {
      id: 3,
      title: 'Implement Material Design',
      description: 'Add Material components to the application',
      completed: false,
      created_at: new Date('2025-04-27')
    }
  ];

  constructor(readonly http: HttpClient) { }

  getTodos(username: string | undefined): Observable<Todos> {
    return this.http.get<Todos>(`${this.apiUrl}todo/get/?username=${username}`);
  }

  getTodoById(id: number): Observable<Todo> {
    const todo = this.dummyTodos.find(t => t.id === id);
    if (todo) {
      return of(todo).pipe(delay(300));
    }
    return of({ id: 0, title: '', description: '', completed: false, created_at: new Date() });

    // Real implementation:
    // return this.http.get<Todo>(`${this.apiUrl}/${id}`);
  }

  createTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(`${this.apiUrl}todo/create/`, todo);
  }

  updateTodo(todo: Todo): Observable<Todo> {
    const index = this.dummyTodos.findIndex(t => t.id === todo.id);
    if (index !== -1) {
      this.dummyTodos[index] = todo;
    }
    return of(todo).pipe(delay(800));

    // Real implementation:
    // return this.http.put<Todo>(`${this.apiUrl}/${todo.id}`, todo);
  }

  deleteTodo(id: number): Observable<void> {
    const index = this.dummyTodos.findIndex(t => t.id === id);
    if (index !== -1) {
      this.dummyTodos.splice(index, 1);
    }
    return of(void 0).pipe(delay(800));

    // Real implementation:
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
