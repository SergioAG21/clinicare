import { Message, MessageStatus } from '@admin/interfaces/message.interface';
import { Component, computed, inject, signal } from '@angular/core';
import { MessageCard } from '../message-card/message-card';
import { ContactService } from '@shared/services/contact.service';

@Component({
  selector: 'app-messages-list',
  imports: [MessageCard],
  templateUrl: './messages-list.html',
})
export class MessagesList {
  public messages = signal<Message[]>([]);

  private contactService = inject(ContactService);

  public filterStatus = signal<MessageStatus | 'ALL'>(MessageStatus.PENDING);

  // Si no se hace esto no es accesible en el HTML
  public MessageStatus = MessageStatus;

  // Computed de mensajes filtrados
  public filteredMessages = computed(() => {
    const all = this.messages();

    if (this.filterStatus() === 'ALL') {
      return [...all].sort((a, b) => {
        const order = {
          [MessageStatus.PENDING]: 1,
          [MessageStatus.CLOSED]: 2,
        };
        return order[a.status] - order[b.status];
      });
    }

    return all.filter((m) => m.status === this.filterStatus());
  });

  ngOnInit(): void {
    this.loadMessages();
  }

  private loadMessages() {
    this.contactService.getAllMessages().subscribe({
      next: (messages) => {
        this.messages.set(messages as Message[]);
      },
      error: (err) => {
        console.error('Error al cargar los mensajes:', err);
      },
    });
  }

  // Función para eliminar localmente
  handleDeletedMessage(id: string) {
    this.messages.set(this.messages().filter((m) => m.id.toString() !== id));
  }
}
