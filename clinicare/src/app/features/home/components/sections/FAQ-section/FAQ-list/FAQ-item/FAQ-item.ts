import { Component, input } from '@angular/core';

@Component({
  selector: 'faq-item',
  imports: [],
  templateUrl: './FAQ-item.html',
})
export class FAQItem {
  public question = input.required<string>();
  public answer = input.required<string>();
}
