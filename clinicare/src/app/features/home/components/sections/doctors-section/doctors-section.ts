import { Component, signal } from '@angular/core';

interface Doctor {
  id: number;
  nombre: string;
  especialidad: string;
  descripcion: string;
  foto: string;
}

@Component({
  selector: 'doctors-section',
  imports: [],
  templateUrl: './doctors-section.html',
})
export class DoctorsSection {
  doctores = signal<Doctor[]>([
    {
      id: 1,
      nombre: 'Dr. Juan Pérez',
      especialidad: 'Cardiología',
      descripcion:
        'Especialista en salud cardiovascular con más de 10 años de experiencia en prevención y tratamiento del corazón.',
      foto: '/img/doctors/doctor1.webp',
    },
    {
      id: 2,
      nombre: 'Dra. Laura Martínez',
      especialidad: 'Neurología',
      descripcion:
        'Experta en el diagnóstico y tratamiento de trastornos del sistema nervioso, comprometida con la atención personalizada.',
      foto: '/img/doctors/doctor2.webp',
    },
    {
      id: 3,
      nombre: 'Dr. Carlos Gómez',
      especialidad: 'Pediatría',
      descripcion:
        'Médico pediatra dedicado al cuidado integral de niños y adolescentes, enfocado en el bienestar y desarrollo saludable.',
      foto: '/img/doctors/doctor3.webp',
    },
  ]);

  doctorSeleccionado = signal<Doctor | null>(null);

  abrirDetalle(doctor: Doctor) {
    this.doctorSeleccionado.set(doctor);
  }

  cerrarModal() {
    this.doctorSeleccionado.set(null);
  }
}
