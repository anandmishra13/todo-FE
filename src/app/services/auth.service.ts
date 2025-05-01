import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly apiUrl = 'http://127.0.0.1:8000/'; // Replace with your API URL
  readonly currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(readonly http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(
      `${this.apiUrl}auth/login/`,
      { username, password }
    )
    .pipe(
      tap(user => {
        console.log('user', user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('token', JSON.stringify(user.token));
        this.currentUserSubject.next(user);
      })
    );
  }

  register(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}auth/register/`, { username, password });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    const currentUser = this.currentUserValue;
    return currentUser ? currentUser.token ?? null : null;
  }

  getUserData(): User {
    const data = localStorage.getItem('currentUser');
    if(data) {
      return JSON.parse(data);
    } else {
      return {}
    }
  }
}
