import { Component, signal } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { GoBackButtonComponent } from '@shared/components/go-back-button/go-back-button.component';
import { BookAppointmentForm } from '@patient/components/book-appointment-form/book-appointment-form';

@Component({
  selector: 'book-appointment-page',
  imports: [GoBackButtonComponent, BookAppointmentForm],
  templateUrl: './book-appointment-page.html',
})
export default class BookAppointmentPage {
  public pageDescription = signal(
    'Aquí podrá crear una nueva cita médica de manera fácil y rápida, eligiendo la fecha y hora que mejor se adapte a sus necesidades incluso elegir el doctor de su preferencia.'
  );

  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Crear una Cita / CliniCare');
    this.meta.updateTag({
      name: 'description',
      content: this.pageDescription(),
    });
  }
}
