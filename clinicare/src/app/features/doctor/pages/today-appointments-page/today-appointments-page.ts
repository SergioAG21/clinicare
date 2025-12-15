import { Component, inject, OnInit, signal } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { AuthService } from '@auth/services/auth.service';
import { Appointment } from '@interfaces/appointment.interface';
import { User } from '@interfaces/user.interface';
import { APPOINTMENT_STATUS } from '@lib/consts';
import { AppointmentCard } from '@shared/components/appointment/appointment-card/appointment-card';
import { AppointmentService } from '@shared/services/appointment.service';

@Component({
  selector: 'app-today-appointments-page',
  imports: [AppointmentCard],
  templateUrl: './today-appointments-page.html',
})
export default class TodayAppointmentsPage implements OnInit {
  public pageDescription = signal(
    'Gestione sus citas médicas programadas para hoy de manera eficiente y brinde una atención oportuna a sus pacientes en CliniCare.'
  );

  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Citas de hoy / CliniCare');
    this.meta.updateTag({
      name: 'description',
      content: this.pageDescription(),
    });
  }

  private appointmentService = inject(AppointmentService);
  private authService = inject(AuthService);

  public loggedUser = signal<User | null>(null);
  public appointments = signal<Appointment[]>([]);

  ngOnInit(): void {
    // Cargar los datos solo si no están cargados todavía
    this.authService.loadUserData();

    // Suscribirse al usuario
    this.authService.currentUser$.subscribe((user) => {
      if (!user) return;

      this.loggedUser.set(user);
      this.getAppointmentsByDoctorId(user.id);
    });
  }

  private getAppointmentsByDoctorId(doctorId: number) {
    this.appointmentService
      .getAppointmentsByDoctorId(doctorId)
      .subscribe((data) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const todayAppointments = data
          .filter((a) => {
            const d = new Date(a.appointmentDate);
            return (
              d >= today &&
              d < tomorrow &&
              a.status === APPOINTMENT_STATUS.PENDING
            );
          })
          .sort(
            (a, b) =>
              new Date(a.appointmentDate).getTime() -
              new Date(b.appointmentDate).getTime()
          );

        console.log(todayAppointments);

        this.appointments.set(todayAppointments);
      });
  }
}
