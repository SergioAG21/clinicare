import { DatePipe, Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Appointment } from '@interfaces/appointment.interface';
import { FormUtils } from '@lib/form-utils';
import { swalAlert } from '@lib/swalAlert';
import { AppointmentService } from '@shared/services/appointment.service';

@Component({
  selector: 'appointment-details-form',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './appointment-details-form.html',
})
export class AppointmentDetailsForm {
  private appointmentService = inject(AppointmentService);
  public fb = inject(FormBuilder);
  public formUtils = FormUtils;
  private location = inject(Location);

  public appointmentDetailForm = this.fb.group({
    doctorNotes: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200),
      ],
    ],
    document: [null],
  });

  public selectedFile = signal<File | null>(null);
  public selectedFileName = signal<string>('');

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (
      file &&
      (file.type === 'application/pdf' || file.type.startsWith('image/'))
    ) {
      this.selectedFile.set(file);
      this.selectedFileName.set(file.name);
    } else {
      this.selectedFile.set(null);
      this.selectedFileName.set('');
      swalAlert(
        'Archivo inválido',
        'Solo se permiten PDFs o imágenes.',
        'error'
      );
    }
  }

  ngOnInit(): void {
    this.getAppointmentDetails();
  }

  private activatedRoute = inject(ActivatedRoute);

  private appointmentId = this.activatedRoute.snapshot.params['id'] || '';

  public appointment = signal<Appointment | null>(null);

  private getAppointmentDetails() {
    // Lógica para obtener los detalles de la cita
    this.appointmentService
      .getAppointmentById(this.appointmentId)
      .subscribe((data) => {
        console.log(data);
        this.appointment.set(data);
      });
  }

  submit() {
    const { doctorNotes } = this.appointmentDetailForm.value;

    // 1. Guardar las notas del doctor
    this.appointmentService
      .saveDoctorNotes(this.appointmentId, doctorNotes || '')
      .subscribe({
        next: () => {
          // 2. Subir PDF si existe
          if (this.selectedFile()) {
            const formData = new FormData();
            formData.append('file', this.selectedFile()!);

            this.appointmentService
              .uploadMedicalDocument(this.appointmentId, formData)
              .subscribe({
                next: () => {
                  swalAlert(
                    '¡Cita Actualizada!',
                    'Se guardaron las notas y el documento adjunto correctamente.',
                    'success',
                    1500,
                    false,
                    false
                  );

                  setTimeout(() => this.location.back(), 1500);
                },
                error: () => {
                  swalAlert(
                    'Notas guardadas, pero…',
                    'No se pudo subir el documento adjunto.',
                    'warning'
                  );
                },
              });

            return;
          }

          swalAlert(
            '¡Cita Actualizada!',
            'Se han agregado las notas correctamente.',
            'success',
            1500,
            false,
            false
          );

          setTimeout(() => this.location.back(), 1500);
        },

        error: (err) => {
          swalAlert(
            'Error',
            err.error?.error || 'No se pudieron guardar las notas.',
            'error'
          );
        },
      });
  }
}
