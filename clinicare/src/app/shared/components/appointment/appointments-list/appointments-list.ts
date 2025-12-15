import { Component, inject, signal } from '@angular/core';
import {
  Appointment,
  AppointmentStatus,
} from '@interfaces/appointment.interface';
import { AppointmentCard } from '../appointment-card/appointment-card';
import { User } from '@interfaces/user.interface';
import { AppointmentService } from '@shared/services/appointment.service';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'appointments-list',
  imports: [AppointmentCard],
  templateUrl: './appointments-list.html',
})
export class AppointmentsList {
  public appointments = signal<Appointment[]>([]);

  public appointmentStatus = AppointmentStatus;

  private authService = inject(AuthService);

  private appointmentService = inject(AppointmentService);

  public loggedUser = signal<User | null>(null);

  ngOnInit(): void {
    // Cargar los datos solo si no están cargados todavía
    this.authService.loadUserData();

    // Suscribirse al usuario
    this.authService.currentUser$.subscribe((user) => {
      if (!user) return;

      if (user) {
        this.appointmentService.getAppointmentsByDoctorId(user.id).subscribe();
      }
      this.loggedUser.set(user);
      this.getAppointmentsByPatientId(user.id);
    });
  }

  private getAppointmentsByPatientId(patientId: number) {
    this.appointmentService
      .getAppointmentsByPatientId(patientId)
      .subscribe((data) => {
        const now = new Date();

        const upcoming = data
          .filter((a) => new Date(a.appointmentDate) >= now)
          .sort(
            (a, b) =>
              new Date(a.appointmentDate).getTime() -
              new Date(b.appointmentDate).getTime()
          );

        this.appointments.set(upcoming);
      });
  }

  handleDeletedMessage(id: string) {
    this.appointments.set(
      this.appointments().filter((m) => m.id.toString() !== id)
    );
  }
}
