import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ArrowBottomIcon } from '@shared/icons/home/arrows-bottom-icon/arrows-bottom-icon';

@Component({
  selector: 'hero',
  imports: [ArrowBottomIcon, CommonModule],
  templateUrl: './hero.component.html',
})
export class HeroComponent {}
