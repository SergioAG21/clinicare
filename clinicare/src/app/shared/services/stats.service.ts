import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

export interface TopSpeciality {
  name: string;
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;
  private apiEndpoint = `${this.baseUrl}/stats`;

  public getTopSpecialities(): Observable<TopSpeciality[]> {
    const url = `${this.apiEndpoint}/top-specialities`;
    return this.http.get<TopSpeciality[]>(url);
  }
}
