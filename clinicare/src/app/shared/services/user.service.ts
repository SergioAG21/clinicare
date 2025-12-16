import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { User } from '@interfaces/user.interface';
import { USER_ROLE, USER_STATUS } from '@lib/consts';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiBaseUrl = environment.apiBaseUrl;
  private apiUsersUrl = `${this.apiBaseUrl}/users`;

  private http = inject(HttpClient);

  // Usuarios
  public userPendingCount = signal(0);
  public activeUsersCount = signal(0);
  public doctorUsersCount = signal(0);
  public patientUsersCount = signal(0);

  getAllUsers() {
    return this.http.get<User[]>(`${this.apiUsersUrl}`).pipe(
      tap((users) => {
        // Users Count
        const activeCount = users.filter(
          (user) =>
            user.roles[0] !== USER_ROLE.ADMIN &&
            user.status === USER_STATUS.ACTIVE
        ).length;
        this.activeUsersCount.set(activeCount);

        // Doctor Count
        const doctorCount = users.filter(
          (user) =>
            user.roles[0] === USER_ROLE.DOCTOR &&
            user.status === USER_STATUS.ACTIVE
        ).length;
        this.doctorUsersCount.set(doctorCount);

        // Patient Count
        const patientCount = users.filter(
          (user) =>
            user.roles[0] === USER_ROLE.PATIENT &&
            user.status === USER_STATUS.ACTIVE
        ).length;
        this.patientUsersCount.set(patientCount);

        // Pending Count
        const pendingCount = users.filter(
          (u) => u.status === USER_STATUS.PENDING
        ).length;
        this.userPendingCount.set(pendingCount);
      })
    );
  }

  getUserById(id: string) {
    return this.http.get<User>(`${this.apiUsersUrl}/${id}`);
  }

  updateUser(id: string, data: any) {
    return this.http.put(`${this.apiUsersUrl}/${id}`, data);
  }

  uploadProfileImage(userId: string, formData: FormData) {
    return this.http.post<{ url: string }>(
      `${this.apiUsersUrl}/${userId}/upload-image`,
      formData
    );
  }

  deleteUserById(id: string) {
    return this.http.delete(`${this.apiUsersUrl}/${id}`);
  }

  updateUserStatusToIncompleteById(id: string) {
    return this.http.put(`${this.apiUsersUrl}/${id}/incomplete`, {});
  }

  updateUserRolesById(id: string, userData: any) {
    return this.http.put(`${this.apiUsersUrl}/${id}/roles`, userData);
  }
}
