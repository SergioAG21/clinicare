import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoBackButtonComponent } from '@shared/components/go-back-button/go-back-button.component';

@Component({
  selector: 'auth-layout',
  imports: [RouterOutlet, GoBackButtonComponent],
  templateUrl: './auth-layout.component.html',
})
export class AuthLayoutComponent {}
