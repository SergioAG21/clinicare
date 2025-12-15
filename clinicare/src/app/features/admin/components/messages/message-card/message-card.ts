import { Message } from '@admin/interfaces/message.interface';
import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { swalAlert } from '@lib/swalAlert';
import { TimeAgoPipe } from '@shared/pipes/TimeAgo.pipe';
import { ContactService } from '@shared/services/contact.service';

@Component({
  selector: 'app-message-card',
  imports: [RouterLink, TimeAgoPipe],
  templateUrl: './message-card.html',
})
export class MessageCard {
  @Output() deletedMessage = new EventEmitter<string>();

  public message = input<Message>();

  private contactService = inject(ContactService);

  deleteMessage() {
    const id = this.message()?.id.toString();

    // Primero mostramos confirmación
    swalAlert(
      '¿Estás seguro?',
      'El mensaje será eliminado de la lista.',
      'warning',
      0,
      true,
      true
    ).then((result) => {
      if (result.isConfirmed) {
        // Si confirma, llamamos al servicio
        this.contactService.deleteMessageById(id!).subscribe({
          next: () => {
            // Mostramos alerta de éxito
            swalAlert(
              'Eliminado',
              'El mensaje ha sido eliminado.',
              'success',
              3000,
              false,
              false
            );

            // Emitir el id al padre
            this.deletedMessage.emit(id);
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
