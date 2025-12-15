import { Component, signal } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { AppointmentsList } from '@shared/components/appointment/appointments-list/appointments-list';

@Component({
  selector: 'app-appointments-page',
  imports: [AppointmentsList],
  templateUrl: './appointments-page.html',
})
export default class AppointmentsPage {
  public pageDescription = signal(
    'Aquí podrá consultar sus citas médicas pendientes de manera fácil y rápida, visualizando la fecha, hora y el doctor asignado para cada una de ellas.'
  );

  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Consulta tus citas pendientes / CliniCare');
    this.meta.updateTag({
      name: 'description',
      content: this.pageDescription(),
    });
  }
}
