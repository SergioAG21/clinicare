import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { UserInfoCard } from '@shared/components/user-info-card/user-info-card';
import { Clock } from '@shared/components/clock/clock';
import { AuthService } from '@auth/services/auth.service';
import { User } from '@interfaces/user.interface';
import { AppointmentService } from '@shared/services/appointment.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, UserInfoCard, Clock],
  templateUrl: './dashboard-page.html',
})
export default class DashboardPage {
  public pageDescription = signal(
    'Bienvenido a CliniCare, Aquí puedes gestionar tus citas médicas y acceder a tu historial de salud.'
  );

  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Dashboard Paciente / CliniCare');
    this.meta.updateTag({
      name: 'description',
      content: this.pageDescription(),
    });
  }

  private appointmentService = inject(AppointmentService);
  private authService = inject(AuthService);

  private loggedUser = signal<User | null>(null);

  ngOnInit(): void {
    // Cargar los datos solo si no están cargados todavía
    this.authService.loadUserData();

    // Suscribirse al usuario
    this.authService.currentUser$.subscribe((user) => {
      if (!user) return;

      if (user) {
        this.appointmentService.getAppointmentsByPatientId(user.id).subscribe();
      }
      this.loggedUser.set(user);
    });
  }

  // Stats
  public appointmentsToday = this.appointmentService.todayAppointmentsCount;
  public totalAppointments = this.appointmentService.totalAppointmentsCount;
  public pendingAppointments = this.appointmentService.pendingAppointmentsCount;
}
