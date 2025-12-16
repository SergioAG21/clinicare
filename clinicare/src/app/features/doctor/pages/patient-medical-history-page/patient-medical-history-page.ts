import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Appointment } from '@interfaces/appointment.interface';
import { User } from '@interfaces/user.interface';
import { APPOINTMENT_STATUS } from '@lib/consts';
import { GoBackButtonComponent } from '@shared/components/go-back-button/go-back-button.component';
import { AppointmentService } from '@shared/services/appointment.service';
import { UserService } from '@shared/services/user.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-patient-medical-history-page',
  imports: [DatePipe, GoBackButtonComponent],
  templateUrl: './patient-medical-history-page.html',
})
export default class PatientMedicalHistoryPage implements OnInit {
  public pageDescription = signal(
    'Aquí puedes ver el historial médico completo del paciente, incluyendo citas pasadas, diagnósticos y tratamientos.'
  );

  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Citas de hoy / CliniCare');
    this.meta.updateTag({
      name: 'description',
      content: this.pageDescription(),
    });
  }

  private activatedRoute = inject(ActivatedRoute);
  private patientId = this.activatedRoute.snapshot.params['id'];

  private appointmentService = inject(AppointmentService);
  private userService = inject(UserService);

  public patient = signal<User | null>(null);
  public medicalHistory = signal<Appointment[]>([]);

  ngOnInit(): void {
    this.getMedicalHistoryByPatientId(this.patientId);
    this.getPatientById(this.patientId);
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

  getPatientById(patientId: number) {
    this.userService.getUserById(patientId.toString()).subscribe((data) => {
      this.patient.set(data);
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
