import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Speciality } from '@doctor/interfaces/specialty.interface';
import { environment } from '@env/environment';
import { User } from './../../../interfaces/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private apiBaseUrl = environment.apiBaseUrl;

  private http = inject(HttpClient);

  getPatients(id: number): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.apiBaseUrl}/patient-doctor/doctor/${id}/patients`
    );
  }

  getSpecialities(): Observable<Speciality[]> {
    return this.http.get<Speciality[]>(`${this.apiBaseUrl}/specialties`);
  }

  getDoctorsBySpeciality(specialityId: string): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.apiBaseUrl}/patient-doctor/speciality/${specialityId}/doctors`
    );
  }
}
