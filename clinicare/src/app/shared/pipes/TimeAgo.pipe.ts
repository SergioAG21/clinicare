import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeAgo' })
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    const now: Date = new Date();
    const playedDate: Date = new Date(value);
    const diffInMs: number = now.getTime() - playedDate.getTime();

    const diffInSec: number = Math.floor(diffInMs / 1000);
    if (diffInSec < 60) {
      return `${diffInSec} segundo${diffInSec === 1 ? '' : 's'}`;
    }

    const diffInMin: number = Math.floor(diffInSec / 60);
    if (diffInMin < 60) {
      return `${diffInMin} minuto${diffInMin === 1 ? '' : 's'}`;
    }

    const diffInHours: number = Math.floor(diffInMin / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hora${diffInHours === 1 ? '' : 's'}`;
    }

    const diffInDays: number = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} día${diffInDays === 1 ? '' : 's'}`;
    }

    // Si tiene más de 7 días, mostrar fecha
    return playedDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
    });
  }
}
