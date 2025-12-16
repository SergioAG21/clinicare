import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { User, UserRole } from './../../../../interfaces/user.interface';
import { USER_ROLE, USER_ROLE_MAP, USER_STATUS } from '@lib/consts';
import { swalAlert } from '@lib/swalAlert';
import { BinIcon } from '@shared/icons/others/bin-icon/bin-icon';
import { AgePipe } from '@shared/pipes/Age.pipe';
import { RoleTranslatePipe } from '@shared/pipes/RoleTranslate.pipe';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-all-users-page',
  imports: [BinIcon, AgePipe, DatePipe, RouterLink, RoleTranslatePipe],
  templateUrl: './all-users-page.html',
})
export default class AllUsersPage implements OnInit {
  public pageDescription = signal(
    'Aquí podrá ver y gestionar todos los usuarios registrados en el sistema, incluyendo sus roles y estados, pudiendo filtrar por roles y buscar usuarios específicos.'
  );

  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Todos los Usuarios / CliniCare');
    this.meta.updateTag({
      name: 'description',
      content: this.pageDescription(),
    });
  }

  public filterStatus = signal<UserRole | 'ALL'>('ALL');

  // Hacer visible en el html
  public UserRole = UserRole;

  ngOnInit(): void {
    this.getAllUsers();
  }

  public userService = inject(UserService);

  public users = signal<User[]>([]);

  public allUsers = computed(() =>
    this.users().filter(
      (user) =>
        user.roles[0] !== USER_ROLE.ADMIN && user.status === USER_STATUS.ACTIVE
    )
  );

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  // Filtro de busqueda
  public searchTerm = signal('');

  // Escucha el evento keydown global
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault(); // evitar el comportamiento por defecto del navegador
      this.searchInput.nativeElement.focus();
    }
  }

  public filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();

    return this.allUsers()
      .filter((user) => {
        const matchesName =
          (user.name + ' ' + user.last_name).toLowerCase().includes(term) ||
          user.dni.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term);

        const matchesStatus =
          this.filterStatus() === 'ALL'
            ? true
            : user.roles[0] === this.filterStatus();

        return matchesName && matchesStatus;
      })
      .sort(
        (a, b) =>
          USER_ROLE_MAP[a.roles[0] as UserRole] -
          USER_ROLE_MAP[b.roles[0] as UserRole]
      );
  });

  getAllUsers() {
    this.userService.getAllUsers().subscribe((data) => {
      this.users.set(data as User[]);
    });
  }

  updateUserStatus(id: string) {
    swalAlert(
      '¿Estás seguro?',
      'Esta acción marcará al usuario como inactivo en el sistema, lo que significa que no será accesible hasta que complete su registro nuevamente.',
      'warning',
      0,
      true,
      true
    ).then((result) => {
      if (result.isConfirmed) {
        this.userService.updateUserStatusToIncompleteById(id!).subscribe({
          next: () => {
            swalAlert(
              'Inactivado',
              'El usuario se ha marcado como inactivo correctamente.',
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
            swalAlert('Error', 'No se pudo eliminar al usuario.', 'error');
            console.error('Error al eliminar al usuario:', err);
          },
        });
      }
    });
  }

  // MODAL CON LA IMAGEN DEL USUARIO
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
}
