import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'side-menu-item',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-menu-item.html',
})
export class SideMenuItem {
  route = input.required<string>();
  titulo = input.required<string>();
  subtitulo = input.required<string>();
  count = input<number>(0);
}
