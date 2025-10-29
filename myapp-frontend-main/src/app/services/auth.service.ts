import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DecodedToken {
  role: string;
  username: string;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_KEY = 'refresh_token';
  private readonly apiUrl = `${environment.apiUrl}${environment.tokenEndpoint}`;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap(response => {
        if (response.access && response.refresh) {
          this.storeTokens(response.access, response.refresh);
        }
      })
    );
  }

  storeTokens(access: string, refresh: string): void {
    localStorage.setItem(this.TOKEN_KEY, access);
    localStorage.setItem(this.REFRESH_KEY, refresh);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwt_decode<DecodedToken>(token);
    } catch (err) {
      console.error('Erreur de décodage du token', err);
      return null;
    }
  }

  getUserRole(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.role || null;
  }

  getUsername(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.username || null;
  }

  isTokenExpired(): boolean {
    const decoded = this.getDecodedToken();
    return !decoded || decoded.exp * 1000 < Date.now();
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    this.router.navigate(['/login']);
  }

  redirectUserByRole(): void {
    const role = this.getUserRole();

    switch (role) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'medecin':
        this.router.navigate(['/medecin']);
        break;
      case 'patient':
        this.router.navigate(['/patient']);
        break;
      default:
        this.router.navigate(['/unauthorized']);
    }
  }
}
