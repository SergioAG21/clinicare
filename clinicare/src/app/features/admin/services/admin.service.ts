import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiBaseUrl = environment.apiBaseUrl;
  private apiUsersUrl = `${this.apiBaseUrl}/users`;

  private http = inject(HttpClient);
}
