import { Component } from '@angular/core';
import { SideMenuItem } from '@shared/components/side-menu-item/side-menu-item';
import { MenuIcon } from '@shared/icons/home/menu-icon/menu-icon';
import { AboutIcon } from '@shared/icons/home/navigation/about-icon/about-icon';
import { CalendarIcon } from '@shared/icons/others/calendar-icon/calendar-icon';

@Component({
  selector: 'doctor-side-menu-items',
  imports: [SideMenuItem, MenuIcon, AboutIcon, CalendarIcon],
  templateUrl: './doctor-side-menu-items.html',
})
export class DoctorSideMenuItems {}
