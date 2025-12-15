import { AdminSideMenuItems } from '@admin/components/admin-side-menu-items/admin-side-menu-items';
import {
  Component,
  computed,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { DoctorSideMenuItems } from '@doctor/components/doctor-side-menu-items/doctor-side-menu-items';
import { User } from '@interfaces/user.interface';
import { USER_ROLE } from '@lib/consts';
import { PatientSideMenuItems } from '@patient/components/patient-side-menu-items/patient-side-menu-items';
import { EditIcon } from '@shared/icons/others/edit-icon/edit-icon';

@Component({
  selector: 'app-sidemenu-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    EditIcon,
    AdminSideMenuItems,
    DoctorSideMenuItems,
    PatientSideMenuItems,
  ],
  templateUrl: './sidemenu-layout.html',
})
export class SidemenuLayout {
  authService = inject(AuthService);
  public mobileMenuOpen = false;

  public loggedUser = signal<User | null>(null);

  ngOnInit(): void {
    this.getLoggedUser();
  }

  USER_GENDER = {
    MALE: 'MALE',
    FEMALE: 'FEMALE',
  };

  USER_ROLE = USER_ROLE;

  public imagenSeleccionada = signal<string | null>(null);

  abrirModal(imagen: string) {
    this.imagenSeleccionada.set(imagen);
    document.body.style.overflow = 'hidden';
  }

  cerrarModal() {
    this.imagenSeleccionada.set(null);
    document.body.style.overflow = '';
  }

  @HostListener('window:keydown.Escape')
  handleEsc() {
    this.cerrarModal();
  }

  getLoggedUser() {
    this.authService.getUserData().subscribe((data) => {
      this.loggedUser.set(data);
    });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}
