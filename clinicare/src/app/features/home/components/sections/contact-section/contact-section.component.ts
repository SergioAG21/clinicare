import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@lib/form-utils';
import { NameFieldIcon } from '@shared/icons/form/name-field-icon/name-field-icon';
import { EmailFieldIcon } from '@shared/icons/form/email-field-icon/email-field-icon';
import { ContactService } from '@shared/services/contact.service';
import { swalAlert } from '@lib/swalAlert';

@Component({
  selector: 'contact-section',
  imports: [ReactiveFormsModule, NameFieldIcon, EmailFieldIcon],
  templateUrl: './contact-section.component.html',
})
export class ContactSectionComponent {
  fb = inject(FormBuilder);
  formUtils = FormUtils;

  private contactService = inject(ContactService);

  contactForm = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(30)],
    ],
    email: [
      '',
      [Validators.required, Validators.pattern(FormUtils.emailPattern)],
    ],
    message: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(255),
      ],
    ],
  });

  submit() {
    const { name = '', email = '', message = '' } = this.contactForm.value;

    this.contactService
      .sendContactMessage({
        name: name!,
        email: email!,
        message: message!,
      })
      .subscribe({
        next: () => {
          swalAlert(
            '¡Mensaje enviado!',
            'Recibirá un correo cuando su mensaje sea revisado por un administrador y responda a su solicitud.',
            'success',
            5000,
            false,
            true
          );
        },
        error: () => {
          swalAlert(
            'Error',
            'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.',
            'error',
            3000,
            false,
            true
          );
        },
      });
    this.contactForm.reset();
  }
}
