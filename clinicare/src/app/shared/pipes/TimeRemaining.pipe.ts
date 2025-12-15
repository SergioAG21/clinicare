import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({ name: 'timeRemaining' })
export class TimeRemainingPipe implements PipeTransform {
  transform(value: string | Date): string {
    const now = new Date();
    const target = new Date(value);

    let diffInMs = target.getTime() - now.getTime();

    // Si la fecha ya pasó
    if (diffInMs <= 0) {
      return 'Expirado';
    }

    const diffInSec = Math.floor(diffInMs / 1000);
    const days = Math.floor(diffInSec / (3600 * 24));
    const hours = Math.floor((diffInSec % (3600 * 24)) / 3600);
    const minutes = Math.floor((diffInSec % 3600) / 60);
    const seconds = diffInSec % 60;

    // Armar el texto dinámicamente
    const parts: string[] = [];

    if (days > 0) parts.push(`${days} día${days === 1 ? '' : 's'}`);
    if (hours > 0) parts.push(`${hours} hora${hours === 1 ? '' : 's'}`);
    if (minutes > 0) parts.push(`${minutes} minuto${minutes === 1 ? '' : 's'}`);
    if (days === 0 && hours === 0 && minutes === 0)
      parts.push(`${seconds} segundo${seconds === 1 ? '' : 's'}`);

    return parts.join(' ');
  }
}
