import { Component, inject, signal } from '@angular/core';
import { UserInfoCard } from '@shared/components/user-info-card/user-info-card';
import { Title, Meta } from '@angular/platform-browser';
import { AuthService } from '@auth/services/auth.service';
import { User } from '@interfaces/user.interface';
import { AppointmentService } from '@shared/services/appointment.service';
import { Clock } from '@shared/components/clock/clock';

@Component({
  selector: 'doctor-dashboard-page',
  imports: [UserInfoCard, Clock],
  templateUrl: './dashboard-page.html',
})
export default class DashboardPage {
  public pageDescription = signal(
    'Bienvenido al panel de control del doctor en CliniCare, donde podrá gestionar sus pacientes, citas y acceder a herramientas médicas esenciales para brindar una atención de calidad.'
  );

  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Dashboard Doctor / CliniCare');
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
        this.appointmentService.getAppointmentsByDoctorId(user.id).subscribe();
      }
      this.loggedUser.set(user);
    });
  }

  // Stats
  public appointmentsToday = this.appointmentService.todayAppointmentsCount;
  public totalAppointments = this.appointmentService.totalAppointmentsCount;
  public pendingAppointments = this.appointmentService.pendingAppointmentsCount;
}
