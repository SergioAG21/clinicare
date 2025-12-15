import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormUtils } from '@lib/form-utils';
import { DniFieldIcon } from '@shared/icons/form/dni-field-icon/dni-field-icon';
import { NameFieldIcon } from '@shared/icons/form/name-field-icon/name-field-icon';
import { BirthdayFieldIcon } from '@shared/icons/form/birthday-field-icon/birthday-field-icon';
import { AddressFieldIcon } from '@shared/icons/form/address-field-icon/address-field-icon';
import { EmailFieldIcon } from '@shared/icons/form/email-field-icon/email-field-icon';
import { PasswordFieldIcon } from '@shared/icons/form/password-field-icon/password-field-icon';
import { MobileFieldIcon } from '@shared/icons/form/mobile-field-icon/mobile-field-icon';
import { WomanFieldIcon } from '@shared/icons/form/woman-field-icon/woman-field-icon';
import { ManFieldIcon } from '@shared/icons/form/man-field-icon/man-field-icon';
import { Title, Meta } from '@angular/platform-browser';
import { AuthService } from '@auth/services/auth.service';
import { swalAlert } from '@lib/swalAlert';
import Swal from 'sweetalert2';

@Component({
  selector: 'register-page',
  imports: [
    ReactiveFormsModule,
    DniFieldIcon,
    NameFieldIcon,
    BirthdayFieldIcon,
    AddressFieldIcon,
    EmailFieldIcon,
    PasswordFieldIcon,
    MobileFieldIcon,
    WomanFieldIcon,
    ManFieldIcon,
    RouterLink,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './register-page.component.html',
})
export default class RegisterPageComponent {
  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Registrarse / CliniCare');
    this.meta.updateTag({
      name: 'description',
      content:
        'Regístrate en CliniCare para acceder a servicios de salud personalizados y gestionar tu bienestar de manera integral.',
    });
  }

  isPosting = signal(false);
  router = inject(Router);
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  formUtils = FormUtils;
  selectedDate = '';

  public currentDate: string = new Date().toISOString().split('T')[0];

  registerForm = this.fb.group({
    dni: ['', [Validators.required, Validators.pattern(FormUtils.dniPattern)]],
    name: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    dateOfBirth: ['', [Validators.required, FormUtils.maxDate]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    phoneNumber: [
      '',
      [Validators.required, Validators.pattern(FormUtils.phonePattern)],
    ],
    gender: ['', [Validators.required]],
    email: [
      '',
      [Validators.required, Validators.pattern(FormUtils.emailPattern)],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    const {
      dni = '',
      name = '',
      lastName = '',
      dateOfBirth = '',
      address = '',
      phoneNumber = '',
      gender = '',
      email = '',
      password = '',
    } = this.registerForm.value;

    this.authService
      .register({
        dni: dni!.toUpperCase(),
        name: name!,
        last_name: lastName!,
        birth_date: dateOfBirth!,
        address: address!,
        phone_number: phoneNumber!,
        gender: gender!,
        email: email!.toLowerCase(),
        password: password!,
      })
      .subscribe({
        next: () => {
          swalAlert(
            '¡Te has registrado con éxito!',
            'Recibirá un correo cuando un administrador revise tu solicitud y active tu cuenta.',
            'success',
            5000,
            false,
            false
          );
          this.registerForm.reset();

          setTimeout(() => {
            this.router.navigateByUrl('/');
          }, 5000);
        },
        error: (err) => {
          swalAlert(
            'Error al registrarse',
            err.error.message ||
              'Ha ocurrido un error al procesar tu registro. Por favor, intenta nuevamente.',
            'error',
            3000,
            false,
            true
          );
        },
      });
  }
}
