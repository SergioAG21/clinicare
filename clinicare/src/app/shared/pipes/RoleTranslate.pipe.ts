import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'roleTranslate' })
export class RoleTranslatePipe implements PipeTransform {
  transform(value: string | undefined): string {
    const map: Record<string, string> = {
      DOCTOR: 'Doctor',
      PATIENT: 'Paciente',
      ADMIN: 'Administrador',
      USER: 'Usuario',
    };

    return map[value ?? ''] ?? value ?? '';
  }
}
