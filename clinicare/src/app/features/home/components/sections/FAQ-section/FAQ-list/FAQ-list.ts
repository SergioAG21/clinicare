import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { FAQItem } from './FAQ-item/FAQ-item';

@Component({
  selector: 'faq-list',
  imports: [FAQItem],
  templateUrl: './FAQ-list.html',
})
export class FAQList {
  public frequestQuestions = signal([
    {
      question: '¿Cómo me puedo registrar?',
      answer:
        'Para registrarte, simplemente haz clic en el botón registrarse y completa el formulario de inscripción. Un administrador validará tu registro y recibirás un correo de confirmación una vez que tu cuenta esté activa.',
    },
    {
      question: '¿Atienden urgencias sin cita?',
      answer:
        'Sí, contamos con servicio de urgencias para casos que requieren atención inmediata, sin necesidad de cita previa.',
    },
    {
      question: '¿Necesito pedir cita previa para ser atendido?',
      answer:
        'Sí, recomendamos solicitar cita previa para garantizar una atención rápida y personalizada. Puedes hacerlo mediante nuestra página web.',
    },
    {
      question: '¿Puedo cancelar o modificar mi cita?',
      answer:
        'Por supuesto. Puedes cancelar o cambiar tu cita llamando a la clínica o desde tu área personal en línea, con al menos 24 horas de antelación.',
    },
    {
      question: '¿Qué especialidades médicas ofrecen?',
      answer:
        'Disponemos de diversas especialidades, como medicina general, pediatría, ginecología, dermatología, odontología y fisioterapia, entre otras.',
    },
    {
      question: '¿Cuál es su horario de atención?',
      answer:
        'Nuestro horario es de lunes a viernes de 8:00 a 20:00 y sábados de 9:00 a 14:00. Las urgencias están disponibles las 24 horas.',
    },
  ]);
}
