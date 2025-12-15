import { Component } from '@angular/core';
import { FooterComponent } from '@shared/layouts/footer/footer.component';
import { FAQSection } from '@home/components/sections/FAQ-section/FAQ-section';
import { HeaderComponent } from '@home/components/header/header.component';
import { HeroComponent } from '@home/components/hero/hero.component';
import { AboutComponent } from '@home/components/sections/about-section/about-section.component';
import { LocationSection } from '@home/components/sections/location-section/location-section';
import { ContactSectionComponent } from '@home/components/sections/contact-section/contact-section.component';
import { FAB } from '@shared/components/FAB/FAB';
import { DoctorsSection } from '@home/components/sections/doctors-section/doctors-section';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-home-layout',
  imports: [
    HeaderComponent,
    HeroComponent,
    AboutComponent,
    LocationSection,
    ContactSectionComponent,
    FooterComponent,
    FAQSection,
    FAB,
    DoctorsSection,
  ],
  templateUrl: './home-layout.component.html',
})
export class HomeLayoutComponent {
  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Inicio / CliniCare');
    this.meta.updateTag({
      name: 'description',
      content: 'Tu Salud nuestra Prioridad',
    });
  }
}
