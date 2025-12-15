import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'clock',
  imports: [DatePipe, TitleCasePipe],
  templateUrl: './clock.html',
})
export class Clock {
  time = signal<string>('');
  date = signal<string>('');
  currentYear = signal(new Date().getFullYear());

  ngOnInit(): void {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
  }

  updateClock(): void {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    this.time.set(`${hours}:${minutes}:${seconds}`);

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    this.date.set(`${day}/${month}/${year}`);
  }
}
