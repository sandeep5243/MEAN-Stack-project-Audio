import { HttpClient, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  base = 'http://localhost:3000/api/auth';
  constructor(private http: HttpClient) {}

  login(emailOrUsername: string, password: string) {
    return this.http.post<{ token: string }>(`${this.base}/login`, { emailOrUsername, password })
      .pipe(tap(res => localStorage.setItem('token', res.token)));
  }
  
  register(email: string, username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.base}/register`, { email, username, password })
      .pipe(tap(res => localStorage.setItem('token', res.token)));
  }
  
  logout() { 
    localStorage.removeItem('token'); 
  }
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('token');
    if (token) {
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}
