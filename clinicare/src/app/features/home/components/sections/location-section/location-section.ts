import { Component, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'location-section',
  imports: [],
  templateUrl: './location-section.html',
})
export class LocationSection {
  @ViewChild('map', { static: true }) divElement!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    const map = L.map(this.divElement.nativeElement).setView(
      [38.999447, -1.861799],
      16
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([38.999447, -1.861799])
      .addTo(map)
      .bindPopup('Nuestra Clínica Está Aquí')
      .openPopup();
  }
}
