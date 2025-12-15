import { DatePipe, Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { User } from '@interfaces/user.interface';
import { FormUtils } from '@lib/form-utils';
import { swalAlert } from '@lib/swalAlert';
import { GoBackButtonComponent } from '@shared/components/go-back-button/go-back-button.component';
import { AddressFieldIcon } from '@shared/icons/form/address-field-icon/address-field-icon';
import { BirthdayFieldIcon } from '@shared/icons/form/birthday-field-icon/birthday-field-icon';
import { DniFieldIcon } from '@shared/icons/form/dni-field-icon/dni-field-icon';
import { EmailFieldIcon } from '@shared/icons/form/email-field-icon/email-field-icon';
import { MobileFieldIcon } from '@shared/icons/form/mobile-field-icon/mobile-field-icon';
import { NameFieldIcon } from '@shared/icons/form/name-field-icon/name-field-icon';
import { UserService } from '@shared/services/user.service';
import { ManFieldIcon } from '@shared/icons/form/man-field-icon/man-field-icon';
import { RoleTranslatePipe } from '@shared/pipes/RoleTranslate.pipe';
import { ROLE_MAP, USER_ROLE } from '@lib/consts';

@Component({
  selector: 'user-details-page',
  imports: [
    GoBackButtonComponent,
    DniFieldIcon,
    NameFieldIcon,
    BirthdayFieldIcon,
    AddressFieldIcon,
    EmailFieldIcon,
    MobileFieldIcon,
    DatePipe,
    ReactiveFormsModule,
    ManFieldIcon,
    RoleTranslatePipe,
  ],
  templateUrl: './user-details-page.html',
})
export default class UserDetailsPage implements OnInit {
  public pageDescription = signal(
    'Aquí puede ver los datos con detalles completos del usuario seleccionado, incluyendo su información personal y roles asignados.'
  );

  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Detalles de Usuario / CliniCare');
    this.meta.updateTag({
      name: 'description',
      content: this.pageDescription(),
    });
  }

  private activatedRoute = inject(ActivatedRoute);
  private userId = this.activatedRoute.snapshot.paramMap.get('id');

  private fb = inject(FormBuilder);

  private location = inject(Location);

  private userService = inject(UserService);
  public userDetails = signal<User | null>(null);

  USER_ROLE = USER_ROLE;

  formUtils = FormUtils;

  ROLE_MAP = ROLE_MAP;

  USER_GENDER = {
    MAN: 'MALE',
    FEMALE: 'FEMALE',
  };

  public userDetailsForm = this.fb.group({
    role: ['', [Validators.required]],
  });

  ngOnInit(): void {
    if (this.userId) {
      this.getUserDetails(this.userId);
    }
  }

  private getUserDetails(id: string) {
    this.userService.getUserById(id).subscribe((data) => {
      console.log(data);

      this.userDetails.set(data as User);
    });
  }

  onSubmit() {
    const { role = '' } = this.userDetailsForm.value;

    const roleId = this.ROLE_MAP[role!];

    if (!roleId) return;

    const userData = {
      id: this.userDetails()?.id,
      dni: this.userDetails()?.dni,
      name: this.userDetails()?.name,
      last_name: this.userDetails()?.last_name,
      birth_date: this.userDetails()?.birth_date,
      address: this.userDetails()?.address,
      phone_number: this.userDetails()?.phone_number,
      email: this.userDetails()?.email,
      gender: this.userDetails()?.gender,
      userRoles: [{ role: { id: roleId } }],
      profile_user_image: this.userDetails()?.profile_user_image,
    };

    this.userService
      .updateUserRolesById(this.userDetails()?.id.toString() || '', userData)
      .subscribe({
        next: (response) => {
          swalAlert(
            '¡Éxito!',
            'El rol del usuario se ha asignado correctamente.',
            'success',
            1500,
            false,
            false
          );

          setTimeout(() => this.location.back(), 1500);
        },
        error: () => {
          swalAlert(
            'Error',
            'Hubo un error al actualizar el rol del usuario. Por favor, inténtelo de nuevo más tarde.',
            'error',
            3000,
            false,
            true
          );
        },
      });
  }
}
