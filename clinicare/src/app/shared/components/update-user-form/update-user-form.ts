import { DatePipe, Location } from '@angular/common';
import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { Speciality } from '@doctor/interfaces/specialty.interface';
import { DoctorService } from '@doctor/services/doctor.service';
import { User, UserRole } from '@interfaces/user.interface';
import { FormUtils } from '@lib/form-utils';
import { swalAlert } from '@lib/swalAlert';
import { AddressFieldIcon } from '@shared/icons/form/address-field-icon/address-field-icon';
import { BirthdayFieldIcon } from '@shared/icons/form/birthday-field-icon/birthday-field-icon';
import { DniFieldIcon } from '@shared/icons/form/dni-field-icon/dni-field-icon';
import { EmailFieldIcon } from '@shared/icons/form/email-field-icon/email-field-icon';
import { ManFieldIcon } from '@shared/icons/form/man-field-icon/man-field-icon';
import { MobileFieldIcon } from '@shared/icons/form/mobile-field-icon/mobile-field-icon';
import { NameFieldIcon } from '@shared/icons/form/name-field-icon/name-field-icon';
import { WomanFieldIcon } from '@shared/icons/form/woman-field-icon/woman-field-icon';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'update-user-form',
  imports: [
    ReactiveFormsModule,
    DatePipe,
    DniFieldIcon,
    NameFieldIcon,
    EmailFieldIcon,
    BirthdayFieldIcon,
    AddressFieldIcon,
    MobileFieldIcon,
    ManFieldIcon,
    WomanFieldIcon,
  ],
  templateUrl: './update-user-form.html',
})
export class UpdateUserForm implements OnInit {
  private authService = inject(AuthService);
  private doctorService = inject(DoctorService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  formUtils = FormUtils;
  location = inject(Location);

  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  public imagenSeleccionada = signal<string | null>(null);

  abrirModal(imagen: string) {
    this.imagenSeleccionada.set(imagen);
    document.body.style.overflow = 'hidden';
  }

  cerrarModal() {
    this.imagenSeleccionada.set(null);
    document.body.style.overflow = '';
  }

  @HostListener('window:keydown.Escape')
  handleEsc() {
    this.cerrarModal();
  }

  public currentDate: string = new Date().toISOString().split('T')[0];

  public currentUser = signal<User | null>(null);

  ngOnInit(): void {
    // Obtener el usuario actual
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser.set(user);
      if (user) {
        this.updateUserForm.patchValue({
          dni: user.dni,
          name: user.name,
          lastName: user.last_name,
          dateOfBirth: user.birth_date,
          address: user.address,
          phoneNumber: user.phone_number,
          gender: user.gender,
          email: user.email,
        });
      }
    });

    if (this.authService.isLoggedIn()) {
      this.authService.loadUserData();
    }

    this.getSpecialities();
  }

  public UserRole = UserRole;

  public specialities = signal<Speciality[]>([]);

  public getSpecialities() {
    return this.doctorService.getSpecialities().subscribe((specialities) => {
      this.specialities.set(specialities);
    });
  }

  USER_GENDER = {
    MALE: 'MALE',
    FEMALE: 'FEMALE',
  };

  public updateUserForm = this.fb.group({
    dni: [
      this.currentUser()?.dni,
      [Validators.required, Validators.pattern(FormUtils.dniPattern)],
    ],
    name: [
      this.currentUser()?.name,
      [Validators.required, Validators.minLength(2)],
    ],
    lastName: [
      this.currentUser()?.last_name,
      [Validators.required, Validators.minLength(2)],
    ],
    dateOfBirth: [
      this.currentUser()?.birth_date,
      [Validators.required, FormUtils.maxDate],
    ],
    address: [
      this.currentUser()?.address,
      [Validators.required, Validators.minLength(5)],
    ],
    phoneNumber: [
      this.currentUser()?.phone_number,
      [Validators.required, Validators.pattern(FormUtils.phonePattern)],
    ],
    gender: [
      this.currentUser()?.gender === this.USER_GENDER.MALE
        ? 'MALE'
        : this.currentUser()?.gender === this.USER_GENDER.FEMALE
        ? 'FEMALE'
        : '',
      [Validators.required],
    ],
    email: [
      this.currentUser()?.email,
      [Validators.required, Validators.pattern(FormUtils.emailPattern)],
    ],
    speciality: [''],
  });

  submit() {
    const formValue = this.updateUserForm.value;

    // Mapear a lo que espera el backend
    const updateDTO = {
      id: this.currentUser()?.id || '',
      dni: formValue.dni?.toUpperCase() || '',
      name: formValue.name || '',
      lastName: formValue.lastName || '',
      birthDate: formValue.dateOfBirth || '',
      address: formValue.address || '',
      phoneNumber: formValue.phoneNumber || '',
      gender: formValue.gender || '',
      email: formValue.email?.toLowerCase() || '',
      specialtyId: formValue.speciality ? Number(formValue.speciality) : null,
    };

    // Subir la Imagen si hay una seleccionada
    if (this.selectedImage) {
      const formData = new FormData();
      formData.append('file', this.selectedImage);

      this.userService
        .uploadProfileImage(updateDTO.id.toString(), formData)
        .subscribe();
    }

    this.userService.updateUser(updateDTO.id.toString(), updateDTO).subscribe({
      next: () => {
        swalAlert(
          '¡Tu información ha sido actualizada con éxito!',
          'Ahora puedes acceder a todas las funcionalidades de CliniCare.',
          'success',
          3000,
          false,
          false
        );
        setTimeout(() => {
          this.location.back();
        }, 3000);
      },
      error: (error) => {
        swalAlert(
          'Error al actualizar tu información',
          error.error.message || 'Por favor, inténtalo de nuevo más tarde.',
          'error'
        );
      },
    });
  }
}
