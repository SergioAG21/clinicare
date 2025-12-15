import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { Appointment } from '@interfaces/appointment.interface';
import { APPOINTMENT_STATUS } from '@lib/consts';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;
  private apiEndpoint = `${this.baseUrl}/appointment`;

  // Stats para el doctor
  public pendingAppointmentsCount = signal(0);
  public totalAppointmentsCount = signal(0);
  public todayAppointmentsCount = signal(0);

  public createAppointment(appointment: any): Observable<any> {
    return this.http.post<any>(this.apiEndpoint, appointment);
  }

  public getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiEndpoint).pipe(
      tap((appointments) => {
        // Contador total de citas
        this.totalAppointmentsCount.set(appointments.length);
      })
    );
  }

  public getAppointmentById(appointmentId: number): Observable<Appointment> {
    const url = `${this.apiEndpoint}/${appointmentId}`;
    return this.http.get<Appointment>(url);
  }

  public getAppointmentsByPatientId(
    patientId: number
  ): Observable<Appointment[]> {
    const url = `${this.apiEndpoint}/patient/${patientId}`;
    return this.http.get<Appointment[]>(url).pipe(
      tap((appointments) => {
        // Contador de citas pendientes
        const pendingAppointments = appointments.filter(
          (a) => a.status === APPOINTMENT_STATUS.PENDING
        );
        this.pendingAppointmentsCount.set(pendingAppointments.length);

        // Contador de citas (Sin contar canceladas)
        const totalAppointmentsCount = appointments.filter(
          (a) => a.status !== APPOINTMENT_STATUS.CANCELLED
        );
        this.totalAppointmentsCount.set(totalAppointmentsCount.length);
      })
    );
  }

  public getAppointmentsByDoctorId(
    doctorId: number
  ): Observable<Appointment[]> {
    const url = `${this.apiEndpoint}/doctor/${doctorId}`;
    return this.http.get<Appointment[]>(url).pipe(
      tap((appointments) => {
        // Contador de citas pendientes
        const pendingAppointments = appointments.filter(
          (a) => a.status === APPOINTMENT_STATUS.PENDING
        );
        this.pendingAppointmentsCount.set(pendingAppointments.length);

        // Contador de citas de hoy
        const today = new Date();
        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth();
        const todayDate = today.getDate();

        const todayAppointments = appointments.filter((a) => {
          const d = new Date(a.appointmentDate);
          return (
            d.getFullYear() === todayYear &&
            d.getMonth() === todayMonth &&
            d.getDate() === todayDate
          );
        });
        this.todayAppointmentsCount.set(todayAppointments.length);

        // Contador total de citas
        this.totalAppointmentsCount.set(appointments.length);
      })
    );
  }

  public getAppointmentsBySpecialityId(
    speciality: number
  ): Observable<Appointment[]> {
    const url = `${this.apiEndpoint}/speciality/${speciality}`;
    return this.http.get<Appointment[]>(url);
  }

  public cancelAppointment(appointmentId: number): Observable<any> {
    const url = `${this.apiEndpoint}/cancel/${appointmentId}`;
    return this.http.put<any>(url, {});
  }

  uploadMedicalDocument(
    appointmentId: number,
    formData: FormData
  ): Observable<{ url: string }> {
    const url = `${this.apiEndpoint}/${appointmentId}/upload-document`;
    return this.http.post<{ url: string }>(url, formData);
  }

  downloadMedicalDocument(appointmentId: number): Observable<Blob> {
    const url = `${this.apiEndpoint}/${appointmentId}/download-document`;
    return this.http.get(url, {
      responseType: 'blob',
    });
  }

  public saveDoctorNotes(
    appointmentId: number,
    doctorNotes: string
  ): Observable<any> {
    const url = `${this.apiEndpoint}/notes/${appointmentId}`;
    return this.http.put<any>(
      url,
      { doctorNotes },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
