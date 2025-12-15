import { Component, inject, OnInit } from '@angular/core';
import { AppointmentService } from '@shared/services/appointment.service';
import { ContactService } from '@shared/services/contact.service';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'stats',
  imports: [],
  templateUrl: './stats.html',
})
export class Stats implements OnInit {
  private userService = inject(UserService);
  private contactService = inject(ContactService);
  private appointmentService = inject(AppointmentService);

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe();
    this.contactService.getAllMessages().subscribe();
    this.appointmentService.getAppointments().subscribe();
  }

  // Mensajes
  public messagesCount = this.contactService.messagesCount;

  // Usuarios
  public usersCount = this.userService.activeUsersCount;
  public pendingUsersCount = this.userService.userPendingCount;
  public doctorsCount = this.userService.doctorUsersCount;
  public patientsCount = this.userService.patientUsersCount;

  // Total de Citas
  public totalAppointmentsCount =
    this.appointmentService.totalAppointmentsCount;
}
