import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { SpanishDateAdapter } from '@lib/spanish-date-adapter';
import { SPANISH_DATE_FORMATS } from '@lib/spanish-date-format';

@Component({
  selector: 'admin-calendar',
  imports: [
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './admin-calendar.html',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: DateAdapter, useClass: SpanishDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: SPANISH_DATE_FORMATS },
  ],
})
export class AdminCalendar {
  today: Date = new Date();
  selectedDate: Date | null = null;

  // Referencia al mat-calendar
  @ViewChild(MatCalendar) calendar!: MatCalendar<Date>;

  isTodaySelected(): boolean {
    if (!this.selectedDate) return false;
    const today = new Date();
    return (
      this.selectedDate.getFullYear() === today.getFullYear() &&
      this.selectedDate.getMonth() === today.getMonth() &&
      this.selectedDate.getDate() === today.getDate()
    );
  }

  backToToday() {
    this.selectedDate = new Date(this.today); // marca el día actual
    if (this.calendar) {
      this.calendar.activeDate = new Date(this.today); // resetea el mes visible
    }
  }
}
