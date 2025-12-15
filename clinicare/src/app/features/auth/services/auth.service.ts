import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginCredentials } from '@auth/interfaces/login.interface';
import { environment } from '@env/environment';
import { RegisterData, User } from '@interfaces/user.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiBaseUrl = environment.apiBaseUrl;
  private apiAuthUrl = `${this.apiBaseUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private http = inject(HttpClient);

  loadUserData(): void {
    if (this.currentUserSubject.value) return;

    this.http.get<User>(`${this.apiBaseUrl}/users/me`).subscribe({
      next: (user) => this.currentUserSubject.next(user),
      error: () => this.currentUserSubject.next(null),
    });
  }

  getUserData(): Observable<User> {
    const apiUsersUrl = `${this.apiBaseUrl}/users`;
    return this.http.get<User>(`${apiUsersUrl}/me`);
  }

  login(credentials: LoginCredentials): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(`${this.apiAuthUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          sessionStorage.setItem('auth_token', response.token);

          this.loadUserData();
        })
      );
  }

  register(credentials: RegisterData): Observable<any> {
    return this.http.post<any>(`${this.apiAuthUrl}/register`, credentials);
  }

  logout() {
    sessionStorage.removeItem('auth_token');
    localStorage.removeItem('role');

    this.currentUserSubject.next(null);
    window.location.href = '/';
  }

  getToken(): string | null {
    return sessionStorage.getItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
