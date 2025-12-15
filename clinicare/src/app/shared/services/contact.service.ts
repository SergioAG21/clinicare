import { Message, MessageStatus } from '@admin/interfaces/message.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, tap } from 'rxjs';

interface ContactMessage {
  name: string;
  email: string;
  message: string;
  status?: MessageStatus;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiBaseUrl;
  private apiContactUrl = `${this.apiBaseUrl}/contact`;

  public messagesCount = signal(0);

  getAllMessages() {
    return this.http.get<ContactMessage[]>(`${this.apiContactUrl}`).pipe(
      tap((messages) => {
        const pendingCount = messages.filter(
          (m) => m.status === MessageStatus.PENDING
        ).length;
        this.messagesCount.set(pendingCount);
      })
    );
  }

  getMessageById(id: string): Observable<Message> {
    return this.http.get<Message>(`${this.apiContactUrl}/${id}`);
  }

  sendContactMessage(data: ContactMessage): Observable<Message> {
    return this.http.post<Message>(`${this.apiContactUrl}/send`, data);
  }

  answerContactMessage(id: string, answer: string): Observable<void> {
    return this.http.post<void>(`${this.apiContactUrl}/answer/${id}`, {
      answer,
    });
  }

  deleteMessageById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiContactUrl}/${id}`).pipe(
      tap(() => {
        this.messagesCount.update((count) => count - 1);
      })
    );
  }
}
