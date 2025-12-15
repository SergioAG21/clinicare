import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormUtils } from '@lib/form-utils';
import { PasswordFieldIcon } from '@shared/icons/form/password-field-icon/password-field-icon';
import { EmailFieldIcon } from '@shared/icons/form/email-field-icon/email-field-icon';
import { Title, Meta } from '@angular/platform-browser';
import { AuthService } from '@auth/services/auth.service';
import { USER_ROLE, USER_STATUS } from '@lib/consts';
import 'sweetalert2/themes/bulma.css';
import { swalAlert } from '@lib/swalAlert';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  imports: [ReactiveFormsModule, RouterLink, PasswordFieldIcon, EmailFieldIcon],
})
export class LoginPageComponent {
  router = inject(Router);
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  formUtils = FormUtils;

  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Inicia Sesión / CliniCare');
    this.meta.updateTag({
      name: 'description',
      content:
        'Inicia sesión en tu cuenta de CliniCare para acceder a tus servicios de salud personalizados.',
    });
  }

  hasError = signal(false);
  isPosting = signal(false);

  loginForm = this.fb.group({
    email: [
      '',
      [Validators.required, Validators.pattern(FormUtils.emailPattern)],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    const { email = '', password = '' } = this.loginForm.value;

    if (this.loginForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;
    }

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: (data) => {
        const decodedToken: any = jwtDecode(data.token);

        const userRole = decodedToken.roles[0];
        localStorage.setItem('roles', userRole);

        const userStatus = decodedToken.userStatus;

        if (userRole === USER_ROLE.ADMIN) {
          this.router.navigateByUrl('/admin/dashboard');
          return;
        }

        if (userRole === USER_ROLE.DOCTOR) {
          if (userStatus === USER_STATUS.INCOMPLETE) {
            this.router.navigateByUrl('/doctor/complete-registration');
            return;
          } else {
            this.router.navigateByUrl('/doctor/dashboard');
            return;
          }
        }

        if (userRole === USER_ROLE.PATIENT) {
          if (userStatus === USER_STATUS.INCOMPLETE) {
            this.router.navigateByUrl('/patient/complete-registration');
            return;
          } else {
            this.router.navigateByUrl('/patient/dashboard');
            return;
          }
        }

        if (userRole === USER_ROLE.USER) {
          swalAlert(
            'Lo sentimos, aun no tienes acceso',
            'Tu solicitud de acceso está en revisión. Te notificaremos por correo electrónico una vez que se haya aprobado.',
            'warning',
            0,
            false,
            true
          );
          return;
        }
      },
      error: (err) => {
        swalAlert(
          'Error al iniciar sesión',
          'Verifica que tu correo y contraseña sean correctos.',
          'error',
          3000,
          false,
          true
        );

        this.loginForm.reset();
      },
    });
  }
}
