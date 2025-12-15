import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { User } from './../../../../interfaces/user.interface';
import { USER_STATUS } from '@lib/consts';
import { swalAlert } from '@lib/swalAlert';
import { BinIcon } from '@shared/icons/others/bin-icon/bin-icon';
import { AgePipe } from '@shared/pipes/Age.pipe';
import { RouterLink } from '@angular/router';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-pending-page',
  imports: [DatePipe, AgePipe, BinIcon, RouterLink],
  templateUrl: './pending-page.html',
})
export default class PendingPage {
  public pageDescription = signal(
    'Hay usuarios pendientes de asignación de roles. Por favor, revise sus perfiles y asigne los permisos correspondientes para garantizar un correcto acceso al sistema.'
  );

  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Usuarios Pendientes / CliniCare');
    this.meta.updateTag({
      name: 'description',
      content: this.pageDescription(),
    });
  }

  ngOnInit(): void {
    this.getAllUsers();
  }

  private userService = inject(UserService);

  public users = signal<User[]>([]);

  public approvalPendingUsers = computed(() =>
    this.users().filter((user) => user.status === USER_STATUS.PENDING)
  );

  getAllUsers() {
    this.userService.getAllUsers().subscribe((data) => {
      this.users.set(data as User[]);
    });
  }

  deleteUser(id: string) {
    swalAlert(
      '¿Estás seguro?',
      'Esta acción eliminará al usuario de la lista. Esta acción no se puede deshacer.',
      'warning',
      0,
      true,
      true
    ).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUserById(id!).subscribe({
          next: () => {
            swalAlert(
              'Rechazada',
              'La solicitud del usuario ha sido rechazada y eliminada.',
              'success',
              3000,
              false,
              false
            );
            this.users.update((users) =>
              users.filter((user) => user.id.toString() !== id)
            );
          },
          error: (err) => {
            swalAlert('Error', 'No se pudo eliminar el mensaje.', 'error');
            console.error('Error al eliminar el mensaje:', err);
          },
        });
      }
    });
  }
}
