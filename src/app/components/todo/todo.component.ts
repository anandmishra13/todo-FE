import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatIconModule,
    MatToolbarModule
  ],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  todoForm: FormGroup;
  todos: Todo[] = [];
  loading = false;
  displayedColumns: string[] = ['sn', 'title', 'description', 'created_at', 'completed', 'actions'];

  constructor(
    readonly formBuilder: FormBuilder,
    readonly todoService: TodoService,
    readonly authService: AuthService,
    readonly router: Router,
    readonly snackBar: MatSnackBar
  ) {
    this.todoForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.loading = true;
    const user = this.authService.getUserData();
    this.todoService.getTodos(user.username).subscribe({
      next: (data) => {
        this.todos = data.todos;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Error loading todos', 'Close', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.todoForm.invalid) {
      return;
    }
    const user = this.authService.getUserData();
    const todo: Todo = {
      title: this.todoForm.value.title,
      description: this.todoForm.value.description,
      username: user.username
    };

    this.loading = true;
    this.todoService.createTodo(todo).subscribe({
      next: () => {
        this.loading = false;
        this.todoForm.reset();
        this.loadTodos();
        this.snackBar.open('Todo created successfully', 'Close', { duration: 3000 });
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Error creating todo', 'Close', { duration: 3000 });
      }
    });
  }

  updateTodoStatus(todo: Todo): void {
    const updatedTodo = { ...todo, completed: !todo.completed };
    this.todoService.updateTodo(updatedTodo).subscribe({
      next: () => {
        this.loadTodos();
        this.snackBar.open('Todo updated successfully', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Error updating todo', 'Close', { duration: 3000 });
      }
    });
  }

  deleteTodo(id?: number): void {
    if (!id) return;

    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.loadTodos();
        this.snackBar.open('Todo deleted successfully', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Error deleting todo', 'Close', { duration: 3000 });
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
