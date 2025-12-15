import { Component, inject, signal } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Appointment } from '@interfaces/appointment.interface';
import { APPOINTMENT_STATUS } from '@lib/consts';
import { AppointmentDetailsForm } from '@shared/components/appointment-details-form/appointment-details-form';
import { GoBackButtonComponent } from '@shared/components/go-back-button/go-back-button.component';
import { AppointmentService } from '@shared/services/appointment.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-appointment-details-page',
  imports: [GoBackButtonComponent, AppointmentDetailsForm, RouterLink],
  templateUrl: './appointment-details-page.html',
})
export default class AppointmentDetailsPage {
  public pageDescription = signal(
    'Gestiona la consulta médica con detalles completos de la cita, historial del paciente y dar un servicio de calidad en CliniCare.'
  );

  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Detalles de la Cita / CliniCare');
    this.meta.updateTag({
      name: 'description',
      content: this.pageDescription(),
    });
  }

  private appointmentService = inject(AppointmentService);
  private activatedRoute = inject(ActivatedRoute);

  private appointmentId = this.activatedRoute.snapshot.params['id'] || '';
  public appointment = signal<Appointment | null>(null);
  public appointments = signal<Appointment[]>([]);

  ngOnInit(): void {
    this.getAppointmentDetails();
  }

  private getPatientAppointments(patientId: number) {
    this.appointmentService
      .getAppointmentsByPatientId(patientId)
      .pipe(
        map((appointments) =>
          appointments.filter((a) => a.status === APPOINTMENT_STATUS.COMPLETED)
        )
      )
      .subscribe((data) => {
        this.appointments.set(data);
      });
  }

  private getAppointmentDetails() {
    // Lógica para obtener los detalles de la cita
    this.appointmentService
      .getAppointmentById(this.appointmentId)
      .subscribe((data) => {
        this.appointment.set(data);
        this.getPatientAppointments(data?.patientId || 0);
      });
  }
}
