import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { Appointment } from '@interfaces/appointment.interface';
import { swalAlert } from '@lib/swalAlert';
import { TimeRemainingPipe } from '@shared/pipes/TimeRemaining.pipe';
import { AppointmentService } from '@shared/services/appointment.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'appointment-card',
  imports: [DatePipe, TitleCasePipe, TimeRemainingPipe, RouterLink],
  templateUrl: './appointment-card.html',
})
export class AppointmentCard {
  @Output() canceledAppointment = new EventEmitter<string>();

  private appointmentService = inject(AppointmentService);
  public appointment = input.required<Appointment>();

  public showCancelButton = input<boolean>(false);
  public showDetailsButton = input<boolean>(false);

  cancelAppointment() {
    // Primero mostramos confirmación
    swalAlert(
      '¿Estás seguro?',
      'Esta cita será cancelada.',
      'warning',
      0,
      true,
      true
    ).then((result) => {
      if (result.isConfirmed) {
        this.appointmentService
          .cancelAppointment(this.appointment().id)
          .subscribe({
            next: () => {
              swalAlert(
                'Cancelada',
                'La cita ha sido cancelada con éxito.',
                'success',
                3000,
                false,
                false
              );

              this.canceledAppointment.emit(this.appointment().id.toString());
            },
            error: (err) => {
              swalAlert('Error', 'No se pudo eliminar el mensaje.', 'error');
              console.error('Error al eliminar el mensaje:', err);
            },
          });
      }
    });
  }
}
