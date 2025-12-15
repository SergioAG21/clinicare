import { Component, input } from '@angular/core';
import { ArrowBackToTopIcon } from '@shared/icons/others/arrow-back-to-top-icon/arrow-back-to-top-icon';

@Component({
  selector: 'back-to-top',
  imports: [ArrowBackToTopIcon],
  templateUrl: './back-to-top.component.html',
})
export class BackToTopComponent {
  public backToSection = input.required<string>();
}
