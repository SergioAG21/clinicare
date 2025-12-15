import { DatePipe, Location } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@auth/services/auth.service';
import { Speciality } from '@doctor/interfaces/specialty.interface';
import { DoctorService } from '@doctor/services/doctor.service';
import { User } from './../../../../interfaces/user.interface';
import { FormUtils } from '@lib/form-utils';
import { MobileFieldIcon } from '@shared/icons/form/mobile-field-icon/mobile-field-icon';
import { ManFieldIcon } from '@shared/icons/form/man-field-icon/man-field-icon';
import { CustomDatepickerComponent } from '@shared/components/date-time-picker/date-time-picker';
import { A11yModule } from '@angular/cdk/a11y';
import { AppointmentService } from '@shared/services/appointment.service';
import { swalAlert } from '@lib/swalAlert';
import { USER_STATUS } from '@lib/consts';

@Component({
  selector: 'book-appointment-form',
  imports: [
    ReactiveFormsModule,
    MobileFieldIcon,
    ManFieldIcon,
    CustomDatepickerComponent,
    A11yModule,
  ],
  templateUrl: './book-appointment-form.html',
})
export class BookAppointmentForm implements OnInit {
  private authService = inject(AuthService);
  private doctorService = inject(DoctorService);
  private appointmentService = inject(AppointmentService);
  public fb = inject(FormBuilder);
  public formUtils = FormUtils;
  private location = inject(Location);

  today: Date = new Date();

  public appointmentForm = this.fb.group({
    appointmentDate: ['', [Validators.required]],
    doctorId: ['', [Validators.required]],
    appointmentType: ['', [Validators.required]],
    speciality: ['', [Validators.required]],
    reason: ['', [Validators.minLength(10), Validators.maxLength(200)]],
  });

  public loggedUser = signal<User | null>(null);

  ngOnInit(): void {
    // Cargar los datos solo si no están cargados todavía
    this.authService.loadUserData();
    this.getSpecialities();

    // Suscribirse al usuario
    this.authService.currentUser$.subscribe((user) => {
      if (!user) return;

      if (user) {
        this.appointmentService.getAppointmentsByDoctorId(user.id).subscribe();
      }
      this.loggedUser.set(user);
    });
    // Detectar cuando el usuario selecciona un doctor
    this.appointmentForm.get('doctorId')?.valueChanges.subscribe((value) => {
      this.doctorSelected.set(!!value); // true si hay valor
    });
  }

  public availableDoctors = signal<User[]>([]);

  public specialities = signal<Speciality[]>([]);

  public getSpecialities() {
    return this.doctorService.getSpecialities().subscribe((specialities) => {
      this.specialities.set(specialities);
    });
  }

  public specialitySelected = signal(false);
  public doctorSelected = signal(false);

  public disableDoctorSelect = computed(() => {
    const doctors = this.availableDoctors() || [];
    return !this.specialitySelected() || doctors.length === 0;
  });

  public onSpecialityChange(event: Event) {
    const specialityId = (event.target as HTMLSelectElement).value;
    this.specialitySelected.set(true);

    this.appointmentForm.get('doctorId')?.reset();

    this.availableDoctors.set([]);

    this.doctorService.getDoctorsBySpeciality(specialityId).subscribe({
      next: (doctors) => {
        const activeDoctors = doctors.filter(
          (doctor: any) => doctor.status === USER_STATUS.ACTIVE
        );
        this.availableDoctors.set(activeDoctors);
      },
      error: (error) => {
        console.error('Error fetching doctors:', error);
        this.availableDoctors.set([]);
      },
    });
  }

  submit() {
    const formData = this.appointmentForm.value;

    const userId = this.loggedUser()?.id; // obtener id del usuario logueado
    if (!userId) {
      console.error('No hay usuario logueado');
      return;
    }

    const appointmentData = {
      ...formData,
      patientId: userId, // añadimos el ID del usuario
      doctorId: Number(formData.doctorId), // opcional: asegurarte que es número
      specialityId: Number(formData.speciality), // opcional: asegurarte que es número
    };

    this.appointmentService.createAppointment(appointmentData).subscribe({
      next: () => {
        swalAlert(
          '¡Cita Creada!',
          'Se ha creado la cita correctamente.',
          'success',
          1500,
          false,
          false
        );

        setTimeout(() => {
          this.location.back();
        }, 1500);
      },
      error: (err) => {
        swalAlert(
          'Lo sentimos',
          err.error?.error || 'No se pudo crear la cita.',
          'error',
          3000,
          false,
          true
        );
      },
    });
  }
}
