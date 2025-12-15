import { AdminCalendar } from '@admin/components/admin-calendar/admin-calendar';
import { Stats } from '@admin/components/stats/stats';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { USER_STATUS } from '@lib/consts';
import { UserService } from '@shared/services/user.service';
import { TopSpecialitiesChart } from '@admin/components/top-specialities-chart/top-specialities-chart';
import { User } from '@interfaces/user.interface';

@Component({
  selector: 'app-dashboard-page',
  imports: [Stats, AdminCalendar, TopSpecialitiesChart],
  templateUrl: './dashboard-page.html',
})
export default class DashboardPage implements OnInit {
  public pageDescription = signal(
    'Aqui podrá obtener una visión general del estado del sistema, gestionar usuarios y supervisar las actividades recientes.'
  );

  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Panel de Administrador / CliniCare');
    this.meta.updateTag({
      name: 'description',
      content: this.pageDescription(),
    });
  }

  private userService = inject(UserService);

  ngOnInit(): void {
    this.getAllUsers();
  }

  public users = signal<User[]>([]);

  public pendingUsersCount = computed(
    () =>
      this.users().filter((user) => user.status === USER_STATUS.PENDING).length
  );

  getAllUsers() {
    this.userService.getAllUsers().subscribe((data) => {
      console.log(data);

      this.users.set(data as User[]);
    });
  }
}
