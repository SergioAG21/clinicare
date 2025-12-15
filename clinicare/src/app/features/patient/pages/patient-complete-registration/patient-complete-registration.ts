import { Component, signal } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { GoBackButtonComponent } from '@shared/components/go-back-button/go-back-button.component';
import { UpdateUserForm } from '@shared/components/update-user-form/update-user-form';

@Component({
  selector: 'app-patient-complete-registration',
  imports: [GoBackButtonComponent, UpdateUserForm],
  templateUrl: './patient-complete-registration.html',
})
export default class PatientCompleteRegistration {
  public pageDescription = signal(
    'Proporciona la información necesaria para activar tu cuenta y acceder a todas las funcionalidades, por favor, verifica que toda la información recibida sea correcta y envía el formulario, si hay algun problema, por favor, contacta con soporte.'
  );

  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Completa tu Registro / CliniCare');
    this.meta.updateTag({
      name: 'description',
      content: this.pageDescription(),
    });
  }
}
