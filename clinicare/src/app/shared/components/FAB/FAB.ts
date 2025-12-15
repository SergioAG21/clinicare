import { Component } from '@angular/core';
import { CloseIcon } from '@shared/icons/home/close-icon/close-icon';
import { MenuIcon } from '@shared/icons/home/menu-icon/menu-icon';
import { AboutIcon } from '@shared/icons/home/navigation/about-icon/about-icon';
import { ContactIcon } from '@shared/icons/home/navigation/contact-icon/contact-icon';
import { LocationIcon } from '@shared/icons/home/navigation/location-icon/location-icon';
import { DoctorIcon } from '@shared/icons/others/doctor-icon/doctor-icon';

@Component({
  selector: 'fab',
  imports: [
    ContactIcon,
    LocationIcon,
    DoctorIcon,
    AboutIcon,
    CloseIcon,
    MenuIcon,
  ],
  templateUrl: './FAB.html',
})
export class FAB {}
