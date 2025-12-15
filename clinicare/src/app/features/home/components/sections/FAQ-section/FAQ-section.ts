import { Component } from '@angular/core';
import { FAQList } from './FAQ-list/FAQ-list';

@Component({
  selector: 'faq-section',
  imports: [FAQList],
  templateUrl: './FAQ-section.html',
})
export class FAQSection {}
