import { Component } from '@angular/core';
import { GoBackButtonComponent } from '@shared/components/go-back-button/go-back-button.component';
import { UpdateUserForm } from '@shared/components/update-user-form/update-user-form';

@Component({
  selector: 'app-update-user-page',
  imports: [UpdateUserForm, GoBackButtonComponent],
  templateUrl: './update-user-page.html',
})
export default class UpdateUserPage {}
