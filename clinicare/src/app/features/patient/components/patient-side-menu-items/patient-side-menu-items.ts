import { Component } from '@angular/core';
import { SideMenuItem } from '@shared/components/side-menu-item/side-menu-item';
import { MenuIcon } from '@shared/icons/home/menu-icon/menu-icon';
import { CalendarIcon } from '@shared/icons/others/calendar-icon/calendar-icon';
import { MedicalHistoryIcon } from '@shared/icons/others/medical-history-icon/medical-history-icon';

@Component({
  selector: 'patient-side-menu-items',
  imports: [SideMenuItem, MenuIcon, CalendarIcon, MedicalHistoryIcon],
  templateUrl: './patient-side-menu-items.html',
})
export class PatientSideMenuItems {}
