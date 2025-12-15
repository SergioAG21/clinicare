import { Component, signal } from '@angular/core';
import { MessagesList } from '@admin/components/messages/messages-list/messages-list';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-messages-page',
  imports: [MessagesList],
  templateUrl: './messages-page.html',
})
export default class MessagesPage {
  public pageDescription = signal(
    'Preguntas enviadas por los usuarios a través del formulario de contacto. Revisa cada una de ellas y proporciona las respuestas necesarias para asistir a nuestros usuarios de manera efectiva.'
  );

  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Mensajes / CliniCare');
    this.meta.updateTag({
      name: 'description',
      content: this.pageDescription(),
    });
  }
}
