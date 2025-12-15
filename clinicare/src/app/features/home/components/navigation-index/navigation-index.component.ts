import { ContactIcon } from '@shared/icons/home/navigation/contact-icon/contact-icon';
import { NgClass } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  input,
  Output,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { User } from './../../../../interfaces/user.interface';
import { AboutIcon } from '@shared/icons/home/navigation/about-icon/about-icon';
import { LocationIcon } from '@shared/icons/home/navigation/location-icon/location-icon';
import { DoctorIcon } from '@shared/icons/others/doctor-icon/doctor-icon';

@Component({
  selector: 'navigation-index',
  imports: [
    AboutIcon,
    DoctorIcon,
    LocationIcon,
    ContactIcon,
    RouterLink,
    NgClass,
  ],
  templateUrl: './navigation-index.component.html',
})
export class NavigationIndexComponent {
  public authService = inject(AuthService);
  public router = inject(Router);
  public isScrolled = input<boolean>();
  @Input() mobileMenuOpen = false;
  @Output() closeMenu = new EventEmitter<void>();

  public currentUser = signal<User | null>(null);

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser.set(user);
    });

    if (this.authService.isLoggedIn()) {
      this.authService.loadUserData();
    }
  }

  public isUserLogged = computed(() => {
    return this.authService.isLoggedIn();
  });

  goToProfile() {
    const userRole = localStorage.getItem('roles');

    if (!userRole) return;

    if (userRole === 'ADMIN') {
      this.router.navigate(['/admin/dashboard']);
      return;
    }

    if (userRole === 'DOCTOR') {
      this.router.navigate(['/doctor/dashboard']);
      return;
    }

    if (userRole === 'PATIENT') {
      this.router.navigate(['/patient/dashboard']);
      return;
    }

    this.router.navigate(['/']);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  onLinkClick() {
    this.closeMenu.emit();
  }

  logout() {
    this.authService.logout();
    return;
  }

  cerrarMenu() {
    return;
  }
}
