import { Component, inject, signal } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { AuthService } from '@auth/services/auth.service';
import { Appointment } from '@interfaces/appointment.interface';
import { User } from '@interfaces/user.interface';
import { APPOINTMENT_STATUS } from '@lib/consts';
import { AppointmentCard } from '@shared/components/appointment/appointment-card/appointment-card';
import { AppointmentService } from '@shared/services/appointment.service';

import { FullCalendarModule } from '@fullcalendar/angular';

// Plugins de FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-agenda-page',
  imports: [AppointmentCard, FullCalendarModule, DatePipe, TitleCasePipe],
  templateUrl: './agenda-page.html',
})
export default class AgendaPage {
  public pageDescription = signal(
    'Consulta tu agenda médica completa y mantente al tanto de todas tus citas programadas en CliniCare.'
  );

  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Consulta tu Agenda / CliniCare');
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

  public selectedAppointment = signal<Appointment | null>(null);
  public isModalOpen = signal(false);

  public openModal(appointment: Appointment) {
    this.selectedAppointment.set(appointment);
    this.isModalOpen.set(true);
  }

  public closeModal() {
    this.selectedAppointment.set(null);
    this.isModalOpen.set(false);
  }

  public calendarOptions: any = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    locale: esLocale,
    height: 'auto',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    events: [],
    eventClick: (info: any) => {
      const appointment: Appointment = {
        id: info.event.id,
        patientName: info.event.extendedProps.patientName,
        doctorName: info.event.extendedProps.doctorName,
        status: info.event.extendedProps.status,
        reason: info.event.extendedProps.reason,
        specialityName: info.event.extendedProps.specialityName,
        appointmentType: info.event.extendedProps.appointmentType,
        doctorNotes: info.event.extendedProps.doctorNotes,
        appointmentDate: info.event.start,
      };
      this.openModal(appointment);
    },
  };

  private getAppointmentsByDoctorId(doctorId: number) {
    this.appointmentService
      .getAppointmentsByDoctorId(doctorId)
      .subscribe((data) => {
        const filteredAppointments = data.sort(
          (a, b) =>
            new Date(a.appointmentDate).getTime() -
            new Date(b.appointmentDate).getTime()
        );

        this.appointments.set(filteredAppointments);
        this.loadCalendarEvents(filteredAppointments);
      });
  }

  private loadCalendarEvents(appointments: Appointment[]) {
    const events = appointments.map((a) => {
      return {
        id: a.id,
        title: a.patientName,
        start: a.appointmentDate,
        color:
          this.appointmentColors.find((c) => c.status === a.status)?.color ||
          '#1e90ff',
        extendedProps: {
          patientName: a.patientName,
          doctorName: a.doctorName,
          status: a.status,
          reason: a.reason,
          specialityName: a.specialityName,
          appointmentType: a.appointmentType,
        },
      };
    });

    this.calendarOptions = {
      ...this.calendarOptions,
      events,
    };
  }

  public appointmentColors = [
    {
      status: APPOINTMENT_STATUS.PENDING,
      color: '#1e90ff',
      label: 'Pendiente',
    },
    {
      status: APPOINTMENT_STATUS.CANCELLED,
      color: '#dc3545',
      label: 'Cancelada',
    },
    {
      status: APPOINTMENT_STATUS.COMPLETED,
      color: '#6c757d',
      label: 'Completada',
    },
  ];
}
