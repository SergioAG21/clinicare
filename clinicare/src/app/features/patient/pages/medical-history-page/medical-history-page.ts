import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { AuthService } from '@auth/services/auth.service';
import { Appointment } from '@interfaces/appointment.interface';
import { User } from '@interfaces/user.interface';
import { APPOINTMENT_STATUS } from '@lib/consts';
import { AppointmentService } from '@shared/services/appointment.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-medical-history-page',
  imports: [DatePipe],
  templateUrl: './medical-history-page.html',
})
export default class MedicalHistoryPage implements OnInit {
  public pageDescription = signal(
    'Aquí puedes ver tu historial médico completo, incluyendo citas pasadas, diagnósticos y tratamientos.'
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
  public medicalHistory = signal<Appointment[]>([]);

  ngOnInit(): void {
    // Cargar los datos solo si no están cargados todavía
    this.authService.loadUserData();

    // Suscribirse al usuario
    this.authService.currentUser$.subscribe((user) => {
      if (!user) return;

      this.loggedUser.set(user);
      this.getMedicalHistoryByPatientId(user.id);
    });
  }

  getMedicalHistoryByPatientId(patientId: number) {
    this.appointmentService
      .getAppointmentsByPatientId(patientId)
      .pipe(
        map((appointments) =>
          appointments.filter((a) => a.status === APPOINTMENT_STATUS.COMPLETED)
        )
      )
      .subscribe((data) => {
        this.medicalHistory.set(data);
      });
  }

  downloadDocument(appointmentId: number, documentUrl: string) {
    if (!documentUrl) {
      console.warn('documentUrl es null o undefined');
      return;
    }

    this.appointmentService.downloadMedicalDocument(appointmentId).subscribe({
      next: (blob) => {
        const fileName =
          documentUrl.split('/').pop() || `documento_${appointmentId}.pdf`;

        const downloadURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = fileName;
        link.click();

        URL.revokeObjectURL(downloadURL);
      },
    });
  }
}
