import { Message } from '@admin/interfaces/message.interface';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactService } from '@shared/services/contact.service';
import { GoBackButtonComponent } from '@shared/components/go-back-button/go-back-button.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@lib/form-utils';
import { User } from './../../../../interfaces/user.interface';
import { AuthService } from '@auth/services/auth.service';
import { swalAlert } from '@lib/swalAlert';
import { Location } from '@angular/common';

@Component({
  selector: 'app-message-page',
  imports: [GoBackButtonComponent, ReactiveFormsModule],
  templateUrl: './message-page.html',
})
export default class MessagePage {
  formUtils = FormUtils;
  private fb = inject(FormBuilder);

  // Inject
  private authService = inject(AuthService);
  private contactService = inject(ContactService);
  private location = inject(Location);
  private route = inject(ActivatedRoute);
  private id = this.route.snapshot.paramMap.get('id') || '';

  // Signals
  public currentUser = signal<User | null>(null);
  public message = signal<Message | null>(null);

  ngOnInit(): void {
    this.getMessageById(this.id);

    // Obtener el usuario actual
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser.set(user);
    });

    if (this.authService.isLoggedIn()) {
      this.authService.loadUserData();
    }
  }

  public replyForm = this.fb.group({
    answer: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(200)],
    ],
  });

  private getMessageById(id: string) {
    this.contactService.getMessageById(id).subscribe({
      next: (message) => {
        this.message.set(message as Message);
      },
      error: (err) => {
        console.error('Error al cargar los mensajes:', err);
      },
    });
  }

  sendMessage() {
    const { answer = '' } = this.replyForm.value;

    this.contactService
      .answerContactMessage(this.message()?.id.toString() || '', answer || '')
      .subscribe({
        next: () => {
          swalAlert(
            '¡Mensaje enviado!',
            'Se ha enviado la respuesta al usuario correctamente.',
            'success',
            1500,
            false,
            false
          );

          setTimeout(() => {
            this.location.back();
          }, 1500);
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
  }
}
