import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormGroup,
} from '@angular/forms';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  getDate,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-custom-datepicker',
  templateUrl: './date-time-picker.html',
  // Es crucial para que funcione con Reactive Forms
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDatepickerComponent),
      multi: true,
    },
  ],
  imports: [NgClass, NgIf, NgFor],
})
export class CustomDatepickerComponent implements ControlValueAccessor, OnInit {
  @Input() appointmentForm!: FormGroup; // Recibe el FormGroup

  isTransitioning: boolean = false;
  // En CustomDatepickerComponent.ts, después de isTransitioning:
  isColorUpdating: boolean = false;

  // Variables de control
  showPicker: boolean = false;
  currentViewDate: Date = new Date();
  today: Date = new Date();

  // Modelo
  selectedDate: Date | null = null;
  selectedTime: string = '09:00'; // Valor por defecto
  selectedDay: number | null = null;
  displayDate: string = '';

  // ControlValueAccessor
  private onChange: any = () => {};
  private onTouched: any = () => {};

  // Propiedades derivadas
  get currentMonthYear(): string {
    return format(this.currentViewDate, 'MMMM yyyy', { locale: es });
  }

  public isSameDay = isSameDay;

  // 🔑 MODIFICACIÓN CLAVE 1: availableTimes ahora es un GETTER dinámico y preciso
  get availableTimes(): string[] {
    // 1. Generar todos los slots (08:00 a 20:00)
    const startHour = '08:00';
    const endHour = '20:00';
    const interval = 45; // minutos
    const allSlots = this.generateTimeSlots(startHour, endHour, interval);

    // Si no hay un día seleccionado, no podemos determinar si es hoy. Mostrar todo por defecto.
    if (this.selectedDay === null) {
      return allSlots;
    }

    // 2. Crear una fecha que represente el día seleccionado actualmente por el usuario.
    const selectedDayDate = new Date(
      this.currentViewDate.getFullYear(),
      this.currentViewDate.getMonth(),
      this.selectedDay
    );

    // 3. Verificar si **el día seleccionado** es el día de hoy.
    const isTodaySelected = isSameDay(selectedDayDate, this.today);

    if (!isTodaySelected) {
      // Si no es hoy, no hay restricciones de tiempo y devolvemos TODO.
      return allSlots;
    }

    // 4. Si es hoy, calcular la hora mínima disponible.
    const now = new Date();

    // Redondeamos la hora actual a la media hora siguiente.
    const nextAvailableTime = this.roundUpToNextInterval(now, interval);

    // Formatear el punto de corte (ej. "17:30")
    const cutoffTimeStr = format(nextAvailableTime, 'HH:mm');

    // 5. Filtrar los slots: solo se incluyen si son mayores o iguales al punto de corte.
    return allSlots.filter((slot) => slot >= cutoffTimeStr);
  }
  constructor() {}

  ngOnInit(): void {
    if (this.selectedDate) {
      this.selectedDay = getDate(this.selectedDate);
      this.currentViewDate = this.selectedDate;
      this.selectedTime = format(this.selectedDate, 'HH:mm');
    } else {
      // 🔑 Inicialización: Si el formulario está vacío, intenta seleccionar el primer slot disponible de hoy
      this.selectedDay = getDate(this.today);
      if (this.availableTimes.length > 0) {
        this.selectedTime = this.availableTimes[0];
        // Dispara la actualización para que el form control tenga un valor inicial válido
        this.updateFormControl();
      }
    }
    this.updateDisplayDate();
  }

  // Reemplaza la función isMonthInPast() existente:

  isMonthInPast(): boolean {
    const currentView = this.currentViewDate;
    const today = this.today;

    // 1. Si el año es menor que el año actual, está en el pasado.
    if (currentView.getFullYear() < today.getFullYear()) {
      return true;
    }

    // 2. Si los años son iguales, y el mes es menor o IGUAL al mes actual, está en el pasado/presente.
    // Usamos el mes actual como límite, ya que no se puede ir hacia atrás desde el mes actual.
    if (
      currentView.getFullYear() === today.getFullYear() &&
      currentView.getMonth() <= today.getMonth() // Cambiado a <=
    ) {
      return true;
    }

    return false;
  }

  // 3. Verifica si el mes actualmente visible es posterior al límite de 1 año (prohibido)
  isMonthTooFarFuture(): boolean {
    const limit = this.oneYearFromNow;

    // Si el año de la vista es mayor que el año límite
    if (this.currentViewDate.getFullYear() > limit.getFullYear()) {
      return true;
    }

    // Si están en el mismo año límite, pero el mes de la vista es posterior al mes límite
    if (
      this.currentViewDate.getFullYear() === limit.getFullYear() &&
      this.currentViewDate.getMonth() > limit.getMonth()
    ) {
      return true;
    }

    return false;
  }

  get oneYearFromNow(): Date {
    const limit = new Date(this.today);
    limit.setFullYear(limit.getFullYear() + 1);
    return limit;
  }

  // --- Implementación de ControlValueAccessor ---

  // Escribe el valor del FormControl en el componente
  writeValue(value: string): void {
    if (value) {
      this.selectedDate = new Date(value);
      this.selectedDay = getDate(this.selectedDate);
      this.currentViewDate = this.selectedDate;
      this.selectedTime = format(this.selectedDate, 'HH:mm');
    } else {
      this.selectedDate = null;
      this.selectedDay = null;
    }
    this.updateDisplayDate();
  }

  // 🔑 NUEVA FUNCIÓN AUXILIAR
  private roundUpToNextInterval(date: Date, intervalMinutes: number): Date {
    const minutes = date.getMinutes();
    const remainder = minutes % intervalMinutes;
    if (remainder === 0) {
      // Si ya está exactamente en el intervalo (ej. 17:00, 17:30)
      return date;
    }
    // Añade la diferencia para alcanzar el siguiente intervalo
    const minutesToAdd = intervalMinutes - remainder;
    return new Date(date.getTime() + minutesToAdd * 60000); // 60000 ms = 1 minuto
  }

  // Lógica del Componente (CustomDatepickerComponent)

  // ... (propiedades y métodos existentes)

  /**
   * Captura el evento de cambio del selector de hora, actualiza la variable interna
   * y luego actualiza el form control del padre.
   */
  onTimeChange(event: Event): void {
    // Aseguramos que el target exista y sea un HTMLSelectElement
    const target = event.target as HTMLSelectElement | null;

    if (target) {
      this.selectedTime = target.value;

      // Llama al método que re-ensambla la fecha completa (día + nueva hora)
      this.updateFormControl();
    }
    this.showPicker = false;
  }

  // ... (otros métodos como selectDay, updateFormControl, etc.)

  // Registra la función que se llamará cuando el valor cambie
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Registra la función que se llamará cuando el componente sea tocado
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // --- Lógica del Datepicker ---

  togglePicker(): void {
    this.showPicker = !this.showPicker;
    this.onTouched();
  }

  // REEMPLAZA ESTA FUNCIÓN COMPLETA
  private handleMonthChange(newDate: Date): void {
    // 1. Ocultar contenido y prevenir actualización de color
    this.isTransitioning = true;
    this.isColorUpdating = true; // Oculta el color final durante el cambio de datos

    // 2. Forzar un "reflow" para aplicar opacity-0 inmediatamente
    const element = document.querySelector('.calendar-transition');

    // 3. CAMBIO DE DATOS (Ocurre mientras el calendario está invisible)
    // Duración: 180ms (Ligeramente menos que 200ms del CSS)
    setTimeout(() => {
      this.currentViewDate = newDate;
      this.selectedDay = null;
      this.updateFormControl();

      // 4. Iniciar el FADE IN (Opacidad 1)
      this.isTransitioning = false;

      // 5. Esperar a que la transición de opacidad (200ms) finalice antes de mostrar el color.
      setTimeout(() => {
        this.isColorUpdating = false; // Permite que el color final se muestre
      }, 200); // Esperamos 200ms (la duración de nuestra transición CSS)
    }, 180);
  }

  prevMonth(): void {
    const targetDate = subMonths(this.currentViewDate, 1);

    // Bloquea la navegación si es anterior al mes actual.
    if (
      targetDate.getFullYear() < this.today.getFullYear() ||
      (targetDate.getFullYear() === this.today.getFullYear() &&
        targetDate.getMonth() < this.today.getMonth())
    ) {
      return;
    }

    this.handleMonthChange(targetDate);
  }

  nextMonth(): void {
    // Solo permite cambiar si NO excede el límite de un año.
    if (!this.isMonthTooFarFuture()) {
      const targetDate = addMonths(this.currentViewDate, 1);
      this.handleMonthChange(targetDate);
    }
  }

  // Obtiene los días del mes actual para mostrar en el calendario
  getDaysInMonth(): number[] {
    const start = startOfMonth(this.currentViewDate);
    const end = endOfMonth(this.currentViewDate);

    // Obtiene todas las fechas y luego extrae solo el número del día
    return eachDayOfInterval({ start, end }).map((d: any) => getDate(d));
  }

  // Obtiene los 'días vacíos' al comienzo de la cuadrícula (días del mes anterior)
  getPaddingDays(): number[] {
    const startDay = getDay(startOfMonth(this.currentViewDate)); // 0=Domingo, 1=Lunes, etc.
    // Usamos (startDay + 6) % 7 para que Lunes sea 0 y Domingo sea 6
    const padding = (startDay + 6) % 7;
    return Array(padding).fill(''); // Rellena con 0s, que se pueden ignorar en el HTML
  }

  isWeekend(day: number): boolean {
    const year = this.currentViewDate.getFullYear();
    const month = this.currentViewDate.getMonth();
    // Creamos un objeto Date para el día específico de la vista actual
    const date = new Date(year, month, day);

    const dayOfWeek = getDay(date); // 0 = Domingo, 6 = Sábado

    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  isCurrentMonth(): boolean {
    return isSameDay(this.currentViewDate, this.today);
  }

  selectDay(day: number): void {
    this.selectedDay = day;

    const year = this.currentViewDate.getFullYear();
    const month = this.currentViewDate.getMonth();
    const newDate = new Date(year, month, day);

    // 🔑 MODIFICACIÓN CLAVE 2: RECALCULAR availableTimes antes de actualizar selectedTime
    // Si el día seleccionado es hoy, el getter availableTimes ya estará filtrado.
    // Si es otro día, el getter devolverá todas las horas.

    // Usamos el getter para obtener la lista correcta de horas disponibles para este día
    const currentAvailableTimes = this.availableTimes;

    if (currentAvailableTimes.length > 0) {
      const firstAvailableSlot = currentAvailableTimes[0];

      // Si la hora actualmente seleccionada es anterior a la primera hora disponible
      // (esto ocurrirá si cambias de un día futuro a hoy), la actualizamos.
      if (this.selectedTime < firstAvailableSlot) {
        this.selectedTime = firstAvailableSlot;
      }

      // Si la hora actual ya no está en la lista (p.ej., seleccionaste 08:00 en un día futuro y vuelves a hoy a las 09:30)
      if (!currentAvailableTimes.includes(this.selectedTime)) {
        this.selectedTime = firstAvailableSlot;
      }
    } else {
      // No hay slots disponibles (p.ej., si hoy ya pasó de las 20:00).
      console.warn(
        'No hay slots disponibles para este día después de la hora actual.'
      );
    }

    // Llama a la función principal para ensamblar la fecha y hora completa
    this.updateFormControl();

    // Si cierras el picker aquí, es posible que el usuario no llegue a seleccionar la hora.
    // this.showPicker = false;
  }

  // Actualiza el FormControl del formulario padre
  // Lógica del Componente (CustomDatepickerComponent)

  // ...

  // Actualiza el FormControl del formulario padre y la vista
  // 🔑 MODIFICACIÓN CLAVE 3: updateFormControl usa la hora actual
  // REEMPLAZA updateFormControl()
  updateFormControl(): void {
    // SI NO HAY DÍA SELECCIONADO, LIMPIA EL FORMULARIO Y LA VISTA
    if (this.selectedDay === null) {
      this.selectedDate = null;
      this.onChange(null); // Establece el valor del form control a null
      this.updateDisplayDate(); // Limpia la entrada de texto
      return;
    }

    // Si llegamos aquí, 'selectedDay' tiene un valor válido
    const year = this.currentViewDate.getFullYear();
    const month = this.currentViewDate.getMonth();
    const day = this.selectedDay;

    const [hours, minutes] = this.selectedTime.split(':').map(Number);

    this.selectedDate = new Date(year, month, day, hours, minutes);

    const isoString = format(this.selectedDate, "yyyy-MM-dd'T'HH:mm");

    this.onChange(isoString);
    this.updateDisplayDate();
  }

  // Función para generar los intervalos de tiempo
  private generateTimeSlots(
    start: string,
    end: string,
    intervalMinutes: number
  ): string[] {
    const slots: string[] = [];
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);

    let currentTime = new Date();
    currentTime.setHours(startH, startM, 0, 0);

    const endTime = new Date();
    endTime.setHours(endH, endM, 0, 0);

    while (currentTime <= endTime) {
      slots.push(format(currentTime, 'HH:mm'));
      currentTime = new Date(currentTime.getTime() + intervalMinutes * 60000);
    }
    return slots;
  }

  // Actualiza el texto que ve el usuario en el campo de entrada
  private updateDisplayDate(): void {
    if (this.selectedDate) {
      this.displayDate = format(
        this.selectedDate,
        'EEEE, dd MMMM yyyy | HH:mm',
        {
          locale: es,
        }
      );
    } else {
      this.displayDate = '';
    }
  }
}
