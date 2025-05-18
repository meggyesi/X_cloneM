import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5001/auth';

  constructor(private http: HttpClient) { }

  // login
  login(email: string, password: string) {
    // HTTP POST request
    const body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(`${this.apiUrl}/login`, body, {
      headers: headers,
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  register(user: User) {
    // HTTP POST request
    const body = new URLSearchParams();
    body.set('email', user.email);
    body.set('nickname', user.nickname);
    body.set('password', user.password);
    body.set('birth', user.birth);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(`${this.apiUrl}/register`, body, {
      headers: headers,
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      withCredentials: true,
      responseType: 'text'
    }).pipe(
      catchError(this.handleError)
    );
  }

  checkAuth() {
    return this.http.get<boolean>(`${this.apiUrl}/checkAuth`, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}