import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AuthService } from '@auth/services/auth.service';
import { User } from '@interfaces/user.interface';
import { FemaleIcon } from '@shared/icons/others/female-icon/female-icon';
import { MaleIcon } from '@shared/icons/others/male-icon/male-icon';
import { AgePipe } from '@shared/pipes/Age.pipe';

@Component({
  selector: 'user-info-card',
  imports: [MaleIcon, FemaleIcon, DatePipe, AgePipe],
  templateUrl: './user-info-card.html',
})
export class UserInfoCard {
  private authService = inject(AuthService);

  public loggedUser = signal<User | null>(null);

  ngOnInit(): void {
    // Cargar los datos solo si no están cargados todavía
    this.authService.loadUserData();

    // Suscribirse al usuario
    this.authService.currentUser$.subscribe((user) => {
      if (!user) return;

      this.loggedUser.set(user);
    });
  }

  USER_GENDER = {
    MALE: 'MALE',
    FEMALE: 'FEMALE',
  };
}
